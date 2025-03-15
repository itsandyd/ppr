import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';

// PATCH /api/availability/[slotId] - Update a specific availability slot
export async function PATCH(
  request: Request,
  { params }: { params: { slotId: string } }
) {
  try {
    const { slotId } = params;
    const body = await request.json();
    const { isAvailable } = body;
    
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    // Check if the slot exists and belongs to the user
    const existingSlot = await db.coachAvailability.findUnique({
      where: {
        id: slotId
      }
    });
    
    if (!existingSlot) {
      return new NextResponse('Availability slot not found', { status: 404 });
    }
    
    if (existingSlot.userId !== userId) {
      return new NextResponse('Access denied', { status: 403 });
    }
    
    // Update the availability slot
    const updatedSlot = await db.coachAvailability.update({
      where: {
        id: slotId
      },
      data: {
        isAvailable: isAvailable
      }
    });
    
    return NextResponse.json(updatedSlot);
  } catch (error) {
    console.error('PATCH /api/availability/[slotId] error:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

// DELETE /api/availability/[slotId] - Delete a specific availability slot
export async function DELETE(
  request: Request,
  { params }: { params: { slotId: string } }
) {
  try {
    const { slotId } = params;
    
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    // Check if the slot exists and belongs to the user
    const existingSlot = await db.coachAvailability.findUnique({
      where: {
        id: slotId
      }
    });
    
    if (!existingSlot) {
      return new NextResponse('Availability slot not found', { status: 404 });
    }
    
    if (existingSlot.userId !== userId) {
      return new NextResponse('Access denied', { status: 403 });
    }
    
    // Delete the availability slot
    await db.coachAvailability.delete({
      where: {
        id: slotId
      }
    });
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('DELETE /api/availability/[slotId] error:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 