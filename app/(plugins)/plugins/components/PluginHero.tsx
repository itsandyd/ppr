"use client";

import TypewriterComponent from "typewriter-effect";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export const PluginHero = () => {
  const { isSignedIn } = useAuth();

  return (
    <div className="font-bold p-6 text-center space-y-2">
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-2 font-extrabold">
      <h1 className="bg-gradient-to-r from-sky-300 to-pink-400 inline-block text-transparent bg-clip-text py-6">The Ultimate VST Plugin Resource
</h1>
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
      <div className="text-sm md:text-xl font-light">
      Whether you&apos;re a bedroom producer or seasoned pro, get instant access to an extensive library of quality free and paid VST plugins all in one place.

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