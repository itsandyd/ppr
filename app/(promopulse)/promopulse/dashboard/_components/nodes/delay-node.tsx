import { useState } from 'react'
import { Handle, Position } from 'reactflow'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define the types for the props
interface DelayNodeProps {
  data: {
    duration: number;
    unit: string;
  };
  isConnectable: boolean;
}

export function DelayNode({ data, isConnectable }: DelayNodeProps) {
  const [duration, setDuration] = useState<number>(data.duration)
  const [unit, setUnit] = useState<string>(data.unit)

  return (
    <Card className="w-[250px]">
      <CardHeader>
        <CardTitle className="text-sm">Delay</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center space-x-2">
        <Input
          type="number"
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value))}
          className="w-20"
        />
        <Select onValueChange={setUnit} value={unit}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="minutes">Minutes</SelectItem>
            <SelectItem value="hours">Hours</SelectItem>
            <SelectItem value="days">Days</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </Card>
  )
}

