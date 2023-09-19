import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";
import Image from "next/image";
import { ServerCard } from "./community-server-card";



export const CommunityLandingContent = async () => {
    const profile = await currentProfile();

    if (!profile) {
        return redirect("/");
    }

    const servers = await db.server.findMany({
        // where: {
        //     members: {
        //         some: {
        //             profileId: profile.id
        //         }
        //     }
        // },
    });


  return (
    <div className="px-10 pb-20">
      <h2 className="text-center text-4xl font-extrabold mb-10">Browse our communities</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {servers.map((server) => (
        //   <Card key={server.id} className="bg-[#192339] border-none text-white">
        //     <CardHeader>
        //       <CardTitle className="flex items-center gap-x-2">
        //         <div>
        //           <p className="text-lg">{server.name}</p>
        //           <p className="text-zinc-400 text-sm">{item.title}</p>
        //         </div>
        //       </CardTitle>
        //       <CardContent className="pt-4 px-0">
        //       </CardContent>
        //     </CardHeader>
        //   </Card>
        <ServerCard key={server.id} server={server}/>
        ))}
      </div>
    </div>
  )
}