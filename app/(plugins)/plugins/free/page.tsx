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

// import { InfoCard } from "./components/InfoCard";

interface SearchPageProps {
    searchParams: {
      title: string;
      categoryId: string;
    }
  };

const FreePluginsPage = async ({
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
  
    const plugins = await getFreePlugins({
        ...searchParams,
    });
        

  return (
    <div className="p-6 space-y-4">
    {/* <PluginSearchInput /> */}
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

