import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { PrismaClient } from "@prisma/client";

// Set runtime to nodejs to avoid edge runtime limitations
export const runtime = "nodejs";

// Simple in-memory cache for audio data
const audioCache: Record<string, { data: Buffer, timestamp: number }> = {};
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes in milliseconds

export async function GET(
  req: NextRequest,
  { params }: { params: { chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { chapterId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!chapterId) {
      return new NextResponse("Missing chapterId", { status: 400 });
    }

    // Check if we have a cached version of this audio
    const cachedAudio = audioCache[chapterId];
    if (cachedAudio && (Date.now() - cachedAudio.timestamp < CACHE_TTL)) {
      // Cache hit - return the cached audio
      console.log(`Serving cached audio for chapter ${chapterId}`);
      
      const headers = new Headers();
      headers.set('Content-Type', 'audio/mpeg');
      headers.set('Content-Length', cachedAudio.data.length.toString());
      
      return new NextResponse(cachedAudio.data, {
        status: 200,
        headers
      });
    }

    // Get the chapter audio URL from the database
    const chapter = await db.courseChapter.findUnique({
      where: { id: chapterId },
      select: { audioUrl: true },
    });

    if (!chapter || !chapter.audioUrl) {
      return new NextResponse("Audio not found", { status: 404 });
    }

    // Fetch the audio file
    const audioResponse = await fetch(chapter.audioUrl);
    
    if (!audioResponse.ok) {
      console.error(`Failed to fetch audio: ${audioResponse.status}`);
      return new NextResponse("Failed to fetch audio", { status: 500 });
    }
    
    // Get the audio data as an array buffer
    const audioBuffer = await audioResponse.arrayBuffer();
    const buffer = Buffer.from(audioBuffer);
    
    // Cache the audio data
    audioCache[chapterId] = {
      data: buffer,
      timestamp: Date.now()
    };
    
    // Set appropriate headers for audio streaming
    const headers = new Headers();
    headers.set('Content-Type', 'audio/mpeg');
    headers.set('Content-Length', buffer.length.toString());
    
    // Return the audio data
    return new NextResponse(buffer, {
      status: 200,
      headers
    });
    
  } catch (error) {
    console.error("[CHAPTER_AUDIO_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 