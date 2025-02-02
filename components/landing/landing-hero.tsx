"use client";

import TypewriterComponent from "typewriter-effect";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlayCircle } from "lucide-react";
import Image from "next/image";

export const LandingHero = () => {
  const { isSignedIn } = useAuth();

  return (
    <div className="relative pt-36 pb-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-8">
          {/* Main Heading */}
          <div>
            <Badge variant="secondary" className="mb-4">The Future of Music Production</Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-sky-300 to-pink-400 text-transparent bg-clip-text py-2">
              PausePlayRepeat
            </h1>
          </div>

          {/* Animated Subheading */}
          <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            <TypewriterComponent
              options={{
                strings: [
                  "Create Without Limits",
                  "Learn from the Best",
                  "Grow Your Audience",
                ],
                autoStart: true,
                loop: true,
                deleteSpeed: 50,
                delay: 50,
              }}
            />
          </div>

          {/* Value Proposition */}
          <div className="max-w-3xl mx-auto space-y-4">
            <p className="text-xl text-muted-foreground">
              The all-in-one platform for musicians to create, learn, promote, and succeed in the modern music industry.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-sky-400" />
                <span>AI-Powered Tools</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-purple-400" />
                <span>Expert Training</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-pink-400" />
                <span>Marketing Suite</span>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href={isSignedIn ? "/music" : "/sign-up"}>
              <Button size="lg" className="bg-gradient-to-r from-sky-300 to-pink-400 hover:opacity-90 rounded-full px-8">
                Start Creating Free
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="rounded-full px-8 gap-2">
              <PlayCircle className="w-5 h-5" /> Watch Demo
            </Button>
          </div>

          {/* Social Proof */}
          <p className="text-sm text-muted-foreground">
            Join 10,000+ musicians already creating with PausePlayRepeat
          </p>
        </div>

        {/* Hero Image */}
        <div className="mt-16 relative">
          <div className="aspect-video max-w-5xl mx-auto rounded-lg overflow-hidden border border-muted">
            <Image
              src="/hero-dashboard.jpg"
              alt="PausePlayRepeat Dashboard"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
};