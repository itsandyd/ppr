import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

export const maxDuration = 300;

// Initialize the OpenAI model
const initializeModel = () => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("Missing OPENAI_API_KEY environment variable");
    }

    return new ChatOpenAI({
      modelName: "gpt-4o",
      temperature: 0.5,
    });
  } catch (error) {
    console.error("[INITIALIZATION_ERROR]", error);
    throw error;
  }
};

const chatModel = initializeModel();

// Template for transforming plugin description into a TTS-friendly script
const scriptTemplate = PromptTemplate.fromTemplate(`
You are an expert at writing engaging video scripts for audio plugins. 
Your task is to transform a technical plugin description into a natural-sounding, 
fluid script that would work well for text-to-speech narration in a product demo video.

Plugin Name: {pluginName}
Plugin Description: {description}

Create a script that:
1. Has a clear introduction that mentions the plugin name and its main purpose
2. Flows naturally and conversationally, as if someone is speaking
3. Highlights the key features and benefits in a logical order
4. Has proper pacing and pauses (you can use commas and periods)
5. Avoids complex technical jargon that would be hard to pronounce
6. Concludes with a specific call to action that says something like: "Want to get your hands on this plugin? You can do so at pauseplayrepeat.com"
7. Is comprehensive and detailed - similar in length to the original description
8. Does NOT use section headers or labels like [INTRO], [FEATURES], etc.

Write a comprehensive script that fully explains the plugin in detail. Don't abbreviate or condense the content.
The script should maintain all the important details from the original description.

IMPORTANT: The script MUST end with a similar closing line: "Want to get your hands on this plugin? You can do so at pauseplayrepeat.com"

Script:
`);

// Define and export the POST function directly
export async function POST(req: Request) {
  console.log("API route /api/plugins/generate called");
  try {
    const { userId } = auth();
    const body = await req.json();
    console.log("Request body:", body);
    const { pluginId, videoScript } = body;

    if (!userId) {
      console.log("Unauthorized - no userId");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!pluginId) {
      console.log("Missing pluginId in request");
      return new NextResponse("Plugin ID is required", { status: 400 });
    }

    console.log("Authenticated userId:", userId);
    console.log("Looking for plugin with ID:", pluginId);

    // Check if the user is an admin
    const adminCheck = await db.user.findUnique({
      where: { id: userId },
      select: { admin: true }
    });
    
    const isAdmin = adminCheck?.admin || false;
    console.log("Is user admin:", isAdmin);

    // First, try to find the plugin without userId constraint
    const plugin = await db.plugin.findUnique({
      where: { 
        id: pluginId
      }
    });

    if (!plugin) {
      console.log("Plugin not found with id:", pluginId);
      return new NextResponse("Plugin not found", { status: 404 });
    }
    
    console.log("Plugin found:", plugin.name, "Plugin userId:", plugin.userId);

    // Check if this is a plugin the user can modify (for saving)
    // Allow if: 1) user is admin, 2) plugin has no owner, or 3) plugin belongs to user
    const canModify = isAdmin || !plugin.userId || plugin.userId === userId;
    console.log("User can modify plugin:", canModify);

    // Use the provided videoScript or fall back to the plugin's description
    const contentToUse = videoScript || plugin.videoScript || plugin.description;
    
    if (!contentToUse) {
      return new NextResponse("No content available to generate script from", { status: 400 });
    }

    // Create the script generation chain
    const scriptChain = RunnableSequence.from([
      scriptTemplate,
      chatModel,
      new StringOutputParser()
    ]);

    // Execute the chain
    const script = await scriptChain.invoke({
      pluginName: plugin.name,
      description: contentToUse
    });

    // Only update the plugin if the user has permission
    if (canModify) {
      // Update the plugin with the generated script
      await db.plugin.update({
        where: { id: pluginId },
        data: { videoScript: script }
      });
    }

    // Return the generated script either way
    return NextResponse.json({ 
      script,
      message: canModify ? "Video script generated and saved successfully" : "Video script generated (preview only)",
      saved: canModify
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    });
  } catch (error) {
    console.error("[GENERATE_SCRIPT_ERROR]", error);
    const errorMessage = error instanceof Error ? error.message : "Internal error";
    return new NextResponse(errorMessage, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    });
  }
}

// Add OPTIONS method handler for CORS preflight requests
export async function OPTIONS(req: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
} 