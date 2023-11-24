import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request, 
) {
    try {
        const { userId } = auth();
        const { folderName } = await req.json();

        if (!userId) {
            throw new NextResponse("You must be logged in to create a folder", { status: 401 });
        }

        const folder = await db.storageFolder.create({
            data: {
                name: folderName,
                userId: userId,
            },
        });

        return NextResponse.json(folder);

    } catch (error) {
        console.log("[FOLDER]", error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}