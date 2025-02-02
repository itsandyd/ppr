import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST() {
  try {
    // Alter ChapterEmbedding table to use VECTOR type
    await db.$executeRaw`
      ALTER TABLE ChapterEmbedding 
      MODIFY COLUMN embedding VECTOR(1536);
    `;

    // Alter VectorEmbedding table to use VECTOR type
    await db.$executeRaw`
      ALTER TABLE VectorEmbedding 
      MODIFY COLUMN embedding VECTOR(1536);
    `;

    return NextResponse.json({ 
      success: true, 
      message: "Vector columns successfully set up!" 
    });
  } catch (error: any) {
    console.error("Error setting up vector columns:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to set up vector columns" 
      },
      { status: 500 }
    );
  }
} 