import { OpenAI } from 'openai';
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs"
import { OpenAIStream, StreamingTextResponse } from 'ai';


const config = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });

export async function POST(
    req: Request
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { messages } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!config.apiKey) {
            return new NextResponse("OpenAI API Key not configured", { status: 500 });
        }

        if (!messages) {
            return new NextResponse("Messages are required", { status: 400 });
        }

        const resp = await config.chat.completions.create({
            model: 'gpt-4-turbo',
            stream: true,
            messages: [{
              role: 'system',
              content: messages,
            }],
          });
          const stream = OpenAIStream(resp)
      
      return new StreamingTextResponse(stream);

    } catch (error) {
        console.log("[CONVERSATION_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500});
    }
}