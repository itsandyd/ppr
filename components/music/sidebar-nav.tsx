import Link from "next/link"
import { HomeIcon, LayoutGrid, Music2, ListMusic, Users2, Library, Plus } from "lucide-react"

export function SidebarNav() {
  return (
    <div className="w-60 min-h-screen bg-[#030303] text-zinc-400 p-6 flex flex-col gap-6">
      <Link href="/" className="flex items-center gap-4 text-zinc-200 hover:text-white">
        <HomeIcon className="w-6 h-6" />
        Home
      </Link>
      <Link href="/music/dashboard" className="flex items-center gap-4 hover:text-white">
        <LayoutGrid className="w-6 h-6" />
        Dashboard
      </Link>
      <Link href="/music/songs" className="flex items-center gap-4 hover:text-white">
        <Music2 className="w-6 h-6" />
        Songs
      </Link>
      <Link href="/music/playlists" className="flex items-center gap-4 hover:text-white">
        <ListMusic className="w-6 h-6" />
        Playlists
      </Link>
      <div className="mt-8">
        <div className="flex items-center gap-4 hover:text-white cursor-pointer group">
          <Library className="w-6 h-6" />
          Your Library
          <Plus className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  )
}

