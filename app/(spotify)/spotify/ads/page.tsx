import { MusicNavbar } from "@/components/music/MusicNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Youtube } from "lucide-react";
import Link from "next/link";
import { BsSpotify } from "react-icons/bs";
import { MdEmail } from "react-icons/md";


const CampaignGoal = () => {
  const goals = [
    {
      icon: BsSpotify,
      title: 'Grow my Spotify track',
      description: 'Get more listeners and streams for your track with AI-powered music ads on Instagram and Facebook.',
      link: "/spotify/ads/create/spotify-growth-track"
    },
    {
      icon: BsSpotify,
      title: 'Grow my Spotify playlist',
      description: 'Get more fans, listeners, and streams for your playlist and the music on it, utilizing AI-powered music ads on Instagram and Facebook.',
    },
    {
      icon: BsSpotify,
      title: 'Grow my Spotify artist profile',
      description: 'Enhance your artist profile by getting more fans, listeners, and streams with AI-powered music ads on Instagram and Facebook.',
    },
    {
      icon: BsSpotify,
      title: 'Grow my Spotify pre-saves',
      description: 'Get more pre-saves for your playlist with AI-powered music ads on Instagram and Facebook.',
    },
    {
      icon: Youtube,
      title: 'Grow my YouTube video.',
      description: 'Get more views for your YouTube video with AI-powered video ads on YouTube.',
    },
    {
      icon: MdEmail,
      title: 'Grow my fan emails.',
      description: 'Get more fan emails with AI-powered music ads on Instagram and Facebook.',
    },
    // ... add other goals here
  ];

  return (
    <>
    <MusicNavbar />
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Select your campaign goal</h1>

      {goals.map((goal, index) => (
        <Card key={index} className="mt-4 mb-4">
          <CardHeader>
            <div className="flex items-center">
              <goal.icon className="mr-2" />  {/* This line is added to display the icon */}
              <CardTitle>{goal.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>{goal.description}</CardContent>
          <CardFooter>
          <Link href={goal.link || "#"} passHref>
              <Button variant="default">
                SELECT
              </Button>
            </Link>
            {/* <Link href="/path/to/how-it-works" className="text-blue-500 underline">
              see how it works here
            </Link> */}
          </CardFooter>
        </Card>
      ))}

      <div className="mt-4">
        <Button variant="secondary">
          GO BACK
        </Button>
      </div>
    </div>
    </>
  );
};

export default CampaignGoal;