import type { Metadata, ResolvingMetadata } from 'next'
import { redirect } from "next/navigation";
import { CheckCircle, Clock } from "lucide-react";

import { getPlugins } from "@/actions/get-plugins";
import { db } from "@/lib/db";
import { PluginList } from "../search/components/PluginList";
import { getFreePlugins } from "@/actions/get-free-plugins";
import { getPaidPlugins } from "@/actions/get-paid-plugins";
import { PluginCategories } from "../search/components/categories";

// import { InfoCard } from "./components/InfoCard";


interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  }
};

export async function generateMetadata(
  { searchParams }: SearchPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const plugins = await getPaidPlugins({
    ...searchParams,
  });

  const previousImages = (await parent).openGraph?.images || []
 
  return {
    title: {
      default: 'Premium VST Plugins — Professional Audio Production Tools | PausePlayRepeat',
      template: '%s | Premium Plugins | PausePlayRepeat',
    },
    description: "Professional-grade VST plugins for serious music producers. Find industry-standard instruments, effects, and audio processing tools from top developers.",
    keywords: ['premium VST plugins', 'professional audio tools', 'paid plugins', 'commercial VST', 'professional music production', 'high-end audio plugins'],
    openGraph: {
      title: 'Premium VST Plugins — Professional Audio Production Tools',
      description: "Professional-grade VST plugins for serious music producers. Find industry-standard instruments, effects, and audio processing tools from top developers.",
      type: 'website',
      images: previousImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Premium VST Plugins — Professional Audio Production Tools',
      description: "Professional-grade VST plugins for serious music producers. Find industry-standard instruments, effects, and audio processing tools from top developers.",
    },
    alternates: {
      canonical: '/plugins/paid',
    }
  }
}

const PaidPluginsPage = async ({
  searchParams
}: SearchPageProps) => {


  const categories = await db.pluginCategory.findMany({
    orderBy: {
      name: "asc"
    },
  });

  if (!categories) {
    return (
      <div>
        <h1>No plugins found</h1>
      </div>
    );
  }

  const plugins = await getPaidPlugins({
      ...searchParams,
  });
        

  return (
    <div className="p-6 space-y-4">
          <PluginCategories
                  items={categories}
                />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      </div>
        <PluginList items={plugins} />
    </div>
  )
}

export default PaidPluginsPage;

