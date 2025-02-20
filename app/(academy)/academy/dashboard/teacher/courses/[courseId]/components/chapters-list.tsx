"use client"

import { CourseChapter } from "@prisma/client";
import { useEffect, useState } from "react";

import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

import { cn } from "@/lib/utils";
import { Grid, Grip, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

interface ChaptersListProps {
    items: CourseChapter[];
    onReorder: (updateData: { id: string; position: number }[]) => void;
    onEdit: (id: string) => void;
  };

export const ChaptersList = ({
    items,
    onReorder,
    onEdit
}: ChaptersListProps) => {

    const [isMounted, setIsMounted] = useState(false);
    const [chapters, setChapters] = useState(items);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [enhancedText, setEnhancedText] = useState("");
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [selectedChapter, setSelectedChapter] = useState<CourseChapter | null>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setChapters(items);
    }, [items]);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
    
        const items = Array.from(chapters);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
    
        const startIndex = Math.min(result.source.index, result.destination.index);
        const endIndex = Math.max(result.source.index, result.destination.index);
    
        const updatedChapters = items.slice(startIndex, endIndex + 1);
    
        setChapters(items);
    
        const bulkUpdateData = updatedChapters.map((chapter) => ({
            id: chapter.id,
            position: items.findIndex((item) => item.id === chapter.id)
          }));
      
          onReorder(bulkUpdateData);
        }   
    
      if (!isMounted) {
        return null;
      }

    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="chapters">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {chapters.map((chapter, index) => (
                      <Draggable 
                        key={chapter.id} 
                        draggableId={chapter.id} 
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className={cn(
                              "flex items-center gap-x-2 rounded-md mb-4 text-sm",
                              chapter.isPublished && ""
                            )}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            <div
                              className={cn(
                                "px-2 py-3 border-r rounded-l-md transition",
                                chapter.isPublished && ""
                              )}
                              {...provided.dragHandleProps}
                            >
                              <Grip
                                className="h-5 w-5"
                              />
                            </div>
                            {chapter.title}
                            <div className="ml-auto pr-2 flex items-center gap-x-2">
                              {chapter.isFree && (
                                <Badge>
                                  Free
                                </Badge>
                              )}
                              <Badge
                                className={cn(
                                  "bg-[#99d8f5]",
                                  // chapter.isPublished && "bg-[#ED0F69]"
                                )}
                              >
                                {chapter.isPublished ? "Published" : "Draft"}
                              </Badge>
                              <Pencil
                                onClick={() => onEdit(chapter.id)}
                                className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs ml-2"
                                onClick={() => {
                                  setSelectedChapter(chapter);
                                  setDialogOpen(true);
                                }}
                              >
                                Enhance with AI
                              </Button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <span />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Enhance Chapter Title with AI</DialogTitle>
                  <DialogDescription>
                    Enhance your chapter title using AI.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  <div>
                    <h4 className="font-medium">Original Title</h4>
                    <p className="text-sm">{selectedChapter?.title}</p>
                  </div>
                  {enhancedText && (
                    <div className="mt-4">
                      <h4 className="font-medium">Enhanced Title</h4>
                      <p className="text-sm">{enhancedText}</p>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Button
                    onClick={async () => {
                      if (selectedChapter) {
                        setIsEnhancing(true);
                        // Simulate Tavily Search and ChatGPT integration for chapter title
                        const enhanced = selectedChapter.title + " [Enhanced by Tavily & ChatGPT]";
                        setEnhancedText(enhanced);
                        setIsEnhancing(false);
                        toast.success("Chapter title enhanced with AI");
                      }
                    }}
                    disabled={isEnhancing}
                  >
                    {isEnhancing ? "Enhancing..." : "Enhance"}
                  </Button>
                  {enhancedText && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (selectedChapter) {
                          setChapters(
                            chapters.map((ch) =>
                              ch.id === selectedChapter.id ? { ...ch, title: enhancedText } : ch
                            )
                          );
                        }
                        setDialogOpen(false);
                        setEnhancedText("");
                        setSelectedChapter(null);
                      }}
                    >
                      Accept Enhancement
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setDialogOpen(false);
                      setEnhancedText("");
                      setSelectedChapter(null);
                    }}
                  >
                    Close
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
        </>
    )
}

export default ChaptersList;