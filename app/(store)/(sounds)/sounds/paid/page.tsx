import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation";
import { CheckCircle, Clock } from "lucide-react";

import { CoursesList } from "@/components/courses/courses-list";
import { getPlugins } from "@/actions/get-plugins";
import { db } from "@/lib/db";

import { getFreePlugins } from "@/actions/get-free-plugins";
import { PluginSearchInput } from "@/components/plugins/PluginSearchInput";
import { SoundsList } from "@/components/sounds/SoundsList";
import { getFreeSounds } from "@/actions/get-free-sounds";
import { getPaidPlugins } from "@/actions/get-paid-plugins";
import { getPaidSounds } from "@/actions/get-paid-sounds";


// import { InfoCard } from "./components/InfoCard";

interface SearchPageProps {
    searchParams: {
      title: string;
      categoryId: string;
    }
  };

const PaidSoundsPage = async ({
    searchParams
}: SearchPageProps) => {

  
    const categories = await db.soundsCategory.findMany({
      orderBy: {
        name: "asc"
      },
    });
  
    if (!categories) {
      return (
        <div>
          <h1>No sounds found</h1>
        </div>
      );
    }
  
    const sounds = await getPaidSounds({
        ...searchParams,
    });
        

  return (
    <div className="p-6 space-y-4">
    {/* <PluginSearchInput /> */}
    {/* <PluginCategories
                  items={categories}
                /> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      </div>
        <SoundsList items={sounds} />
    </div>
  )
}

export default PaidSoundsPage;

