// app/api/music/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { Song } from '@prisma/client';

export async function POST(req: NextRequest) {
    const { title, artist, url, image } = await req.json();

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

    const newSong = await db.song.create({
        data: {
            title,
            artist,
            url,
            imagePath: image,
            duration: 0,
            userId,
            platform: null
        }
    });

    return NextResponse.json(newSong);
}