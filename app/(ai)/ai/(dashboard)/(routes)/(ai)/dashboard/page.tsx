"use client";

import { MessageSquare, ImageIcon, VideoIcon, Music, Code, HelpingHand, Paperclip } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const tools = [
    {
        label: "Conversation",
        icon: MessageSquare,
        href: "/ai/conversation",
        bgColor: "text-violet-500/10",
        color: "text-violet-500",
    },
    {
        label: "Album Artwork Generation",
        icon: ImageIcon,
        href: "/ai/image",
        bgColor: "text-pink-500/10",
        color: "text-pink-500",
    },
    {
        label: "Stable Diffusion Animation",
        icon: VideoIcon,
        href: "/ai/sdanimate",
        color: "text-orange-500",
    },
    {
        label: "Animate Diffusion",
        icon: VideoIcon,
        href: "/ai/animatediffusion",
        color: "text-orange-500",
    },
    // {
    //     label: "Video Generation",
    //     icon: VideoIcon,
    //     href: "/video",
    //     bgColor: "text-orange-500/10",
    //     color: "text-orange-500",
    // },
    {
        label: "Sample Generation",
        icon: Music,
        href: "/ai/music",
        bgColor: "text-blue-500/10",
        color: "text-blue-500",
    },
    // {
    //     label: "Code Generation",
    //     icon: Code,
    //     href: "/code",
    //     bgColor: "text-green-500/10",
    //     color: "text-green-500",
    // },
    {
        label: "Companions",
        icon: HelpingHand,
        href: "/ai/companion",
        bgColor: "text-grey-500/10",
        color: "text-grey-500",
    },
    {
        label: "ChatWithPDF",
        icon: Paperclip,
        href: "/ai/pdf",
        bgColor: "text-grey-500/10",
        color: "text-grey-500",
    },
    
];

const DashboardPage = () => {
    return (
        <div>
            <div className="mb-8 space-y-4">
                <h2 className="text-2xl md:text-4xl font-bold text-center">
                    Dashboard
                </h2>
                <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
                    Experience the power of AI.
                </p>
                <div className="px-4 md:px-20 lg:px-32 space-y-4">
                    {tools.map((tool) => (
                        <Link href={tool.href} key={tool.href}>
                                <Card className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer">
                                    <div className="flex items-center gap-x-4">
                                        <div className={cn("w-8 h-8", tool.bgColor)}>
                                            <tool.icon className={cn("w-8 h-8", tool.color)} />
                                        </div>
                                        <div className="font-semibold">
                                            {tool.label}
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5"/>
                                </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default DashboardPage;