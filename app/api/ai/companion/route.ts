import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { checkSubscription } from "@/lib/subscriptions";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const user = await currentUser();
        const { src, name, description, instructions, seed, categoryId } = body;

        if (!user || !user.id || !user.firstName) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!src || !name || !description || !instructions || !seed || !categoryId) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // const isPro = await checkSubscription();

        // if (!isPro) {
        //     return new NextResponse("Pro Subscription Required", { status: 403 });
        // }

        const companion = await db.companion.create({
            data: {
                src,
                name,
                description,
                instructions,
                seed,
                categoryId,
                userName: user.firstName,
                userId: user.id,
            },
        });

        return NextResponse.json(companion);

    } catch (error) {
        console.log("[COMPANION_POST", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}