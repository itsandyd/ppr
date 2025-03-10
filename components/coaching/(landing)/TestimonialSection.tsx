import Link from "next/link";
import Image from "next/image";

const TestimonialSection = () => {
  return (
    <div className="grid gap-6 lg:grid-cols-[400px_1fr] lg:gap-12 xl:grid-cols-[600px_1fr] mt-12">
      <Image
        alt="Student Success Story"
        className="mx-auto aspect-video overflow-hidden rounded-xl object-bottom sm:w-full lg:aspect-square"
        height="550"
        src="/placeholder.svg"
        width="550"
      />
      <div className="flex flex-col justify-center space-y-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
            Student Success Stories
          </h2>
          <p className="max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400">
            Our students have gone from bedroom producers to releasing tracks on major labels, performing at festivals, and building sustainable careers in music. Discover how personalized coaching can accelerate your progress.
          </p>
        </div>
        <div className="flex flex-col gap-2 min-[400px]:flex-row">
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-8 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 dark:focus-visible:ring-zinc-300"
            href="#testimonials"
          >
            Read Testimonials
          </Link>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus-visible:ring-zinc-300"
            href="/coaching/browse"
          >
            Browse Coaches
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection; 