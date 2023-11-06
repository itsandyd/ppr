import { LandingNavbar } from "@/components/landing/landing-navbar"
import { Button } from "@/components/ui/button"
import { SelectValue, SelectTrigger, SelectLabel, SelectItem, SelectGroup, SelectContent, Select } from "@/components/ui/select"
import Image from "next/image"
import Link from "next/link"

export default function Component() {
  return (
    <>
    <LandingNavbar />
    <section className="container mx-auto px-4 md:px-6 py-8 grid grid-cols-[240px_1fr_300px] gap-10">
      <nav className="flex flex-col gap-4 items-start py-2">
        <Link href="/plugins">
        <h3 className="text-xl font-bold">Plugins</h3>
        </Link>
        <Link className="font-semibold" href="/plugins/all">
          All Plugins
        </Link>
        <Link className="font-semibold" href="#">
          New Releases
        </Link>
        <Link className="font-semibold" href="#">
          Top Sellers
        </Link>
        <Link className="font-semibold" href="/plugins/free">
          Free Plugins
        </Link>
        <Link className="font-semibold" href="#">
          My Library
        </Link>
      </nav>
     <div className="flex-grow">
  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-8">
    <h2 className="text-2xl font-bold mb-2">Try XFer Serum</h2>
    <p className="text-gray-600 dark:text-gray-400 mb-4">
      Experience the best audio plugins for your music production.
    </p>
    <Link href="/plugins">
        <Button variant="default">Try Now</Button>
    </Link>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Sort by Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Types</SelectLabel>
              <SelectItem value="utility">Utility</SelectItem>
              <SelectItem value="eq">EQ</SelectItem>
              <SelectItem value="reverb">Reverb</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Sort by Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Price</SelectLabel>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Sort by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categories</SelectLabel>
              <SelectItem value="utility">Utility</SelectItem>
              <SelectItem value="eq">EQ</SelectItem>
              <SelectItem value="reverb">Reverb</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        <div className="rounded-lg overflow-hidden shadow-lg">
          <Image
            alt="Plugin 1"
            height="200"
            src="/placeholder.svg"
            style={{
              aspectRatio: "200/200",
              objectFit: "cover",
            }}
            width="200"
          />
          <div className="p-4 bg-white dark:bg-gray-800">
            <h3 className="font-semibold text-lg mb-2">Plugin 1</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2">Category Type</p>
            <p className="text-gray-500 dark:text-gray-300">Developer Name</p>
          </div>
        </div>
        <div className="rounded-lg overflow-hidden shadow-lg">
          <Image
            alt="Plugin 2"
            height="200"
            src="/placeholder.svg"
            style={{
              aspectRatio: "200/200",
              objectFit: "cover",
            }}
            width="200"
          />
          <div className="p-4 bg-white dark:bg-gray-800">
            <h3 className="font-semibold text-lg mb-2">Plugin 2</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2">Category Type</p>
            <p className="text-gray-500 dark:text-gray-300">Developer Name</p>
          </div>
        </div>
      </div>
      </div>
    </section>
    </>
  )
}
