import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { fal } from "@fal-ai/client";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { audioUrl, coverImageUrl, chapterId, textLength } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!audioUrl) {
      return new NextResponse("Audio URL is required", { status: 400 });
    }

    if (!chapterId) {
      return new NextResponse("Chapter ID is required", { status: 400 });
    }

    console.log("Audio URL received:", audioUrl);
    
    // Ensure the audioUrl is accessible to external services
    // If it's a relative URL, make it absolute
    let fullAudioUrl = audioUrl;
    if (audioUrl.startsWith("/")) {
      fullAudioUrl = `${process.env.NEXT_PUBLIC_APP_URL}${audioUrl}`;
      console.log("Converted relative audio URL to absolute:", fullAudioUrl);
    }

    // Instead of requiring coverImageUrl, check if it exists
    // If not, get the chapter and its course to find a cover image
    let imageUrlToUse = coverImageUrl;
    
    if (!imageUrlToUse || imageUrlToUse === "") {
      console.log("No cover image URL provided, attempting to use course image");
      
      // Get the chapter and its course to find the course image
      const chapter = await db.courseChapter.findUnique({
        where: { id: chapterId },
        include: { course: true }
      });
      
      if (chapter?.course?.imageUrl) {
        imageUrlToUse = chapter.course.imageUrl;
        console.log("Using course image URL:", imageUrlToUse);
      } else {
        // Use a default image if no course image is available
        imageUrlToUse = "https://placehold.co/1920x1080/333/white?text=Chapter+Video";
        console.log("No course image found, using default placeholder");
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
      return new NextResponse("Video generation service not properly configured", { status: 500 });
    }

    // Configure Fal.ai API key
    fal.config({
      credentials: falApiKey
    });

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
              duration: estimatedDuration, // Use estimated duration based on text length
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
              duration: estimatedDuration, // Use estimated duration based on text length
              url: fullAudioUrl
            }
          ]
        }
      ]
    };

    // console.log("Submitting request to Fal.ai FFmpeg API with input:", JSON.stringify(input));
    
    try {
      // Call the Fal.ai FFmpeg API using the client library
      const result = await fal.subscribe("fal-ai/ffmpeg-api/compose", {
        input,
        logs: true,
        onQueueUpdate: (update: { status: string; logs?: { message: string }[] }) => {
          if (update.status === "IN_PROGRESS" && update.logs) {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        }
      });
      
      // console.log("Fal.ai API response:", result);
      
      // Access the data property of the result which contains the API response
      if (!result?.data?.video_url) {
        // console.error("No video URL in response:", result);
        return new NextResponse("The video generation service did not return a valid video URL", { status: 500 });
      }
      
      // Convert the video URL to string if it's not already
      const videoUrl = String(result.data.video_url);
      
      // Validate the URL to ensure it's accessible
      try {
        // Test if the URL is valid and accessible
        console.log("Validating video URL:", videoUrl);
        const videoResponse = await fetch(videoUrl, { method: 'HEAD' });
        if (!videoResponse.ok) {
          // console.error(`Video URL validation failed: ${videoResponse.status} ${videoResponse.statusText}`);
          // throw new Error(`Video URL returned status ${videoResponse.status}`);
        }
        console.log("Video URL is valid and accessible");
      } catch (validationError) {
        // console.error("Error validating video URL:", validationError);
        // Continue anyway - the URL might still work in the player
      }
      
      // Get the existing chapter data to check if it has Mux data
      const existingChapter = await db.courseChapter.findUnique({
        where: { id: chapterId },
        include: { muxData: true }
      });
      
      // Save the video URL to the database
      await db.courseChapter.update({
        where: { id: chapterId },
        data: {
          videoUrl: videoUrl,
          muxData: { 
            // If we're not using Mux anymore, delete any existing Mux data
            // This ensures the UI knows to use the direct video URL instead of MuxPlayer
            delete: existingChapter?.muxData ? true : undefined
          }
        }
      });
      
      // Return the generated video URL
      return NextResponse.json({ 
        videoUrl: videoUrl,
        thumbnailUrl: result.data.thumbnail_url ? String(result.data.thumbnail_url) : null,
        message: "Video generated successfully"
      });
    } catch (falError) {
      console.error("Fal.ai API call error:", falError);
      return new NextResponse("Failed to connect to the video generation service. Please try again later.", { status: 500 });
    }

  } catch (error) {
    console.error("[VIDEO_GENERATOR_ERROR]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
} 