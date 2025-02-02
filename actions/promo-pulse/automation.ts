'use server'

import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'

interface AutomationNode {
  id: string
  type: string
  position: {
    x: number
    y: number
  }
  data: {
    label: string
    templateId?: string
    duration?: number
    unit?: string
    tag?: string
  }
}

interface SaveAutomationData {
  name: string
  nodes: AutomationNode[]
  edges: {
    source: string
    target: string
  }[]
}

export async function saveAutomation(data: SaveAutomationData) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      console.error('[SAVE_AUTOMATION] No userId found')
      return { success: false, error: 'Unauthorized' }
    }

    console.log('[SAVE_AUTOMATION] Attempting to save:', data)

    const automation = await db.emailAutomation.create({
      data: {
        name: data.name,
        userId: userId,
        nodes: {
          create: data.nodes.map(node => ({
            type: node.type,
            position: node.position,
            data: node.data,
            templateId: node.data.templateId || null
          }))
        },
        edges: {
          create: data.edges.map(edge => ({
            source: edge.source,
            target: edge.target
          }))
        }
      },
      include: {
        nodes: true,
        edges: true
      }
    })

    console.log('[SAVE_AUTOMATION] Successfully saved:', automation)

    return { success: true, automation }
  } catch (error) {
    console.error('[SAVE_AUTOMATION] Error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to save automation' 
    }
  }
}