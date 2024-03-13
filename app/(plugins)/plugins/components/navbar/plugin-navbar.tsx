
import { PluginNavbarRoutes } from "./plugin-navbar-routes";

export const PluginNavbar = () => {
    return ( 
        // border-b 
        <div className="p-4 h-full flex items-center">
            {/* <CourseMobileSidebar /> */}
            <PluginNavbarRoutes />  
        </div>
     );
}