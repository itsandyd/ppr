/**
 * v0 by Vercel.
 * @see https://v0.dev/t/VcFKJW3t1ld
 */
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"
import { UserButton } from "@clerk/nextjs"
import { Menu, Play, PlayCircle, Plus, Settings, Settings2 } from "lucide-react"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Component() {

    const sounds = [
        { name: 'Thunderous Clap', details: '0:04 sec | A# | 120 BPM' },
        { name: 'Velvet Bass Pulse', details: '0:07 sec | C# | 100 BPM' },
        { name: 'Ethereal Pad Swoosh', details: '0:09 sec | D# | 130 BPM' },
        { name: 'Retro Arcade Blip', details: '0:03 sec | F | 110 BPM' },
        { name: 'Crisp Hi-Hat Tick', details: '0:02 sec | G# | 140 BPM' },
        { name: 'Mystic Chime Twinkle', details: '0:06 sec | E | 95 BPM' },
        { name: 'Robotic Glitch Zap', details: '0:05 sec | B | 105 BPM' },
        { name: 'Laser Gun Reload', details: '0:03 sec | F# | 150 BPM' },
        { name: 'Oceanic Wave Crash', details: '0:08 sec | G | 85 BPM' },
        { name: 'Jungle Tom Roll', details: '0:04 sec | A | 115 BPM' },
        { name: 'Groovy Bass Slide', details: '0:07 sec | C | 125 BPM' },
        { name: 'Spacey Flute Echo', details: '0:09 sec | D | 90 BPM' },
        { name: 'Metallic Snare Snap', details: '0:03 sec | E# | 135 BPM' },
        { name: 'Hollow Wood Knock', details: '0:02 sec | G# | 95 BPM' },
        { name: 'Slinky Spring Boing', details: '0:06 sec | A# | 100 BPM' },
        { name: 'Vaporwave Synth Glide', details: '0:07 sec | B# | 128 BPM' },
        { name: 'Whimsical Harp Gliss', details: '0:05 sec | C# | 118 BPM' },
        { name: 'Deep Sub Drop', details: '0:04 sec | D# | 130 BPM' },
        { name: 'Electric Spark Fizz', details: '0:03 sec | F# | 145 BPM' },
        { name: 'Ghostly Whisper Loop', details: '0:09 sec | A | 80 BPM' }
      ];
      

  return (
    <section key="1" className="container mx-auto px-4 md:px-6">
      <header className="flex justify-between items-center py-6">
        <Link className="text-2xl font-bold" href="/">
          SoundLibrary
        </Link>
        <nav className="hidden lg:flex items-center space-x-4">
          {/* <Link
            className="text-lg text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            href="#"
          >
            Sounds
          </Link>
          <Link
            className="text-lg text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            href="#"
          >
            Skills
          </Link> */}
          {/* <Button className="ml-auto" variant="outline">
            Login
          </Button>
          <Button className="ml-4">Try free</Button> */}
          <UserButton />
        </nav>
      </header>
      <div className="mt-8 mb-4">
        <form>
          <Input
            className="w-full py-3 px-4 border border-zinc-300 rounded-lg text-lg dark:bg-zinc-800 dark:border-zinc-600"
            placeholder="Search sounds..."
            type="search"
          />
        </form>
      </div>
      {/* <div className="flex items-center justify-between mt-8 mb-8">
        <span className="text-lg">Showing 1-20 of 500 results</span>
        <div className="flex items-center space-x-2">
          <span className="text-sm">Sort by:</span>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Relevance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div> */}
       <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sound Name</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sounds.map((sound, index) => (
              <TableRow key={index}>
                <TableCell>
  <div className="flex items-center space-x-2">
    <Button size="icon" variant="ghost" className="mr-2">
      <PlayCircle className="w-6 h-6 text-black" />
    </Button>
    {sound.name}
  </div>
</TableCell>
                <TableCell>{sound.details}</TableCell>
                <TableCell>
                  <Button size="icon" variant="ghost">
                    <IconHeart className="w-6 h-6 text-black" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <Plus className="w-6 h-6 text-black" />
                  </Button>
                  <Button size="icon" variant="ghost">
                  <DropdownMenu>
                    
    <DropdownMenuTrigger>
    <Menu className="w-6 h-6 text-black" />
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>Sound Options</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>Add to your Library (1 credit)</DropdownMenuItem>
      <DropdownMenuItem>Add to likes</DropdownMenuItem>
      <DropdownMenuItem>View Pack</DropdownMenuItem>
      <DropdownMenuItem>Copy link</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}

function IconHeart(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}
