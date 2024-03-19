import Link from "next/link"
// import { Button } from "../ui/button"
// import { Logo } from "./logo"

import { ArrowLeft } from "lucide-react"
import { ProfileSidebarRoutes } from "./ProfileSidebarRoutes"

export const ProfileSidebar = () => {
  return (
    // border-r
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-6">
        <Link href="/">
            <p className="text-2xl font-bold flex items-center">Profile</p>
        </Link>
      </div>
      <div className="flex flex-col w-full">
        <ProfileSidebarRoutes />
      </div>
    </div>
  )
}