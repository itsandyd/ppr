import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { PrismaClient } from "@prisma/client";
import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "../uploadthing/core";
import { ElevenLabsClient } from "elevenlabs";
import { v4 as uuidv4 } from "uuid";
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Set runtime to nodejs to avoid edge runtime limitations with UploadThing
export const runtime = "nodejs";

// Create a new Prisma Client instance to ensure we have the latest schema
const prisma = new PrismaClient();

// Initialize S3 client
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION_NAME, AWS_S3_BUCKET_NAME } = process.env;

if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_REGION_NAME || !AWS_S3_BUCKET_NAME) {
  console.warn('One or more AWS environment variables are not set. S3 upload will fail.');
}

const s3 = new S3Client({
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID || '',
    secretAccessKey: AWS_SECRET_ACCESS_KEY || '',
  },
  region: AWS_REGION_NAME || '',
});

// Function to generate presigned URL for an S3 object
const generatePresignedUrl = async (objectKey: string) => {
  const getObjectParams = {
    Bucket: AWS_S3_BUCKET_NAME,
    Key: objectKey,
    Expires: 3600,
  };
  const command = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return url;
};

// Function to get the direct S3 URL (not presigned)
const getS3Url = (objectKey: string) => {
  return `https://${AWS_S3_BUCKET_NAME}.s3.${AWS_REGION_NAME}.amazonaws.com/${objectKey}`;
};

// Function to upload audio buffer to S3
const uploadAudioStreamToS3 = async (audioStream: Buffer) => {
  const remotePath = `audio/${uuidv4()}.mp3`;
  await s3.send(
    new PutObjectCommand({
      Bucket: AWS_S3_BUCKET_NAME,
      Key: remotePath,
      Body: audioStream,
      ContentType: 'audio/mpeg',
    })
  );
  return remotePath;
};

// Create route handler for uploadthing
export const { POST: uploadthingPost, GET: uploadthingGet } = createRouteHandler({
  router: ourFileRouter,
});

// Simple function to strip markdown formatting for cleaner TTS
function stripMarkdown(text: string): string {
  return text
    // Remove headers (# Header)
    .replace(/#+\s+(.*)/g, '$1')
    // Remove bold/italic (**bold**, *italic*)
    .replace(/(\*\*|\*)(.*?)(\*\*|\*)/g, '$2')
    // Remove links ([text](url))
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`(.*?)`/g, '$1')
    // Replace lists (- item or * item or 1. item) with plain text
    .replace(/^(\s*[-*]\s+|\s*\d+\.\s+)(.*)/gm, '$2')
    // Replace horizontal rules (---, ***) with line breaks
    .replace(/^(\s*[-*]){3,}\s*$/gm, '\n')
    // Add proper spacing after periods if missing
    .replace(/\.(\w)/g, '. $1')
    // Fix multiple consecutive blank lines
    .replace(/\n{3,}/g, '\n\n')
    // Fix spacing issues
    .replace(/\s+/g, ' ')
    // Trim whitespace
    .trim();
}

// Create audio buffer from text using ElevenLabs SDK
async function createAudioBufferFromText(text: string): Promise<Buffer> {
  // Create ElevenLabs client
  const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY;
  if (!elevenLabsApiKey) {
    throw new Error("ELEVEN_LABS_API_KEY is not configured");
  }
  
  const client = new ElevenLabsClient({
    apiKey: elevenLabsApiKey,
  });
  
  // Voice ID for 'Rachel'
  const voiceId = "IXQAN2tgDlb8raWmXvzP";
  
  // Create the audio stream and convert to buffer
  const audioStream = await client.textToSpeech.convertAsStream(voiceId, {
    model_id: 'eleven_turbo_v2',
    text: text,
    output_format: 'mp3_44100_128',
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75,
      use_speaker_boost: true,
      speed: 1.0,
    },
  });

  // Collect all chunks into a buffer
  const chunks: Uint8Array[] = [];
  for await (const chunk of audioStream) {
    chunks.push(chunk);
  }

  // Concatenate all chunks into a single buffer
  return Buffer.concat(chunks);
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { text, chapterId } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!text) {
      return new NextResponse("Text is required", { status: 400 });
    }

    if (!chapterId) {
      return new NextResponse("Chapter ID is required", { status: 400 });
    }

    console.log("Generating audio with ElevenLabs TTS...");
    console.log("Text length:", text.length);

    // Clean the text by removing markdown formatting
    const cleanedText = stripMarkdown(text);
    console.log("Text cleaned of markdown formatting");

    // For very long texts, we might need to chunk or summarize
    // For now, we'll just truncate if it's too long (ElevenLabs has limits)
    const maxLength = 4000;
    const truncatedText = cleanedText.length > maxLength 
      ? cleanedText.substring(0, maxLength) + "..." 
      : cleanedText;

    try {
      // Generate the audio buffer using ElevenLabs SDK
      console.log("Converting text to speech...");
      const audioBuffer = await createAudioBufferFromText(truncatedText);
      console.log(`Audio generated, size: ${audioBuffer.length} bytes`);
      
      // Upload the audio buffer to S3
      console.log("Uploading audio to S3...");
      const s3ObjectKey = await uploadAudioStreamToS3(audioBuffer);
      console.log(`Audio uploaded to S3: ${s3ObjectKey}`);
      
      // Generate a presigned URL for the uploaded audio
      const audioUrl = await generatePresignedUrl(s3ObjectKey);
      console.log("Presigned URL generated for audio access");
      
      // Get the direct S3 URL to store in the database
      const directS3Url = getS3Url(s3ObjectKey);
      
      // Update the chapter with the full S3 URL
      await prisma.courseChapter.update({
        where: { id: chapterId },
        data: {
          audioUrl: directS3Url, // Store the full S3 URL instead of just the key
          description: truncatedText
        }
      });
      
      console.log("Database updated with full S3 URL");
      
      // Return the audio information
      return NextResponse.json({
        audioUrl: audioUrl, // Presigned URL for immediate access
        audioKey: s3ObjectKey,
        s3Url: directS3Url, // Include the direct URL in the response
        chapterId: chapterId,
        success: true,
        message: "Audio generated and uploaded to S3 successfully."
      });
      
    } catch (error) {
      console.error("Error generating or uploading audio:", error);
      
      // If there was an error, just return the error message
      return NextResponse.json({ 
        error: error instanceof Error ? error.message : "Unknown error",
        success: false
      }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error("[ELEVENLABS_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 