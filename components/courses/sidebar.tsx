import Link from "next/link"
import { Button } from "../ui/button"
import { Logo } from "./logo"
import { SidebarRoutes } from "./sidebar-routes"
import { ArrowLeft } from "lucide-react"

export const CourseDashboardSidebar = () => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      <div className="p-6">
        <Link href="/">
            <Logo />
        </Link>
      </div>
      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
    </div>
  )
}