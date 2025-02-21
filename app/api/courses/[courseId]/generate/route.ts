import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";

// Disable LangSmith tracing to avoid unauthorized errors
process.env.LANGCHAIN_TRACING_V2 = "false";
process.env.LANGCHAIN_ENDPOINT = "";
process.env.LANGCHAIN_API_KEY = "";

// Define the schema for course content
const ChapterSchema = z.object({
  title: z.string().describe("The title of the chapter"),
  description: z.string().describe("Detailed description of what the chapter covers"),
});

const CourseContentSchema = z.object({
  title: z.string().describe("An engaging and SEO-friendly course title"),
  description: z.string().describe("A comprehensive course description highlighting value proposition and learning outcomes"),
  chapters: z.array(ChapterSchema).min(5).max(10).describe("A list of 5-10 well-structured chapters"),
});

// Convert Zod schema to JSON schema for OpenAI function calling
const courseContentJsonSchema = zodToJsonSchema(CourseContentSchema);

function truncateText(text: string, maxLength: number = 200): string {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength - 3) + '...' : text;
}

function sanitizeSearchQuery(title: string, description: string | null): string {
  // Extract main keywords from title
  const titleKeywords = title.split(' ').slice(0, 5).join(' ');
  
  // Extract first sentence or part of description if available
  let descriptionExcerpt = '';
  if (description) {
    const firstSentence = description.split('.')[0];
    descriptionExcerpt = truncateText(firstSentence, 100);
  }

  // Combine and format search query
  const query = `${titleKeywords} ${descriptionExcerpt} course curriculum`;
  return truncateText(query.trim());
}

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
        modelName: "gpt-4-turbo-preview",
        temperature: 0.7,
      })
    };
  } catch (error) {
    console.error("[INITIALIZATION_ERROR]", error);
    throw error;
  }
};

const { searchTool, chatModel } = initializeTools();

const researchPrompt = PromptTemplate.fromTemplate(`
You are an expert course creator and researcher. Based on the following course topic and search results, 
provide comprehensive research insights that will help in creating an engaging course.

Course Title: {title}
Course Description: {description}

Search Results:
{searchResults}

Provide a detailed analysis of:
1. Key topics and themes
2. Important concepts to cover
3. Latest developments or trends
4. Potential practical applications
5. Common misconceptions or challenges

Keep the analysis focused and relevant to course creation.
`);

const courseGenerationModel = new ChatOpenAI({
  modelName: "gpt-4-turbo-preview",
  temperature: 0.7,
}).bind({
  functions: [{
    name: "generate_course_content",
    description: "Generate structured course content based on research insights",
    parameters: courseContentJsonSchema,
  }],
  function_call: { name: "generate_course_content" }
});

const courseGenerationPrompt = PromptTemplate.fromTemplate(`
You are an expert course creator. Using the research insights provided, generate a comprehensive course structure.
The content should be engaging, practical, and well-structured.

Research Insights:
{research}

Original Course Details:
Title: {title}
Description: {description}

Generate an improved course outline that is practical, actionable, and follows a logical progression.
The course should be comprehensive yet focused, with clear learning objectives and outcomes.
`);

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { courseTitle, courseDescription } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Create the research chain
    const researchChain = RunnableSequence.from([
      async ({ title, description }) => {
        try {
          const query = sanitizeSearchQuery(title, description);
          console.log("[TAVILY_SEARCH_QUERY]", query);
          
          const searchResults = await searchTool.call(query);
          
          if (!searchResults || typeof searchResults !== 'string') {
            console.log("[TAVILY_SEARCH_RESULTS_EMPTY]", "No results returned");
            return {
              title,
              description,
              searchResults: "No relevant search results found. Proceeding with course generation based on provided content.",
            };
          }

          console.log("[TAVILY_SEARCH_RESULTS_LENGTH]", searchResults.length);
          return {
            title,
            description,
            searchResults,
          };
        } catch (error) {
          console.error("[TAVILY_SEARCH_ERROR]", error);
          // Provide more context in the fallback message
          return {
            title,
            description,
            searchResults: `Unable to perform external research. Generating course content based on the provided title "${title}" and description. The course will focus on core concepts and best practices in this field.`,
          };
        }
      },
      researchPrompt,
      chatModel,
      new StringOutputParser(),
    ]);

    // Create the course generation chain with function calling
    const courseGenerationChain = RunnableSequence.from([
      courseGenerationPrompt,
      courseGenerationModel,
      new JsonOutputFunctionsParser(),
    ]);

    // Execute the chains
    const research = await researchChain.invoke({
      title: courseTitle,
      description: courseDescription || "No description provided",
    });

    const generatedContent = await courseGenerationChain.invoke({
      research,
      title: courseTitle,
      description: courseDescription || "No description provided",
    });

    // Validate the generated content against our schema
    const validatedContent = CourseContentSchema.parse(generatedContent);

    return NextResponse.json(validatedContent);
  } catch (error) {
    console.error("[COURSE_GENERATE]", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Error";
    return new NextResponse(errorMessage, { 
      status: error instanceof Error && error.message.includes("Unauthorized") ? 401 : 500 
    });
  }
}