import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { PrismaClient } from "@prisma/client";
import { ElevenLabsClient } from "elevenlabs";
import { v4 as uuidv4 } from "uuid";
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Set runtime to nodejs to avoid edge runtime limitations
export const maxDuration = 300; // 300 seconds (5 minutes) maximum timeout

// Create a new Prisma Client instance
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
  const remotePath = `audio/plugins/${uuidv4()}.mp3`;
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
  console.log("API route /api/plugins/elevenlabs called");
  try {
    const { userId } = auth();
    const body = await req.json();
    console.log("Request body:", body);
    const { text, pluginId } = body;

    if (!userId) {
      console.log("Unauthorized - no userId");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!pluginId) {
      console.log("Missing pluginId in request");
      return new NextResponse("Plugin ID is required", { status: 400 });
    }

    console.log("Authenticated userId:", userId);
    console.log("Looking for plugin with ID:", pluginId);

    // Check if the user is an admin
    const adminCheck = await db.user.findUnique({
      where: { id: userId },
      select: { admin: true }
    });
    
    const isAdmin = adminCheck?.admin || false;
    console.log("Is user admin:", isAdmin);

    // First, try to find the plugin without userId constraint
    const plugin = await db.plugin.findUnique({
      where: { 
        id: pluginId
      }
    });

    if (!plugin) {
      console.log("Plugin not found with id:", pluginId);
      return new NextResponse("Plugin not found", { status: 404 });
    }
    
    console.log("Plugin found:", plugin.name, "Plugin userId:", plugin.userId);

    // Check if this is a plugin the user can modify (for saving)
    // Allow if: 1) user is admin, 2) plugin has no owner, or 3) plugin belongs to user
    const canModify = isAdmin || !plugin.userId || plugin.userId === userId;
    console.log("User can modify plugin:", canModify);

    if (!canModify) {
      console.log("Permission denied - plugin belongs to another user");
      return new NextResponse("You don't have permission to edit this plugin", { status: 403 });
    }

    // Use provided text, or fall back to video script, or finally use description
    const textToUse = text || plugin.videoScript || plugin.description || "";
    
    if (!textToUse) {
      return new NextResponse("No text content available for audio generation", { status: 400 });
    }

    console.log("Generating audio with ElevenLabs TTS for plugin...");
    console.log("Text length:", textToUse.length);

    // Clean the text by removing markdown formatting
    const cleanedText = stripMarkdown(textToUse);
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
      
      // Get the direct S3 URL to store in the database - NO PRESIGNED URL
      const directS3Url = getS3Url(s3ObjectKey);
      console.log("Direct S3 URL for database and video generation:", directS3Url);
      
      // Update the plugin with the direct S3 URL
      await prisma.plugin.update({
        where: { id: pluginId },
        data: {
          audioUrl: directS3Url,
        }
      });
      console.log("Plugin updated with direct S3 audio URL");
      
      // Return the audio information with the DIRECT URL, not the presigned URL
      return NextResponse.json({
        audioUrl: directS3Url, // Use direct URL instead of presigned URL
        audioKey: s3ObjectKey,
        pluginId: pluginId,
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
    console.error("[PLUGIN_ELEVENLABS_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 