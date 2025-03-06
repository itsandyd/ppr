import type { Metadata, ResolvingMetadata } from 'next'
import { getChapter } from '@/actions/get-chapter';
import { Banner } from '@/components/courses/banner';
import { CourseCard } from '@/components/courses/course-card';
import { CourseNavbar } from '@/components/courses/navbar';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import react from 'react';

import { Separator } from '@/components/ui/separator';
import { Preview } from '@/components/courses/preview';

import { getPlugin } from '@/actions/get-plugin-by-id';
import Image from 'next/image';
import { PluginPurchaseButton } from './components/PluginPurchaseButton';
import { PluginEditButton } from './components/PluginEditButton';
import { PluginHero } from '../components/PluginHero';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Download, ExternalLink, Info, Tag, Calendar, User } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface PageProps {
  params: { 
    pluginId: string;
  }
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const plugin = await db.plugin.findFirst({
    where: {
      OR: [
        { id: params.pluginId },
        { slug: params.pluginId }
      ]
    },
    include: {
      pluginType: true
    }
  });

  if (!plugin) {
    return {
      title: 'Plugin Not Found | PausePlayRepeat',
      description: 'The requested VST plugin could not be found. Browse our collection of other audio plugins for music production.',
      alternates: {
        canonical: '/plugins',
      }
    }
  }

  const previousImages = (await parent).openGraph?.images || []
  const pluginType = (plugin.price ?? 0) > 0 ? 'Paid' : 'Free';
  const priceInfo = (plugin.price ?? 0) > 0 ? `Price: $${plugin.price}` : 'Free Download';

  // Get category name from categoryId
  const category = plugin.categoryId ? await db.pluginCategory.findUnique({
    where: { id: plugin.categoryId }
  }) : null;
  const categoryName = category?.name || 'Audio';
 
  return {
    title: `${plugin.name} — ${pluginType} ${categoryName} Plugin | PausePlayRepeat`,
    description: `${plugin.description || `${plugin.name} - Professional audio plugin for music production`}. ${priceInfo}. Find more ${categoryName} plugins at PausePlayRepeat.`,
    keywords: [
      plugin.name,
      categoryName,
      pluginType + ' plugin',
      'VST plugin',
      'audio production',
      'music production',
      plugin.pricingType || '',
      'DAW tools'
    ].filter(Boolean),
    openGraph: {
      title: `${plugin.name} — ${pluginType} ${categoryName} Plugin`,
      description: plugin.description || `${plugin.name} - Professional audio plugin for music production`,
      type: 'website',
      images: [...(plugin.image ? [{ 
        url: plugin.image,
        alt: `${plugin.name} - ${pluginType} VST Plugin`
      }] : []), ...previousImages],
      url: `/plugins/${plugin.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${plugin.name} — ${pluginType} ${categoryName} Plugin`,
      description: plugin.description || `${plugin.name} - Professional audio plugin for music production`,
    },
    alternates: {
      canonical: `/plugins/${plugin.slug}`,
    }
  }
}

const PluginPage = async ({ params }: PageProps) => {
  const plugin = await db.plugin.findFirst({
    where: {
      OR: [
        { id: params.pluginId },
        { slug: params.pluginId }
      ]
    },
    include: {
      pluginType: true,
      category: true
    }
  });

  if (!plugin) {
    return redirect("/plugins");
  }

  const similarPlugins = await db.plugin.findMany({
    where: {
      categoryId: plugin.categoryId || undefined,
      NOT: { id: plugin.id }
    },
    take: 3,
    include: {
      category: true,
      pluginType: true
    }
  });

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="pt-6 pb-6">
          <Link 
            href="/plugins" 
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            ← Back to Plugins
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-12">
          {/* Left Column - Image */}
          <div className="relative aspect-square bg-zinc-900 rounded-lg overflow-hidden">
            <Image 
              src={plugin?.image || '/placeholder.svg'}
              alt={plugin?.name || 'Plugin Image'}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Right Column - Plugin Info */}
          <div className="space-y-8">
            {/* Header Info */}
            <div className="space-y-4">
              {plugin.category && (
                <Badge variant="outline" className="bg-transparent border-zinc-700 text-zinc-400">
                  {plugin.category.name}
                </Badge>
              )}
              <h1 className="text-3xl font-bold text-white">{plugin.name}</h1>
              {plugin.author && (
                <div className="flex items-center gap-2 text-zinc-400">
                  <User className="h-4 w-4" />
                  <span>By {plugin.author}</span>
                </div>
              )}
            </div>

            {/* Plugin Details Card */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="border-b border-zinc-800 pb-4">
                <h2 className="text-lg font-semibold text-white">Plugin Details</h2>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Tag className="h-4 w-4" />
                  <span>Type: {plugin.pricingType}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Calendar className="h-4 w-4" />
                  <span>Added {formatDistanceToNow(new Date(plugin.createdAt))} ago</span>
                </div>
                {plugin.purchaseUrl && (
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-zinc-400" />
                    <a 
                      href={plugin.purchaseUrl} 
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
              <PluginPurchaseButton 
                pluginId={plugin.id}
                price={plugin.price || 0}
                pricingType={plugin.pricingType}
                optInFormUrl={plugin.optInFormUrl || ''}
                purchaseUrl={plugin.purchaseUrl || ''}
              />
              {plugin.userId && <PluginEditButton pluginId={plugin.id} />}
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="py-12">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="border-b border-zinc-800">
              <h2 className="text-xl font-semibold text-white">About {plugin.name}</h2>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none pt-6">
              <Preview value={plugin?.description || ''} />
            </CardContent>
          </Card>
        </div>

        {/* Similar Plugins Section */}
        {similarPlugins.length > 0 && (
          <div className="pb-12">
            <h2 className="text-xl font-semibold text-white mb-6">Similar Plugins</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarPlugins.map((sp) => (
                <Link href={`/plugins/${sp.slug}`} key={sp.id}>
                  <Card className="bg-zinc-900 border-zinc-800 h-full hover:bg-zinc-800/50 transition-colors">
                    <CardHeader className="space-y-3">
                      <div className="aspect-video relative rounded overflow-hidden bg-zinc-800">
                        <Image
                          src={sp.image || '/placeholder.svg'}
                          alt={sp.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-white line-clamp-1">{sp.name}</h3>
                        {sp.category && (
                          <Badge variant="outline" className="bg-transparent border-zinc-700 text-zinc-400 text-xs">
                            {sp.category.name}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-zinc-400 line-clamp-2">
                        {sp.description}
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

export default PluginPage;