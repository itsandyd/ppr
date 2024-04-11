
import { PluginNavbarRoutes } from "./plugin-navbar-routes";

export const PluginNavbar = () => {
    return ( 
        // border-b 
        <div className="p-4 border-b h-full flex items-center shadow-sm bg-white dark:bg-[#313338]">
            {/* <CourseMobileSidebar /> */}
            <PluginNavbarRoutes />  
        </div>
     );
}