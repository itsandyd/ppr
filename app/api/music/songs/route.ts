import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { MusicPlatform } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { title, author, platform, url, songPath, imagePath } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!title || !author) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Check if either platform+url or songPath is provided
    if (!((platform && url) || songPath)) {
      return new NextResponse("Either platform and URL or songPath must be provided", { status: 400 });
    }

    // If platform is provided, validate it
    if (platform && !Object.values(MusicPlatform).includes(platform)) {
      return new NextResponse("Invalid platform", { status: 400 });
    }

    const song = await db.song.create({
      data: {
        title,
        author,
        platform: platform || null,
        url: url || null,
        songPath: songPath || null,
        imagePath: imagePath || null,
        userId
      }
    });

    return NextResponse.json(song);
  } catch (error) {
    console.log('[SONGS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
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
      // If platform and url exist, use those, otherwise use legacy songPath
      source: song.platform && song.url ? song.url : song.songPath,
      type: song.platform || 'LEGACY'
    }));

    return NextResponse.json(transformedSongs);
  } catch (error) {
    console.log('[SONGS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 