import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation";
import { CheckCircle, Clock } from "lucide-react";

import { CoursesList } from "@/components/courses/courses-list";
import { getPlugins } from "@/actions/get-plugins";
import { db } from "@/lib/db";
import { PluginList } from "../search/components/PluginList";
import { getFreePlugins } from "@/actions/get-free-plugins";
import { PluginSearchInput } from "@/components/plugins/PluginSearchInput";
import { PluginCategories } from "../search/components/categories";
import { PluginTypes } from "../search/components/types";

interface SearchPageProps {
    searchParams: {
      title: string;
      categoryId: string;
      typeId: string;
    }
};

const FreePluginsPage = async ({
    searchParams
}: SearchPageProps) => {
    const plugins = await getFreePlugins({
        ...searchParams,
    });

    const types = await db.pluginType.findMany({
      orderBy: {
        name: "asc"
      },
    });

    const effectCategories = await db.pluginEffectCategory.findMany({
      orderBy: {
        name: "asc"
      }
    });

    const instrumentCategories = await db.pluginInstrumentCategory.findMany({
      orderBy: {
        name: "asc"
      }
    });

    return (
        <div className="p-6 space-y-4">
            <PluginTypes items={types} />
            <PluginCategories items={effectCategories}/>
            <PluginCategories items={instrumentCategories}/>
            <PluginList items={plugins} />
        </div>
    )
}

export default FreePluginsPage;