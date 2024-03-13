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
            throw new NextResponse("You must be logged in to create a plugin", { status: 401 });
        }

        const plugin = await db.plugin.create({
            data: {
                name,
                userId,
            },
        });

        return NextResponse.json(plugin);

    } catch (error) {
        console.log("[PLUGIN]", error)
        return new NextResponse("Interanl Error", { status: 500 });
    }
}