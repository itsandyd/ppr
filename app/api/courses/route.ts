import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request, 
) {
    try {
        const { userId } = auth();
        const { title } = await req.json();

        if (!userId) {
            throw new NextResponse("You must be logged in to create a course", { status: 401 });
        }

        const course = await db.course.create({
            data: {
                title,
                userId,
            },
        });

        return NextResponse.json(course);

    } catch (error) {
        console.log("[COURSE]", error)
        return new NextResponse("Interanl Error", { status: 500 });
    }
}