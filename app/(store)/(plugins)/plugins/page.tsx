import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const plugins = [
  {
    id: 1,
    name: "Xfer Serum",
    description: "Xfer Serum is a cutting-edge wavetable synthesizer known for its high-quality sound and incredible flexibility. With its detailed wavetable editor, users can create unique sounds with ease. Serum offers a variety of filters, effects, and deep modulation capabilities, making it a favorite among producers and sound designers.",
    image: "/serum.png",
  },
  {
    id: 2,
    name: "Sylenth1",
    description: "Sylenth1 is a virtual analog VSTi synthesizer that takes the definitions of quality and performance to a higher level. Until now, very few software synthesizers have been able to stand up to the sound quality standards of hardware synths. Sylenth1 is designed to perform and provides a wide array of sounds with its subtractive synth design.",
    image: "/sylenth.png",
  },
  // {
  //   id: 3,
  //   name: "FabFilter Pro-Q 3",
  //   description: "FabFilter Pro-Q 3 is a comprehensive EQ plugin with a modern intuitive interface, providing high-quality linear phase operation along with the zero latency and unique Natural Phase modes. It features up to 24 bands and a gorgeous spectrum analyzer for precise visual feedback based on the music you're working on.",
  //   image: "/placeholder.svg",
  // },
  {
    id: 4,
    name: "Massive X",
    description: "Massive X is a sonic monster – the ultimate synth for basses and leads. The virtual-analog concept belies the contemporary, cutting-edge sound it generates. The high-end engine delivers pure quality, lending an undeniable virtue and character to even the most saturated of sounds.",
    image: "/massivex.png",
  },
  {
    id: 5,
    name: "Omnisphere",
    description: "Omnisphere is the flagship synthesizer of Spectrasonics – an instrument of extraordinary power and versatility. It brings together a wide variety of synthesis types, from granular synthesis to wave table, and includes a massive library of unique sounds, making it one of the most comprehensive synthesizers available.",
    image: "/placeholder.svg",
  },
  {
    id: 6,
    name: "Nexus",
    description: "Nexus is a ROM synthesizer-plugin that delivers a level of sonic quality unsurpassed by even the highest-end hardware. Euphoric leads, glowing keys, otherworldly pads... Nexus does it all.",
    image: "/placeholder.svg",
  },
  {
    id: 7,
    name: "Diva",
    description: "Diva captures the spirit of various analog synthesizers, bringing the diversity of their sound to a modern digital environment. The oscillators, filters, and envelopes closely model components found in some of the greatest monophonic and polyphonic synthesizers of yesteryear.",
    image: "/placeholder.svg",
  },
    {
    id: 8,
    name: "Emvoice",
    description: "Emvoice One is a vocal synthesizer plugin (VST/AU) that generates vocal lines from scratch. Simply type lyrics, enter notes for each syllable, and hyper-realistic vocals are generated within your DAW on the spot. Create glissando and vibrato patterns with note editing.",
    image: "/placeholder.svg",
  },
];


const topPlugins = [
  {
    id: 5,
    name: "Omnisphere",
    description: "Omnisphere is the flagship synthesizer of Spectrasonics – an instrument of extraordinary power and versatility. It brings together a wide variety of synthesis types, from granular synthesis to wave table, and includes a massive library of unique sounds, making it one of the most comprehensive synthesizers available.",
    image: "/placeholder.svg",
  },
  {
    id: 7,
    name: "Diva",
    description: "Diva captures the spirit of various analog synthesizers, bringing the diversity of their sound to a modern digital environment. The oscillators, filters, and envelopes closely model components found in some of the greatest monophonic and polyphonic synthesizers of yesteryear.",
    image: "/placeholder.svg",
  },
  // Add more top plugins as needed
];

const featuredPlugin = plugins[0];

export default function Component() {
  return (
    <>
    <LandingNavbar />
      <section className="container mx-auto px-4 md:px-6 py-8 grid grid-cols-1 md:grid-cols-[240px_1fr_300px] gap-10">
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
      <main className="grid gap-6">
      <div className="rounded-lg overflow-hidden shadow-md">
      <AspectRatio ratio={400 / 200}>
  <Image
    alt={featuredPlugin.name}
    src={featuredPlugin.image}
    className="rounded-lg object-cover w-full h-full"
    fill
  />
</AspectRatio>
  <div className="p-4">
    <h2 className="text-2xl font-bold">{featuredPlugin.name}</h2>
    <p className="text-zinc-500 dark:text-zinc-400">{featuredPlugin.description}</p>
    <Button className="mt-4" variant="default">
      Start Free Trial
    </Button>
  </div>
</div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
          <div className="relative group">
            <Link className="absolute inset-0 z-10" href="#">
              <span className="sr-only">View Plugin</span>
            </Link>
            <div className="grid grid-cols-2 gap-4">
  {plugins.map((plugin) => (
    <Card key={plugin.id}>
      <CardHeader>
        <Image
          alt={plugin.name}
          className="rounded-lg object-cover w-full aspect-square hover:opacity-50 transition-opacity"
          height="100"
          src={plugin.image}
          width="100"
        />
      </CardHeader>
      <CardContent>
        <CardTitle>{plugin.name}</CardTitle>
        <small className="text-sm leading-none text-zinc-500 dark:text-zinc-400">{plugin.description}</small>
      </CardContent>
    </Card>
  ))}
</div>
</div>
        </div>
      </main>
      <aside className="gap-6">
  <div>
    <h3 className="text-xl font-bold mb-2">Top Plugins This Week</h3>
    <ol className="list-decimal list-inside">
      {topPlugins.map((plugin) => (
        <li key={plugin.id}>{plugin.name}</li>
      ))}
    </ol>
  </div>
  {/* <div>
    <h3 className="text-xl font-bold mb-2">Top Presets This Week</h3>
    <ol className="list-decimal list-inside">
      {topPresets.map((preset) => (
        <li key={preset.id}>{preset.name}</li>
      ))}
    </ol>
  </div> */}
</aside>
    </section>
    </>
  )
}