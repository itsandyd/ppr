import { LandingNavbar } from "@/components/landing/landing-navbar"
import { Button } from "@/components/ui/button"
import { SelectValue, SelectTrigger, SelectLabel, SelectItem, SelectGroup, SelectContent, Select } from "@/components/ui/select"
import Image from "next/image"
import Link from "next/link"

const plugins = [
    {
      id: 1,
      name: "Span",
      author: "Voxengo",
      description: "SPAN is a free real-time “fast Fourier transform” audio spectrum analyzer AAX, AudioUnit, and VST plugin for professional sound and music production applications. SPAN provides you with a very flexible “mode” system which you can use to setup your spectrum analyzer preferences.  You may specify Fourier block size in samples, FFT window overlap percentage, spectrum's visual slope.  Beside that you can choose to display secondary spectrum of a desired type (e.g. real-time maximum, all-time maximum).  Spectrum can be smoothed out visually for an easier examination. SPAN supports multi-channel analysis, and can be set to display spectrums from two different channels or channel groups at the same time.  Spectrum's color can be chosen to taste. SPAN also features output level metering with adjustable ballistics and integration time, EBU R128, K-system metering (including calibration K-system metering).  SPAN displays level metering statistics, headroom estimation, and true peak clipping detection.  Correlation metering is available as well.",
      image: "/span.png",
      href: "https://www.voxengo.com/product/span/"
    },
    {
      id: 1,
      name: "Pancake",
      author: "Cableguys",
      description: "PanCake is a free plugin for most flexible panning modulations. You can construct your own modulation curves. They can be easily drawn using soft or hard control points, thus producing gentle transitions or sharp bends in the waveform. PanCake's LFO can be beat-synced to your DAW, from a fast 1/128 note modulation up to 32 bars. It can also be set free-running from 0.02 Hz to 5.24 kHz, and can be triggered vie MIDI. A precise display of channel left/right volume provides helpful visual control. ",
      image: "/pancake.png",
      href: "https://www.cableguys.com/pancake"
    },
    {
      id: 1,
      name: "UREQ",
      author: "Analog Obsession",
      description: "U-Style Stripped Down Classic Equalizer!",
      image: "/UREQ.png",
      href: "https://www.patreon.com/posts/88488633"
    },
    {
      id: 1,
      name: "PreBOX",
      author: "Analog Obsession",
      description: "A multi preamp simulator.",
      image: "/prebox.png",
      href: "https://www.patreon.com/posts/prebox-68682105"
    },
    {
      id: 1,
      name: "Krush",
      author: "Tritik",
      description: "With its bit crushing and downsampling algorithms, Krush combines the crispy taste of the digital realm with the warmth of its drive stage and analog modeled resonant filters. A modulation section allows you to quickly add extra life to the sound by modulating any parameter. The sound palette produced by Krush ranges from the dirtiest digital effects to crunchy modulated colours, with all the classic and weirdest bit-crushing effects in between.",
      image: "/krush.png",
      href: "https://www.tritik.com/product/krush/"
    },
    {
      id: 1,
      name: "Echorus",
      author: "Tritik",
      description: "Echorus is built around 4 original chorus algorithms, an Echo section, and a couple of analog-modeled high-pass and low-pass filters. The 4 chorus modes (retro, multi, detune, random) provide a wide range of chorusing effects. They make Echorus versatile and suitable for any type of sound sources, and whether you want a subtle, thick, dark, cheesy, or more experimental chorus sound, Echorus has got you covered. Echorus also has an echo section including delay time and feedback gain controls. This allows you to re-inject the output signal within the chorus, expanding further more the possibilities. You can use this feedback loop with some short delay times to strengthen the chorus effect, get some flanging tones or create pitched resonances. Longer delay lines bring more classical delay effects, but with the particularity that your sound will pass through the chorus processor at each echo. Set up a sensible echo delay time and increase the feedback gain… and you will end up with big washy ambiences. Adjust it to more moderate settings, and you have the perfect tool for enhancing and enriching pads, keys and guitars.",
      image: "/echorus.png",
      href: "https://www.tritik.com/product/echorus/"
    },
    {
      id: 1,
      name: "Vital",
      author: "Matt Tytel",
      description: "Vital is a free spectral warping wavetable synth created by Matt Tytel that has quickly established itself as a serious rival to Serum. Featuring both free and pro versions, this VST provides producers and sound designers all the tools needed to make powerful, modern sounds right inside of the synth.",
      image: "/vital.png",
      href: "https://vital.audio/"
    },
    {
      id: 1,
      name: "SnareBuzz",
      author: "Wavesfactory",
      description: "SnareBuzz is a a free audio plugin that simulates the sympathetic resonances produced by the wires of a snare drum when another sound source is playing near. Use it as a psycho-acoustic effect to bring realism and life to your tracks.",
      image: "/snarebuzz.png",
      href: "https://www.wavesfactory.com/free-audio-plugins/snarebuzz/"
    },
    {
      id: 1,
      name: "Loudness Meter",
      author: "Youlean",
      description: "Youlean Loudness Meter helps you find the true perceived loudness of your audio and prepares it for TV or streaming services release.",
      image: "/youleanloudnessmeter.png",
      href: "https://youlean.co/youlean-loudness-meter/"
    },
    {
      id: 1,
      name: "Vinyl",
      author: "iZotope",
      description: "iZotope's Vinyl plug-in is the ultimate LoFi effect for vintage audio vibes.",
      image: "/vinyl.png",
      href: "https://www.izotope.com/en/products/vinyl.html"
    },
]

export default function Component() {
  return (
    <>
    <LandingNavbar />
    <section className="container mx-auto px-4 md:px-6 py-8 grid grid-cols-[240px_1fr_300px] gap-10">
      <nav className="flex flex-col gap-4 items-start py-2">
        <Link href="/plugins">
        <h3 className="text-xl font-bold">Plugins</h3>
        </Link>
        <Link className="" href="/plugins/all">
          All Plugins
        </Link>
        <Link className="" href="#">
          New Releases
        </Link>
        <Link className="" href="#">
          Top Sellers
        </Link>
        <Link className="font-semibold" href="/plugins/free">
          Free Plugins
        </Link>
        <Link className="" href="#">
          My Library
        </Link>
      </nav>
     <div className="flex-grow">
  {/* <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-8">
    <h2 className="text-2xl font-bold mb-2">Try XFer Serum</h2>
    <p className="text-gray-600 dark:text-gray-400 mb-4">
      Experience the best audio plugins for your music production.
    </p>
    <Link href="/plugins">
        <Button variant="default">Try Now</Button>
    </Link>
  </div> */}
   <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-8">
    <h2 className="text-2xl font-bold mb-2">Free Plugins</h2>
    <p className="text-gray-600 dark:text-gray-400 mb-4">
      Browse our directory of the best free audio plugins for your music production, or add your own.
    </p>
    <Link href="/plugins/add">
        <Button variant="default">Add Your Own</Button>
    </Link>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Sort by Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Types</SelectLabel>
              <SelectItem value="utility">Utility</SelectItem>
              <SelectItem value="eq">EQ</SelectItem>
              <SelectItem value="reverb">Reverb</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {/* <Select>
          <SelectTrigger>
            <SelectValue placeholder="Sort by Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Price</SelectLabel>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Sort by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categories</SelectLabel>
              <SelectItem value="utility">Utility</SelectItem>
              <SelectItem value="eq">EQ</SelectItem>
              <SelectItem value="reverb">Reverb</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select> */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      {plugins.map((plugin) => (
  <Link href={plugin.href} key={plugin.id}>
    <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
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
        {/* <p className="text-gray-600 dark:text-gray-400 mb-2">{plugin.description}</p> */}
        <p className="text-gray-500 dark:text-gray-300">{plugin.author}</p>
      </div>
    </div>
  </Link>
))}
</div>
      </div>
    </section>
    </>
  )
}
