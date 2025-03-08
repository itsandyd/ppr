import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import type { Metadata, ResolvingMetadata } from 'next'

import { PluginCategories } from "./components/categories";
import { PluginSearchInput } from "@/components/plugins/PluginSearchInput";
import { PluginList } from "./components/PluginList";
import { getPlugins } from "@/actions/get-plugins";

// Explicitly set dynamic rendering for this route
export const dynamic = 'force-dynamic';

interface SearchPageProps {
  searchParams: {
    title?: string;
    categoryId?: string;
    typeId?: string;
  }
};
  
export async function generateMetadata(
  { searchParams }: SearchPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const plugins = await getPlugins({
    title: searchParams.title || "",
    categoryId: searchParams.categoryId || "",
    typeId: searchParams.typeId || "",
  });

  const previousImages = (await parent).openGraph?.images || []
  
  return {
    title: 'Search Plugins | PausePlayRepeat',
    description: "Search for VST plugins, DAW tools, and audio effects for music production.",
    keywords: ['VST plugins', 'search plugins', 'audio production tools', 'free VST', 'paid plugins'],
    openGraph: {
      title: 'Search Plugins | PausePlayRepeat',
      description: "Search for VST plugins, DAW tools, and audio effects for music production.",
      type: 'website',
      images: previousImages,
    },
  }
}
  
const SearchPage = async ({
  searchParams
}: SearchPageProps) => {
  try {
    const categories = await db.pluginCategory.findMany({
      orderBy: {
        name: "desc"
      }
    });
    
    if (!categories) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">No categories found</h1>
            <p className="text-muted-foreground">Please try again later or contact support.</p>
          </div>
        </div>
      );
    }
    
    const plugins = await getPlugins({
      title: searchParams.title || "",
      categoryId: searchParams.categoryId || "",
      typeId: searchParams.typeId || "",
    });
    
    return (
      <>
        <div className="px-6 pt-6 md:hidden md:mb-0 block">
          <PluginSearchInput />
        </div>
        <div className="p-6 space-y-4">
          <PluginCategories
            items={categories}
          />
          <PluginList items={plugins} />
        </div>
      </>
    );
  } catch (error) {
    console.error("[SEARCH_PAGE_ERROR]", error);
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="text-muted-foreground">Please try again later or contact support.</p>
        </div>
      </div>
    );
  }
}
         
export default SearchPage;