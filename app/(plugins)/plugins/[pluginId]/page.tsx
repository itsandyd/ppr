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
import { getPlugins } from '@/actions/get-plugins';
import { getPlugin } from '@/actions/get-plugin-by-id';
import Image from 'next/image';
import { PluginPurchaseButton } from './components/PluginPurchaseButton';
import { PluginEditButton } from './components/PluginEditButton';
import { PluginHero } from '../components/PluginHero';

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

  // >>> NEW: Fetch similar plugins from the same category <<<
  const similarPlugins = await db.plugin.findMany({
    where: {
      categoryId: plugin.categoryId || undefined,
      NOT: { id: plugin.id }
    },
    take: 4
  });
  // <<< NEW CODE ENDS >>>

  return (
    <>
      <div className="pt-12 max-w-4xl mx-auto px-4 min-h-screen bg-background text-foreground dark:bg-background dark:text-foreground transition-colors">
        <div className='pt-12'>
          <div className="group pt-12 transition overflow-hidden border rounded-lg mx-auto max-w-4xl bg-card text-card-foreground dark:bg-card dark:text-card-foreground shadow-xl">
            <div className="p-3">
              <div className="flex justify-center items-center p-4">
                <Image 
                  src={plugin?.image || 'placeholder.svg'}
                  alt={plugin?.name || 'Plugin Name'}
                  width={500}
                  height={500}
                  className="object-cover rounded-md shadow-lg"
                />
              </div>
              <div className="flex flex-col pt-2">
                <div className="p-4 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                  <h2 className="text-lg md:text-xl font-bold">{plugin?.name}</h2>
                  <PluginPurchaseButton 
                    pluginId={plugin.id}
                    price={plugin.price || 0}
                    pricingType={plugin.pricingType}
                    optInFormUrl={plugin.optInFormUrl || ''}
                    purchaseUrl={plugin.purchaseUrl || ''}
                  />
                  {plugin.userId && <PluginEditButton pluginId={plugin.id} />}
                </div>
                <Separator className="mt-2 mb-4" />
                <div className="px-4 pb-4">
                  <Preview value={plugin?.description!}/>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4">
            Similar {plugin.category?.name || 'Audio'} Plugins
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {similarPlugins.length === 0 && (
              <p>No similar plugins found.</p>
            )}
            {similarPlugins.map((sp) => (
              <div 
                key={sp.id} 
                className="border p-4 rounded-md shadow-sm transition hover:shadow-md hover:bg-secondary dark:hover:bg-secondary"
              >
                <h4 className="font-bold text-lg mb-1">{sp.name}</h4>
                <p className="text-sm mb-2">
                  {sp.description?.slice(0, 100)}...
                </p>
                <a 
                  href={`/plugins/${sp.slug}`} 
                  className="inline-block text-blue-500 hover:underline"
                >
                  View Details
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default PluginPage;