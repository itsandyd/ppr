import { auth, UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import SidebarNav from "@/components/storage/SidebarNav";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { db } from "@/lib/db";
import Link from "next/link";
import { Bell, Music } from "lucide-react";
import { Button } from "@/components/ui/button";

const StorageLayout = async ({
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

    const userFolders = await db.storageFolder.findMany({
        where: {
            userId: userId,
        },
    });

    return (
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-zinc-100/40 lg:block dark:bg-zinc-800/40">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <SidebarNav userId={userId} folders={userFolders} />
                </div>
            </div>
            <div className="flex flex-col">
                {/* Main content here */}
                {children}
            </div>
        </div>
    );
}

export default StorageLayout;