import { currentProfile } from "@/lib/current-profile";

import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { UserButton } from "@clerk/nextjs";
import { NavigationItem } from "./navigation-item";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavigationAction } from "./navigation-action";
import { ModeToggle } from "../mode-toggle";
import { ArrowLeft, PersonStanding, SkipBack, User } from "lucide-react";
import Link from "next/link";
import { GithubIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import NavigationHome from "./navigation-home";
import { Button } from "../../ui/button";


export const NavigationSidebar = async () => {
    const profile = await currentProfile();

    if (!profile) {
        return redirect("/");
    }

    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        },
    });

    return ( 
        <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1f22] bg-[#E3E5E8] py-3">
            <Button variant="ghost" className="rounded-full">
                <Link href="/">
                    <ArrowLeft className="text-zinc-500 h-6 w-6" />
                </Link>
            </Button>
            <NavigationHome />
            <NavigationAction />
            <Separator 
                className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"
            />
            <ScrollArea className="flex-1 w-full">
                {servers.map((server) => (
                    <div key={server.id} className="mb-4">
                        <NavigationItem
                            id={server.id}
                            name={server.name}
                            imageUrl={server.imageUrl}
                        />
                    </div>
                ))}
            </ScrollArea>
            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipContent>
                            Contribute to the project
                        </TooltipContent>
                            <Link href="https://github.com/pauseplayrepeat/community" className="text-zinc-500">
                                <GithubIcon className="text-zinc-500 h-6 w-6" />
                            </Link>
                    </Tooltip>
                </TooltipProvider>
                <ModeToggle />
                <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                        elements: {
                            avatarBox: "h-[48px] w-[48px]",
                        }
                    }}
                />
            </div>
        </div>
     );
}

export default NavigationSidebar;