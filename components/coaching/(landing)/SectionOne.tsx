/**
 * v0 by Vercel.
 * @see https://v0.dev/t/ChycLdmReBv
 */
import Image from "next/image"
import Link from "next/link"

export default function CoachingLandingSectionOne() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex flex-col items-center space-y-4 text-center md:text-left">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Introduction to Music Production Coaching
            </h1>
            <p className="mx-auto max-w-[700px] text-zinc-500 md:text-xl dark:text-zinc-400">
              As an experienced music producer, youve honed your craft to perfection. Now, imagine the satisfaction of
              empowering a new generation of artists, passing on your knowledge and wisdom, and witnessing their growth.
              Welcome to the rewarding world of Music Production Coaching.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start space-y-4">
            <Image
              alt="Music producer at work"
              className="rounded-lg shadow-lg"
              height="300"
              src="/placeholder.svg"
              style={{
                aspectRatio: "450/300",
                objectFit: "cover",
              }}
              width="450"
            />
            <blockquote className="border-l-4 border-zinc-900 pl-4 max-w-[400px] text-zinc-500 dark:text-zinc-400">
              <p>
                Coaching has been a game changer for me. Its rewarding to see my students grow and succeed in their music careers.
              </p>
              <cite className="text-right block mt-2 text-zinc-600 dark:text-zinc-500">
                - Successful Music Producer
              </cite>
            </blockquote>
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <Link
            className="inline-flex h-9 items-center justify-center rounded-md bg-zinc-900 px-6 py-2 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 dark:focus-visible:ring-zinc-300"
            href="#"
          >
            Start Coaching Journey
          </Link>
        </div>
      </div>
    </section>
  )
}

