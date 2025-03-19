import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { fal } from "@fal-ai/client";

// Configure for longer timeouts on Vercel
export const maxDuration = 300; // 300 seconds (5 minutes) maximum timeout

export async function POST(req: Request) {
  console.log("API route /api/video-generator called");
  try {
    const { userId } = auth();
    const body = await req.json();
    console.log("Request body:", body);
    const { audioUrl, coverImageUrl, chapterId: recordId, textLength } = body;

    if (!userId) {
      console.log("Unauthorized - no userId");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!audioUrl) {
      console.log("Missing audioUrl in request");
      return new NextResponse("Audio URL is required", { status: 400 });
    }

    if (!recordId) {
      console.log("Missing recordId in request");
      return new NextResponse("ID is required", { status: 400 });
    }

    console.log("Authenticated userId:", userId);
    
    // Determine if we're working with a plugin or a chapter based on the record ID
    const isPlugin = await db.plugin.findUnique({ 
      where: { id: recordId },
      select: { id: true, userId: true, image: true }
    });
    
    const isChapter = isPlugin ? false : await db.courseChapter.findUnique({
      where: { id: recordId },
      select: { id: true, course: { select: { userId: true, imageUrl: true } } }
    });
    
    if (!isPlugin && !isChapter) {
      console.log("Neither plugin nor chapter found with id:", recordId);
      return new NextResponse("No valid record found", { status: 404 });
    }
    
    // Check authorization for the record
    let canModify = false;
    let imageForVideo = "";
    
    if (isPlugin) {
      console.log("Record is a plugin");
      // Check if user is admin
      const adminCheck = await db.user.findUnique({
        where: { id: userId },
        select: { admin: true }
      });
      
      const isAdmin = adminCheck?.admin || false;
      
      // Allow if: 1) user is admin, 2) plugin has no owner, or 3) plugin belongs to user
      canModify = isAdmin || !isPlugin.userId || isPlugin.userId === userId;
      imageForVideo = isPlugin.image || "";
    } else if (isChapter) {
      console.log("Record is a course chapter");
      // Check if user created the course
      canModify = isChapter.course.userId === userId;
      imageForVideo = isChapter.course.imageUrl || "";
    }
    
    if (!canModify) {
      console.log("Permission denied - record belongs to another user");
      return new NextResponse("You don't have permission to edit this record", { status: 403 });
    }

    // Ensure the audioUrl is accessible to external services
    // If it's a relative URL, make it absolute
    let fullAudioUrl = audioUrl;
    if (audioUrl.startsWith("/")) {
      fullAudioUrl = `${process.env.NEXT_PUBLIC_APP_URL}${audioUrl}`;
      console.log("Converted relative audio URL to absolute:", fullAudioUrl);
    }
    
    // Handle Amazon S3 signed URLs - but don't replace with fallback
    if (fullAudioUrl.includes("X-Amz-Algorithm") || fullAudioUrl.includes("X-Amz-Signature")) {
      console.log("Detected S3 signed URL, attempting to use it directly");
    }

    // Determine what image to use for the video
    let imageUrlToUse = coverImageUrl;
    
    if (!imageUrlToUse || imageUrlToUse === "") {
      console.log("No cover image URL provided, attempting to use record image");
      
      if (imageForVideo) {
        imageUrlToUse = imageForVideo;
        console.log("Using record image URL:", imageUrlToUse);
      } else {
        console.error("No image found and no cover image provided");
        return new NextResponse("No image available for video. Please provide a cover image.", { status: 400 });
      }
    }

    // Ensure the imageUrl is accessible to external services
    // If it's a relative URL, make it absolute
    if (imageUrlToUse.startsWith("/")) {
      imageUrlToUse = `${process.env.NEXT_PUBLIC_APP_URL}${imageUrlToUse}`;
      console.log("Converted relative image URL to absolute:", imageUrlToUse);
    }

    console.log("Cover Image URL:", imageUrlToUse);
    
    // Estimate video duration based on text length (roughly ~125 words per minute)
    const estimatedWords = textLength ? Math.ceil(textLength / 5) : 200; // default to 200 words if no length
    const estimatedMinutes = Math.max(1, Math.ceil(estimatedWords / 125)); // minimum 1 minute
    const estimatedDuration = estimatedMinutes * 60 * 1000; // convert to milliseconds
    
    console.log(`Estimated duration: ${estimatedMinutes} minutes (${estimatedDuration}ms)`);
    
    // Use Fal.ai FFmpeg API to generate a video from the image and audio
    const falApiKey = process.env.FAL_API_KEY;
    
    if (!falApiKey) {
      console.error("FAL_API_KEY is not configured");
      return new NextResponse("Video generation service not properly configured: Missing FAL_API_KEY environment variable", { status: 500 });
    }

    // Check if key has newlines that need to be removed
    const cleanedApiKey = falApiKey.replace(/\r?\n|\r/g, "");
    console.log("Using Fal.ai API key (first 10 chars):", cleanedApiKey.substring(0, 10) + "...");
    
    // Configure Fal.ai API key
    try {
      fal.config({
        credentials: cleanedApiKey
      });
      console.log("Fal.ai client configured successfully");
    } catch (configError) {
      console.error("Error configuring Fal.ai client:", configError);
      return new NextResponse(`Failed to configure Fal.ai client: ${configError instanceof Error ? configError.message : 'Unknown error'}`, { status: 500 });
    }

    // Validate input URLs
    try {
      // Validate audio URL
      const audioUrlResponse = await fetch(fullAudioUrl, { method: 'HEAD' }).catch(() => null);
      if (!audioUrlResponse || !audioUrlResponse.ok) {
        console.error("Audio URL is not accessible:", fullAudioUrl);
        return new NextResponse(`Audio URL is not accessible. Please check that the audio file exists and is publicly accessible.`, { status: 400 });
      }

      // Validate image URL
      const imageUrlResponse = await fetch(imageUrlToUse, { method: 'HEAD' }).catch(() => null);
      if (!imageUrlResponse || !imageUrlResponse.ok) {
        console.error("Image URL is not accessible:", imageUrlToUse);
        return new NextResponse(`Image URL is not accessible. Please check that the image file exists and is publicly accessible.`, { status: 400 });
      }
    } catch (urlValidationError) {
      console.error("Error validating URLs:", urlValidationError);
      // Continue anyway - the URLs might still work with Fal.ai
    }

    // Prepare the input for Fal.ai FFmpeg API
    const input = {
      tracks: [
        // Image track (video)
        {
          id: "image-track",
          type: "video",
          keyframes: [
            {
              timestamp: 0,
              duration: estimatedDuration,
              url: imageUrlToUse
            }
          ]
        },
        // Audio track
        {
          id: "audio-track",
          type: "audio",
          keyframes: [
            {
              timestamp: 0,
              duration: estimatedDuration,
              url: fullAudioUrl
            }
          ]
        }
      ]
    };
    
    try {
      console.log("Calling Fal.ai FFmpeg API with input:", JSON.stringify(input));
      
      // Use actual input with no fallbacks
      let result = await fal.subscribe("fal-ai/ffmpeg-api/compose", {
        input,
        logs: true,
        onQueueUpdate: (update: { status: string; logs?: { message: string }[] }) => {
          if (update.status === "IN_PROGRESS" && update.logs) {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        }
      }).catch((err) => {
        console.error("Fal.ai API call threw an exception:", err);
        throw new Error(`Fal.ai API error: ${err.message || 'Unknown error'}`);
      });
      
      if (!result) {
        console.error("Fal.ai result is undefined");
        throw new Error("Fal.ai returned undefined result");
      }
      
      console.log("Fal.ai API call completed with result:", JSON.stringify(result));
      
      // Access the data property of the result which contains the API response
      if (!result?.data?.video_url) {
        console.error("No video URL returned from Fal.ai");
        return new NextResponse("The video generation service did not return a valid video URL", { status: 500 });
      }
      
      // Convert the video URL to string if it's not already
      const videoUrl = String(result.data.video_url);
      console.log("Received video URL:", videoUrl);
      
      // Update the appropriate record with the video URL
      if (isPlugin) {
        // Update the plugin with the video URL
        await db.plugin.update({
          where: { id: recordId },
          data: {
            videoUrl: videoUrl,
          }
        });
        console.log("Plugin updated with video URL");
      } else {
        // Get the existing chapter data to check if it has Mux data
        const existingChapter = await db.courseChapter.findUnique({
          where: { id: recordId },
          include: { muxData: true }
        });
        
        // Save the video URL to the chapter
        await db.courseChapter.update({
          where: { id: recordId },
          data: {
            videoUrl: videoUrl,
            // If we're not using Mux anymore, delete any existing Mux data
            muxData: existingChapter?.muxData ? { delete: true } : undefined
          }
        });
        console.log("Course chapter updated with video URL");
      }
      
      // Return the generated video URL
      return NextResponse.json({ 
        videoUrl: videoUrl,
        thumbnailUrl: result.data.thumbnail_url ? String(result.data.thumbnail_url) : null,
        message: "Video generated successfully"
      });
    } catch (falError) {
      console.error("Fal.ai API call error:", falError);
      return new NextResponse(`Failed to connect to the video generation service: ${falError instanceof Error ? falError.message : 'Unknown error'}`, { status: 500 });
    }

  } catch (error) {
    console.error("[VIDEO_GENERATOR_ERROR]", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new NextResponse(errorMessage, { status: 500 });
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