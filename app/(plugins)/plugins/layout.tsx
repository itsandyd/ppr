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
      <div className="h-full">
        {/* Mobile Menu Button - Only visible on mobile */}
        <div className="md:hidden fixed top-4 left-4 z-50">
          <PluginSidebar />
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden md:block fixed inset-y-0 left-0 z-40">
          <PluginSidebar />
        </div>

        {/* Main Content */}
        <main className="h-full bg-[#313338] md:pl-[240px] transition-all duration-300 md:sidebar-adjusted">
          {children}
        </main>
      </div>
    </SidebarProvider>
   );
}
 
export default PluginsLayout;