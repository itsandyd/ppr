import { useState } from 'react'
import { Handle, Position } from 'reactflow'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define the types for the props
interface ConditionNodeProps {
  data: {
    tag: string;
  };
  isConnectable: boolean;
}

export function ConditionNode({ data, isConnectable }: ConditionNodeProps) {
  const [tag, setTag] = useState(data.tag)

  return (
    <Card className="w-[250px]">
      <CardHeader>
        <CardTitle className="text-sm">Condition</CardTitle>
      </CardHeader>
      <CardContent>
        <Select onValueChange={setTag} value={tag}>
          <SelectTrigger>
            <SelectValue placeholder="Select tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tag1">Tag 1</SelectItem>
            <SelectItem value="tag2">Tag 2</SelectItem>
            <SelectItem value="tag3">Tag 3</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Bottom} id="yes" isConnectable={isConnectable} />
      <Handle type="source" position={Position.Right} id="no" isConnectable={isConnectable} />
    </Card>
  )
}

