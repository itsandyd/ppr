"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import qs from "query-string";
import { useDebounce } from "@/hooks/use-debounce";

export const SearchInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("title") || "");
  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    const currentQuery = new URLSearchParams(searchParams.toString());
    
    if (debouncedValue) {
      currentQuery.set("title", debouncedValue);
    } else {
      currentQuery.delete("title");
    }

    const url = `${window.location.pathname}?${currentQuery.toString()}`;
    router.push(url);
  }, [debouncedValue, router, searchParams]);

  return (
    <form className="relative flex-1 w-full" onSubmit={(e) => e.preventDefault()}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input 
        placeholder="Search plugins..." 
        className="pl-10 w-full bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-400"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </form>
  );
}; 