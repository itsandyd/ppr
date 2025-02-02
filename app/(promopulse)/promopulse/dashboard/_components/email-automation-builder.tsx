"use client"

import { useState, useCallback } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  applyEdgeChanges,
  applyNodeChanges,
  NodeChange,
  EdgeChange,
  Connection,
  addEdge
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { EmailNode } from './nodes/email-node'
import { DelayNode } from './nodes/delay-node'
import { ConditionNode } from './nodes/condition-node'
import { saveAutomation } from '@/actions/promo-pulse/automation'
import { useToast } from "@/components/ui/use-toast"

interface EmailTemplate {
  id: string;
  subject: string;
  content: string;
}

interface EmailAutomationBuilderProps {
  emailTemplates: EmailTemplate[];
}

const nodeTypes = {
  email: EmailNode,
  delay: DelayNode,
  condition: ConditionNode,
}

const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'input',
    data: { label: 'Start' },
    position: { x: 250, y: 5 },
  },
]

const initialEdges: Edge[] = []

interface AutomationNode {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
    templateId?: string;
    duration?: number;
    unit?: string;
    tag?: string;
  };
}

interface SaveAutomationData {
  name: string;
  nodes: AutomationNode[];
  edges: {
    source: string;
    target: string;
  }[];
}

export function EmailAutomationBuilder({ emailTemplates }: EmailAutomationBuilderProps) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)
  const [lastNodeId, setLastNodeId] = useState('start')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  )
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  )
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  )

  const handleTemplateChange = (nodeId: string, templateId: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              templateId,
            },
          };
        }
        return node;
      })
    );
  };

  const addNode = (type: string, data: any) => {
    const newNodeId = (nodes.length).toString()
    const newNode: Node = {
      id: newNodeId,
      type,
      data: {
        ...data,
        templates: emailTemplates,
        onTemplateChange: (templateId: string) => handleTemplateChange(newNodeId, templateId),
      },
      position: { x: 250, y: nodes.length * 100 },
    }
    
    const newEdge: Edge = {
      id: `e${lastNodeId}-${newNodeId}`,
      source: lastNodeId,
      target: newNodeId,
    }

    setNodes((nds) => [...nds, newNode])
    setEdges((eds) => [...eds, newEdge])
    setLastNodeId(newNodeId)
  }

  const addEmailNode = () => {
    addNode('email', { label: 'Send Email', templateId: null })
  }

  const addDelayNode = () => {
    addNode('delay', { label: 'Delay', duration: 1, unit: 'days' })
  }

  const addConditionNode = () => {
    addNode('condition', { label: 'Condition', tag: '' })
  }

  const handleSaveAutomation = async () => {
    try {
      setIsLoading(true)
      
      // Filter out the start node if needed
      const automationNodes = nodes.filter(node => node.id !== 'start')
      
      console.log('Saving automation with:', {
        nodes: automationNodes,
        edges
      })

      const result = await saveAutomation({
        name: "My Automation",
        nodes: automationNodes.map(node => ({
          id: node.id,
          type: node.type || 'default',
          position: {
            x: node.position.x,
            y: node.position.y
          },
          data: {
            label: node.data.label,
            templateId: node.data.templateId,
            duration: node.data.duration,
            unit: node.data.unit,
            tag: node.data.tag
          }
        })),
        edges: edges.map(edge => ({
          source: edge.source,
          target: edge.target
        }))
      })

      console.log('Save automation result:', result)

      if (result.success) {
        toast({
          title: "Success",
          description: "Automation saved successfully",
        })
      } else {
        throw new Error(result.error || 'Failed to save automation')
      }
    } catch (error) {
      console.error('Error saving automation:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save automation",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Email Automation Builder</CardTitle>
        <CardDescription>Create your email automation workflow</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 mb-4">
          <Button onClick={addEmailNode}>Add Email</Button>
          <Button onClick={addDelayNode}>Add Delay</Button>
          <Button onClick={addConditionNode}>Add Condition</Button>
        </div>
        <div style={{ width: '100%', height: '500px' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
          >
            <Controls />
            <Background />
          </ReactFlow>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleSaveAutomation}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Automation"}
        </Button>
      </CardFooter>
    </Card>
  )
}