import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type React from "react" // Added import for React

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MusicGate - Unlock Exclusive Production Resources",
  description: "Access premium music production tools and resources by following on social media",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white min-h-screen`}>
        <header className="border-b border-gray-800">
          <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-white">
              MusicGate
            </Link>
            <div className="space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/freebies/resources">Resources</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/freebies/create-resource">Create Resource</Link>
              </Button>
            </div>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="border-t border-gray-800 mt-12 py-6 text-center text-gray-400">
          © 2025 MusicGate. All rights reserved.
        </footer>
      </body>
    </html>
  )
}

