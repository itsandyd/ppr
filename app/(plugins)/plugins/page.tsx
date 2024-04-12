import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation";
import { CheckCircle, Clock } from "lucide-react";

import { CoursesList } from "@/components/courses/courses-list";
import { getPlugins } from "@/actions/get-plugins";
import { db } from "@/lib/db";
import { PluginList } from "./search/components/PluginList";
import { PluginTypes } from "./search/components/types";
import { PluginCategories } from "./search/components/categories";
// import { InfoCard } from "./components/InfoCard";


export default async function Plugins() {
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
  
    const plugins = await getPlugins();

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
      <PluginCategories items={effectCategories}/>
      <PluginCategories items={instrumentCategories}/>
      {/* <CoursesList
        items={[...coursesInProgress, ...completedCourses]}
      /> */}
      <PluginList items={plugins} />
    </div>
  )
}