import { PluginNavbar } from "./components/navbar/plugin-navbar";
import { PluginSidebar } from "./components/sidebar/plugin-sidebar";
import { SidebarProvider } from "./components/providers/sidebar-provider";

const PluginsLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return ( 
    <SidebarProvider>
      <div className="h-full flex">
        {/* Desktop Sidebar - Fixed Position */}
        <div className="hidden md:flex fixed left-0 inset-y-0 z-40 w-60">
          <PluginSidebar />
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col md:ml-60">
          {/* Navbar */}
          <div className="sticky top-0 z-50 w-full">
            <PluginNavbar />
          </div>

          {/* Main Content */}
          <main className="flex-1 h-full bg-background text-foreground dark:bg-background dark:text-foreground pt-2">
            <div className="max-w-7xl mx-auto w-full px-4">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
   );
}
 
export default PluginsLayout;