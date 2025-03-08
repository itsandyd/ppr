import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type React from "react" // Added import for React
import { ModeToggle } from "@/components/community/mode-toggle"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Free Music Production Resources, Samples & Tools | MusicGate",
  description: "Download free music production tools, samples, project files, and VST plugins for producers. High-quality resources for Ableton, FL Studio, Logic Pro and more.",
  keywords: "free music production resources, free samples, free VST plugins, music production tools, Ableton resources, FL Studio resources, free project files, music producer tools, free sound packs, music production freebies",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://app.pauseplayrepeat.com/freebies",
    title: "Free Music Production Resources, Samples & Tools | MusicGate",
    description: "Download free music production tools, samples, project files, and VST plugins for producers. High-quality resources for Ableton, FL Studio, Logic Pro and more.",
    siteName: "MusicGate",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Music Production Resources, Samples & Tools | MusicGate",
    description: "Download free music production tools, samples, project files, and VST plugins for producers. High-quality resources for Ableton, FL Studio, Logic Pro and more.",
  },
  alternates: {
    canonical: "https://app.pauseplayrepeat.com/freebies"
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground min-h-screen theme-transition`}>
        <header className="border-b border-border theme-transition">
          <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">
              MusicGate
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/freebies/resources">Resources</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/freebies/create-resource">Create Resource</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/freebies/leads">View Leads</Link>
              </Button>
              <ModeToggle />
            </div>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="border-t border-border mt-12 py-6 text-center text-muted-foreground theme-transition">
          <div className="container mx-auto px-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Free Music Production Resources</h3>
              <p className="text-sm">
                MusicGate offers free high-quality resources for music producers including samples, 
                project files, VST plugins, presets, and tutorials for all major DAWs.
              </p>
            </div>
            <p>© 2025 MusicGate. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}

