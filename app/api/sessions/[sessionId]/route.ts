import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

interface IParams {
  sessionId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = params;

    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({ error: "Invalid session ID" }, { status: 400 });
    }

    // Find the session to delete (stored as a reservation in the database)
    const session = await db.coachingReservation.findUnique({
      where: {
        id: sessionId
      }
    });

    if (!session) {
      return NextResponse.json({ error: "Coaching session not found" }, { status: 404 });
    }

    // Make sure the user owns this session
    if (session.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized to cancel this coaching session" }, { status: 403 });
    }

    // Delete the session
    await db.coachingReservation.delete({
      where: {
        id: sessionId
      }
    });

    return NextResponse.json({ message: "Coaching session cancelled successfully" });
  } catch (error) {
    console.error("[SESSION_DELETE]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
} 