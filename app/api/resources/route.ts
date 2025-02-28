import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import { db } from "@/lib/db"

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