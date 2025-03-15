import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs';
import { db } from '@/lib/db';

// POST /api/availability/weekly - Create availability slots for multiple days
export async function POST(
  request: Request
) {
  try {
    const body = await request.json();
    const { dates, startTime, endTime } = body;
    
    const user = await currentUser();
    
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    // Validate required fields
    if (!dates || !Array.isArray(dates) || !startTime || !endTime) {
      return new NextResponse('Missing required fields', { status: 400 });
    }
    
    // Create availability slots for each date
    const createdSlots = await Promise.all(
      dates.map(async (dateString) => {
        return db.coachAvailability.create({
          data: {
            date: new Date(dateString),
            startTime,
            endTime,
            isAvailable: true,
            userId: user.id
          }
        });
      })
    );
    
    return NextResponse.json({ 
      success: true, 
      count: createdSlots.length,
      message: `Created ${createdSlots.length} availability slots`
    });
  } catch (error) {
    console.error('POST /api/availability/weekly error:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 