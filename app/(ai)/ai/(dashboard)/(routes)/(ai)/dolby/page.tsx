"use client";

import * as z from "zod";
import axios from "axios";
import { useState, useCallback, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Music, Send } from "lucide-react";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

import { formSchema } from "./constants";
import { AiHeading } from "@/components/ai/ai-heading";
import { AiLoader } from "@/components/ai/ai-loader";
import AiEmpty from "@/components/ai/ai-empty";


const Dolby = () => {
  const router = useRouter();
  const [music, setMusic] = useState<string>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      notLike: "",
      duration: 5,
      alpha: 0.5,
      denoise: 0.75,
      num_inference_steps: 50,
      apiRoute: "/api/ai/riffusion", // default API route
    },
  });

  // const selectedApiRoute = form.watch("apiRoute");

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setMusic(undefined);
      const requestBody = values.apiRoute === "/api/ai/riffusion"
        ? { ...values, seed_image_id: values.seed_image_id }
        : values;
      const response = await axios.post(values.apiRoute, requestBody);
      if (values.apiRoute === "/api/ai/riffusion") {
        setMusic(response.data.audio);
      } else {
        setMusic(response.data);
      }
    } catch (error: any) {
      // handle error
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <AiHeading
        title="Enhance"
        description="Enhance audio using AI"
        Icon={Music}
        iconColor="text-emerald-500"
        bgColor="bg-emerald-500/10"
      />
        <div className="px-4 lg:px-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="
              rounded-lg 
              border 
              w-full 
              p-4 
              px-3 
              md:px-6 
              focus-within:shadow-sm
              grid
              grid-cols-12
              gap-2
            "
          >
            {/* <FormField
              control={form.control}
              name="audioFile"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-12">
                  <div className="text-l font-bold">Upload Audio File</div>
                  <FormControl className="m-0 p-0">
                  <FileUpload 
  endpoint="aiMusicFile"
  onChange={(url) => {
    if (url) {
      setAudioFileUrl(url);
    }
  }}
/>
                  </FormControl>
                  <FormDescription className="w-full whitespace-nowrap">
                    Select an audio file to upload.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model_name"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-12">
                  <div className="text-l font-bold">Choose a model</div>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="htdemucs">htdemucs</SelectItem>
                        <SelectItem value="htdemucs_ft">htdemucs_ft</SelectItem>
                        <SelectItem value="htdemucs_6s">htdemucs_6s</SelectItem>
                        <SelectItem value="hdemucs_mmi">hdemucs_mmi</SelectItem>
                        <SelectItem value="mdx">mdx</SelectItem>
                        <SelectItem value="mdx_q">mdx_q</SelectItem>
                        <SelectItem value="mdx_extra">mdx_extra</SelectItem>
                        <SelectItem value="mdx_extra_q">mdx_extra_q</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stem"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-12">
                  <div className="text-l font-bold">Stem Setting</div>
                  <FormDescription>Only separate audio into the chosen stem and others (no_stem).</FormDescription>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a stem" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vocals">Vocals</SelectItem>
                        <SelectItem value="bass">Bass</SelectItem>
                        <SelectItem value="drums">Drums</SelectItem>
                        <SelectItem value="guitar">Guitar</SelectItem>
                        <SelectItem value="piano">Piano</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clip_mode"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-12">
                  <div className="text-l font-bold">Strategy for avoiding clipping</div>
                  <FormDescription>Rescaling entire signal if necessary (rescale) or hard clipping (clamp).</FormDescription>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a strategy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rescale">Rescale</SelectItem>
                        <SelectItem value="clamp">Clamp</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shifts"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-12">
                  <div className="text-l font-bold">Number of random shifts for equivariant stabilization</div>
                  <FormDescription>Increase separation time but improves quality. 10 was used in the original paper</FormDescription>
                  <FormControl>
                    <Slider defaultValue={[field.value || 1]} min={1} max={10} step={1} onValueChange={(values) => field.onChange(values[0])} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="overlap"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-12">
                  <div className="text-l font-bold">Overlap between the splits</div>
                  <FormControl>
                    <Slider defaultValue={[field.value || 0.25]} min={0} max={1} step={0.01} onValueChange={(values) => field.onChange(values[0])} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="output_format"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-12">
                  <div className="text-l font-bold">Choose the output format</div>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mp3">mp3</SelectItem>
                        <SelectItem value="wav">wav</SelectItem>
                        <SelectItem value="flac">flac</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            {outputFormat === 'mp3' && (
              <FormField
                control={form.control}
                name="mp3_bitrate"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-12">
                    <div className="text-l font-bold">Bitrate of converted mp3</div>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            {outputFormat === 'wav' && (
              <FormField
                control={form.control}
                name="float32"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-12">
                    <FormLabel>Save wav output as float32 (2x bigger)</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            )} */}
            <Button className="col-span-12 w-full" type="submit" disabled={isLoading} size="icon">
              Separate
            </Button>
          </form>
        </Form>
        {/* {isLoading && (
          <div className="p-20">
            <AiLoader />
          </div>
        )}
        {!music && !isLoading && (
          <AiEmpty label="No music generated." />
        )}
        {music && (
          <audio controls className="w-full mt-8">
            <source src={music} />
          </audio>
        )} */}
      </div>
      </div>
  );
}

export default Dolby;