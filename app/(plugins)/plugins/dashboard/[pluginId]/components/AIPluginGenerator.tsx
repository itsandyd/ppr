"use client";

import { useState } from "react";
import axios from "axios";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface AIPluginGeneratorProps {
  pluginId: string;
  pluginTitle?: string;
  pluginDescription?: string;
}

export const AIPluginGenerator = ({
  pluginId,
  pluginTitle,
  pluginDescription
}: AIPluginGeneratorProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onClick = async () => {
    try {
      setIsLoading(true);
      
      // Show an initial toast to indicate the AI is working
      const toastId = toast.loading(
        "AI is generating comprehensive content. This may take up to 30 seconds...", 
        { duration: 30000 }
      );
      
      await axios.post(`/api/plugins/${pluginId}/ai-generate`, {
        title: pluginTitle,
        description: pluginDescription,
      });
      
      // Dismiss the loading toast
      toast.dismiss(toastId);
      
      // Show success toast
      toast.success(
        <div>
          <p className="font-semibold">Plugin content enhanced with AI!</p>
          <p className="text-sm mt-1">A complete professional description has been generated.</p>
        </div>
      );
      
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={onClick}
      disabled={isLoading || !pluginTitle || !pluginDescription}
      variant="outline"
      size="sm"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4 mr-2" />
          AI Generate
        </>
      )}
    </Button>
  );
}; 