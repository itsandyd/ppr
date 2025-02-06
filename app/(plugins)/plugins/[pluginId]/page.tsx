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
import { Skeleton } from "@/components/ui/skeleton";

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

export function PluginPageSkeleton() {
  return (
    <div className="pt-12 max-w-4xl mx-auto">
      <Skeleton className="h-[400px] w-full rounded-lg" />
      <div className="mt-6 space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
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

  return (
    <div className="pt-12 max-w-4xl mx-auto px-4">
      <div className='pt-12'>
        <div className="group pt-12 transition overflow-hidden border rounded-lg p-3 mx-auto max-w-4xl">
          <div className="flex justify-center items-center p-4">
            <Image 
              src={plugin?.image || 'placeholder.svg'}
              alt={plugin?.name || 'Plugin Name'}
              width={500}
              height={500}
              className="object-cover rounded-md"
            />
          </div>
          <div className="flex flex-col pt-2">
            <div className="p-4 flex flex-col md:flex-row items-center justify-between">
              <h2 className="text-lg md:text-base font-bold mb-2">{plugin?.name}</h2>
              <PluginPurchaseButton 
                pluginId={plugin.id}
                price={plugin.price || 0}
                pricingType={plugin.pricingType}
                optInFormUrl={plugin.optInFormUrl || ''}
                purchaseUrl={plugin.purchaseUrl || ''}
              />
              {plugin.userId && <PluginEditButton pluginId={plugin.id} />}
            </div>
            <Separator />
            <div>
              <Preview value={plugin?.description!}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PluginPage;