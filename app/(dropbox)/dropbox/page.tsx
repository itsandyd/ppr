import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Cloud, Folder, Globe, Headphones, Lock, LockIcon, Music, Rewind, User } from "lucide-react";
import Link from "next/link";

export default function Home() {
    return (
        <main className="flex-1">
      <section className="w-full py-12">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Unleash Your Creative Potential with Streamlined Music Storage
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Designed exclusively for music producers, PausePlayRepeat Storage simplifies your workflow with secure,
                  accessible, and efficient storage solutions.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link
                  className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                  href="#"
                >
                  Start Free Trial
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card">
              <Folder className="h-6 w-6 text-gray-600 dark:text-gray-200" />
              <h3 className="text-xl font-bold mt-4">Effortless Organization</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Easily categorize and access your tracks, samples, and projects.
              </p>
            </div>
            <div className="card">
              <Headphones className="h-6 w-6 text-gray-600 dark:text-gray-200" />
              <h3 className="text-xl font-bold mt-4">High-Quality Audio Support</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Store and retrieve your music without compromising on quality.
              </p>
            </div>
            <div className="card">
              <User className="h-6 w-6 text-gray-600 dark:text-gray-200" />
              <h3 className="text-xl font-bold mt-4">Collaboration Made Simple</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Share files with collaborators securely and instantly.
              </p>
            </div>
            <div className="card">
              <Globe className="h-6 w-6 text-gray-600 dark:text-gray-200" />
              <h3 className="text-xl font-bold mt-4">Anywhere Access</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Get to your files from any device, at any time, ensuring your creative process is uninterrupted.
              </p>
            </div>
            <div className="card">
              <LockIcon className="h-6 w-6 text-gray-600 dark:text-gray-200" />
              <h3 className="text-xl font-bold mt-4">Safe and Secure</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Advanced encryption to keep your creative work protected.
              </p>
            </div>
            <div className="card">
              <Rewind className="h-6 w-6 text-gray-600 dark:text-gray-200" />
              <h3 className="text-xl font-bold mt-4">Automatic Version Control</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Keep track of changes with automatic version backups. Never lose progress on your tracks again, and easily revert to previous versions when needed.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Start your free trial today and experience a revolution in music production storage.
            </h2>
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
              href="#"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>
      </main>
    )
}