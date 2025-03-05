import type { Metadata, ResolvingMetadata } from 'next'
import { Filter } from "lucide-react";

import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SearchInput } from "./components/SearchInput";

import { SoundsList } from "@/components/sounds/SoundsList";
import { SoundHero } from './components/SoundHero';
import { SoundCategories } from './components/categories';
import { getSounds } from '@/actions/get-sounds';


interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
    typeId: string;
  }
};

export async function generateMetadata(
  { searchParams }: SearchPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const sounds = await getSounds({
    ...searchParams,
  });

  const previousImages = (await parent).openGraph?.images || []
 
  return {
    title: {
      default: 'PausePlayRepeat — Music Producer Sound Library',
      template: '%s | PausePlayRepeat',
    },
    description: "Discover free and paid sound packs, samples, and presets for music production.",
    keywords: ['sound packs', 'samples', 'presets', 'free sounds', 'paid sounds', 'music production', 'audio samples'],
    openGraph: {
      title: 'PausePlayRepeat — Music Producer Sound Library',
      description: "Discover free and paid sound packs, samples, and presets for music production.",
      type: 'website',
      images: previousImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'PausePlayRepeat — Music Producer Sound Library',
      description: "Discover free and paid sound packs, samples, and presets for music production.",
    },
    alternates: {
      canonical: '/sounds',
    }
  }
}

const SoundsPage = async ({
  searchParams
}: SearchPageProps) => {
  const sounds = await getSounds({
    ...searchParams,
  });

  const categories = await db.soundsCategory.findMany({
    orderBy: {
      name: "asc"
    },
  });

  if (!categories) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">No sounds found</h1>
          <p className="text-muted-foreground">Please try again later or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SoundHero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
          <SearchInput />
          <Button 
            variant="outline" 
            className="w-full md:w-auto bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Sound Categories Section */}
        <section className="space-y-6 mb-12">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight text-white">Sound Categories</h2>
          </div>
          <SoundCategories items={categories} />
        </section>

        <Separator className="my-8 bg-zinc-800" />

        {/* Sound List Section */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight text-white">Available Sounds</h2>
            <p className="text-zinc-400">
              {sounds.length} sound{sounds.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <SoundsList items={sounds} />
        </section>
      </div>
    </div>
  )
}

export default SoundsPage;