import type { Metadata, ResolvingMetadata } from 'next'
import { redirect } from "next/navigation";
import { Filter } from "lucide-react";

import { db } from "@/lib/db";
import { PluginList } from "./search/components/PluginList";
import { PluginTypes } from "./search/components/types";
import { PluginCategories } from "./search/components/categories";
import { getFreePlugins } from "@/actions/get-free-plugins";
import { PluginHero } from "./components/PluginHero";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SearchInput } from "./components/SearchInput";
import { getPlugins } from '@/actions/get-plugins';

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
    typeId: string;
  }
};

export async function generateMetadata(
  { searchParams }: SearchPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const plugins = await getPlugins({
    ...searchParams,
  });

  const previousImages = (await parent).openGraph?.images || []
 
  return {
    title: {
      default: 'PausePlayRepeat — Music Producer Plugin Marketplace',
      template: '%s | PausePlayRepeat',
    },
    description: "Discover free and paid VST plugins, DAW tools, and audio effects for music production. Explore synth plugins, amp simulators, and more.",
    keywords: ['VST plugins', 'audio production tools', 'free VST', 'paid plugins', 'synth plugins', 'music production', 'DAW tools', 'audio effects'],
    openGraph: {
      title: 'PausePlayRepeat — Music Producer Plugin Marketplace',
      description: "Discover free and paid VST plugins, DAW tools, and audio effects for music production. Explore synth plugins, amp simulators, and more.",
      type: 'website',
      images: previousImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'PausePlayRepeat — Music Producer Plugin Marketplace',
      description: "Discover free and paid VST plugins, DAW tools, and audio effects for music production. Explore synth plugins, amp simulators, and more.",
    },
    alternates: {
      canonical: '/plugins',
    }
  }
}

const PluginsPage = async ({
  searchParams
}: SearchPageProps) => {
  const plugins = await getPlugins({
    ...searchParams,
  });

  const effects = await db.pluginEffectCategory.findMany({
    orderBy: {
      name: "asc"
    },
  });

  const types = await db.pluginType.findMany({
    orderBy: {
      name: "asc"
    },
  });

  const instruments = await db.pluginInstrumentCategory.findMany({
    orderBy: {
      name: "asc"
    },
  });

  if (!effects || !types || !instruments) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">No plugins found</h1>
          <p className="text-muted-foreground">Please try again later or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PluginHero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
          <SearchInput />
          {/* <Button 
            variant="outline" 
            className="w-full md:w-auto dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-800 bg-gray-100 border-gray-200 text-gray-900 hover:bg-gray-200"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button> */}
        </div>

        {/* Plugin Types Section */}
        <section className="space-y-6 mb-12">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight dark:text-white text-gray-900">Plugin Types</h2>
          </div>
          <PluginTypes items={types} />
        </section>

        <Separator className="my-8 dark:bg-zinc-800 bg-gray-200" />

        {/* Categories Section - Conditional Rendering */}
        {searchParams.typeId === "4d3c10bb-a7a0-43d8-9ac2-79e855e4708a" && (
          <section className="space-y-6 mb-12">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold tracking-tight dark:text-white text-gray-900">Effect Categories</h2>
            </div>
            <PluginCategories items={effects} />
          </section>
        )}

        {/* Plugin List Section */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight dark:text-white text-gray-900">Available Plugins</h2>
            <p className="dark:text-zinc-400 text-gray-500">
              {plugins.length} plugin{plugins.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <PluginList items={plugins} />
        </section>
      </div>
    </div>
  )
}

export default PluginsPage;

