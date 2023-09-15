"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const testimonials = [
  {
    name: "Chatbot-Assisted Lyrics & Text Generation",
    // avatar: "J",
    // title: "Software Engineer",
    description: "Facing writer's block? PausePlayRepeat AI crafts lyrics and text that resonate with your music's essence. Say goodbye to blank pages and embrace endless inspiration.",
  },
  {
    name: "Instant Music Sample Creation",
    // avatar: "A",
    // title: "Designer",
    description: "Generate custom samples tailored to your style. Elevate your tracks with a world of sound at your fingertips.",
  },
  {
    name: "Dynamic Music Videos",
    // avatar: "M",
    // title: "CEO",
    description: "Illuminate your music! Our AI-driven tool creates entrancing music videos that pulse, shift, and groove in harmony with your beats. Stand out with visuals that leave a lasting impression.",
  },
  {
    name: "Stunning Album Artwork",
    // avatar: "M",
    // title: "CFO",
    description: "Make a statement from the first glance. Design album covers that encapsulate the soul of your music. With PausePlayRepeat AI, create covers that are as unforgettable as your melodies.",
  },
];

export const LandingContent = () => {
  return (
    <div className="px-10 pb-20">
      <h2 className="text-center text-4xl font-extrabold mb-10">Features</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {testimonials.map((item) => (
          <Card key={item.description} className="bg-[#192339] border-none text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-x-2">
                <div>
                  <p className="text-lg">{item.name}</p>
                  {/* <p className="text-zinc-400 text-sm">{item.title}</p> */}
                </div>
              </CardTitle>
              <CardContent className="pt-4 px-0">
                {item.description}
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}