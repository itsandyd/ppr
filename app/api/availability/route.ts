import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs';
import { db } from '@/lib/db';

// GET /api/availability - Get availability for a specific date
export async function GET(
  request: Request
) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!date) {
      return new NextResponse('Date parameter is required', { status: 400 });
    }

    // Parse the date string to create a range for the entire day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    // Query the database to get all time slots for this date
    const timeSlots = await db.coachAvailability.findMany({
      where: {
        userId,
        date: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    });
    
    return NextResponse.json(timeSlots);
  } catch (error) {
    console.error('GET /api/availability error:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

// POST /api/availability - Create a new availability slot
export async function POST(
  request: Request
) {
  try {
    const body = await request.json();
    const { date, startTime, endTime, isAvailable } = body;
    
    const user = await currentUser();
    
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    // Validate required fields
    if (!date || !startTime || !endTime) {
      return new NextResponse('Missing required fields', { status: 400 });
    }
    
    // Create the new availability slot
    const timeSlot = await db.coachAvailability.create({
      data: {
        date: new Date(date),
        startTime,
        endTime,
        isAvailable: isAvailable ?? true,
        userId: user.id
      }
    });
    
    return NextResponse.json(timeSlot);
  } catch (error) {
    console.error('POST /api/availability error:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 