import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import { db } from "@/lib/db"

// Resource type definition
type Resource = {
  id: string
  slug: string
  title: string
  description: string
  fileName: string
  fileUrl: string
  requiresLeadGen: boolean
  followGateRequirements?: any[]
  userId: string
  downloads: number
  createdAt: string
}

// Get a resource by slug
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug
    
    // Find the resource by slug in the database
    const resource = await db.resource.findUnique({
      where: { slug },
      include: {
        leads: {
          select: {
            id: true,
            createdAt: true,
          }
        }
      }
    })
    
    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      resource
    })
    
  } catch (error) {
    console.error("Error fetching resource:", error)
    return NextResponse.json(
      { error: "Failed to fetch resource" },
      { status: 500 }
    )
  }
}

// Record a download
export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug
    
    // Find and update the resource by slug in the database
    const resource = await db.resource.update({
      where: { slug },
      data: {
        downloads: {
          increment: 1
        }
      }
    })
    
    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      resource
    })
    
  } catch (error) {
    console.error("Error recording download:", error)
    return NextResponse.json(
      { error: "Failed to record download" },
      { status: 500 }
    )
  }
} 