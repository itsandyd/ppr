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

export async function POST(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const { prompt } = await request.json();
    const user = await currentUser();

    if (!user || !user.firstName || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const identifier = request.url + "-" + user.id;
    const { success } = await rateLimit(identifier);

    if (!success) {
      return new NextResponse("Rate limit exceeded", { status: 429 });
    }

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
      }
    });

    if (!companion) {
      return new NextResponse("Companion not found", { status: 404 });
    }


    const finalPrompt = `ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${companion.name}: prefix. ${companion.instructions} ${prompt} `

    const resp = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      stream: true,
      messages: [{
        role: 'system',
        content: finalPrompt,
      }],
    });
    const stream = OpenAIStream(resp)

return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
