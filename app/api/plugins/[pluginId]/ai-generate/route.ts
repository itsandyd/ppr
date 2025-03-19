import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { ChatOpenAI } from "@langchain/openai";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

export const maxDuration = 300;

// Initialize tools and models
const initializeTools = () => {
  try {
    const required = ['TAVILY_API_KEY', 'OPENAI_API_KEY'];
    const missing = required.filter(key => !process.env[key]);
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    return {
      searchTool: new TavilySearchResults({
        apiKey: process.env.TAVILY_API_KEY,
        maxResults: 5
      }),
      chatModel: new ChatOpenAI({
        modelName: "gpt-4o",
        temperature: 0.7,
      })
    };
  } catch (error) {
    console.error("[INITIALIZATION_ERROR]", error);
    throw error;
  }
};

const { searchTool, chatModel } = initializeTools();

function sanitizeSearchQuery(pluginName: string, description: string | null): string {
  const combinedQuery = `${pluginName} audio plugin VST music production details features`.trim();
  return combinedQuery.slice(0, 200);
}

const pluginEnhancePrompt = PromptTemplate.fromTemplate(`
You are an expert audio plugin marketer and technical writer. Based on the following context, create a comprehensive
and compelling plugin description that would appeal to music producers and audio professionals.

Plugin Context:
Plugin Name: {pluginName}
Current Description: {currentDescription}

Search Results:
{searchResults}

Create a well-structured, professional plugin description with the following sections:

## Overview
Start with a concise, compelling introduction about what the plugin does and its unique value proposition.

## Key Features
List 5-8 standout features using bullet points. Focus on technical capabilities and benefits.

## Sound Quality & Processing
Describe the sonic characteristics and audio quality that sets this plugin apart.

## User Interface
Explain the interface design, workflow improvements, and ease of use.

## Technical Specifications
Include format compatibility (VST, AU, AAX), system requirements, and technical details.

## Use Cases
Briefly describe ideal applications and target users (mixing engineers, producers, etc.)

Use professional but accessible audio engineering terminology. Maintain a confident, authoritative tone that would appeal to audio professionals.
Ensure the description is factual, avoiding hyperbole while still highlighting unique selling points.
Focus on creating rich, SEO-friendly content that effectively sells the plugin's value.`);

export async function POST(
  req: Request,
  { params }: { params: { pluginId: string } }
) {
  try {
    const { userId } = auth();
    const { title, description } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the plugin
    const plugin = await db.plugin.findFirst({
      where: {
        id: params.pluginId,
        userId,
      },
    });

    if (!plugin) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Create the research chain
    const researchChain = RunnableSequence.from([
      async ({ pluginName, currentDescription }) => {
        try {
          const query = sanitizeSearchQuery(pluginName, currentDescription);
          console.log("[TAVILY_SEARCH_QUERY]", query);
          
          const searchResults = await searchTool.invoke({ input: query });
          
          if (!searchResults || typeof searchResults !== 'string') {
            console.log("[TAVILY_SEARCH_RESULTS_EMPTY]", "No results returned");
            return {
              pluginName,
              currentDescription,
              searchResults: "No relevant search results found. Generating content based on plugin name and basic audio plugin knowledge.",
            };
          }

          return {
            pluginName,
            currentDescription,
            searchResults,
          };
        } catch (error) {
          console.error("[TAVILY_SEARCH_ERROR]", error);
          return {
            pluginName,
            currentDescription,
            searchResults: `Unable to perform external research. Generating comprehensive content based on plugin information and audio plugin best practices.`,
          };
        }
      },
      pluginEnhancePrompt,
      chatModel,
      new StringOutputParser(),
    ]);

    // Execute the chain
    const enhancedDescription = await researchChain.invoke({
      pluginName: plugin.name,
      currentDescription: plugin.description || "No description provided",
    });
    
    // Update the plugin with enhanced content
    const updatedPlugin = await db.plugin.update({
      where: {
        id: params.pluginId,
      },
      data: {
        description: enhancedDescription,
      },
    });

    return NextResponse.json(updatedPlugin);
  } catch (error) {
    console.error("[PLUGIN_AI_GENERATE]", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Error";
    return new NextResponse(errorMessage, { 
      status: error instanceof Error && error.message.includes("Unauthorized") ? 401 : 500 
    });
  }
} 