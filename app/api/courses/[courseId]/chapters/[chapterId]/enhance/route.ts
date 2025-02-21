import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { db } from "@/lib/db";

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

function sanitizeSearchQuery(courseTitle: string, chapterTitle: string, description: string | null): string {
  const combinedQuery = `${courseTitle} ${chapterTitle} detailed lecture content tutorial`.trim();
  return combinedQuery.slice(0, 200);
}

const researchPrompt = PromptTemplate.fromTemplate(`
You are an expert course creator and educator. Based on the following context, create comprehensive course content
that could serve as a detailed video script or text-based lecture.

Course Context:
Course Title: {courseTitle}
Course Description: {courseDescription}
Chapter Title: {chapterTitle}
Current Content: {currentDescription}

Search Results:
{searchResults}

Create detailed course content that:
1. Serves as a complete lecture script/content
2. Includes:
   - A brief introduction to the topic
   - Detailed explanations of key concepts
   - Practical examples and code snippets where relevant
   - Step-by-step tutorials or demonstrations
   - Common pitfalls and best practices
   - Interactive elements or exercises
3. Uses proper markdown formatting for:
   - Headers (##, ###)
   - Code blocks (\`\`\`)
   - Lists and bullet points
   - Important highlights
4. Maintains a conversational yet educational tone
5. Includes clear section breaks and logical progression

The content should be comprehensive enough to serve as either:
- A complete video script for recording
- A detailed text-based lesson
- A reference material for students

Focus on practical, hands-on learning while maintaining academic rigor.
`);

export async function POST(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the current chapter and course details
    const chapter = await db.courseChapter.findUnique({
      where: {
        id: params.chapterId,
      }
    });

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
      }
    });

    if (!chapter || !course) {
      return new NextResponse("Chapter or Course not found", { status: 404 });
    }

    // Create the research chain
    const researchChain = RunnableSequence.from([
      async ({ courseTitle, courseDescription, chapterTitle, currentDescription }) => {
        try {
          const query = sanitizeSearchQuery(courseTitle, chapterTitle, currentDescription);
          console.log("[TAVILY_SEARCH_QUERY]", query);
          
          const searchResults = await searchTool.call(query);
          
          if (!searchResults || typeof searchResults !== 'string') {
            console.log("[TAVILY_SEARCH_RESULTS_EMPTY]", "No results returned");
            return {
              courseTitle,
              courseDescription,
              chapterTitle,
              currentDescription,
              searchResults: "No relevant search results found. Generating content based on course context and best practices.",
            };
          }

          return {
            courseTitle,
            courseDescription,
            chapterTitle,
            currentDescription,
            searchResults,
          };
        } catch (error) {
          console.error("[TAVILY_SEARCH_ERROR]", error);
          return {
            courseTitle,
            courseDescription,
            chapterTitle,
            currentDescription,
            searchResults: `Unable to perform external research. Generating comprehensive content based on course context and educational best practices.`,
          };
        }
      },
      researchPrompt,
      chatModel,
      new StringOutputParser(),
    ]);

    // Execute the chain
    const enhancedDescription = await researchChain.invoke({
      courseTitle: course.title,
      courseDescription: course.description || "No description provided",
      chapterTitle: chapter.title,
      currentDescription: chapter.description || "No content provided",
    });

    return NextResponse.json({ enhancedDescription });
  } catch (error) {
    console.error("[CHAPTER_ENHANCE]", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Error";
    return new NextResponse(errorMessage, { 
      status: error instanceof Error && error.message.includes("Unauthorized") ? 401 : 500 
    });
  }
} 