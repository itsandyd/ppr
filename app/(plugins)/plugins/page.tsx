import type { Metadata, ResolvingMetadata } from 'next'
import { redirect, useRouter } from "next/navigation";
import { CheckCircle, Clock } from "lucide-react";

import { getPlugins } from "@/actions/get-plugins";
import { db } from "@/lib/db";
import { PluginList } from "./search/components/PluginList";
import { PluginTypes } from "./search/components/types";
import { PluginCategories } from "./search/components/categories";
import { getFreePlugins } from "@/actions/get-free-plugins";
import { PluginHero } from "./components/PluginHero";

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

  if (!effects) {
    return (
      <div className="flex items-center justify-center h-full text-foreground dark:text-foreground">
        <h1>No plugins found</h1>
      </div>
    );
  }

  const instruments = await db.pluginInstrumentCategory.findMany({
    orderBy: {
      name: "asc"
    },
  });

  return (
    <div className="p-4 md:p-6 space-y-6 text-white">
      <PluginHero />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      </div>
      <PluginTypes
        items={types}
      />
      {searchParams.typeId === "4d3c10bb-a7a0-43d8-9ac2-79e855e4708a" && <PluginCategories items={effects}/>}
      {searchParams.typeId === "4d3c10bb-a7a0-43d8-9ac2-79e855e4708a" && <PluginCategories items={effects}/>}
      <PluginList items={plugins} />
    </div>
  )
}

export default PluginsPage;

