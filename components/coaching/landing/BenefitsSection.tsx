'use client';

import { Button } from "@/components/ui/button";
import { CheckCircle, Users } from "lucide-react";

export default function BenefitsSection() {
  return (
    <section className="py-20 border-b border-border bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Transform Your Music With Expert Guidance</h2>
          <p className="text-muted-foreground text-lg">
            Our students don&apos;t just improve—they breakthrough. Here&apos;s what personalized coaching can do for you:
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">Identify & Fix Your Blind Spots</h3>
                <p className="text-muted-foreground">
                  Get honest, professional feedback on what&apos;s holding your tracks back—things you might never notice
                  on your own.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">Learn Industry Secrets</h3>
                <p className="text-muted-foreground">
                  Discover techniques that top producers use but never share in tutorials—the real difference
                  between amateur and professional sound.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-2">Build Industry Connections</h3>
                <p className="text-muted-foreground">
                  Work with coaches who have real industry connections and can open doors once your music reaches
                  professional quality.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card p-8 rounded-xl border border-border">
            <h3 className="text-2xl font-bold mb-6">Success Stories</h3>

            <div className="space-y-6">
              <div className="pb-6 border-b border-border">
                <p className="italic text-card-foreground mb-4">
                  &quot;After 6 months of trying to get signed, my coach identified critical issues in my mixdown. Three
                  sessions later, my track was signed to Anjunabeats.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full"></div>
                  <div>
                    <p className="font-medium">Alex K.</p>
                    <p className="text-sm text-muted-foreground">Trance Producer</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="italic text-card-foreground mb-4">
                  &quot;My coach showed me arrangement techniques that immediately made my tracks sound more
                  professional. Within weeks I landed my first Spotify editorial playlist.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full"></div>
                  <div>
                    <p className="font-medium">Sarah M.</p>
                    <p className="text-sm text-muted-foreground">Future Bass Producer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xl font-medium text-primary mb-4">
            94% of our students report breakthrough moments within their first month
          </p>
          <Button size="lg" className="group">
            See All Success Stories
            <Users className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
} 