import type { Metadata, ResolvingMetadata } from 'next'
import { redirect } from "next/navigation";
import { CheckCircle, Clock } from "lucide-react";

import { getPlugins } from "@/actions/get-plugins";
import { db } from "@/lib/db";
import { PluginList } from "../search/components/PluginList";
import { getFreePlugins } from "@/actions/get-free-plugins";
import { PluginSearchInput } from "@/components/plugins/PluginSearchInput";
import { PluginCategories } from "../search/components/categories";
import { PluginTypes } from "../search/components/types";
import { PluginHero } from '../components/PluginHero';

// import { InfoCard } from "./components/InfoCard";

interface SearchPageProps {
    searchParams: {
      title: string;
      categoryId: string;
      typeId: string;
      pluginTypeName: string;
      pluginTypeId: string;
    }
  };

export async function generateMetadata(
  { searchParams }: SearchPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // fetch data
  const plugins = await getFreePlugins({
    ...searchParams,
  });

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []
 
  return {
    title: 'Free Plugins - The Ultimate VST Plugin Resource',
    description: "Whether you're a bedroom producer or seasoned pro, get instant access to an extensive library of quality free and paid VST plugins all in one place.",
    openGraph: {
      images: previousImages,
    },
  }
}

const FreePluginsPage = async ({
    searchParams
}: SearchPageProps) => {

    const categories = await db.pluginEffectCategory.findMany({
      orderBy: {
        name: "asc"
      },
      where: {
        pluginTypeId: {
          equals: searchParams.typeId
        }
      }
    });

    const types = await db.pluginType.findMany({
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
  
    const plugins = await getFreePlugins({
        ...searchParams,
    });

    let pluginTypeName;
    if (searchParams.pluginTypeId) {
        pluginTypeName = await db.pluginType.findUnique({
            where: {
                id: searchParams.pluginTypeId,
            },
            select: {
                name: true,
            },
        });
    }

  return (
    <div className="p-6 space-y-4">
    {/* <PluginSearchInput /> */}
    <PluginHero />
    <PluginTypes
      items={types}
      />
      <PluginCategories
      items={categories}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      </div>
        <PluginList items={plugins} />
    </div>
  )
}

export default FreePluginsPage;