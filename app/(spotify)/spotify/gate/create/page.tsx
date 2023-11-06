"use client"

import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaSoundcloud } from "react-icons/fa";
import { YoutubeIcon } from "lucide-react";
import { BsSpotify, BsYoutube } from "react-icons/bs";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";
import { UploadDropzone } from "@uploadthing/react";
import { Checkbox } from "@/components/ui/checkbox";

const genres = [
    { label: "House", options: ["Deep House", "Progressive House", "Electro House", "Tech House", "Tropical House"] },
    { label: "Techno", options: ["Detroit Techno", "Minimal Techno", "Dub Techno"] },
    { label: "Trance", options: ["Progressive Trance", "Uplifting Trance", "Vocal Trance", "Psytrance"] },
    { label: "Dubstep", options: ["Melodic Dubstep", "Riddim Dubstep", "Brostep"] },
    { label: "Drum and Bass (DnB)", options: ["Liquid DnB", "Jump-Up", "Neurofunk"] },
    { label: "Electro", options: ["Electro Swing", "Big Room Electro"] },
    { label: "Breakbeat", options: ["Big Beat", "Breaks"] },
    { label: "Hardcore", options: ["Happy Hardcore", "Hardstyle", "Gabber"] },
    { label: "Trap", options: ["Hybrid Trap", "Future Trap"] },
    { label: "Future Bass", options: [] },
    { label: "Garage", options: ["UK Garage", "2-Step Garage"] },
    { label: "Ambient", options: ["Ambient House", "Ambient Techno"] },
    // {el: "Chillout", options: [] },
    { label: "Trip-Hop", options: [] },
    { label: "Glitch Hop", options: [] },
    // { label: "Moombahton",tions: opundefined[] },
    { label: "Progressive", options: [] },
    { label: "Down Tempo", options: [] },
    { label: "Acid", options: [] },
    { label: "Bass Music", options: [] },
    { label: "Tropical", options: [] },
    { label: "Lo-Fi", options: [] },
    { label: "Synthwave", options: [] },
    { label: "Disco", options: ["Nu-Disco"] },
  ];

const gateSteps = [
    "Email capture",
    "SoundCloud",
    "YouTube",
    "Spotify",
    "Apple Music",
    "Deezer",
    "Twitch",
    "Mixcloud",
    "Facebook",
    "Messenger",
    "Instagram",
    "Twitter",
    "TikTok",
    "Bandcamp",
    "Donation",
  ];

const formSchema = z.object({
  source: z.string().nonempty({ message: "Source is required." }),
  genre: z.string().nonempty({ message: "Genre is required." }),
  upload: z.string().nonempty({ message: "Upload is required." }),
  title: z.string().nonempty({ message: "Title is required." }),
//   design: z.string().nonempty({ message: "Design is required." }),
  gateSteps: z.string().nonempty({ message: "Gate Steps are required." }),
  linkURL: z.string().nonempty({ message: "Link URL is required." }),
  releaseSettings: z.string().nonempty({ message: "Release Settings are required." }),
  emailPromotion: z.string().nonempty({ message: "Email Promotion is required." }),
  trackingPixels: z.string().nonempty({ message: "Tracking Pixels are required." }),
  confirmation: z.string().nonempty({ message: "Confirmation is required." }),
});

export default function CampaignForm() {
    const form = useForm({
      resolver: zodResolver(formSchema),
    });
  
    return (
        <div>
            <LandingNavbar />
    <div className="mt-4 mb-4 mr-24 ml-24">
      <Form {...form}>
      <FormField
  control={form.control}
  name="source"
  render={({ field }) => (
    <FormItem>
      <div className="flex items-center">
        <FormLabel>Source</FormLabel>
        <div className="flex ml-2 space-x-2">
          <FaSoundcloud />
          <BsYoutube />
          <BsSpotify />
        </div>
      </div>
      <FormControl>
        <Input placeholder="https://www…" {...field} />
      </FormControl>
      <FormDescription>Enter source/track URL for your title</FormDescription>
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="genre"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Genre</FormLabel>
      <FormControl>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select genre" />
          </SelectTrigger>
          <SelectContent>
            {genres.map((genre, index) => (
              <React.Fragment key={index}>
                <SelectItem value={genre.label}>{genre.label}</SelectItem>
                {genre.options.map((option, index) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </React.Fragment>
            ))}
          </SelectContent>
        </Select>
      </FormControl>
    </FormItem>
  )}
/>
        <FormField
          control={form.control}
          name="upload"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload</FormLabel>
              <FormControl>
                <UploadDropzone {...form}/>
              </FormControl>
              <FormDescription>Upload the audio file you would like to share with fans (mp3, wav, aiff, zip)</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="design"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload</FormLabel>
              <FormControl>
                <UploadDropzone {...form}/>
              </FormControl>
              <FormDescription>Upload the audio file you would like to share with fans (mp3, wav, aiff, zip)</FormDescription>
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="gateSteps"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Gate Steps</FormLabel>
                <FormDescription>
                  Select the steps you want to include in the gate.
                </FormDescription>
              </div>
              {gateSteps.map((step) => (
                <FormField
                  key={step}
                  control={form.control}
                  name="gateSteps"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={step}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                        <Checkbox
  checked={field.value?.includes(step)}
  onCheckedChange={(checked) => {
    return checked
      ? field.onChange([...(field.value || []), step])
      : field.onChange(
          field.value?.filter(
            (value: any) => value !== step
          )
        )
  }}
/>
                        </FormControl>
                        <FormLabel className="font-normal">
                          {step}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="linkURL"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link URL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="releaseSettings"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Release Settings</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="emailPromotion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Promotion</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="trackingPixels"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tracking Pixels</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmation</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </Form>
      </div>
      </div>
    );
  }