"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

interface EnhanceDetailsButtonProps {
  pluginTitle?: string;
  pluginDescription?: string;
}

const EnhanceDetailsButton = ({
  pluginTitle,
  pluginDescription
}: EnhanceDetailsButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onClick = async () => {
    if (!pluginTitle || !pluginDescription) {
      toast.error("Add a title and description first");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post("/api/plugins/enhance-details", {
        title: pluginTitle,
        description: pluginDescription
      });
      
      const enhancedData = response.data;
      
      // Display the suggested keywords for the user to see
      if (enhancedData.suggestedKeywords && enhancedData.suggestedKeywords.length > 0) {
        const keywordsPreview = enhancedData.suggestedKeywords
          .slice(0, 5)
          .join(", ") + (enhancedData.suggestedKeywords.length > 5 ? "..." : "");
          
        toast.success(
          <div>
            <p className="font-semibold">Title & Description enhanced!</p>
            <p className="text-sm mt-1">Suggested keywords: {keywordsPreview}</p>
            <p className="text-xs mt-1">Copy keywords from the console for use in your plugin metadata.</p>
          </div>,
          { duration: 5000 }
        );
        
        // Log the full set of keywords to the console for the user to copy
        console.log('Suggested keywords for your plugin:', enhancedData.suggestedKeywords.join(', '));
      } else {
        toast.success("Plugin details enhanced");
      }
      
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isLoading || !pluginTitle || !pluginDescription}
      onClick={onClick}
    >
      {isLoading ? (
        <span className="flex items-center">
          <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
          Enhancing...
        </span>
      ) : (
        <>
          <Sparkles className="h-4 w-4 mr-2" />
          Enhance Details
        </>
      )}
    </Button>
  );
};

export default EnhanceDetailsButton; 