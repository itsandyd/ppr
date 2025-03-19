"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash, Loader2 } from "lucide-react";
import { ConfirmModal } from "@/components/courses/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import axios from "axios";

interface ActionsProps {
  disabled: boolean;
  pluginId: string;
  isPublished: boolean;
}

export const Actions = ({
  disabled,
  pluginId,
  isPublished
}: ActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(`/api/plugins/${pluginId}/unpublish`);
        toast.success("Plugin unpublished");
      } else {
        await axios.patch(`/api/plugins/${pluginId}/publish`);
        toast.success("Plugin published");
      }

      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/plugins/${pluginId}`);
      toast.success("Plugin deleted");
      router.push(`/plugins/dashboard`);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isLoading && (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        )}
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  )
} 