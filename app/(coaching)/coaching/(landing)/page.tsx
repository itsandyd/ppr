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
  const listings = await getListings(searchParams);
  
  return (
    <section key="1" className="w-full py-12">
    <div className="container px-4 md:px-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
        <Image
          alt="Hero"
          className="mx-auto aspect-video overflow-hidden rounded-xl object-bottom sm:w-full lg:order-last lg:aspect-square"
          height="550"
          src="/coachhero.jpg"
          width="550"
        />
        <div className="flex flex-col justify-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Transform Your Expertise Into Inspiration
            </h1>
            <p className="max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400">
              Your journey as a music producer has given you unique insights and skills. Now, share that brilliance and empower the next generation of artists while building a rewarding coaching career.
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
              className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus-visible:ring-zinc-300"
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
              Success Stories That Inspire
            </h2>
            <p className="max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400">
              From bedroom producers to industry mentors, our coaches have transformed their careers while helping others achieve their musical dreams. Discover how they&apos;re making an impact—and how you can too.
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
              className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus-visible:ring-zinc-300"
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
        Master Your Craft Through Teaching
      </h2>
      <p className="max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400">
        The most profound way to deepen your own expertise? Share it with others. As you guide students through their creative journey, you&apos;ll discover new perspectives, refine your techniques, and evolve as both a producer and mentor.
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
        className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus-visible:ring-zinc-300"
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
        Connect With a Global Coaching Community
      </h2>
      <p className="max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400">
        Join a vibrant network of passionate music production coaches from around the world. Exchange ideas, collaborate on teaching methods, access exclusive resources, and build meaningful relationships that elevate your coaching practice.
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
        Begin Your Coaching Journey Today
      </h2>
      <p className="max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400">
        Getting started is seamless. Create your profile, showcase your expertise, set your availability, and connect with eager students worldwide. Our platform handles the logistics so you can focus on what matters most—sharing your musical knowledge.
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

{/* Discord Section */}
<div className="mt-12 p-6 bg-indigo-50 rounded-xl border border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800/30">
  <div className="flex flex-col md:flex-row items-center gap-6">
    <div className="flex-shrink-0">
      <Image
        alt="Discord Logo"
        className="w-16 h-16 md:w-24 md:h-24"
        height="96"
        width="96"
        src="/discord-logo.svg"
        onError={(e) => {
          // Fallback if image doesn't exist
          e.currentTarget.src = "/placeholder.svg";
        }}
      />
    </div>
    <div className="flex-grow">
      <h2 className="text-2xl font-bold mb-2 text-indigo-900 dark:text-indigo-200">Coaching Sessions via Discord</h2>
      <p className="text-indigo-700 dark:text-indigo-300 mb-4">
        All coaching sessions are conducted through Discord, the leading platform for audio and video communication. When booking a session, you&apos;ll be prompted to add your Discord username to your profile if you haven&apos;t already.
      </p>
      <div className="flex flex-wrap gap-4">
        <Link
          className="inline-flex h-10 items-center justify-center rounded-md bg-indigo-600 px-6 text-sm font-medium text-white shadow transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
          href="https://discord.com/register"
          target="_blank"
          rel="noopener noreferrer"
        >
          Create Discord Account
        </Link>
        <Link
          className="inline-flex h-10 items-center justify-center rounded-md border border-indigo-200 bg-white px-6 text-sm font-medium text-indigo-700 shadow-sm transition-colors hover:bg-indigo-50 hover:text-indigo-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 dark:hover:bg-indigo-900 dark:hover:text-indigo-200"
          href="/user-profile"
        >
          Update Your Profile
        </Link>
      </div>
    </div>
  </div>
</div>
{/* Footer */}
<footer className="w-full py-12 bg-gray-800 text-white">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold">Ready to Transform Lives Through Music?</h2>
    <p className="mt-4 mb-6">Contact our coach support team to learn more about opportunities and resources</p>
    <p>Email: coaches@example.com</p>
    <p>Phone: (123) 456-7890</p>
    <p className="mt-4">© 2023 Music Production Coaching Platform. All rights reserved.</p>
  </div>
</footer>

    </div>
  </section>
  )
}

export default Home;