import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs";

import { db } from "@/lib/db";

export async function POST(
  req: Request
) {
  try {
    const { userId } = auth();
    const user = await currentUser();
    const body = await req.json();
    const { companionId } = body;

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Delete all messages for this companion and user
    await db.companionMessage.deleteMany({
      where: {
        companionId: companionId,
        userId: userId,
      },
    });

    return new NextResponse("Messages cleared", { status: 200 });
  } catch (error) {
    console.log("[COMPANION_CLEAR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 