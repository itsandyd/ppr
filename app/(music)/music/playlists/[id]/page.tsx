
import { SidebarNav } from "@/components/music/sidebar-nav"
import { SiteHeader } from "@/components/music/site-header"
import { PlaylistDetails } from "@/components/music/playlist-details"

// This would typically come from your database
const playlists = [
  {
    id: 1,
    title: "Chill Vibes",
    creator: "MoodMaster",
    description: "Relax and unwind with these smooth tracks.",
    songCount: 25,
    image: "/placeholder.svg?height=400&width=400",
    songs: [
      { id: 1, title: "Calm Waters", artist: "Ocean Sounds", duration: "3:45" },
      { id: 2, title: "Gentle Breeze", artist: "Nature's Whisper", duration: "4:20" },
      { id: 3, title: "Sunset Serenade", artist: "Twilight Ensemble", duration: "3:55" },
      // ... more songs ...
    ],
  },
  // ... other playlists ...
]

export default function PlaylistPage({ params }: { params: { id: string } }) {
  const playlist = playlists.find((p) => p.id === Number.parseInt(params.id))

  if (!playlist) {
    return <div>Playlist not found</div>
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <SidebarNav />
      <main className="flex-1">
        <SiteHeader />
        <div className="p-6">
          <PlaylistDetails {...playlist} />
        </div>
      </main>
    </div>
  )
}

