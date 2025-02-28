import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import { db } from "@/lib/db"

// Simple request throttling with a Map to store recent requests
const recentRequests = new Map<string, number>();
const THROTTLE_WINDOW_MS = 2000; // 2 seconds window

// Helper function to generate a slug from a title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')  // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')       // Replace multiple hyphens with a single one
    .trim();
}

// This is a mock implementation
// In a real app, you'd save to a database
export async function POST(request: Request) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Check if this user has recently made a request
    const lastRequestTime = recentRequests.get(userId);
    const now = Date.now();
    
    if (lastRequestTime && (now - lastRequestTime) < THROTTLE_WINDOW_MS) {
      console.log(`Throttled request from user ${userId} - too many requests`);
      return NextResponse.json(
        { error: "Please wait before creating another resource" },
        { status: 429 }  // Too Many Requests
      );
    }
    
    // Set the last request time
    recentRequests.set(userId, now);
    
    // Clean up old entries periodically (optional)
    if (recentRequests.size > 100) {
      const cutoff = now - THROTTLE_WINDOW_MS;
      Array.from(recentRequests.entries()).forEach(([key, timestamp]) => {
        if (timestamp < cutoff) {
          recentRequests.delete(key);
        }
      });
    }
    
    const body = await request.json()
    const { 
      title, 
      description, 
      fileUrl, 
      fileName, 
      followGateRequirements, 
      requiresLeadGen,
      imageUrl
    } = body
    
    // Log the received data for debugging
    console.log("Received resource data:", body)
    
    // Basic validation
    if (!title || !description || !fileUrl) {
      return NextResponse.json(
        { error: "Title, description, and file are required" },
        { status: 400 }
      )
    }
    
    // Generate a slug from the title
    const baseSlug = generateSlug(title);
    
    // Check if the slug already exists
    const existingResource = await db.resource.findFirst({
      where: { slug: baseSlug }
    });
    
    // If the slug exists, append a random string to make it unique
    const slug = existingResource 
      ? `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`
      : baseSlug;
    
    // Create resource in database
    const resource = await db.resource.create({
      data: {
        title,
        slug,
        description,
        fileUrl,
        fileName,
        followGateRequirements: followGateRequirements || [],
        requiresLeadGen: !!requiresLeadGen,
        imageUrl,
        userId,
        type: fileName.endsWith('.zip') ? 'ZIP Archive' : 'Resource',
      }
    })
    
    // Log the resource for debugging
    console.log("Resource created:", resource)
    
    return NextResponse.json({ 
      success: true,
      message: "Resource created successfully",
      resource
    })
    
  } catch (error) {
    console.error("Error creating resource:", error)
    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500 }
    )
  }
}

// Get all resources
export async function GET() {
  try {
    // Fetch resources from database with download count
    const resources = await db.resource.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json({ 
      success: true,
      resources
    })
  } catch (error) {
    console.error("Error fetching resources:", error)
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    )
  }
} 