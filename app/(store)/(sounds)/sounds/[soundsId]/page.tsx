import type { Metadata, ResolvingMetadata } from 'next'
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

import { Preview } from '@/components/courses/preview';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Download, ExternalLink, Info, Tag, Calendar, User } from 'lucide-react';
import { SoundsPurchaseButton } from '@/components/sounds/SoundsIdPage/SoundsPurchaseButton';

interface PageProps {
  params: { 
    soundsId: string;
  }
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const sound = await db.sounds.findFirst({
    where: {
      OR: [
        { id: params.soundsId },
        { slug: params.soundsId }
      ]
    },
    include: {
      category: true
    }
  });

  if (!sound) {
    return {
      title: 'Sound Not Found | PausePlayRepeat',
      description: 'The requested sound pack could not be found. Browse our collection of other sound packs for music production.',
      alternates: {
        canonical: '/sounds',
      }
    }
  }

  const previousImages = (await parent).openGraph?.images || []
  const pricingType = (sound.price ?? 0) > 0 ? 'Paid' : 'Free';
  const priceInfo = (sound.price ?? 0) > 0 ? `Price: $${sound.price}` : 'Free Download';
  const categoryName = sound.category?.name || 'Audio';
 
  return {
    title: `${sound.name} — ${pricingType} ${categoryName} Sound Pack | PausePlayRepeat`,
    description: `${sound.description || `${sound.name} - Professional sound pack for music production`}. ${priceInfo}. Find more ${categoryName} sounds at PausePlayRepeat.`,
    keywords: [
      sound.name,
      categoryName,
      pricingType + ' sounds',
      'sound pack',
      'audio samples',
      'music production',
      sound.pricingType || '',
      'DAW tools'
    ].filter(Boolean),
    openGraph: {
      title: `${sound.name} — ${pricingType} ${categoryName} Sound Pack`,
      description: sound.description || `${sound.name} - Professional sound pack for music production`,
      type: 'website',
      images: [...(sound.image ? [{ 
        url: sound.image,
        alt: `${sound.name} - ${pricingType} Sound Pack`
      }] : []), ...previousImages],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${sound.name} — ${pricingType} ${categoryName} Sound Pack`,
      description: sound.description || `${sound.name} - Professional sound pack for music production`,
    },
    alternates: {
      canonical: '/sounds',
    }
  }
}

const SoundPage = async ({ params }: PageProps) => {
  const { userId } = auth();
  
  const sound = await db.sounds.findFirst({
    where: {
      OR: [
        { id: params.soundsId },
        { slug: params.soundsId }
      ]
    },
    include: {
      category: true
    }
  });

  if (!sound) {
    return redirect("/sounds");
  }

  const similarSounds = await db.sounds.findMany({
    where: {
      categoryId: sound.categoryId || undefined,
      NOT: { 
        OR: [
          { id: sound.id },
          { slug: sound.slug }
        ]
      }
    },
    take: 3,
    include: {
      category: true
    }
  });

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="py-6">
          <Link 
            href="/sounds" 
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            ← Back to Sounds
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-12">
          {/* Left Column - Image */}
          <div className="relative aspect-square bg-zinc-900 rounded-lg overflow-hidden">
            <Image 
              src={sound?.image || '/placeholder.svg'}
              alt={sound?.name || 'Sound Pack Image'}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Right Column - Sound Info */}
          <div className="space-y-8">
            {/* Header Info */}
            <div className="space-y-4">
              {sound.category && (
                <Badge variant="outline" className="bg-transparent border-zinc-700 text-zinc-400">
                  {sound.category.name}
                </Badge>
              )}
              <h1 className="text-3xl font-bold text-white">{sound.name}</h1>
              {sound.author && (
                <div className="flex items-center gap-2 text-zinc-400">
                  <User className="h-4 w-4" />
                  <span>By {sound.author}</span>
                </div>
              )}
            </div>

            {/* Sound Details Card */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="border-b border-zinc-800 pb-4">
                <h2 className="text-lg font-semibold text-white">Sound Pack Details</h2>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Tag className="h-4 w-4" />
                  <span>Type: {sound.pricingType}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Calendar className="h-4 w-4" />
                  <span>Added {formatDistanceToNow(new Date(sound.createdAt))} ago</span>
                </div>
                {sound.purchaseUrl && (
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-zinc-400" />
                    <a 
                      href={sound.purchaseUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Official Website
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <SoundsPurchaseButton 
                pluginId={sound.id}
                price={sound.price || 0}
                pricingType={sound.pricingType}
                optInFormUrl={sound.optInFormUrl || ''}
                purchaseUrl={sound.purchaseUrl || ''}
              />
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="py-12">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="border-b border-zinc-800">
              <h2 className="text-xl font-semibold text-white">About {sound.name}</h2>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none pt-6">
              <Preview value={sound?.description || ''} />
            </CardContent>
          </Card>
        </div>

        {/* Similar Sounds Section */}
        {similarSounds.length > 0 && (
          <div className="pb-12">
            <h2 className="text-xl font-semibold text-white mb-6">Similar Sound Packs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarSounds.map((ss) => (
                <Link href={`/sounds/${ss.slug}`} key={ss.id}>
                  <Card className="bg-zinc-900 border-zinc-800 h-full hover:bg-zinc-800/50 transition-colors">
                    <CardHeader className="space-y-3">
                      <div className="aspect-video relative rounded overflow-hidden bg-zinc-800">
                        <Image
                          src={ss.image || '/placeholder.svg'}
                          alt={ss.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-white line-clamp-1">{ss.name}</h3>
                        {ss.category && (
                          <Badge variant="outline" className="bg-transparent border-zinc-700 text-zinc-400 text-xs">
                            {ss.category.name}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-zinc-400 line-clamp-2">
                        {ss.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SoundPage;