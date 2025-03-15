import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prisma from '@/lib/prismadb';

interface IParams {
  listingId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { listingId } = params;

    if (!listingId || typeof listingId !== 'string') {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    // Find the listing first to verify ownership
    const listing = await prisma.coachingListing.findUnique({
      where: {
        id: listingId
      }
    });

    if (!listing) {
      return new NextResponse("Listing not found", { status: 404 });
    }

    // Verify that the user owns this listing
    if (listing.userId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Delete the listing
    await prisma.coachingListing.delete({
      where: {
        id: listingId
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[LISTING_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { listingId } = params;

    if (!listingId || typeof listingId !== 'string') {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const listing = await prisma.coachingListing.findUnique({
      where: {
        id: listingId
      }
    });

    if (!listing) {
      return new NextResponse("Listing not found", { status: 404 });
    }

    return NextResponse.json(listing);
  } catch (error) {
    console.error('[LISTING_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { userId } = auth();
    const { listingId } = params;
    const body = await request.json();
    
    const { 
      title,
      description,
      imageSrc,
      category,
      price
    } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!listingId || typeof listingId !== 'string') {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    if (!title || !description || !category || !price) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Find the listing first to verify ownership
    const existingListing = await prisma.coachingListing.findUnique({
      where: {
        id: listingId
      }
    });

    if (!existingListing) {
      return new NextResponse("Listing not found", { status: 404 });
    }

    // Verify that the user owns this listing
    if (existingListing.userId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Update the listing
    const listing = await prisma.coachingListing.update({
      where: {
        id: listingId
      },
      data: {
        title,
        description,
        imageSrc,
        category,
        price: parseInt(price.toString())
      }
    });

    return NextResponse.json(listing);
  } catch (error) {
    console.error('[LISTING_UPDATE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}