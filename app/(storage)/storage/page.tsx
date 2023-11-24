import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bell, DownloadCloud, File, Music, Search, UploadCloud } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { UserButton, auth } from "@clerk/nextjs";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import SidebarNav from "@/components/storage/SidebarNav";
import { redirect } from "next/navigation";

export default function Component() {

    return (
        <div className="">
            {/* <div className="hidden border-r bg-zinc-100/40 lg:block dark:bg-zinc-800/40">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-[60px] items-center border-b px-6">
                        <Link className="flex items-center gap-2 font-semibold" href="#">
                            <Music className="h-6 w-6" />
                            <span className="">File Storage</span>
                        </Link>
                        <Button className="ml-auto h-8 w-8" size="icon" variant="outline">
                            <Bell className="h-4 w-4" />
                            <span className="sr-only">Toggle notifications</span>
                        </Button>
                    </div>
                    <SidebarNav />
                </div>
            </div> */}
            <div className="flex flex-col">
                <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-zinc-100/40 px-6 dark:bg-zinc-800/40">
                    <Link className="lg:hidden" href="#">
                        <Music className="h-6 w-6" />
                        <span className="sr-only">Home</span>
                    </Link>
                    <div className="w-full flex-1">
                        <form>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                                <Input
                                    className="w-full bg-white shadow-none appearance-none pl-8 md:w-2/3 lg:w-1/3 dark:bg-zinc-950"
                                    placeholder="Search files..."
                                    type="search"
                                />
                            </div>
                        </form>
                    </div>
                    <UserButton />
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                    <div className="flex items-center">
                        <h1 className="font-semibold text-lg md:text-2xl">My Files</h1>
                        <UploadButton<OurFileRouter> className="ml-auto"
                            endpoint="musicFile"
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {/* Add your file components here */}
                    </div>
                </main>
            </div>
        </div>
    );
}

// Add your IconBell, IconMusic, and other SVG components here