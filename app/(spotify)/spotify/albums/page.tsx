"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LandingNavbar } from "@/components/landing/landing-navbar";

const formSchema = z.object({
  searchInput: z.string(),
});

const CLIENT_ID = "eb50c2830540448d99e4f2342c2a8d87";
const CLIENT_SECRET = "d344df747b684472b5de0b3c9d8e2175";

type Album = {
    id: string;
    name: string;
    artists: { name: string }[];
    release_date: string;
    total_tracks: number;
    images: { url: string }[];
    external_urls: { spotify: string }; // Add this line
  };

const Spotify = () => {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState<Album[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchInput: "",
    },
  });

  useEffect(() => {
    var authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    };
    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => {
        setAccessToken(data.access_token);
        console.log(data.access_token);
      });
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);

    var artistParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + accessToken
      },
    };
    console.log(artistParameters);
    var artistID = await fetch('https://api.spotify.com/v1/search?q=' + values.searchInput + '&type=artist', artistParameters)
      .then(response => response.json())
      .then(data => { return data.artists.items[0].id });

    console.log("Artist ID is" + artistID);

    await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + "?include_groups=album&market=US&limit=50", {
      headers: {
        "Authorization": "Bearer " + accessToken
      }
    })
    .then(response => response.json())
    .then(data => { 
      console.log(data); 
      setAlbums(data.items || []); // Update the albums state
    });
  };

  const onCancel = () => {
    setAlbums([]); // Clear the albums
    form.reset(); // Reset the form
  };

  return (
    <div>
        <LandingNavbar />
      <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="searchInput"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Search</FormLabel>
                  <FormControl>
                    <Input placeholder="Search Spotify" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter your search query.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
            <Button type="button" variant="ghost" onClick={onCancel}>
  Cancel
</Button>
              <Button type="submit">
                Continue
              </Button>
            </div>
          </form>
        </Form>
        <div className="mt-8">
        <div className="grid grid-cols-4 gap-4">
        {albums.map((album: Album) => (
  <Link href={album.external_urls.spotify} key={album.id}>
      <div className="flex items-center gap-x-4 w-full">
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>{album.name}</CardTitle>
              <CardDescription>{album.artists[0].name}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Release Date: {album.release_date}</p>
              <p>Total Tracks: {album.total_tracks}</p>
            </CardContent>
            <CardFooter>
              {/* <Image src={album.images[0].url} alt={album.name} fill/> */}
            </CardFooter>
          </Card>
        </div>
        {/* Add LikeButton or any other component here if needed */}
      </div>
  </Link>
))}
          </div>
                </div>
              </div>
              </div>
            );
          };
          
          export default Spotify;
