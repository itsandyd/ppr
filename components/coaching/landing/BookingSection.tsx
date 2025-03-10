import Link from "next/link";
import Image from "next/image";

const BookingSection = () => {
  return (
    <div className="grid gap-6 lg:grid-cols-[400px_1fr] lg:gap-12 xl:grid-cols-[600px_1fr] mt-12">
      <Image
        alt="Booking Interface Preview"
        className="mx-auto aspect-video overflow-hidden rounded-xl object-bottom sm:w-full lg:aspect-square"
        height="550"
        src="/placeholder.svg"
        width="550"
      />
      <div className="flex flex-col justify-center space-y-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
            Seamless Booking Experience
          </h2>
          <p className="max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400">
            Our intuitive booking platform lets you choose your preferred date, select from available time slots, and instantly see pricing. View coach statistics including session count and student ratings to make informed decisions before scheduling.
          </p>
        </div>
        <div className="flex flex-col gap-2 min-[400px]:flex-row">
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-8 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 dark:focus-visible:ring-zinc-300"
            href="/coaching/browse"
          >
            Try It Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingSection; 