'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/20 to-muted border-b border-border">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Music?</h2>
          <p className="text-lg text-foreground/80 mb-8">
            Take the first step toward professional-sounding tracks with personalized coaching from industry
            experts.
          </p>

          <div className="bg-card/80 p-8 rounded-xl border border-border mb-8">
            <h3 className="text-2xl font-bold mb-4">How It Works</h3>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="space-y-2">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mb-2">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h4 className="font-bold">Choose Your Coach</h4>
                <p className="text-muted-foreground text-sm">
                  Browse profiles and find the perfect match for your genre and goals
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mb-2">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h4 className="font-bold">Book Your Session</h4>
                <p className="text-muted-foreground text-sm">
                  Select a time that works for you and share your tracks in advance
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mb-2">
                  <span className="text-primary font-bold">3</span>
                </div>
                <h4 className="font-bold">Transform Your Sound</h4>
                <p className="text-muted-foreground text-sm">
                  Get personalized feedback and actionable techniques to level up
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <Button size="lg" className="group mb-3 px-8 py-6 text-lg" asChild>
              <Link href="/coaching/browse">
                Start Your Journey Today
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <p className="text-primary text-sm">
              100% Satisfaction Guarantee: Love your first session or it&apos;s free
            </p>
            <p className="text-muted-foreground text-sm mt-4">Limited spots available with our top coaches this month</p>
          </div>
        </div>
      </div>
    </section>
  );
} 