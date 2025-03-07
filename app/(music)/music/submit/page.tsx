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
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white flex">
      <SidebarNav />
      <main className="flex-1">
        <SiteHeader />
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Submit Your Music</h1>
            <p className="text-gray-500 dark:text-gray-400">Share your music with the community</p>
          </div>
          <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
            <SubmitMusicForm />
          </div>
        </div>
      </main>
    </div>
  );
} 