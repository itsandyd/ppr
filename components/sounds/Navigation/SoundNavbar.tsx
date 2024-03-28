import { SoundNavbarRoutes } from "./SoundNavbarRoutes";



export const SoundNavbar = () => {
    return ( 
        // border-b 
        <div className="p-4 border-b h-full flex items-center shadow-sm ">
            {/* <CourseMobileSidebar /> */}
            <SoundNavbarRoutes />  
        </div>
     );
}