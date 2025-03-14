import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

interface IParams {
  reservationId?: string;
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

    const { reservationId } = params;

    if (!reservationId || typeof reservationId !== 'string') {
      return NextResponse.json({ error: "Invalid reservation ID" }, { status: 400 });
    }

    // Find the reservation to delete
    const reservation = await db.coachingReservation.findUnique({
      where: {
        id: reservationId
      }
    });

    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }

    // Make sure the user owns this reservation
    if (reservation.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized to cancel this coaching session" }, { status: 403 });
    }

    // Delete the reservation
    await db.coachingReservation.delete({
      where: {
        id: reservationId
      }
    });

    return NextResponse.json({ message: "Coaching session cancelled successfully" });
  } catch (error) {
    console.error("[RESERVATION_DELETE]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
} 