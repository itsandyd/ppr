import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { stripeConnectComplete } = body;

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

    const updatedCoachProfile = await db.coachProfile.update({
      where: {
        id: coachProfile.id
      },
      data: {
        stripeConnectComplete
      }
    });

    return NextResponse.json(updatedCoachProfile);
  } catch (error) {
    console.log("[STRIPE_CONNECT_STATUS_UPDATE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 