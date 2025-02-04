"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useCompletion } from "ai/react"

import { ChatForm } from "@/components/ai/companion/chat/chat-form";
import { Companion, CompanionMessage, ChapterEmbedding } from "@prisma/client";
import { ChatHeader } from "@/components/ai/companion/chat/chat-header";
import { ChatMessages } from "@/components/ai/companion/chat/chat-messages";
import { ChatMessageProps } from "@/components/ai/companion/chat/chat-message";

interface ChatClientProps {
  companion: Companion & {
    messages: CompanionMessage[];
    _count: {
      messages: number;
    }
  };
  chapterEmbeddings: (ChapterEmbedding & {
    chapter: {
      id: string;
      title: string;
      description: string | null;
    }
  })[];
};

export const ChatClient = ({
  companion,
  chapterEmbeddings,
}: ChatClientProps) => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessageProps[]>(companion.messages);
  
  const {
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
    setInput,
  } = useCompletion({
    api: `/api/ai/companion/chat/${companion.id}`,
    onFinish(_prompt, completion) {
      const systemMessage: ChatMessageProps = {
        role: "system",
        content: completion
      };

      setMessages((current) => [...current, systemMessage]);
      setInput("");

      router.refresh();
    },
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const userMessage: ChatMessageProps = {
      role: "user",
      content: input
    };

    setMessages((current) => [...current, userMessage]);

    handleSubmit(e);
  }

  return (
    <div className="flex flex-col h-full p-4 space-y-2">
      <ChatHeader companion={companion} />
      <ChatMessages 
        companion={companion}
        isLoading={isLoading}
        messages={messages}
        chapterEmbeddings={chapterEmbeddings}
      />
      <ChatForm 
        isLoading={isLoading} 
        input={input} 
        handleInputChange={handleInputChange} 
        onSubmit={onSubmit}
        chapterEmbeddings={chapterEmbeddings}
      />
    </div>
   );
}