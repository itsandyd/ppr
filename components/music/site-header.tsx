import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between p-6">
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" className="rounded-full bg-black/50 text-white hover:bg-black/70">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full bg-black/50 text-white hover:bg-black/70">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" className="text-zinc-200 hover:text-white">
          Sign up
        </Button>
        <Button className="bg-white text-black hover:bg-zinc-100 rounded-full px-6">Login</Button>
      </div>
    </header>
  )
}

