import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { SiteHeader } from "@/components/music/site-header";
import { SidebarNav } from "@/components/music/sidebar-nav";
import { SubmitMusicForm } from "@/components/music/submit-music-form";

export default async function SubmitMusicPage() {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <SidebarNav />
      <main className="flex-1">
        <SiteHeader />
        <div className="p-6">
          <div
            className="rounded-xl p-8 mb-8"
            style={{
              background: "linear-gradient(to bottom, rgba(176, 216, 243, 0.2) 0%, rgba(0,0,0,1) 100%)",
            }}
          >
            <h1 className="text-3xl font-bold mb-2">Submit Your Music</h1>
            <p className="text-zinc-400 mb-4">Share your music with the community</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <SubmitMusicForm />
          </div>
        </div>
      </main>
    </div>
  );
} 