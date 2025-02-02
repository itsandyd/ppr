import { Handle, Position } from 'reactflow'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EmailTemplate {
  id: string;
  subject: string;
  content: string;
}

interface EmailNodeProps {
  data: {
    label: string;
    templateId?: string;
    templates: EmailTemplate[];
    onTemplateChange?: (templateId: string) => void;
  };
}

export function EmailNode({ data }: EmailNodeProps) {
  return (
    <Card className="w-[300px]">
      <CardHeader className="p-4">
        <CardTitle className="text-sm">{data.label}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Select
          value={data.templateId}
          onValueChange={(value) => data.onTemplateChange?.(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a template" />
          </SelectTrigger>
          <SelectContent>
            {data.templates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                {template.subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </Card>
  )
}

