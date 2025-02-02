import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SignInButton, SignUpButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
// import { MobileMenu } from '@/components/mobile-menu'

export default async function LandingPage() {
  const { userId } = auth();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <MusicIcon className="h-6 w-6" />
          <span className="sr-only">Promo Pulse</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <div className="hidden md:flex gap-4 sm:gap-6">
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
              Features
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="/pricing">
              Pricing
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
              About
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
              Contact
            </Link>
          </div>
          <div className="hidden md:flex gap-4">
            {userId ? (
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button>Sign Up</Button>
                </SignUpButton>
              </>
            )}
          </div>
          {/* <MobileMenu userId={userId} /> */}
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Connecting Independent Artists with Top Promoters & Curators
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Discover, Share, and Grow Together. The platform where artists find opportunity, and promoters find great music.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild>
                  <Link href="/signup">Start Promoting</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/discover">Discover New Tracks</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>For Artists</CardTitle>
                  <CardDescription>Get Your Music Heard by the Right People</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4" />
                      Easily pitch your latest tracks to YouTube curators, label A&Rs, and music blogs
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4" />
                      Track who listens, clicks, and engages with your music
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4" />
                      Save time with AI-powered tools that help you craft the perfect pitch
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>For Promoters & Curators</CardTitle>
                  <CardDescription>Discover Fresh Tracks That Match Your Audience</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4" />
                      Easily find high-quality music submissions tailored to your platform&apos;s genre and style
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4" />
                      Curate playlists, YouTube content, and blog posts with trending new music from rising artists
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4" />
                      Simplify submissions – all music links, bios, and assets in one place
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Promoters Meet Artists. Artists Meet Opportunity.</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Artists submit music that&apos;s ready to be heard. Promoters access personalized submissions tailored to their audience. Everyone wins.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <CardTitle>For Artists</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4" />
                      Targeted Outreach: Send campaigns directly to promoters who fit your music style
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4" />
                      Professional Templates: Impress with well-crafted, professional email pitches
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4" />
                      Performance Analytics: Know which promoters listen, open, and click on your links
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>For Promoters</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4" />
                      Curated Submissions: Receive music that matches your content and audience
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4" />
                      Simplified Review Process: Streamlined submissions with all assets in one place
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4" />
                      Discover New Talent: Easily find rising artists to feature, share, or sign
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Testimonials</CardTitle>
                </CardHeader>
                <CardContent>
                  <blockquote className="space-y-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                    &quot;I got my song featured on a major YouTube channel thanks to Promo Pulse!&quot;
                    </p>
                    <footer className="text-sm">- Independent Artist</footer>
                  </blockquote>
                  <blockquote className="space-y-2 mt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                    &quot;Found an amazing track that blew up my channel. Promo Pulse is a game-changer!&quot;
                    </p>
                    <footer className="text-sm">- Music Curator</footer>
                  </blockquote>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Promo Pulse. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

function CheckIcon(props: any) {
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
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function MusicIcon(props: any) {
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
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  )
}

