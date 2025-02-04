"use client";

import { Companion } from "@prisma/client"
import Image from "next/image"
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import Link from "next/link"
import { MessageSquare, History, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface CompanionsProps {
    data: (Companion & {
        _count: {
            messages: number;
        }
    })[];
}

export const Companions = ({
    data,
}: CompanionsProps) => {
    const router = useRouter();

    if (data.length === 0) {
        return (
            <div className="pt-10 flex flex-col items-center justify-center space-y-3"> 
                <div className="relative w-60 h-60">
                    <Image
                        fill
                        className="grayscale"
                        src="/empty.png"
                        alt="Empty"
                    />
                </div>
                <p className="text-sm text-muted-foreground">No companions found.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 pb-10">
            {data.map((item) => (
                <Card
                    key={item.id}
                    className="bg-primary/10 rounded-xl cursor-pointer hover:opacity-75 transition border-0"
                    onClick={() => router.push(`/ai/companion/${item.id}/history`)}
                >
                    <CardHeader className="flex items-center justify-center text-center text-muted-foreground">
                        <div className="relative w-32 h-32">
                            <Image
                                src={item.src}
                                fill
                                alt={item.name}
                                className="rounded-xl object-cover"
                            />
                        </div>
                        <p className="font-bold">
                            {item.name}
                        </p>
                        <p className="text-xs">
                            {item.description}
                        </p>
                    </CardHeader>
                    <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-x-2">
                            <div className="flex items-center">
                                <MessageSquare className="w-3 h-3 mr-1" />
                                {item._count.messages}
                            </div>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/ai/companion/chat/${item.id}`);
                                }}
                            >
                                <MessageCircle className="w-4 h-4" />
                            </Button>
                        </div>
                        <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/ai/companion/${item.id}/history`);
                            }}
                        >
                            <History className="w-4 h-4" />
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}