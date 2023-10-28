

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST (
    request: Request
) {
    const body = await request.json();
    const {
        email,
        name,
        // password,
    } = body;



    const user = await db.user.create({
        data: {
            email,
            name,
            // password,
    }
    });

    return NextResponse.json(user);
}


