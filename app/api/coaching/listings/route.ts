import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';


// import getCurrentUser from '@/app/actions/getCurrentUser';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    
    // Extract the data from the request body
    const { title, description, price, category, imageSrc } = body;
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    // Validate required fields
    if (!title || !description || !price || !category) {
      return new NextResponse("Missing required fields", { status: 400 });
    }
    
    // Create a new coaching listing
    const listing = await db.coachingListing.create({
      data: {
        title,
        description,
        imageSrc: imageSrc || '/images/coaching-placeholder.jpg',
        category,
        price: typeof price === 'string' ? parseInt(price, 10) : price,
        userId,
        // These fields might not be needed for coaching but match the schema
        roomCount: 1,
        bathroomCount: 1,
        guestCount: 1,
        locationValue: 'online' // Coaching is typically online
      }
    });
    
    return NextResponse.json(listing);
  } catch (error) {
    console.error('[COACHING_LISTINGS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    
    let query: any = {};
    
    // If a userId is provided, filter listings by that user
    if (userId) {
      query.userId = userId;
    }
    
    // Get all coaching listings matching the query
    const listings = await db.coachingListing.findMany({
      where: query,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(listings);
  } catch (error) {
    console.error('[COACHING_LISTINGS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}