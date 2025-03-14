'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="py-20 border-b border-border bg-gradient-to-br from-muted/50 to-background">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          {/* <div className="inline-block bg-primary/20 border border-primary/30 rounded-full px-4 py-1 text-sm font-medium text-primary mb-2">
            As featured in Billboard & Electronic Musician
          </div> */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Why Do Your Tracks Still Sound <span className="text-primary">Amateur</span>?
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg">
            You&apos;ve watched countless tutorials. You&apos;ve spent thousands on gear. Yet your music still doesn&apos;t sound
            like the pros. The missing piece? Personalized guidance from someone who&apos;s already succeeded.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="group" asChild>
              <Link href="/coaching/browse">
                Discover The Difference
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="relative h-[400px] rounded-xl overflow-hidden">
          <Image
            src="/coachhero.jpg"
            alt="Music producer in studio"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent mix-blend-overlay"></div>
        </div>
      </div>
    </section>
  );
} 