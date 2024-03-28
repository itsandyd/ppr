
import { LandingNavbar } from '@/components/landing/landing-navbar'
import { ClerkProvider } from '@clerk/nextjs'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
      <main className="h-full">
        {/* <LandingNavbar /> */}
          {children}
      </main>
  )
}

export default layout