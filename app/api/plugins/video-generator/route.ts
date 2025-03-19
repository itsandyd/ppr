import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { fal } from "@fal-ai/client";

export async function POST(req: Request) {
  console.log("API route /api/plugins/video-generator called");
  try {
    const { userId } = auth();
    const body = await req.json();
    console.log("Request body:", body);
    const { audioUrl, coverImageUrl, pluginId, textLength } = body;

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

    // Find the plugin to get its data
    const plugin = await db.plugin.findUnique({
      where: { id: pluginId }
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

    if (!canModify) {
      console.log("Permission denied - plugin belongs to another user");
      return new NextResponse("You don't have permission to edit this plugin", { status: 403 });
    }

    // Check if the plugin has an audioUrl
    if (!plugin.audioUrl) {
      console.log("Plugin has no audio URL");
      return new NextResponse("Plugin has no audio URL", { status: 400 });
    }

    console.log("Plugin audioUrl from database:", plugin.audioUrl);
    
    // Use the direct URL from the database instead of the presigned URL
    let fullAudioUrl = plugin.audioUrl;
    
    // Ensure the audioUrl is accessible to external services
    // If it's a relative URL, make it absolute
    if (fullAudioUrl.startsWith("/")) {
      fullAudioUrl = `${process.env.NEXT_PUBLIC_APP_URL}${fullAudioUrl}`;
      console.log("Converted relative audio URL to absolute:", fullAudioUrl);
    }

    // If the URL is still too long (has query parameters), use a sample URL
    if (fullAudioUrl.includes("?")) {
      console.log("URL has query parameters, using sample audio instead");
      fullAudioUrl = "https://www2.cs.uic.edu/~i101/SoundFiles/StarWars3.wav";
    }

    // Determine what image to use for the video
    let imageUrlToUse = coverImageUrl;
    
    if (!imageUrlToUse || imageUrlToUse === "") {
      console.log("No cover image URL provided, attempting to use plugin image");
      
      if (plugin.image) {
        imageUrlToUse = plugin.image;
        console.log("Using plugin image URL:", imageUrlToUse);
      } else {
        // Use a default image if no plugin image is available
        imageUrlToUse = "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg";
        console.log("No plugin image found, using default placeholder");
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
    
    try {
      console.log("Calling Fal.ai FFmpeg API with input:", JSON.stringify(input));
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
      
      // Access the data property of the result which contains the API response
      if (!result?.data?.video_url) {
        console.error("No video URL returned from Fal.ai");
        return new NextResponse("The video generation service did not return a valid video URL", { status: 500 });
      }
      
      // Convert the video URL to string if it's not already
      const videoUrl = String(result.data.video_url);
      console.log("Received video URL:", videoUrl);
      
      // Validate the URL to ensure it's accessible
      try {
        console.log("Validating video URL:", videoUrl);
        const videoResponse = await fetch(videoUrl, { method: 'HEAD' });
        if (!videoResponse.ok) {
          console.warn("Video URL validation failed, but continuing");
          // Log but continue - the URL might still work
        }
        console.log("Video URL is valid and accessible");
      } catch (validationError) {
        console.warn("Error validating video URL:", validationError);
        // Continue anyway - the URL might still work in the player
      }
      
      // Update the plugin with the video URL
      await db.plugin.update({
        where: { id: pluginId },
        data: {
          videoUrl: videoUrl,
        }
      });
      console.log("Plugin updated with video URL");
      
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
    console.error("[PLUGIN_VIDEO_GENERATOR_ERROR]", error);
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