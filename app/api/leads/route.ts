import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { resourceId, name, email } = body
    
    // Validate required fields
    if (!resourceId || !name || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      )
    }
    
    // Check if resource exists and requires lead gen
    const resource = await db.resource.findUnique({
      where: { id: resourceId }
    })
    
    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      )
    }
    
    if (!resource.requiresLeadGen) {
      return NextResponse.json(
        { error: "This resource does not require lead generation" },
        { status: 400 }
      )
    }
    
    // Check if this email has already been captured for this resource
    const existingLead = await db.resourceLead.findFirst({
      where: {
        resourceId,
        email
      }
    })
    
    if (existingLead) {
      return NextResponse.json({
        success: true,
        message: "You already have access to this resource",
        alreadyExists: true
      })
    }
    
    // Create the new lead
    const lead = await db.resourceLead.create({
      data: {
        name,
        email,
        resourceId
      }
    })
    
    return NextResponse.json({
      success: true,
      message: "Lead captured successfully",
      lead
    })
    
  } catch (error) {
    console.error("Error capturing lead:", error)
    return NextResponse.json(
      { error: "Failed to process lead capture" },
      { status: 500 }
    )
  }
} 