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
      <div className="h-full relative flex">
        {/* Mobile Menu Button - Only visible on mobile */}
        <div className="md:hidden fixed top-4 left-4 z-50">
          <PluginSidebar />
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden md:flex fixed inset-y-0 left-0 z-40 w-60">
          <PluginSidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 h-full bg-background text-foreground dark:bg-background dark:text-foreground transition-colors md:ml-60">
          <div className="max-w-5xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
   );
}
 
export default PluginsLayout;