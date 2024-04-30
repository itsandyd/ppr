import { OpenAI, ChatOpenAI } from "@langchain/openai";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs"
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { HumanMessage } from "@langchain/core/messages";
import { PromptTemplate } from "@langchain/core/prompts";


// const model = new ChatOpenAI({
//     apiKey: process.env.OPENAI_API_KEY!,
//   });

  export async function POST(
    req: Request
) {
    try {

        // const llm = new OpenAI({
        //     model: "gpt-3.5-turbo-instruct",
        //   });
        // const chatModel = new ChatOpenAI({
        //     // model: "gpt-3.5-turbo-1106",
        //     // streaming: true

        //   })

        const model = new ChatOpenAI({
            apiKey: process.env.OPENAI_API_KEY!,
          });

        const { userId } = auth();
        const body = await req.json();
        const { text } = body;

        const promptTemplate = PromptTemplate.fromTemplate(`
            You are a helpful assistant.
            Respond to the following user query:
            {topic}
        `);
        // const messages = [new HumanMessage(text)];

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!model.apiKey) {
            return new NextResponse("OpenAI API Key not configured", { status: 500 });
        }

        if (!text) {
            return new NextResponse("Messages are required", { status: 400 });
        };

        const chain = promptTemplate.pipe(model);

        const result = await chain.invoke({ topic: text });

        // await llm.invoke(text)

        // await chatModel.invoke(messages)

        console.log(result);

        return new NextResponse(JSON.stringify(result));
    } catch (error) {
        console.log("[CONVERSATION_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500});
    }
}