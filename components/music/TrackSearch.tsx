import React, { useState } from 'react';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import Link from 'next/link';
import axios from 'axios';
import { auth, useAuth, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { Heart } from 'lucide-react';

type Track = {
    id: string;
    name: string;
    artists: { 
      name: string; 
      followers: { total: number }; 
      genres: string[] 
    }[];
    album: { images: { url: string }[] };
    external_urls: { spotify: string };
  };

const formSchema = z.object({
    searchInput: z.string(),
});

const TrackSearch = ({ accessToken }: { accessToken: string }) => {

    // const { toast } = useToaster();
    const [tracks, setTracks] = useState<Track[]>([]);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            searchInput: "",
        },
    });

    const handleAddTrack = async (trackUrl: string, trackName: string, artistName: string, albumImage: string) => {
        await axios.post('/api/music/sharedTracks', { trackUrl, trackName, artistName, albumImage });
        // toast.success("Track added successfully")
    };

    const searchTracks = async (values: z.infer<typeof formSchema>) => {
        const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${values.searchInput}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const data = await response.json();
        setTracks(data.tracks.items);
    };

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(searchTracks)} className="space-y-8">
                    <FormItem>
                        <FormLabel>Search</FormLabel>
                        <FormControl>
                            <Input placeholder="Search Spotify" {...form.register("searchInput")} />
                        </FormControl>
                        <FormDescription>
                            Enter your search query.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                    <Button type="submit">Search</Button>
                </form>
            </Form>
            <div className="grid grid-cols-4 gap-4">
                {tracks.map(track => (
                    <Card key={track.id}>
                         <CardHeader>
      <CardTitle>{track.name}</CardTitle>
      <CardDescription>{track.artists[0].name}</CardDescription>
      {track.artists[0].followers && <CardDescription>Followers: {track.artists[0].followers.total}</CardDescription>}
      {track.artists[0].genres && <CardDescription>Genres: {track.artists[0].genres.join(', ')}</CardDescription>}
    </CardHeader>
                        <CardContent>
                            <Image width="300" height="300" src={track.album.images[0].url} alt="Album cover" />
                        </CardContent>
                        <CardFooter>
                        <Button onClick={() => handleAddTrack(track.external_urls.spotify, track.name, track.artists[0].name, track.album.images[0].url)}><Heart /></Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default TrackSearch;