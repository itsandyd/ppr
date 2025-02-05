import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request, 
) {
    try {
        const { userId } = auth();
        const body = await req.json();

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
        return new NextResponse("Internal error", { status: 500 });
    }
}