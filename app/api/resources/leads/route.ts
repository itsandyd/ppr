// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Get all resources created by the current user 
    // that have lead generation enabled, and include the leads
    const resources = await db.resource.findMany({
      where: {
        userId,
        requiresLeadGen: true
      },
      include: {
        leads: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json({
      success: true,
      resources
    })
    
  } catch (error) {
    console.error("Error fetching resource leads:", error)
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    )
  }
} 