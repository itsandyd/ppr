import Link from "next/link"
import { HomeIcon, LayoutGrid, Music2, ListMusic, Library, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarNavProps {
  isMobile?: boolean;
}

export function SidebarNav({ isMobile = false }: SidebarNavProps) {
  return (
    <div className={cn(
      isMobile ? 'w-full' : 'w-[250px]',
      'min-h-screen p-6 flex flex-col gap-6',
      'bg-gray-50 dark:bg-[#030303]',
      'border-r border-gray-200 dark:border-gray-800',
      'text-gray-700 dark:text-zinc-400',
      !isMobile && 'hidden md:flex'
    )}>
      <Link href="/" className="flex items-center gap-4 text-gray-900 dark:text-zinc-200 hover:text-black dark:hover:text-white">
        <HomeIcon className="w-6 h-6" />
        Home
      </Link>
      <Link href="/music/dashboard" className="flex items-center gap-4 hover:text-black dark:hover:text-white">
        <LayoutGrid className="w-6 h-6" />
        Dashboard
      </Link>
      <Link href="/music/songs" className="flex items-center gap-4 hover:text-black dark:hover:text-white">
        <Music2 className="w-6 h-6" />
        Songs
      </Link>
      <Link href="/music/playlists" className="flex items-center gap-4 hover:text-black dark:hover:text-white">
        <ListMusic className="w-6 h-6" />
        Playlists
      </Link>
      <div className="mt-8">
        <div className="flex items-center gap-4 hover:text-black dark:hover:text-white cursor-pointer group">
          <Library className="w-6 h-6" />
          Your Library
          <Plus className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  )
}

