import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

async function generateEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: text,
  });
  return response.data[0].embedding;
}

export async function POST() {
  try {
    // Modify columns to VECTOR type
    // try {
    //   await db.$executeRaw`
    //     ALTER TABLE ChapterEmbedding 
    //     MODIFY COLUMN embedding VECTOR(1536);
    //   `;
    //   await db.$executeRaw`
    //     ALTER TABLE VectorEmbedding 
    //     MODIFY COLUMN embedding VECTOR(1536);
    //   `;
    // } catch (error: any) {
    //   if (!error.message.includes('Duplicate')) {
    //     throw error;
    //   }
    // }

    // Get all course chapters that don't have embeddings yet
    const chapters = await db.courseChapter.findMany({
      where: {
        embedding: null,
        description: {
          not: null
        }
      },
      select: {
        id: true,
        title: true,
        description: true
      }
    });

    console.log(`Found ${chapters.length} chapters without embeddings`);

    // Generate and store embeddings for each chapter
    for (const chapter of chapters) {
      if (!chapter.description) continue;

      const content = `${chapter.title}\n${chapter.description}`;
      const embedding = await generateEmbedding(content);

      await db.chapterEmbedding.create({
        data: {
          chapterId: chapter.id,
          embedding: embedding as any
        }
      });

      console.log(`Created embedding for chapter: ${chapter.title}`);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Vector columns modified and embeddings generated for ${chapters.length} chapters!` 
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