import TypewriterComponent from "typewriter-effect";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Server } from "@prisma/client";
import { db } from "@/lib/db";

interface ServerLandingHeroProps {
  serverId: string;
}

export const ServerLandingHero = async ({
  serverId,
}: ServerLandingHeroProps) => {

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    // include: {
    //   channels: {
    //     orderBy: {
    //       createdAt: "asc",
    //     },
    //   },
    //   members: {
    //     include: {
    //       profile: true,
    //     },
    //     orderBy: {
    //       role: "asc",
    //     }
    //   }
    // }
  });
  // const { isSignedIn } = useAuth();

  return (
    <div className="text-white font-bold py-36 text-center space-y-5">
      <div className="text-sm md:text-xl font-light text-zinc-400">
        Welcome to
      </div>
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold">
        {server?.name}
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          {/* <TypewriterComponent
            options={{
              strings: [
                "Pause",
                "Play",
                "Repeat",
              ],
              autoStart: true,
              loop: true,
            }}
          /> */}
        </div>
      </div>
      <div>
        {/* <Link href={isSignedIn ? "/community" : "/sign-up"}>
          <Button variant="default" className="md:text-lg p-4 md:p-6 rounded-full font-semibold">
                Get Started
          </Button>
        </Link> */}
      </div>
      <div className="text-zinc-400 text-xs md:text-sm font-normal">
      </div>
    </div>
  );
};