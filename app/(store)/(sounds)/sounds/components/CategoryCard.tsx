"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CategoryCardProps {
  id: string;
  name: string;
}

export const CategoryCard = ({
  id,
  name,
}: CategoryCardProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategoryId = searchParams.get("categoryId");
  const isSelected = currentCategoryId === id;

  const onClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (params.get("categoryId") === id) {
      params.delete("categoryId");
    } else {
      params.set("categoryId", id);
    }

    router.push(`/sounds?${params.toString()}`);
  };

  return (
    <Button
      onClick={onClick}
      className={cn(
        "w-full p-4 bg-zinc-900 border-2 border-zinc-800 rounded-lg hover:border-zinc-700 transition",
        isSelected && "border-zinc-600"
      )}
      variant="ghost"
    >
      {name}
    </Button>
  );
}; 