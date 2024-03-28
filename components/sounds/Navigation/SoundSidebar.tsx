import Link from "next/link"
// import { Button } from "../ui/button"
// import { Logo } from "./logo"

import { ArrowLeft } from "lucide-react"
import { SoundSidebarRoutes } from "./SoundSidebarRoutes"


export const SoundSidebar = () => {
  return (
    // border-r
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-6">
        <Link href="/sounds">
            <p className="text-2xl font-bold flex items-center">Sounds</p>
        </Link>
      </div>
      <div className="flex flex-col w-full">
        <SoundSidebarRoutes />
      </div>
    </div>
  )
}