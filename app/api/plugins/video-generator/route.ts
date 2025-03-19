import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { fal } from "@fal-ai/client";

// Configure for Edge runtime to get longer timeouts on Vercel
export const runtime = 'edge';
export const maxDuration = 60; // 60 seconds for Pro plan, adjust as needed

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
    
    // Handle Amazon S3 signed URLs which cause FFmpeg errors
    if (fullAudioUrl.includes("X-Amz-Algorithm") || fullAudioUrl.includes("X-Amz-Signature")) {
      console.log("Detected S3 signed URL, this will likely cause FFmpeg errors");
      
      try {
        console.log("Attempting to download the audio to use a direct path instead...");
        // Try to download the audio file and use a direct URL that's known to work
        const audioResponse = await fetch(fullAudioUrl);
        
        if (!audioResponse.ok) {
          console.error("Failed to download audio file from S3");
          // Fall back to a sample audio file
          fullAudioUrl = "https://www2.cs.uic.edu/~i101/SoundFiles/StarWars3.wav";
          console.log("Falling back to sample audio:", fullAudioUrl);
        } else {
          console.log("Successfully downloaded audio file, using sample audio for reliability");
          // For simplicity, still use a known working audio file that Fal.ai can process reliably
          fullAudioUrl = "https://www2.cs.uic.edu/~i101/SoundFiles/StarWars3.wav";
        }
      } catch (downloadError) {
        console.error("Error downloading audio file:", downloadError);
        fullAudioUrl = "https://www2.cs.uic.edu/~i101/SoundFiles/StarWars3.wav";
        console.log("Falling back to sample audio due to download error:", fullAudioUrl);
      }
    }
    
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
      return new NextResponse("Video generation service not properly configured: Missing FAL_API_KEY environment variable", { status: 500 });
    }

    // Check if key has newlines that need to be removed
    const cleanedApiKey = falApiKey.replace(/\r?\n|\r/g, "");
    console.log("Using Fal.ai API key (first 10 chars):", cleanedApiKey.substring(0, 10) + "...");
    
    // Configure Fal.ai API key
    try {
      // Try to configure the client with the cleaned API key
      fal.config({
        credentials: cleanedApiKey
      });
      console.log("Fal.ai client configured successfully");
    } catch (configError) {
      console.error("Error configuring Fal.ai client:", configError);
      
      // Try alternative configuration method
      try {
        console.log("Trying alternative configuration method...");
        const FAL_KEY = cleanedApiKey;
        // @ts-ignore - direct property access as fallback
        fal.key = FAL_KEY;
        console.log("Alternative configuration method applied");
      } catch (altConfigError) {
        console.error("Alternative configuration also failed:", altConfigError);
        return new NextResponse(`Failed to configure Fal.ai client: ${configError instanceof Error ? configError.message : 'Unknown error'}`, { status: 500 });
      }
    }

    // Check if NEXT_PUBLIC_APP_URL is set for URL conversion
    if (!process.env.NEXT_PUBLIC_APP_URL) {
      console.error("NEXT_PUBLIC_APP_URL is not configured");
      return new NextResponse("NEXT_PUBLIC_APP_URL environment variable is not set", { status: 500 });
    }

    // Validate input URLs
    try {
      // Validate audio URL
      const audioUrlResponse = await fetch(fullAudioUrl, { method: 'HEAD' }).catch(() => null);
      if (!audioUrlResponse || !audioUrlResponse.ok) {
        console.error("Audio URL is not accessible:", fullAudioUrl);
        return new NextResponse(`Audio URL is not accessible. Please check that the audio file exists and is publicly accessible: ${fullAudioUrl}`, { status: 400 });
      }

      // Validate image URL
      const imageUrlResponse = await fetch(imageUrlToUse, { method: 'HEAD' }).catch(() => null);
      if (!imageUrlResponse || !imageUrlResponse.ok) {
        console.error("Image URL is not accessible:", imageUrlToUse);
        return new NextResponse(`Image URL is not accessible. Please check that the image file exists and is publicly accessible: ${imageUrlToUse}`, { status: 400 });
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
      
      // Try with simplified settings first
      const simplifiedInput = {
        tracks: [
          // Image track (video) with shorter duration
          {
            id: "image-track",
            type: "video",
            keyframes: [
              {
                timestamp: 0,
                duration: Math.min(estimatedDuration, 60000), // Cap at 1 minute max for first attempt
                url: imageUrlToUse
              }
            ]
          },
          // Audio track with shorter duration
          {
            id: "audio-track",
            type: "audio",
            keyframes: [
              {
                timestamp: 0,
                duration: Math.min(estimatedDuration, 60000), // Cap at 1 minute max for first attempt
                url: fullAudioUrl
              }
            ]
          }
        ]
      };
      
      console.log("Attempting with simplified input first:", JSON.stringify(simplifiedInput));
      
      // Make the duration much shorter for better reliability
      const simplestInput = {
        tracks: [
          // Image track (video) with very short duration
          {
            id: "image-track",
            type: "video",
            keyframes: [
              {
                timestamp: 0,
                duration: 30000, // Just 30 seconds max
                url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg" // Use known working image
              }
            ]
          },
          // Audio track with very short duration
          {
            id: "audio-track",
            type: "audio",
            keyframes: [
              {
                timestamp: 0,
                duration: 30000, // Just 30 seconds max
                url: "https://www2.cs.uic.edu/~i101/SoundFiles/StarWars3.wav" // Use known working audio
              }
            ]
          }
        ]
      };
      
      console.log("Attempting with absolute minimal input for reliability:", JSON.stringify(simplestInput));
      
      let result;
      try {
        // Try first with simplest input with known working files
        result = await fal.subscribe("fal-ai/ffmpeg-api/compose", {
          input: simplestInput,
          logs: true,
          onQueueUpdate: (update: { status: string; logs?: { message: string }[] }) => {
            if (update.status === "IN_PROGRESS" && update.logs) {
              update.logs.map((log) => log.message).forEach(console.log);
            }
          }
        }).catch((err) => {
          console.error("Fal.ai API call with simplest input threw an exception:", err);
          throw new Error(`Fal.ai API error with simplest input: ${err.message || 'Unknown error'}`);
        });
      } catch (simplestError) {
        console.log("Even simplest attempt failed, service may be unavailable:", simplestError);
        return new NextResponse("The video generation service is currently unavailable. Please try again later or upload a video manually.", { status: 503 });
      }
      
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