import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation";
import { CheckCircle, Clock } from "lucide-react";

import { CoursesList } from "@/components/courses/courses-list";
import { getPlugins } from "@/actions/get-plugins";
import { db } from "@/lib/db";
import { PluginList } from "./search/components/PluginList";
import { PluginTypes } from "./search/components/types";
import { PluginCategories } from "./search/components/categories";
import { getFreePlugins } from "@/actions/get-free-plugins";
import { PluginHero } from "./components/PluginHero";
// import { InfoCard } from "./components/InfoCard";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
    typeId: string;
  }
};


const PluginsPage = async ({
  searchParams
}: SearchPageProps) => {
//   const { userId } = auth();

//   if (!userId) {
//     return redirect("/");
//   }

  // const {
  //   completedCourses,
  //   coursesInProgress
  // } = await getDashboardCourses(userId);

  // const { userId } = auth();
  
  //   if (!userId) {
  //     return redirect("/");
  //   }
  
    // const type = await db.pluginType.findMany({
    //   orderBy: {
    //     name: "desc"
    //   }
    // });
  
    // if (!type) {
    //   return (
    //     <div>
    //       <h1>No plugins found</h1>
    //     </div>
    //   );
    // }
    
  
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
        <div>
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
    <div className="p-6 space-y-4">
        <PluginHero />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
       {/* <InfoCard
          icon={Clock}
          label="In Progress"
          // numberOfItems={coursesInProgress.length}
       /> 
       <InfoCard
          icon={CheckCircle}
          label="Completed"
          // numberOfItems={completedCourses.length}
          variant="success"
       /> */}
      </div>
      <PluginTypes
      items={types}
      />
      <PluginCategories items={effects}/>
      <PluginCategories items={instruments}/>
      {/* <CoursesList
        items={[...coursesInProgress, ...completedCourses]}
      /> */}
      <PluginList items={plugins} />
    </div>
  )
}

export default PluginsPage;

