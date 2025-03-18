import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.findFirst({
      where: {
        id: userId
      }
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const coachProfile = await db.coachProfile.findFirst({
      where: {
        userId: user.id
      }
    });

    if (!coachProfile) {
      return new NextResponse("Coach profile not found", { status: 404 });
    }

    return NextResponse.json({ 
      coach: coachProfile,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      } 
    });
  } catch (error) {
    console.log("[COACH_PROFILE_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 