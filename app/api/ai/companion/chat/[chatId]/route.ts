import dotenv from "dotenv";
import { StreamingTextResponse, LangChainStream, OpenAIStream } from "ai";
import { auth, currentUser } from "@clerk/nextjs";
import { Replicate } from "@langchain/community/llms/replicate";
import { CallbackManager } from "@langchain/core/callbacks/manager";
import { NextResponse } from "next/server";

import { rateLimit } from "@/lib/rate-limit";
import { db } from "@/lib/db";
import { Chat } from "@livekit/components-react";
import { HumanMessage } from "@langchain/core/messages";

import OpenAI from "openai";
import { Readable } from "stream";

dotenv.config({ path: `.env` });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Function to calculate cosine similarity between two vectors
function cosineSimilarity(vecA: number[], vecB: number[]) {
  console.log("Calculating cosine similarity between vectors");
  const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
  const similarity = dotProduct / (magnitudeA * magnitudeB);
  console.log("Similarity score:", similarity);
  return similarity;
}

// Function to find most similar chapters based on embedding
async function findSimilarChapters(questionEmbedding: number[], threshold = 0.5) {
  console.log("Starting similarity search with threshold:", threshold);
  
  const chapterEmbeddings = await db.chapterEmbedding.findMany({
    include: {
      chapter: {
        select: {
          title: true,
          description: true,
        },
      },
    },
  });
  
  console.log(`Found ${chapterEmbeddings.length} total chapter embeddings`);

  // Map and calculate similarities first
  const chaptersWithSimilarity = chapterEmbeddings
    .map(embedding => {
      const similarity = cosineSimilarity(questionEmbedding, embedding.embedding as number[]);
      console.log(`Chapter "${embedding.chapter.title}" - Similarity score: ${similarity.toFixed(3)}`);
      return {
        ...embedding,
        similarity
      };
    });

  // Sort by similarity first
  const sortedChapters = chaptersWithSimilarity
    .sort((a, b) => b.similarity - a.similarity);

  // Get top 5 chapters regardless of threshold for logging
  console.log("\nTop 5 most similar chapters:");
  sortedChapters.slice(0, 5).forEach((chapter, index) => {
    console.log(`${index + 1}. "${chapter.chapter.title}" - Similarity: ${chapter.similarity.toFixed(3)}`);
  });

  // Then filter by threshold
  const similarChapters = sortedChapters
    .filter(chapter => {
      const passes = chapter.similarity > threshold;
      console.log(`Chapter "${chapter.chapter.title}" ${passes ? 'passes' : 'fails'} threshold (${threshold})`);
      return passes;
    })
    .slice(0, 3); // Keep top 3 that pass threshold

  console.log(`\nSelected ${similarChapters.length} chapters above threshold ${threshold}:`);
  similarChapters.forEach((chapter, index) => {
    console.log(`${index + 1}. "${chapter.chapter.title}" (similarity: ${chapter.similarity.toFixed(3)})`);
  });

  return similarChapters;
}

export async function POST(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    console.log("Starting chat request processing");
    const { prompt } = await request.json();
    console.log("User prompt:", prompt);
    
    const user = await currentUser();

    if (!user || !user.firstName || !user.id) {
      console.log("Unauthorized request - missing user information");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const identifier = request.url + "-" + user.id;
    const { success } = await rateLimit(identifier);

    if (!success) {
      return new NextResponse("Rate limit exceeded", { status: 429 });
    }

    console.log("Generating embedding for user question");
    const questionEmbeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-large",
      input: prompt,
    });
    const questionEmbedding = questionEmbeddingResponse.data[0].embedding;
    console.log("Successfully generated question embedding");

    console.log("Finding similar chapters");
    const similarChapters = await findSimilarChapters(questionEmbedding);

    console.log("Creating context from similar chapters");
    const contextFromChapters = similarChapters
      .map(chapter => `${chapter.chapter.title}: ${chapter.chapter.description}`)
      .join('\n\n');
    console.log("Context created:", contextFromChapters);

    // Store user message first
    const companion = await db.companion.update({
      where: {
        id: params.chatId
      },
      data: {
        messages: {
          create: {
            content: prompt,
            role: "user",
            userId: user.id,
          },
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc"
          },
          take: 10, // Get last 10 messages
        }
      }
    });

    if (!companion) {
      console.log("Companion not found:", params.chatId);
      return new NextResponse("Companion not found", { status: 404 });
    }

    // Format previous messages for context
    const messageHistory = companion.messages
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    console.log("Preparing final prompt with context");
    const finalPrompt = `
    Previous conversation:
    ${messageHistory}

    Use the following course chapter context to help answer the question:
    ${contextFromChapters}
    
    ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${companion.name}: prefix.
    ${companion.instructions}
    
    Question: ${prompt}
    `;
    console.log("Final prompt prepared with conversation history");

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      stream: true,
      messages: [{
        role: 'system',
        content: finalPrompt,
      }],
    });

    // Initialize response accumulator
    let fullResponse = '';

    // Create a custom parser stream
    const stream = OpenAIStream(response, {
      async onToken(token) {
        fullResponse += token;
      },
      async onCompletion(completion) {
        console.log("Storing complete AI response in database:", fullResponse);
        // Store the complete response
        await db.companion.update({
          where: {
            id: params.chatId
          },
          data: {
            messages: {
              create: {
                content: fullResponse,
                role: "system",
                userId: user.id,
              },
            },
          }
        });
      },
    });

    // Return the streaming response
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Error in chat processing:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
