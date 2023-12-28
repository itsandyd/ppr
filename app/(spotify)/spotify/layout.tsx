import { auth, UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import SidebarNav from "@/components/storage/SidebarNav";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { db } from "@/lib/db";
import Link from "next/link";
import { Bell, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/dropbox/Header";

const MusicLayout = async ({
    children,
    // params,
}: {
    children: React.ReactNode;
    // params: 
}) => {

    const { userId } = auth();
    

    if (!userId) {
        return redirect("/");
    }

    return (
        <div className="h-full">
            <div className="h-[80px] fixed inset-y-0 w-full z-50">
                {/* <Header /> */}
            <div>
                {/* Main content here */}
                {children}
            </div>
        </div>
        </div>
    );
}

export default MusicLayout;