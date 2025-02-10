import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    
    const { 
      name, 
      description, 
      genre, 
      mood, 
      isPublic,
      contactEmail,
      submissionEnabled,
      submissionGuidelines,
      slug,
      platform,
      imagePath,
      url
    } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (submissionEnabled && !contactEmail) {
      return new NextResponse("Contact email is required when submissions are enabled", { status: 400 });
    }

    const playlist = await db.playlist.create({
      data: {
        userId,
        name,
        ...(slug ? { slug } : {}),
        ...(description ? { description } : {}),
        ...(genre ? { genre } : {}),
        ...(mood ? { mood } : {}),
        isPublic: isPublic || false,
        ...(contactEmail ? { contactEmail } : {}),
        submissionEnabled: submissionEnabled || false,
        ...(submissionGuidelines ? { submissionGuidelines } : {}),
        ...(platform ? { platform } : {}),
        ...(imagePath ? { imagePath } : {}),
        ...(url ? { url } : {})
      },
      include: {
        User: true
      }
    });

    return NextResponse.json(playlist);
  } catch (error) {
    console.log("[PLAYLISTS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 