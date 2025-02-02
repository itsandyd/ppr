import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendEmail } from '@/lib/promopulse/send-email'
import { EmailAutomationNode } from '@prisma/client'

async function processNode(node: EmailAutomationNode, data: any = {}) {
  switch (node.type) {
    case 'email':
      if (node.templateId) {
        const template = await db.emailTemplate.findUnique({
          where: { id: node.templateId }
        })
        if (template) {
          await sendEmail(
            data.recipientEmail,
            template.subject,
            template.content
          )
        }
      }
      break
      
    case 'delay':
      const nodeData = node.data as { delay: number; unit: string }
      const delayMs = nodeData.delay * (
        nodeData.unit === 'hours' ? 3600000 : 
        nodeData.unit === 'minutes' ? 60000 : 
        1000
      )
      await new Promise(resolve => setTimeout(resolve, delayMs))
      break
      
    case 'condition':
      const conditionData = node.data as { type: string; value: any }
      // Return true/false based on condition
      return true
  }
}

async function processAutomation(automationId: string, data: any = {}) {
  const automation = await db.emailAutomation.findUnique({
    where: { id: automationId },
    include: {
      nodes: true,
      edges: true
    }
  })

  if (!automation) return

  // Find start node (node with no incoming edges)
  const startNode = automation.nodes.find(node => 
    !automation.edges.some(edge => edge.target === node.id)
  ) as EmailAutomationNode | undefined

  if (!startNode) return

  // Process nodes in sequence following edges
  let currentNode = startNode as EmailAutomationNode
  
  do {
    await processNode(currentNode, data)
    
    // Find next node
    const nextEdge = automation.edges.find(edge => 
      edge.source === currentNode!.id
    )
    if (!nextEdge) break
    
    const nextNode = automation.nodes.find(node => 
      node.id === nextEdge.target
    ) as EmailAutomationNode | undefined
    
    if (!nextNode) break

    currentNode = nextNode
  } while (true)
}

export async function POST(req: Request) {
  try {
    const { automationId, data } = await req.json()
    
    if (!automationId) {
      return NextResponse.json(
        { error: 'Automation ID is required' },
        { status: 400 }
      )
    }

    await processAutomation(automationId, data)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[AUTOMATION_CRON]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 