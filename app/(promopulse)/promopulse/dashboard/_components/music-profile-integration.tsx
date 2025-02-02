import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function MusicProfileIntegration() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Music Profile Integration</CardTitle>
        <CardDescription>Connect your music platforms</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <Button variant="outline">Connect Spotify</Button>
          <Button variant="outline">Connect SoundCloud</Button>
          <Button variant="outline">Connect YouTube</Button>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">Connected profiles will appear here</p>
      </CardFooter>
    </Card>
  )
}

