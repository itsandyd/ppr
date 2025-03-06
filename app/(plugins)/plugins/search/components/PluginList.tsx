"use client";

import { Plugin, PluginType } from "@prisma/client";
import { PluginCard } from "./PluginCard";
import { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PluginWithType = Plugin & {
  pluginType: PluginType | null;
};

interface PluginsListProps {
  items: PluginWithType[];
  isLoading?: boolean;
}

// Skeleton loader for plugin cards
const PluginCardSkeleton = () => {
  return (
    <div className="rounded-lg border overflow-hidden bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 shadow-sm transition-all duration-200">
      <div className="aspect-video w-full relative">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex justify-between items-center mt-6">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  );
};

export const PluginList = ({
  items,
  isLoading = false
}: PluginsListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // 3 rows of 4 cards
  
  // Create ref for the Available Plugins section
  const availablePluginsRef = useRef<HTMLDivElement>(null);
  
  // Calculate total pages
  const totalPages = Math.ceil(items.length / itemsPerPage);
  
  // Get current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  
  useEffect(() => {
    // Reset to page 1 when items change (e.g., due to filtering)
    setCurrentPage(1);
  }, [items]);
  
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to the Available Plugins section when changing pages
    if (availablePluginsRef.current) {
      availablePluginsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5; // Maximum number of page buttons to show
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array(12).fill(0).map((_, index) => (
          <PluginCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Ref attached to this div to scroll to Available Plugins section */}
      <div ref={availablePluginsRef}></div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {currentItems.map((item) => (
          <PluginCard
            key={item.id}
            id={item.id}
            slug={item.slug ?? ""}
            name={item.name}
            price={item.price || 0}
            imageUrl={item.image || '/placeholder.svg'}
            description={item.description || ''}
            type={item.pluginType?.name || 'No Type'}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-zinc-400 mt-10">
          No plugins found. Try adjusting your search.
        </div>
      )}
      
      {/* Pagination */}
      {items.length > 0 && totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center gap-1">
            <Button
              onClick={() => currentPage > 1 && paginate(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
              size="icon"
              className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-gray-400"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {getPageNumbers().map(number => (
              <Button
                key={number}
                onClick={() => paginate(number)}
                variant={currentPage === number ? "default" : "outline"}
                className={currentPage === number 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white"
                }
                size="sm"
              >
                {number}
              </Button>
            ))}
            
            <Button
              onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
              size="icon"
              className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-gray-400"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      )}
      
      {/* Pagination info */}
      {items.length > 0 && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, items.length)} of {items.length} plugins
        </div>
      )}
    </div>
  );
}