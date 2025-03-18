import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * This route handler serves audio data for a specific chapter
 * It fetches the audio from ElevenLabs using the stored text and returns it
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { chapterId: string } }
) {
  try {
    const { userId } = auth();
    const chapterId = params.chapterId;

    // Optional: Check authorization (can the user access this chapter?)
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the chapter data from the database
    const chapter = await prisma.courseChapter.findUnique({
      where: {
        id: chapterId,
      },
    });

    if (!chapter) {
      return new NextResponse("Chapter not found", { status: 404 });
    }

    // Use the chapter's description to generate the audio
    const text = chapter.description || "";
    if (!text) {
      return new NextResponse("No text to generate audio from", { status: 400 });
    }

    // Get ElevenLabs API key
    const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY;
    
    if (!elevenLabsApiKey) {
      return new NextResponse("Text-to-speech service not properly configured", { status: 500 });
    }
    
    // Voice ID for 'Rachel'
    const voiceId = "21m00Tcm4TlvDq8ikWAM";
    
    // Generate audio using ElevenLabs API directly
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': elevenLabsApiKey
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_turbo_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return new NextResponse(`ElevenLabs API error: ${response.status}`, { 
        status: 500 
      });
    }
    
    // Get the audio data as an array buffer
    const audioData = await response.arrayBuffer();
    
    // Return the audio data with appropriate headers
    return new NextResponse(audioData, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioData.byteLength.toString(),
        'Cache-Control': 'public, max-age=604800', // Cache for 1 week
      }
    });
  } catch (error) {
    console.error("[AUDIO_API_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 