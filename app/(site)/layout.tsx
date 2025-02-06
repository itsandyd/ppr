import { LandingNavbar } from '@/components/landing/landing-navbar'
import { ClerkProvider } from '@clerk/nextjs'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-full">
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm">
        <LandingNavbar />
      </nav>
      <div className="pt-[72px]">
        {children}
      </div>
    </main>
  )
}

export default layout