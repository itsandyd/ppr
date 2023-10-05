// app/api/music/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { Song } from '@prisma/client';

export async function POST(req: NextRequest) {
    const { author, title, song, image } = await req.json();

    const { userId } = auth();

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const profile = await db.profile.findUnique({
        where: {
            userId
        }
    });

    if (!profile) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const newSongData = {
        author,
        title,
        songPath: song, // replace with actual path after handling file
        imagePath: image, // replace with actual path after handling file
        userId
    };

    const newSong = await db.song.create({
        data: {
            ...newSongData
        }
    });

    return NextResponse.json(newSong);
}