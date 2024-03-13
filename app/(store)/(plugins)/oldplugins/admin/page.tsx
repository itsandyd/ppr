"use client"

import { useState, useEffect } from 'react';
import { LandingNavbar } from "@/components/landing/landing-navbar"
import { Button } from "@/components/ui/button"
import { SelectValue, SelectTrigger, SelectLabel, SelectItem, SelectGroup, SelectContent, Select } from "@/components/ui/select"
import Image from "next/image"
import Link from "next/link"
import AddPluginModal from '@/components/plugins/modals/AddPluginModal';

const plugins = [
    {
      id: 1,
      name: "Span",
      author: "Voxengo",
      description: "SPAN is a free real-time “fast Fourier transform” audio spectrum analyzer AAX, AudioUnit, and VST plugin for professional sound and music production applications. SPAN provides you with a very flexible “mode” system which you can use to setup your spectrum analyzer preferences.  You may specify Fourier block size in samples, FFT window overlap percentage, spectrum's visual slope.  Beside that you can choose to display secondary spectrum of a desired type (e.g. real-time maximum, all-time maximum).  Spectrum can be smoothed out visually for an easier examination. SPAN supports multi-channel analysis, and can be set to display spectrums from two different channels or channel groups at the same time.  Spectrum's color can be chosen to taste. SPAN also features output level metering with adjustable ballistics and integration time, EBU R128, K-system metering (including calibration K-system metering).  SPAN displays level metering statistics, headroom estimation, and true peak clipping detection.  Correlation metering is available as well.",
      image: "/placeholder.svg",
    },
]

export default function Admin() {

    const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
    <LandingNavbar />
    <section className="container mx-auto px-4 md:px-6 py-8 grid grid-cols-[240px_1fr_300px] gap-10">
      <nav className="flex flex-col gap-4 items-start py-2">
        <Link href="/plugins">
        <h3 className="text-xl font-bold">Plugins</h3>
        </Link>
        <Link className="font-semibold" href="/plugins/all">
          All Plugins
        </Link>
        <Link className="font-semibold" href="#">
          New Releases
        </Link>
        <Link className="font-semibold" href="#">
          Top Sellers
        </Link>
        <Link className="font-semibold" href="/plugins/free">
          Free Plugins
        </Link>
        <Link className="font-semibold" href="#">
          My Library
        </Link>
      </nav>
     <div className="flex-grow">
  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-8">
    <h2 className="text-2xl font-bold mb-2">Manage Plugins</h2>
    <p className="text-gray-600 dark:text-gray-400 mb-4">
      Add, edit, or delete plugins.
    </p>
    <Button variant="default" onClick={() => setIsModalOpen(true)}>
        Add New Plugin
      </Button>
  </div>
  {isModalOpen && <AddPluginModal onClose={() => setIsModalOpen(false)} />}
  <div className="grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
  {plugins.map((plugin) => (
    <div key={plugin.id} className="rounded-lg overflow-hidden shadow-lg">
      <Image
        alt={plugin.name}
        height="200"
        src={plugin.image}
        style={{
          aspectRatio: "200/200",
          objectFit: "cover",
        }}
        width="200"
      />
      <div className="p-4 bg-white dark:bg-gray-800">
        <h3 className="font-semibold text-lg mb-2">{plugin.name}</h3>
        <p className="text-gray-500 dark:text-gray-300">{plugin.author}</p>
        <Link href={`/plugins/${plugin.id}/edit`}>
          <Button variant="default">Edit</Button>
        </Link>
        <Button variant="default">Delete</Button>
      </div>
    </div>
  ))}
</div>
      </div>
    </section>
    </>
  )
    }