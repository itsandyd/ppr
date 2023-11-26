/**
 * v0 by Vercel.
 * @see https://v0.dev/t/0QrKb3NICia
 */
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Component() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-6xl font-semibold text-gray-800 dark:text-gray-200">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">We couldnt find the page you were looking for.</p>
      </div>
      <Button className="mt-4" variant="outline">
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  )
}

