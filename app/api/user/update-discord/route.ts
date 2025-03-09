import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";
import { db } from "@/lib/db";

export async function POST(
  request: Request
) {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { discordUsername } = body;

    if (!discordUsername) {
      return NextResponse.json(
        { error: "Discord username is required" },
        { status: 400 }
      );
    }

    // 1. Update the user's Discord username in Clerk metadata
    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        discordUsername
      }
    });

    // 2. Find the user in the database by their Clerk ID
    const dbUser = await db.user.findFirst({
      where: {
        id: userId
      }
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    // 3. Update the user's Discord username in the database
    const updatedUser = await db.user.update({
      where: {
        id: userId
      },
      data: {
        discordUsername
      }
    });

    return NextResponse.json({
      success: true,
      discordUsername,
      user: updatedUser
    });
  } catch (error) {
    console.error("[USER_UPDATE_DISCORD]", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
} 