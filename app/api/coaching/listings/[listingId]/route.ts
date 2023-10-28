import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

interface IParams {
  listingId?: string;
}

export async function DELETE(
  request: Request, 
  { params }: { params: IParams }
) {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

  const { listingId } = params;

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('Invalid ID');
  }

  const listing = await db.coachingListing.deleteMany({
    where: {
      id: listingId,
      userId: userId
    }
  });

  return NextResponse.json(listing);
}