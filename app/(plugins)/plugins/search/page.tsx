

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { SearchInput } from "@/components/courses/search-input";
import { getCourses } from "@/actions/get-courses";
import { CoursesList } from "@/components/courses/courses-list";
import { PluginCategories } from "./components/categories";
import { PluginSearchInput } from "@/components/plugins/PluginSearchInput";
import { PluginList } from "./components/PluginList";
import { getPlugins } from "@/actions/get-plugins";

interface SearchPageProps {
    searchParams: {
      title: string;
      categoryId: string;
    }
  };
  
  const SearchPage = async ({
    searchParams
  }: SearchPageProps) => {
    const { userId } = auth();
  
    if (!userId) {
      return redirect("/");
    }
  
    const categories = await db.pluginCategory.findMany({
      orderBy: {
        name: "asc"
      }
    });
  
    if (!categories) {
      return (
        <div>
          <h1>No plugins found</h1>
        </div>
      );
    }
  
    const plugins = await getPlugins();
        
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