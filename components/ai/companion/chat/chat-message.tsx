"use client";

import { BeatLoader } from "react-spinners";
import { Copy } from "lucide-react";
import { useTheme } from "next-themes";
import { ChapterEmbedding } from "@prisma/client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { BotAvatar } from "./bot-avatar";
import { UserAvatar } from "./user-avatar";

export interface ChatMessageProps {
  role: "system" | "user";
  content?: string;
  isLoading?: boolean;
  src?: string;
  chapterEmbeddings?: (ChapterEmbedding & {
    chapter: {
      id: string;
      title: string;
      description: string | null;
    }
  })[];
}

export const ChatMessage = ({
  role,
  content,
  isLoading,
  src,
  chapterEmbeddings
}: ChatMessageProps) => {
  const { toast } = useToast();
  const { theme } = useTheme();
  
  const onCopy = () => {
    if (!content) {
      return;
    }

    navigator.clipboard.writeText(content);
    toast({
      description: "Message copied to clipboard.",
      duration: 3000,
    })
  }

  // const renderChapterReferences = () => {
  //   if (role === "system" && chapterEmbeddings && chapterEmbeddings.length > 0) {
  //     return (
  //       <div className="mt-2 text-xs text-muted-foreground">
  //         <p className="font-semibold">Related Chapters:</p>
  //         <ul className="list-disc pl-4">
  //           {chapterEmbeddings.map((embedding) => (
  //             <li key={embedding.id}>
  //               {embedding.chapter.title}
  //             </li>
  //           ))}
  //         </ul>
  //       </div>
  //     );
  //   }
  //   return null;
  // };

  return (
    <div className={cn(
      "group flex items-start gap-x-3 py-4 w-full",
      role === "user" && "justify-end"
    )}>
      {role !== "user" && src && <BotAvatar src={src} />}
      <div className="rounded-md px-4 py-2 max-w-sm text-sm bg-primary/10">
        {isLoading 
          ? <BeatLoader color={theme === "light" ? "black" : "white"} size={5} /> 
          : (
            <>
              {content}
              {/* {renderChapterReferences()} */}
            </>
          )
        }
      </div>
      {role === "user" && <UserAvatar />}
      {role !== "user" && !isLoading && (
        <Button 
          onClick={onCopy} 
          className="opacity-0 group-hover:opacity-100 transition" 
          size="icon"
          variant="ghost"
        >
          <Copy className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}