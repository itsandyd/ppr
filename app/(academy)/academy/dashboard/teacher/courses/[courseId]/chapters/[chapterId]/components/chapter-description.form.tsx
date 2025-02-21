"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, Loader2, Wand2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CourseChapter } from "@prisma/client";
import { Editor } from "@/components/editor";
import { Preview } from "@/components/courses/preview";
import { Markdown } from "@/components/markdown";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ChapterDescriptionFormProps {
  initialData: CourseChapter;
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  description: z.string().min(1, {
    message: "Description is required",
  }),
});

export const ChapterDescriptionForm = ({
  initialData,
  courseId,
  chapterId
}: ChapterDescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [enhancedText, setEnhancedText] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);
  const togglePreview = () => setIsPreview((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toast.success("Chapter updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }

  const handleEnhance = async () => {
    try {
      setIsEnhancing(true);
      const response = await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/enhance`);
      
      if (response.data.enhancedDescription) {
        setEnhancedText(response.data.enhancedDescription);
        toast.success("Description enhanced with AI");
      } else {
        throw new Error("Failed to enhance description");
      }
    } catch (error) {
      console.error("[ENHANCE_ERROR]", error);
      toast.error("Failed to enhance description");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleQuickEnhance = async () => {
    try {
      setIsEnhancing(true);
      const response = await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/enhance`);
      
      if (response.data.enhancedDescription) {
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, {
          description: response.data.enhancedDescription
        });
        toast.success("Description enhanced and applied");
        router.refresh();
      } else {
        throw new Error("Failed to enhance description");
      }
    } catch (error) {
      console.error("[QUICK_ENHANCE_ERROR]", error);
      toast.error("Failed to enhance description");
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="mt-6 border rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <span>Chapter content</span>
        <div className="flex gap-2">
          <Button onClick={toggleEdit} variant="ghost" size="sm">
            <Pencil className="h-4 w-4" />
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" disabled={isEnhancing}>
                {isEnhancing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4" />
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Generate Chapter Content with AI</DialogTitle>
                <DialogDescription>
                  Our AI will generate comprehensive course content that can serve as a video script or detailed lesson.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Current Content</h4>
                  <div className="text-sm p-4 bg-muted rounded-lg overflow-y-auto max-h-[200px]">
                    <Markdown value={form.getValues("description") || "No content yet"} />
                  </div>
                </div>
                {enhancedText && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Generated Content</h4>
                    <div className="text-sm p-4 bg-muted rounded-lg overflow-y-auto max-h-[300px]">
                      <Markdown value={enhancedText} />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Button 
                  onClick={handleEnhance} 
                  disabled={isEnhancing}
                  className="flex items-center"
                >
                  {isEnhancing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating content...
                    </>
                  ) : (
                    "Generate Content"
                  )}
                </Button>
                {enhancedText && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      form.setValue("description", enhancedText);
                      setDialogOpen(false);
                      setEnhancedText("");
                      form.handleSubmit(onSubmit)();
                    }}
                  >
                    Apply Generated Content
                  </Button>
                )}
                <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {!isEditing && (
        <div className={cn(
          "text-sm mt-2",
          !initialData.description && "text-slate-500 italic"
        )}>
          {!initialData.description && "No content"}
          {initialData.description && (
            <div className="prose-sm">
              <Markdown value={initialData.description} />
            </div>
          )}
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="space-y-4">
                      <Editor {...field} />
                      {isPreview && (
                        <div className="mt-4 border rounded-lg p-4">
                          <Preview value={field.value} />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                type="button"
                variant="ghost"
                onClick={togglePreview}
              >
                {isPreview ? "Hide Preview" : "Show Preview"}
              </Button>
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}

export default ChapterDescriptionForm;