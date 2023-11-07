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
    } = body;

    const plugin = await db.plugin.create({
        data: {
            name,
            author,
            description,
            image,
            userId: userId
        },
    });

    return NextResponse.json(plugin);
}