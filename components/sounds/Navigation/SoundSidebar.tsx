import Link from "next/link"
// import { Button } from "../ui/button"
// import { Logo } from "./logo"

import { ArrowLeft } from "lucide-react"
import { SoundSidebarRoutes } from "./SoundSidebarRoutes"
import { cn } from "@/lib/utils"

interface SoundSidebarProps {
  className?: string;
}

export const SoundSidebar = ({
  className
}: SoundSidebarProps) => {
  return (
    <div className={cn(
      "h-full border-r flex flex-col overflow-y-auto shadow-sm",
      "bg-white dark:bg-zinc-900",
      className
    )}>
      <div className="p-6">
        <Link href="/sounds" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          <p className="text-xl font-bold">Sounds Library</p>
        </Link>
      </div>
      <div className="flex flex-col w-full">
        <SoundSidebarRoutes />
      </div>
    </div>
  )
}