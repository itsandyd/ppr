import { SidebarNav } from "@/components/music/sidebar-nav"
import { SiteHeader } from "@/components/music/site-header"
import { SongDetails } from "@/components/music/song-details"


// This would typically come from your database
const songs = [
  {
    id: 1,
    title: "Midnight Dreams",
    artist: "Luna Wave",
    album: "Nocturnal Echoes",
    duration: "3:45",
    image: "/placeholder.svg?height=400&width=400",
  },
  // ... other songs ...
]

export default function SongPage({ params }: { params: { id: string } }) {
  const song = songs.find((s) => s.id === Number.parseInt(params.id))

  if (!song) {
    return <div>Song not found</div>
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
            <SongDetails {...song} />
          </div>
        </div>
      </main>
    </div>
  )
}

