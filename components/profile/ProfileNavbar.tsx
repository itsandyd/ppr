import { ProfileMobileSidebar } from "./ProfileMobileSidebar";
import { ProfileNavbarRoutes } from "./ProfileNavbarRoutes";


export const ProfileNavbar = () => {
    return ( 
        <div className="p-4 border-b h-full flex items-center shadow-sm bg-white">
            <ProfileMobileSidebar />
            <ProfileNavbarRoutes />
        </div>
     );
}