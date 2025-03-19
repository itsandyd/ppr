import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
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
        maxResults: 3
      }),
      chatModel: new ChatOpenAI({
        modelName: "gpt-4o",
        temperature: 0.6,
      })
    };
  } catch (error) {
    console.error("[INITIALIZATION_ERROR]", error);
    throw error;
  }
};

const { searchTool, chatModel } = initializeTools();

function sanitizeSearchQuery(pluginName: string): string {
  const combinedQuery = `${pluginName} audio plugin VST music production marketing keywords`.trim();
  return combinedQuery.slice(0, 200);
}

const marketingEnhancePrompt = PromptTemplate.fromTemplate(`
You are an expert in audio plugin marketing and SEO. Based on the following information, enhance the plugin details
to improve its marketability and discoverability.

Plugin Information:
Plugin Name: {pluginName}
Current Description: {currentDescription}

Search Results about similar plugins:
{searchResults}

Generate the following enhanced content:

1. An improved, concise title that maintains the original plugin name but adds a descriptive subtitle
2. A brief but compelling one-paragraph description (max 2-3 sentences)
3. A list of 10-15 relevant keywords and tags that would help with SEO

For the title, focus on clarity and benefits.
For the description, highlight the unique value proposition and target user.
For keywords, include specific audio engineering terms, use cases, and relevant technical specifications.

Format your response as a JSON object with these keys:
- enhancedTitle
- enhancedDescription
- suggestedKeywords (as an array)

Ensure all content is factual, professional, and avoids hyperbole while still being marketing-effective.`);

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { title, description } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!title || !description) {
      return new NextResponse("Title and description are required", { status: 400 });
    }

    // Create the marketing enhancement chain
    const marketingChain = RunnableSequence.from([
      async ({ pluginName, currentDescription }) => {
        try {
          const query = sanitizeSearchQuery(pluginName);
          console.log("[TAVILY_SEARCH_QUERY]", query);
          
          const searchResults = await searchTool.invoke({ input: query });
          
          if (!searchResults || typeof searchResults !== 'string') {
            console.log("[TAVILY_SEARCH_RESULTS_EMPTY]", "No results returned");
            return {
              pluginName,
              currentDescription,
              searchResults: "No relevant search results found. Generating content based on plugin name and marketing best practices.",
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
            searchResults: `Unable to perform external research. Generating enhanced marketing content based on provided information and audio plugin marketing best practices.`,
          };
        }
      },
      marketingEnhancePrompt,
      chatModel,
      new StringOutputParser(),
    ]);

    // Execute the chain
    const enhancementResult = await marketingChain.invoke({
      pluginName: title,
      currentDescription: description,
    });
    
    // Parse the JSON response
    let enhancedResult;
    try {
      enhancedResult = JSON.parse(enhancementResult);
    } catch (error) {
      console.error("[JSON_PARSE_ERROR]", error);
      // Fallback handling if the result isn't properly formatted JSON
      enhancedResult = {
        enhancedTitle: title,
        enhancedDescription: description,
        suggestedKeywords: ["audio plugin", "music production", "VST"]
      };
    }

    return NextResponse.json(enhancedResult);
  } catch (error) {
    console.error("[ENHANCE_PLUGIN_DETAILS]", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Error";
    return new NextResponse(errorMessage, { 
      status: error instanceof Error && error.message.includes("Unauthorized") ? 401 : 500 
    });
  }
} 