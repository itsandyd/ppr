"use client"

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import Link from "next/link";

interface ServerCardProps {
    server: {
        id: string;
        name: string;
        imageUrl: string;
        inviteCode: string;
    }
}

export const ServerCard = ({ server }: ServerCardProps) => {

  const router = useRouter();

    return (
        <Card className="bg-primary/10 rounded-xl cursor-pointer transition border-0">
            <Link href={`/community/servers/${server.id}`}>
                <CardHeader className="flex items-center justify-center text-center text-muted-foreground">
                    <div className="relative w-32 h-32">
                        <Image fill src={server.imageUrl} alt={server.name} className="rounded-xl object-cover" />
                    </div>
                    <p className="font-bold">{server.name}</p>
                </CardHeader>
            </Link>
            <CardFooter className="flex flex-col items-center justify-between text-xs text-muted-foreground">
                <Button 
                    variant="ghost"
                    onClick={() => router.push(`/community/servers/${server.id}`)}>
                    Go to Server
                </Button>
                <Button 
                    variant="default"
                    onClick={() => router.push(`${origin}/community/invite/${server.inviteCode}`)}>
                    Join Server
                </Button>
            </CardFooter>
        </Card>
    );
};