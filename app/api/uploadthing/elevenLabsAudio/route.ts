import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { db } from "@/lib/db";

// Set runtime to nodejs to avoid edge runtime limitations
export const runtime = "nodejs"; 

// Create uploadthing instance
const f = createUploadthing();

// Auth middleware
const handleAuth = () => {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");
  return { userId };
};

// Define router specifically for ElevenLabs audio
const audioRouter = {
  elevenLabsAudio: f({ audio: { maxFileSize: "32MB", maxFileCount: 1 } })
    .middleware(() => {
      // Get auth data
      const authData = handleAuth();
      return authData;
    })
    .onUploadComplete(({ metadata, file }) => {
      console.log("ElevenLabs audio upload complete!");
      console.log("File URL:", file.url);
      console.log("File name:", file.name);
      console.log("File size:", file.size);
      console.log("User ID:", metadata.userId);
      
      return { url: file.url };
    }),
} satisfies FileRouter;

// Handle POST requests
export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Check if this is a multipart form request
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 });
    }
    
    // Get form data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    
    // Create new filename with timestamps
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const newFilename = `elevenlabs-audio-${timestamp}.${fileExtension}`;
    
    // Create new File object with renamed file
    const renamedFile = new File([file], newFilename, { type: file.type });
    
    // Create new FormData with renamed file
    const newFormData = new FormData();
    newFormData.append("file", renamedFile);
    
    // Forward to the uploadthing endpoint
    const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/uploadthing`, {
      method: "POST",
      headers: {
        // We can't forward the content-type header as the browser
        // will set the correct boundary for the multipart form
      },
      body: newFormData,
    });
    
    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      console.error("Upload error:", errorData);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
    
    const responseData = await uploadResponse.json();
    
    // Return the uploaded file URL
    return NextResponse.json({ 
      url: responseData.data?.[0]?.url || null,
      success: !!responseData.data?.[0]?.url,
    });
  } catch (error) {
    console.error("[ELEVENLABS_UPLOAD_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 