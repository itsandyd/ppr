import Link from "next/link";
import Image from "next/image";

const PlatformSection = () => {
  return (
    <div className="mt-12 p-6 bg-indigo-50 rounded-xl border border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800/30">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-shrink-0">
          <Image
            alt="Discord Logo"
            className="w-16 h-16 md:w-24 md:h-24"
            height="96"
            width="96"
            src="/discord-logo.svg"
            unoptimized
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
  );
};

export default PlatformSection; 