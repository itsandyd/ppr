import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CardHeader, CardContent, Card } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import Image from "next/image"


export const TrackListing = async () => {

    const songs = await db.sharedTrack.findMany();

    if (!songs) {
        return null;
    }

  return (
    <main className="container mx-auto p-4 md:p-6">
      <section className="mb-8">
        <h2 className="text-3xl font-bold tracking-tighter mb-4 md:text-4xl">Premium Sponsored Songs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {songs.map(track => (
 <Card key={track.id}>
<div className="flex items-center justify-center mt-6">
  <Image src={track.albumImage} height="300" width="300" alt="image"/>
</div>
 <CardHeader>
   <div className="flex flex-col items-center gap-4">
     <h3 className="font-semibold">{track.trackName}</h3>
     <p className="text-gray-500">{track.artistName}</p>
     <Badge>PREMIUM</Badge>
   </div>
 </CardHeader>
 <CardContent className="w-full">
   <Button className="w-full"><Link href={track.trackUrl}>Listen Now</Link></Button>
 </CardContent>
</Card>
))}
        </div>
      </section>
      <section>
        <h2 className="text-3xl font-bold tracking-tighter mb-4 md:text-4xl">Submitted Songs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {songs.map(track => (
  <Card key={track.id}>
    <CardHeader>
      <div className="flex items-center gap-4">
        <Image src={track.albumImage} height="100" width="100" alt="image"/>
        <div>
          <h3 className="font-semibold">{track.trackName}</h3>
          <p className="text-gray-500">{track.artistName}</p>
        </div>
        <Badge>PREMIUM</Badge>
      </div>
    </CardHeader>
    <CardContent>
    <Button><Link href={track.trackUrl}>Listen Now</Link></Button>
    </CardContent>
  </Card>
))}
        </div>
      </section>
      <div className="flex justify-center mt-8">
        <Button variant="outline">Want to boost your music?</Button>
      </div>
    </main>
  )
}

