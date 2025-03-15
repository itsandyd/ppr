import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';

interface TimeSlot {
  id: string;
  date: Date | string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    
    const { date, timeSlots } = body;
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    if (!date) {
      return new NextResponse("Date is required", { status: 400 });
    }
    
    if (!timeSlots || !Array.isArray(timeSlots)) {
      return new NextResponse("Time slots are required", { status: 400 });
    }

    // First, get all existing time slots for this date
    const existingSlots = await db.coachAvailability.findMany({
      where: {
        userId,
        date: new Date(date),
      }
    });

    // Create a map of existing slot IDs
    const existingSlotIds = new Set(existingSlots.map(slot => slot.id));
    const timeSlotIds = new Set(timeSlots.map((slot: TimeSlot) => slot.id));

    // Identify slots to delete (in existing but not in new timeSlots)
    const slotsToDelete = existingSlots.filter(slot => !timeSlotIds.has(slot.id));

    // Delete slots that are no longer in the list
    if (slotsToDelete.length > 0) {
      await db.coachAvailability.deleteMany({
        where: {
          id: {
            in: slotsToDelete.map(slot => slot.id)
          }
        }
      });
    }

    // Update or create slots from the timeSlots array
    for (const slot of timeSlots as TimeSlot[]) {
      if (existingSlotIds.has(slot.id)) {
        // Update existing slot
        await db.coachAvailability.update({
          where: {
            id: slot.id
          },
          data: {
            date: new Date(date),
            startTime: slot.startTime,
            endTime: slot.endTime,
            isAvailable: slot.isAvailable
          }
        });
      } else {
        // Create new slot if it doesn't have an ID yet or ID doesn't exist
        await db.coachAvailability.create({
          data: {
            userId,
            date: new Date(date),
            startTime: slot.startTime,
            endTime: slot.endTime,
            isAvailable: slot.isAvailable
          }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[AVAILABILITY_SAVE_ALL]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 