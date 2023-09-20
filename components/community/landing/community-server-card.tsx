"use client"

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";

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

    const { onOpen } = useModal();

    return (
      <Card>
        <CardHeader>
          <CardTitle>{server.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <Image src={server.imageUrl} alt={server.name} width={200} height={200}/>
        </CardContent>
        <CardFooter>
          <Button 
            className="py-2 px-4 flex bg-blue-500 font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            onClick={() => router.push(`/community/servers/${server.id}`)}>
            Go to Server
          </Button>
          <Button 
            className="py-2 px-4 flex bg-blue-500 font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            onClick={() => router.push(`${origin}/community/invite/${server.inviteCode}`)}>
            Join Server
          </Button>
        </CardFooter>
      </Card>
    );
  };