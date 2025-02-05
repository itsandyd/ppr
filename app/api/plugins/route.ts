import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { userId } = auth();
        const body = await request.json();
        
        // Implement rate limiting check here
        
        const { name } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const slug = name.toLowerCase().replace(/\s+/g, '-');

        const plugin = await db.plugin.create({
            data: {
                name,
                userId,
                slug,
            },
        });

        return NextResponse.json(plugin);

    } catch (error) {
        console.log("[PLUGIN]", error)
        return NextResponse.json(
            { error: "Invalid request" },
            { status: 400 }
        );
    }
}