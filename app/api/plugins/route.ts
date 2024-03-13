import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const {
        name,
        author,
        description,
        image,
        categoryId, // Assuming this is passed in the request body
    } = body;

    // Ensure categoryId is provided and valid
    if (!categoryId) {
      return new NextResponse("Category ID is required", { status: 400 });
    }

    // Optionally, validate categoryId exists in the database
    const categoryExists = await db.pluginCategory.findUnique({
      where: { id: categoryId },
    });

    if (!categoryExists) {
      return new NextResponse("Invalid Category ID", { status: 400 });
    }

    const plugin = await db.plugin.create({
        data: {
            name,
            author,
            description,
            image,
            userId: userId,
            categoryId: categoryId, // Add categoryId to the data being inserted
        },
    });

    return NextResponse.json(plugin);
}