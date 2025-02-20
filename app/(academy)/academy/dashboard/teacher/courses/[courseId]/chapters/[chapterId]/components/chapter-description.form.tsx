"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Course, CourseChapter } from "@prisma/client";
import { Editor } from "@/components/editor";
import { Preview } from "@/components/courses/preview";

import { OpenAIEmbeddings } from "langchain/embeddings/openai";
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
};

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

  const toggleEdit = () => setIsEditing((current) => !current);

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
    setIsEnhancing(true);
    const originalDescription = form.getValues("description");
    // Simulate Tavily Search and ChatGPT integration
    const enhanced = originalDescription + " [Enhanced by Tavily & ChatGPT]";
    setEnhancedText(enhanced);
    setIsEnhancing(false);
    toast.success("Description enhanced with AI");
  };

  return (
    <div className="mt-6 border rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <span>Chapter description</span>
        <div className="flex gap-2">
          <Button onClick={toggleEdit} variant="ghost">
            {isEditing ? (
              "Cancel"
            ) : (
              <>
                <Pencil className="h-4 w-4 mr-2" />
                Edit chapter
              </>
            )}
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Enhance with AI</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enhance description with AI</DialogTitle>
                <DialogDescription>
                  Enhance your description using AI.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <div>
                  <h4 className="font-medium">Original Text</h4>
                  <p className="text-sm">{form.getValues("description")}</p>
                </div>
                {enhancedText && (
                  <div className="mt-4">
                    <h4 className="font-medium">Enhanced Text</h4>
                    <p className="text-sm">{enhancedText}</p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Button onClick={handleEnhance} disabled={isEnhancing}>
                  {isEnhancing ? "Enhancing..." : "Enhance"}
                </Button>
                {enhancedText && (
                  <Button variant="outline" onClick={() => { form.setValue("description", enhancedText); setDialogOpen(false); }}>
                    Accept Enhancement
                  </Button>
                )}
                <Button variant="ghost" onClick={() => setDialogOpen(false)}>Close</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {!isEditing && (
        <div className={cn("text-sm mt-2", !initialData.description && " italic"
        )}>
          {!initialData.description && "No description"}
          {initialData.description && (
            <Preview
                onChange={() => {}}
              value={initialData.description}
            />
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
                    <Editor 
                        {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
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