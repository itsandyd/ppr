

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { SearchInput } from "@/components/courses/search-input";
import { getCourses } from "@/actions/get-courses";
import { CoursesList } from "@/components/courses/courses-list";

import { PluginSearchInput } from "@/components/plugins/PluginSearchInput";

import { getPlugins } from "@/actions/get-plugins";
import { PluginList } from "../search/components/PluginList";
import { getPluginsByCategory } from "@/actions/getPluginByCategory";

interface SearchPageProps {
    searchParams: {
      title: string;
      categoryId: string;
    }
  };
  
  const AutotunePluginPage = async ({
    searchParams
  }: SearchPageProps) => {
    const { userId } = auth();
  
    if (!userId) {
      return redirect("/");
    }
  
    const categories = await db.pluginCategory.findMany({
        where: {
            name: {
                contains: 'Bitcrusher'
            },
          },
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
  
    const plugins = await getPluginsByCategory('Bitcrusher');
        
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
         

export default AutotunePluginPage;

