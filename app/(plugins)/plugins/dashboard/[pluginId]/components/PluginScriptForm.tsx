"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Pencil, Wand2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface PluginScriptFormProps {
  initialData: {
    description?: string | null;
    videoScript?: string | null;
  };
  pluginId: string;
}

const formSchema = z.object({
  videoScript: z.string().min(1, {
    message: "Video script is required",
  }),
});

export const PluginScriptForm = ({
  initialData,
  pluginId,
}: PluginScriptFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoScript: initialData.videoScript || ""
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    // Reset the form when toggling edit mode
    if (!isEditing) {
      form.reset({
        videoScript: initialData.videoScript || ""
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/plugins/${pluginId}`, values);
      toast.success("Video script updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const generateScript = async () => {
    if (!initialData.description) {
      toast.error("Please add a description first to generate a script");
      return;
    }

    try {
      setIsGenerating(true);
      console.log("Generating script for plugin:", pluginId);
      
      // Using the absolute URL pattern to avoid routing issues
      const response = await axios.post(`/api/plugins/generate`, {
        pluginId,
        videoScript: initialData.videoScript || initialData.description
      });
      
      if (response.data && response.data.script) {
        form.setValue("videoScript", response.data.script);
        
        if (response.data.saved) {
          toast.success("Video script generated and saved successfully");
        } else {
          // Preview mode - just show the script but don't save
          toast.success("Video script generated (preview only)");
          setIsEditing(true); // Set to edit mode so user can see the script
        }
        
        // If not in edit mode and the user has permission to save, update via API
        if (!isEditing && response.data.saved) {
          await axios.patch(`/api/plugins/${pluginId}`, {
            videoScript: response.data.script
          });
          router.refresh();
        }
      }
    } catch (error: any) {
      console.error("Error generating script:", error);
      // More detailed error messaging
      if (error.response) {
        console.log('Response status:', error.response.status);
        console.log('Response data:', error.response.data);
        
        if (error.response.status === 404) {
          toast.error("Plugin not found. Please make sure you have the correct access.");
        } else if (error.response.status === 403) {
          toast.error("You don't have permission to edit this plugin. Only admins or the plugin owner can generate scripts.");
        } else {
          toast.error(`Failed to generate script: ${error.response.status} ${error.response.statusText}`);
        }
      } else if (error.request) {
        console.log('No response received:', error.request);
        toast.error("Failed to generate script: No response from server");
      } else {
        toast.error(`Failed to generate script: ${error.message}`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 dark:bg-slate-900 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Video Script
        <div className="flex gap-x-2">
          <Button
            onClick={generateScript}
            disabled={isGenerating || (!initialData.description && !initialData.videoScript)}
            variant="outline"
            size="sm"
          >
            {isGenerating ? (
              <>Generating...</>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Script
              </>
            )}
          </Button>
          <Button onClick={toggleEdit} variant="outline" size="sm">
            {isEditing ? (
              <>Cancel</>
            ) : (
              <>
                <Pencil className="h-4 w-4 mr-2" />
                {initialData.videoScript ? "Edit Script" : "Add Script"}
              </>
            )}
          </Button>
        </div>
      </div>
      {!isEditing && (
        <div className="mt-2">
          {initialData.videoScript ? (
            <div className="text-sm mt-2 bg-white dark:bg-slate-800 p-3 rounded-md whitespace-pre-wrap">
              {initialData.videoScript}
            </div>
          ) : (
            <div className="text-sm mt-2 italic text-muted-foreground">
              No video script available. Generate or add one to improve your video narration.
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
              name="videoScript"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Script</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="Enter a script for text-to-speech narration..."
                      {...field}
                      rows={12}
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
  );
}; 