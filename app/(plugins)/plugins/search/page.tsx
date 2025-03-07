import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import type { Metadata, ResolvingMetadata } from 'next'

import { SearchInput } from "@/components/courses/search-input";
import { getCourses } from "@/actions/get-courses";
import { CoursesList } from "@/components/courses/courses-list";
import { PluginCategories } from "./components/categories";
import { PluginSearchInput } from "@/components/plugins/PluginSearchInput";
import { PluginList } from "./components/PluginList";
import { getPlugins } from "@/actions/get-plugins";
import { useState } from "react";

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
  
    const categories = await db.pluginCategory.findMany({
      orderBy: {
        name: "desc"
      }
    });
  
    if (!categories) {
      return (
        <div>
          <h1>No plugins found</h1>
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
                {/* <PluginCategories
                  items={categories}
                /> */}
                <PluginList items={plugins} />
              </div>
            </>
           );
        }
         

export default SearchPage;