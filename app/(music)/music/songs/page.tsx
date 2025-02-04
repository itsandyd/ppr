
import { MusicGrid } from "@/components/music/music-grid"
import { SiteHeader } from "@/components/music/site-header"
import { SidebarNav } from "@/components/music/sidebar-nav"

export default function MusicPage() {
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
            <h1 className="text-3xl font-bold">Discover New Music</h1>
          </div>

          <MusicGrid />
        </div>
      </main>
    </div>
  )
}

