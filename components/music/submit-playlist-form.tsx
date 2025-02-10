"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ListMusic, Upload } from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { slugify } from "@/lib/utils"

export const SubmitPlaylistForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imagePath, setImagePath] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    genre: "",
    mood: "",
    isPublic: "private", // private or public
    contactEmail: "",
    submissionEnabled: false,
    submissionGuidelines: "",
    platform: "",
    url: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { name, description, genre, mood, isPublic, contactEmail, submissionEnabled, submissionGuidelines, platform, url } = formData;

      if (!name) {
        toast({
          title: "Missing Information",
          description: "Please provide a name for your playlist.",
          variant: "destructive",
        });
        return;
      }

      if (submissionEnabled && !contactEmail) {
        toast({
          title: "Missing Information",
          description: "Contact email is required when submissions are enabled.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Creating Playlist",
        description: "Please wait while we create your playlist...",
      });

      // Create the playlist entry
      const response = await fetch("/api/music/playlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          slug: slugify(name),
          description,
          genre,
          mood,
          isPublic: isPublic === "public",
          contactEmail,
          submissionEnabled,
          submissionGuidelines,
          platform: platform || null,
          imagePath: imagePath || null,
          url: url || null,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to create playlist");
      }

      const playlist = await response.json();

      toast({
        title: "Success! 🎉",
        description: "Your playlist has been created successfully.",
        variant: "default",
      });

      router.push(`/music/playlists/${playlist.slug || playlist.id}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : "There was a problem creating your playlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const platforms = [
    "SPOTIFY",
    "YOUTUBE",
    "SOUNDCLOUD"
  ];

  const genres = [
    "Pop",
    "Rock",
    "Hip Hop",
    "R&B",
    "Jazz",
    "Classical",
    "Electronic",
    "Country",
    "Folk",
    "Latin",
    "Metal",
    "Blues",
    "Reggae",
    "World",
    "Other"
  ];

  const moods = [
    "Happy",
    "Energetic",
    "Calm",
    "Relaxed",
    "Melancholic",
    "Romantic",
    "Party",
    "Focus",
    "Workout",
    "Sleep",
    "Other"
  ];

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center">
            {imagePath ? (
              <div className="relative w-40 h-40 rounded-lg overflow-hidden">
                <Image
                  src={imagePath}
                  alt="Playlist cover"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-40 h-40 bg-zinc-800 rounded-lg flex items-center justify-center">
                <ListMusic className="h-10 w-10 text-zinc-400" />
              </div>
            )}
            <div className="mt-4">
              <UploadButton
                endpoint="playlistImage"
                onClientUploadComplete={(res) => {
                  if (res?.[0]?.url) {
                    setImagePath(res[0].url);
                    toast({
                      title: "Upload complete",
                      description: "Your playlist cover has been uploaded.",
                    });
                  }
                }}
                onUploadError={(error: Error) => {
                  toast({
                    title: "Upload failed",
                    description: error.message,
                    variant: "destructive",
                  });
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Playlist Name *</Label>
            <Input
              id="name"
              placeholder="Enter playlist name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your playlist..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={loading}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select
                value={formData.platform}
                onValueChange={(value) => setFormData({ ...formData, platform: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                placeholder="Enter playlist URL"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label>Genre</Label>
              <Select
                value={formData.genre}
                onValueChange={(value) => setFormData({ ...formData, genre: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre.toLowerCase()}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Mood</Label>
              <Select
                value={formData.mood}
                onValueChange={(value) => setFormData({ ...formData, mood: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a mood" />
                </SelectTrigger>
                <SelectContent>
                  {moods.map((mood) => (
                    <SelectItem key={mood} value={mood.toLowerCase()}>
                      {mood}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Visibility</Label>
              <Select
                value={formData.isPublic}
                onValueChange={(value) => setFormData({ ...formData, isPublic: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Enable Submissions</h3>
              <p className="text-sm text-zinc-400">Allow others to submit songs to your playlist</p>
            </div>
            <Switch
              checked={formData.submissionEnabled}
              onCheckedChange={(checked) => setFormData({ ...formData, submissionEnabled: checked })}
            />
          </div>

          {formData.submissionEnabled && (
            <>
              <div className="space-y-2 mb-4">
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="Enter contact email for submissions"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="submissionGuidelines">Submission Guidelines</Label>
                <Textarea
                  id="submissionGuidelines"
                  placeholder="Enter guidelines for song submissions..."
                  value={formData.submissionGuidelines}
                  onChange={(e) => setFormData({ ...formData, submissionGuidelines: e.target.value })}
                  disabled={loading}
                  rows={3}
                />
              </div>
            </>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={loading}
        >
          <ListMusic className="h-4 w-4 mr-2" />
          {loading ? "Creating..." : "Create Playlist"}
        </Button>
      </form>
    </Card>
  );
}; 