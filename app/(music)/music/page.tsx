
import { SidebarNav } from "@/components/music/sidebar-nav"
import { SiteHeader } from "@/components/music/site-header"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex">
      <SidebarNav />
      <main className="flex-1">
        <SiteHeader />
        <div
          className="relative min-h-[calc(100vh-88px)] flex items-center justify-center text-center px-4"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight">Elevate Your Music Journey</h1>
            <p className="text-xl text-zinc-300">
              Pauseplayrepeat is more than just a music app – it&apos;s a thriving community where artists and fans connect
              through the universal language of music.
            </p>
            <Button className="bg-[#BAE6FD] text-black hover:bg-[#93C5FD] rounded-full px-8 py-6 text-lg font-medium">
              View our Collection
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

