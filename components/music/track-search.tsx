"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TrackSearchProps {
  onSearch: (query: string) => void;
  accessToken?: string;
}

export const TrackSearch = ({
  onSearch,
  accessToken
}: TrackSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="relative w-full max-w-2xl mx-auto"
    >
      <Input
        placeholder="Search for songs, artists, or albums..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-10 bg-neutral-900 text-white placeholder-neutral-400 border-neutral-700 focus:border-white"
      />
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-transparent"
      >
        <Search className="h-5 w-5 text-neutral-400" />
      </Button>
    </form>
  );
}; 