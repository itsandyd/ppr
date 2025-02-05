"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Music } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PLATFORMS = {
  SPOTIFY: {
    name: "Spotify",
    pattern: /^(?:https:\/\/open\.spotify\.com\/track\/|spotify:track:)([a-zA-Z0-9]+)(.*)$/,
    example: "https://open.spotify.com/track/..."
  },
  YOUTUBE: {
    name: "YouTube",
    pattern: /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
    example: "https://youtube.com/watch?v=... or https://youtu.be/..."
  },
  SOUNDCLOUD: {
    name: "SoundCloud",
    pattern: /^(?:https?:\/\/)?(?:www\.)?soundcloud\.com\/.+$/,
    example: "https://soundcloud.com/..."
  }
};

export const SubmitMusicForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    platform: "" as keyof typeof PLATFORMS | "",
    url: "",
  });

  const validateUrl = (url: string, platform: keyof typeof PLATFORMS) => {
    const platformData = PLATFORMS[platform];
    if (!platformData.pattern.test(url)) {
      throw new Error(`Invalid ${platformData.name} URL format. Example: ${platformData.example}`);
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { title, author, platform, url } = formData;

      if (!title || !author || !platform || !url) {
        throw new Error("Please fill in all required fields");
      }

      // Validate URL format
      validateUrl(url, platform as keyof typeof PLATFORMS);

      // Create the song entry
      const response = await fetch("/api/music/songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          author,
          platform,
          url,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create song");
      }

      toast({
        title: "Success!",
        description: "Your song has been submitted successfully.",
      });

      router.push("/music/songs");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Song Title</Label>
          <Input
            id="title"
            placeholder="Enter song title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            disabled={loading}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="author">Artist Name</Label>
          <Input
            id="author"
            placeholder="Enter artist name"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            disabled={loading}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Platform</Label>
          <Select
            value={formData.platform}
            onValueChange={(value: keyof typeof PLATFORMS) => 
              setFormData({ ...formData, platform: value })
            }
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a platform" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PLATFORMS).map(([key, { name }]) => (
                <SelectItem key={key} value={key}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="url">Song URL</Label>
          <Input
            id="url"
            placeholder={formData.platform ? PLATFORMS[formData.platform as keyof typeof PLATFORMS].example : "Select a platform first"}
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            disabled={loading || !formData.platform}
            required
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={loading}
        >
          <Music className="h-4 w-4 mr-2" />
          {loading ? "Submitting..." : "Submit Song"}
        </Button>
      </form>
    </Card>
  );
}; 