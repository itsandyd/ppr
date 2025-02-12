import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { MusicPlatform } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { 
      title,
      author,
      platform,
      url,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    if (!author) {
      return new NextResponse("Author is required", { status: 400 });
    }

    if (!platform || !Object.values(MusicPlatform).includes(platform as MusicPlatform)) {
      return new NextResponse("Valid platform is required", { status: 400 });
    }

    if (!url) {
      return new NextResponse("URL is required", { status: 400 });
    }

    const song = await db.song.create({
      data: {
        title,
        artist: author,
        userId,
        platform: platform as MusicPlatform,
        url,
      }
    });

    return NextResponse.json(song);
  } catch (error) {
    console.log("[SONGS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const songs = await db.song.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform the response to handle both old and new formats
    const transformedSongs = songs.map(song => ({
      ...song,
      source: song.url,
      type: song.platform || 'LEGACY'
    }));

    return NextResponse.json(transformedSongs);
  } catch (error) {
    console.log('[SONGS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 