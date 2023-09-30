import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react"; 
import { UserButton } from "@clerk/nextjs";
// import MobileSidebar from "@/components/mobile-sidebar";
// import { ModeToggle } from "./mode-toggle";

const AiNavbar = () => {
    return (
        <div className="flex items-center p-4">
            <Button variant="ghost" size="icon" className="md:hidden">
                {/* <MobileSidebar /> */}
            </Button> 
            <div className="flex w-full justify-end gap-x-3">
                {/* <ModeToggle /> */}
                <UserButton afterSignOutUrl="/"/>
            </div>
        </div>
    )
}

export default AiNavbar;