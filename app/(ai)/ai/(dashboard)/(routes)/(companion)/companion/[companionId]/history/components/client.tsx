"use client";

import { Companion, CompanionMessage } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface CompanionHistoryClientProps {
  companion: Companion & {
    messages: CompanionMessage[];
    _count: {
      messages: number;
    };
  };
}

export const CompanionHistoryClient = ({
  companion,
}: CompanionHistoryClientProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Function to start a new chat
  const onStartNewChat = async () => {
    try {
      setIsLoading(true);
      // Clear any existing messages for this companion
      await axios.post("/api/companion/clear", { companionId: companion.id });
      // Navigate to chat
      router.push(`/ai/companion/chat/${companion.id}`);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Group messages by conversation (using createdAt timestamps within 5 minutes)
  const conversations = companion.messages.reduce((acc: any[], message) => {
    const messageTime = new Date(message.createdAt).getTime();
    const lastConversation = acc[acc.length - 1];

    if (
      lastConversation &&
      messageTime - new Date(lastConversation[0].createdAt).getTime() < 5 * 60 * 1000
    ) {
      lastConversation.push(message);
    } else {
      acc.push([message]);
    }
    return acc;
  }, []);

  return (
    <div className="h-full p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Conversations with {companion.name}</h1>
        <Button 
          onClick={onStartNewChat} 
          disabled={isLoading}
        >
          Start New Chat
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {conversations.map((conversation: CompanionMessage[], index: number) => (
          <Card 
            key={index}
            className="p-4 cursor-pointer hover:opacity-75 transition"
            onClick={() => router.push(`/ai/companion/chat/${companion.id}`)}
          >
            <div className="flex items-center gap-x-2 mb-4">
              <MessageSquare className="w-6 h-6" />
              <div className="flex flex-col">
                <p className="font-semibold">
                  Conversation from {formatDistanceToNow(new Date(conversation[0].createdAt), { addSuffix: true })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {conversation.length} messages
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {conversation.slice(0, 3).map((message) => (
                <div 
                  key={message.id}
                  className="text-sm text-muted-foreground"
                >
                  <span className="font-semibold">
                    {message.role === "user" ? "You: " : `${companion.name}: `}
                  </span>
                  {message.content.length > 100 
                    ? `${message.content.substring(0, 100)}...` 
                    : message.content}
                </div>
              ))}
              {conversation.length > 3 && (
                <div className="text-sm text-muted-foreground">
                  ... and {conversation.length - 3} more messages
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
      {conversations.length === 0 && (
        <div className="text-center text-muted-foreground">
          No conversations yet. Start chatting!
        </div>
      )}
    </div>
  );
}; 