import { PluginNavbar } from "@/app/(plugins)/plugins/components/navbar/plugin-navbar";
import { PluginSidebar } from "@/app/(plugins)/plugins/components/sidebar/plugin-sidebar";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface PluginLayoutProps {
  children: React.ReactNode;
  params: {
    pluginId: string;
  };
}

const PluginsLayout = async ({ children, params }: PluginLayoutProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const plugin = await db.plugin.findFirst({
    where: {
      OR: [
        { id: params.pluginId },
        { slug: params.pluginId }
      ],
      userId,
    },
  });

  if (!plugin) {
    return redirect("/");
  }

  return ( 
    <div className="h-full">
      <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
        <PluginNavbar />
      </div>
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <PluginSidebar />
      </div>
      <main className="md:pl-56 pt-[80px] h-full">
        {children}
      </main>
    </div>
   );
}
 
export default PluginsLayout;