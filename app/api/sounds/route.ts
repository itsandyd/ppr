import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request, 
) {
    try {
        const { userId } = auth();
        const { name } = await req.json();

        if (!userId) {
            throw new NextResponse("You must be logged in to create sound", { status: 401 });
        }

        const sounds = await db.sounds.create({
            data: {
                name,
                userId,
            },
        });

        return NextResponse.json(sounds);

    } catch (error) {
        console.log("[SOUNDS]", error)
        return new NextResponse("Interanl Error", { status: 500 });
    }
}