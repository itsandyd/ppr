import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function POST(request: Request) {

    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();

    const {
        trackUrl,
        trackName,
        artistName,
        albumImage,
      } = body;
    
      const sharedTrack = await db.sharedTrack.create({
        data: {
          userId: userId,
          trackUrl,
          trackName,
          artistName,
          albumImage,
        },
      })

  return NextResponse.json(sharedTrack);
}