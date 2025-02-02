"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmailAutomationBuilder } from "./email-automation-builder"
import { saveEmailTemplate, sendTestEmail } from "@/actions/promo-pulse/email-template"

interface EmailTemplate {
  id: string;
  content: string;
  subject: string;
}

interface EmailTemplateEditorProps {
  emailTemplates: EmailTemplate[];
}

export function EmailTemplateEditor({ emailTemplates }: EmailTemplateEditorProps) {
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [testEmail, setTestEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSaveTemplate = async () => {
    try {
      setIsLoading(true);
      const result = await saveEmailTemplate(subject, content);

      if (result.success) {
        toast({
          title: "Template Saved",
          description: "Your email template has been saved successfully.",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendTestEmail = async () => {
    try {
      setIsLoading(true);
      const result = await sendTestEmail(testEmail, subject, content);

      if (result.success) {
        toast({
          title: "Test Email Sent",
          description: "Your test email has been sent successfully.",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send test email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Campaign Builder</CardTitle>
        <CardDescription>Create and customize your email campaigns</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="template">
          <TabsList>
            <TabsTrigger value="template">Email Template</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
          </TabsList>
          <TabsContent value="template">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Enter email subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Email Content</Label>
                <Textarea
                  id="content"
                  placeholder="Write your email content here..."
                  className="min-h-[200px]"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="testEmail">Test Email Address</Label>
                <Input
                  id="testEmail"
                  type="email"
                  placeholder="Enter test email address"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="automation">
            <EmailAutomationBuilder emailTemplates={emailTemplates} />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleSaveTemplate}
          disabled={isLoading || !subject || !content}
        >
          {isLoading ? "Saving..." : "Save Template"}
        </Button>
        <Button 
          onClick={handleSendTestEmail}
          disabled={isLoading || !subject || !content || !testEmail}
        >
          {isLoading ? "Sending..." : "Send Test Email"}
        </Button>
      </CardFooter>
    </Card>
  )
}

