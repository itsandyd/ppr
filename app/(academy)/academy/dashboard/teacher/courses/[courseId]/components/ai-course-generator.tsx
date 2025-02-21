"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AICourseGeneratorProps {
  courseId: string;
  courseTitle: string;
  courseDescription: string | null;
}

export const AICourseGenerator = ({
  courseId,
  courseTitle,
  courseDescription,
}: AICourseGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{
    title?: string;
    description?: string;
    chapters?: Array<{ title: string; description: string }>;
  }>({});

  const generateCourseContent = async () => {
    try {
      setIsGenerating(true);
      
      const response = await fetch(`/api/courses/${courseId}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseTitle,
          courseDescription,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate course content");
      }

      const data = await response.json();
      setGeneratedContent(data);
      setShowDialog(true);
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to generate course content"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyChanges = async () => {
    try {
      setIsApplying(true);
      const response = await fetch(`/api/courses/${courseId}/apply-generated`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(generatedContent),
      });

      if (!response.ok) {
        throw new Error("Failed to apply generated content");
      }

      toast({
        description: "Successfully applied AI-generated content"
      });
      setShowDialog(false);
      window.location.reload();
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to apply generated content"
      });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <>
      <Button
        onClick={generateCourseContent}
        disabled={isGenerating}
        variant="outline"
        className="w-full md:w-auto"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating with AI...
          </>
        ) : (
          "Generate Course Content with AI"
        )}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] p-0 gap-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>AI Generated Course Content</DialogTitle>
            <DialogDescription>
              Review and apply the AI-generated content to your course
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[calc(80vh-180px)] px-6">
            <div className="pr-4">
              <div className="flex flex-col gap-6 pb-6">
                {generatedContent.title && (
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold">Suggested Title</h3>
                    <div className="text-sm p-3 bg-muted rounded-lg">
                      {generatedContent.title}
                    </div>
                  </div>
                )}

                {generatedContent.description && (
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold">Suggested Description</h3>
                    <div className="text-sm p-3 bg-muted rounded-lg whitespace-pre-wrap">
                      {generatedContent.description}
                    </div>
                  </div>
                )}

                {generatedContent.chapters && generatedContent.chapters.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold">Suggested Chapters</h3>
                    <div className="grid gap-4">
                      {generatedContent.chapters.map((chapter, index) => (
                        <div 
                          key={index} 
                          className={cn(
                            "p-4 rounded-lg border",
                            "hover:bg-muted/50 transition-colors"
                          )}
                        >
                          <h4 className="font-medium mb-2">{chapter.title}</h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {chapter.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>

          <div className="flex justify-end gap-2 p-6 border-t">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              disabled={isApplying}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApplyChanges}
              disabled={isApplying}
            >
              {isApplying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Applying changes...
                </>
              ) : (
                "Apply Changes"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}; 