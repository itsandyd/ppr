

import Container from "@/components/coaching/Container";
import ListingCard from "@/components/coaching/listings/ListingCard";
import ClientOnly from "@/components/coaching/ClientOnly";
import EmptyState from "@/components/coaching/EmptyState";
import getListings, { IListingsParams } from "@/actions/getListings";
import CoachingLandingHero from "@/components/coaching/(landing)/Hero";
import CoachingLandingSectionOne from "@/components/coaching/(landing)/SectionOne";
import Link from "next/link";
import Image from "next/image";

interface HomeProps {
  searchParams: IListingsParams;
};

const Home = async ({ searchParams }: HomeProps) => {
  // const listings = await getListings(searchParams);
  
  return (
    <section key="1" className="w-full py-12">
    <div className="container px-4 md:px-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
        <img
          alt="Hero"
          className="mx-auto aspect-video overflow-hidden rounded-xl object-bottom sm:w-full lg:order-last lg:aspect-square"
          height="550"
          src="/coachhero.jpg"
          width="550"
        />
        <div className="flex flex-col justify-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Discover the Joy of Sharing Your Gift
            </h1>
            <p className="max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400">
              You&apos;ve mastered the art of music production. Now, it&apos;s time to inspire others by becoming a coach.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-8 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 dark:focus-visible:ring-zinc-300"
              href="#"
            >
              Become a Coach
            </Link>
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus-visible:ring-zinc-300"
              href="#"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[400px_1fr] lg:gap-12 xl:grid-cols-[600px_1fr] mt-12">
        <Image
          alt="Testimonial"
          className="mx-auto aspect-video overflow-hidden rounded-xl object-bottom sm:w-full lg:aspect-square"
          height="550"
          src="/placeholder.svg"
          width="550"
        />
        <div className="flex flex-col justify-center space-y-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Hear from Successful Coach-Producers
            </h2>
            <p className="max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400">
              Our platform has helped countless music producers turn their passion into a rewarding coaching career.
              Hear their stories.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-8 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 dark:focus-visible:ring-zinc-300"
              href="#"
            >
              View Testimonials
            </Link>
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-200 border-zinc-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus-visible:ring-zinc-300"
              href="#"
            >
              Join Now
            </Link>
          </div>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[400px_1fr] lg:gap-12 xl:grid-cols-[600px_1fr] mt-12">
  <Image
    alt="Coaching Interactions"
    className="mx-auto aspect-video overflow-hidden rounded-xl object-bottom sm:w-full lg:aspect-square"
    height="550"
    src="/placeholder.svg"
    width="550"
  />
  <div className="flex flex-col justify-center space-y-4">
    <div className="space-y-2">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
        Deepen Your Skills Through Teaching
      </h2>
      <p className="max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400">
        Teaching is not just about imparting knowledge to others. It's also a powerful way to deepen your own understanding and skills. Experience the joy of learning while you teach.
      </p>
    </div>
    <div className="flex flex-col gap-2 min-[400px]:flex-row">
      <Link
        className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-8 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 dark:focus-visible:ring-zinc-300"
        href="#"
      >
        Start Teaching
      </Link>
      <Link
        className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus-visible:ring-zinc-300"
        href="#"
      >
        Learn More
      </Link>
    </div>
  </div>
</div>
{/* Third Section */}
<div className="grid gap-6 lg:grid-cols-[400px_1fr] lg:gap-12 xl:grid-cols-[600px_1fr] mt-12">
  <Image
    alt="Community of Coaches"
    className="mx-auto aspect-video overflow-hidden rounded-xl object-bottom sm:w-full lg:aspect-square"
    height="550"
    src="/placeholder.svg"
    width="550"
  />
  <div className="flex flex-col justify-center space-y-4">
    <div className="space-y-2">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
        Join a Supportive Community of Coaches
      </h2>
      <p className="max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400">
        Become part of a diverse and supportive community of coaches. Share your experiences, learn from others, and grow together.
      </p>
    </div>
    <Link
      className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-8 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 dark:focus-visible:ring-zinc-300"
      href="#"
    >
      Join Our Community
    </Link>
  </div>
</div>
{/* Fourth Section */}
<div className="grid gap-6 lg:grid-cols-[400px_1fr] lg:gap-12 xl:grid-cols-[600px_1fr] mt-12">
  <Image
    alt="Sign Up Instructions"
    className="mx-auto aspect-video overflow-hidden rounded-xl object-bottom sm:w-full lg:aspect-square"
    height="550"
    src="/placeholder.svg"
    width="550"
  />
  <div className="flex flex-col justify-center space-y-4">
    <div className="space-y-2">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
        Start Your Coaching Journey
      </h2>
      <p className="max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400">
        Signing up as a coach is easy. Follow our simple instructions and start your coaching journey today.
      </p>
    </div>
    <Link
      className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-8 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 dark:focus-visible:ring-zinc-300"
      href="#"
    >
      Sign Up Now
    </Link>
  </div>
</div>
{/* Footer */}
<footer className="w-full py-12 bg-gray-800 text-white">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold">Contact Us</h2>
    <p>123 Street, City, State, Country</p>
    <p>Email: info@example.com</p>
    <p>Phone: (123) 456-7890</p>
  </div>
</footer>

    </div>
  </section>
  )
}

export default Home;