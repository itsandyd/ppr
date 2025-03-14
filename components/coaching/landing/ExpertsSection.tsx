'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";
import Link from "next/link";

export default function ExpertsSection() {
  return (
    <section className="py-20 border-b border-border">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div className="relative h-[350px] rounded-xl overflow-hidden">
          <Image src="/placeholder.svg" alt="Industry experts" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-background/70 to-transparent"></div>
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Learn From Those Who&apos;ve Done It</h2>
          <p className="text-muted-foreground">
            Your coach might be the Grammy-nominated producer behind your favorite track, the label owner who could
            sign your next release, or the festival headliner who knows exactly what makes crowds move. They&apos;ll
            share insider techniques they&apos;ve never revealed in tutorials—secrets that took them years to discover
            but will take you minutes to learn.
          </p>
          <Button variant="outline" className="group" asChild>
            <Link href="/coaching/browse">
              Explore Our Coaches
              <Award className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
} 