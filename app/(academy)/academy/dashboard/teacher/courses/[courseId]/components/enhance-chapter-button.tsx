"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

interface EnhanceChaptersButtonProps {
  courseTitle: string;
  courseDescription: string | null;
}

export default function EnhanceChaptersButton({ courseTitle, courseDescription }: EnhanceChaptersButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedChapters, setGeneratedChapters] = useState<string[]>([]);

  const generateChapters = async () => {
    setIsGenerating(true);
    // Simulated delay to mimic API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // Simulate generating chapters using courseTitle and courseDescription
    const chapters = [
      `Chapter 1: Introduction to ${courseTitle}`,
      `Chapter 2: Basics of ${courseTitle}`,
      `Chapter 3: Advanced Concepts in ${courseTitle}`,
      `Chapter 4: Practical Applications of ${courseTitle}`,
      `Chapter 5: Future Directions`,
    ];
    setGeneratedChapters(chapters);
    setIsGenerating(false);
    toast({ title: "Chapters generated!" });
  };

  const acceptChapters = () => {
    toast({ title: "Chapters accepted!" });
    // Here, you could add logic to update the chapters list in parent component if needed.
    setDialogOpen(false);
    setGeneratedChapters([]);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          {generatedChapters.length === 0 ? "Enhance Chapters" : "Regenerate Chapters"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Course Chapters</DialogTitle>
          <DialogDescription>
            Using your course title and description, generate a proposed list of chapters.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {generatedChapters.length === 0 ? (
            <Button onClick={generateChapters} disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Generate Chapters"}
            </Button>
          ) : (
            <div>
              <ul className="list-disc ml-6">
                {generatedChapters.map((chapter, index) => (
                  <li key={index} className="text-sm">{chapter}</li>
                ))}
              </ul>
              <div className="mt-4 flex items-center gap-2">
                <Button variant="outline" onClick={generateChapters} disabled={isGenerating}>
                  Regenerate
                </Button>
                <Button onClick={acceptChapters}>
                  Accept Chapters
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
