"use client";

import axios from "axios"
import * as z from "zod";

import { Download, ImageIcon, VideoIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { formSchema, } from "./constants";
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";
import { Card, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { AiHeading } from "@/components/ai/ai-heading";
import AiEmpty from "@/components/ai/ai-empty";
import { AiLoader } from "@/components/ai/ai-loader";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

const ImagePage = () => {
    const router = useRouter();
    const [images, setImages] = useState<string[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt_start: "",
            prompt_end: "",
            width: 512,
            height: 512,
            num_inference_steps: 50,
            prompt_strength: 0.8,
            num_animation_frames: 10,
            num_interpolation_steps: 5,
            guidance_scale: 7.5,
            gif_frames_per_second: 20,
            gif_ping_pong: false,
            film_interpolation: false,
            intermediate_output: false,
            seed: undefined,
            output_format: "gif",
        },
    });

    const [checked, setChecked] = useState(false);

    const handleCheckboxChange = (event: any) => {
      setChecked(event.target.checked);
    };

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setImages([]);
            const response = await axios.post("/api/ai/sdanimate", {
                ...values,
            });
            setImages(response.data);
            form.reset();
        } catch (error: any) {
            console.log(error);
        } finally {
            router.refresh();
        }
    };

    return (
        <div>
            <AiHeading
                title="Video Generation"
                description="Generate Music Visuals from a prompt."
                Icon={VideoIcon}
                iconColor="text-orange-500"
                bgColor="bg-orange-500/10"
            />
            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
  control={form.control}
  name="prompt_start"
  render={({ field }) => (
    <FormItem className="col-span-12">
      <div className="text-l font-bold">Prompt to start the animation with</div>
      <FormControl className="m-0 p-0">
        <Input
          className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
          disabled={isLoading}
          placeholder="Enter prompt to start the animation"
          {...field}
        />
      </FormControl>
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="prompt_end"
  render={({ field }) => (
    <FormItem className="col-span-12">
      <div className="text-l font-bold">Prompt to end the animation with</div>
      <FormControl className="m-0 p-0">
        <Input
          className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
          disabled={isLoading}
          placeholder="Enter prompt to end the animation"
          {...field}
        />
      </FormControl>
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="width"
  render={({ field }) => (
    <FormItem className="col-span-12 lg:col-span-6">
      <div className="w-full h-auto py-2">
        <div className="text-l font-bold">Width</div>
        <div className="py-2">
          <Select 
            onValueChange={(value) => field.onChange(parseInt(value))} 
            defaultValue={field.value.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select width" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="128">128</SelectItem>
              <SelectItem value="256">256</SelectItem>
              <SelectItem value="512">512</SelectItem>
              <SelectItem value="768">768</SelectItem>
              <SelectItem value="1024">1024</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <FormDescription className="w-full whitespace-nowrap">
          Select the width for the output image.
        </FormDescription>
        <FormMessage />
      </div>
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="height"
  render={({ field }) => (
    <FormItem className="col-span-12 lg:col-span-6">
      <div className="w-full h-auto py-2">
        <div className="text-l font-bold">Height</div>
        <div className="py-2">
          <Select 
            onValueChange={(value) => field.onChange(parseInt(value))} 
            defaultValue={field.value.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select height" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="128">128</SelectItem>
              <SelectItem value="256">256</SelectItem>
              <SelectItem value="512">512</SelectItem>
              <SelectItem value="768">768</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <FormDescription className="w-full whitespace-nowrap">
          Select the height for the output image.
        </FormDescription>
        <FormMessage />
      </div>
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="num_inference_steps"
  render={({ field }) => (
    <FormItem className="col-span-12">
      <div className="text-l font-bold">Number of denoising steps</div>
      <FormControl className="m-0 p-0">
        <Slider
          defaultValue={[field.value]}
          max={100}
          step={1}
          onValueChange={(values) => field.onChange(values[0])}
        />
      </FormControl>
      <FormDescription className="w-full whitespace-nowrap">
        Adjust the number of denoising steps.
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="prompt_strength"
  render={({ field }) => (
    <FormItem className="col-span-12">
      <div className="text-l font-bold">Prompt Strength</div>
      <FormControl className="m-0 p-0">
        <Slider
          defaultValue={[field.value]}
          max={1}
          step={0.1}
          onValueChange={(values) => field.onChange(values[0])}
        />
      </FormControl>
      <FormDescription className="w-full whitespace-nowrap">
        Lower prompt strength generates more coherent gifs, higher respects prompts more but can be jumpy.
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="num_animation_frames"
  render={({ field }) => (
    <FormItem className="col-span-12">
      <div className="text-l font-bold">Number of frames to animate</div>
      <FormControl className="m-0 p-0">
        <Slider
          defaultValue={[field.value]}
          max={100}
          step={1}
          onValueChange={(values) => field.onChange(values[0])}
        />
      </FormControl>
      <FormDescription className="w-full whitespace-nowrap">
        Adjust the number of frames to animate.
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="num_interpolation_steps"
  render={({ field }) => (
    <FormItem className="col-span-12">
      <div className="text-l font-bold">Number of steps to interpolate between animation frames</div>
      <FormControl className="m-0 p-0">
        <Slider
          defaultValue={[field.value]}
          max={100}
          step={1}
          onValueChange={(values) => field.onChange(values[0])}
        />
      </FormControl>
      <FormDescription className="w-full whitespace-nowrap">
        Adjust the number of steps to interpolate between animation frames.
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="guidance_scale"
  render={({ field }) => (
    <FormItem className="col-span-12">
      <div className="text-l font-bold">Scale for classifier-free guidance</div>
      <FormControl className="m-0 p-0">
        <Slider
          defaultValue={[field.value]}
          max={10}
          step={0.1}
          onValueChange={(values) => field.onChange(values[0])}
        />
      </FormControl>
      <FormDescription className="w-full whitespace-nowrap">
        Adjust the scale for classifier-free guidance.
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="gif_frames_per_second"
  render={({ field }) => (
    <FormItem className="col-span-12">
      <div className="text-l font-bold">Frames/second in output GIF</div>
      <FormControl className="m-0 p-0">
        <Slider
          defaultValue={[field.value]}
          max={60}
          step={1}
          onValueChange={(values) => field.onChange(values[0])}
        />
      </FormControl>
      <FormDescription className="w-full whitespace-nowrap">
        Adjust the frames per second in the output GIF.
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="gif_ping_pong"
  render={({ field }) => (
    <FormItem className="col-span-12">
      <div className="text-l font-bold">Reverse Animation</div>
      <FormControl className="m-0 p-0">
        <Select onValueChange={value => field.onChange(value === "Yes")}>
          <SelectTrigger>
            <SelectValue placeholder={field.value ? "Yes" : "No"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
          </SelectContent>
        </Select>
      </FormControl>
      <FormDescription className="w-full whitespace-nowrap">
        Whether to reverse the animation and go back to the beginning before looping.
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="film_interpolation"
  render={({ field }) => (
    <FormItem className="col-span-12">
      <div className="text-l font-bold">Use FILM for Interpolation</div>
      <FormControl className="m-0 p-0">
        <Select onValueChange={value => field.onChange(value === "Yes")}>
          <SelectTrigger>
            <SelectValue placeholder={field.value ? "Yes" : "No"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
          </SelectContent>
        </Select>
      </FormControl>
      <FormDescription className="w-full whitespace-nowrap">
        Whether to use FILM for between-frame interpolation (film-net.github.io).
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="intermediate_output"
  render={({ field }) => (
    <FormItem className="col-span-12">
      <div className="text-l font-bold">Display Intermediate Outputs</div>
      <FormControl className="m-0 p-0">
        <Select onValueChange={value => field.onChange(value === "Yes")}>
          <SelectTrigger>
            <SelectValue placeholder={field.value ? "Yes" : "No"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
          </SelectContent>
        </Select>
      </FormControl>
      <FormDescription className="w-full whitespace-nowrap">
        Whether to display intermediate outputs during generation.
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="seed"
  render={({ field }) => (
    <FormItem className="col-span-12">
      <div className="text-l font-bold">Random Seed</div>
      <FormControl className="m-0 p-0">
      <Slider
  defaultValue={[field.value || 0]} // If field.value is undefined, use 0
  max={100}
  step={1}
  onValueChange={(values) => field.onChange(values[0])}
/>
      </FormControl>
      <FormDescription className="w-full whitespace-nowrap">
        Random seed. Leave blank to randomize the seed.
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="output_format"
  render={({ field }) => (
    <FormItem className="col-span-12">
      <div className="text-l font-bold">Output file format</div>
      <FormControl className="m-0 p-0">
        <Select onValueChange={value => field.onChange(value)}>
          <SelectTrigger>
            <SelectValue placeholder={field.value || "gif"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gif">gif</SelectItem>
            <SelectItem value="mp4">mp4</SelectItem>
          </SelectContent>
        </Select>
      </FormControl>
      <FormDescription className="w-full whitespace-nowrap">
        Allowed values: gif, mp4
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
                            <Button className="col-span-12 w-full" type="submit" disabled={isLoading} size="icon">
                                Generate
                            </Button>
                            {/* <Button className="col-span-12 w-full" variant="link" onClick={() => router.push('/image/prompts')}>
                                View Prompts
                            </Button> */}
                        </form>
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    {isLoading && (
                        <div className="p-20">
                            <AiLoader />
                        </div>
                    )}
                    {images.length === 0 && !isLoading && (
                        <AiEmpty label="No images generated." />
                    )}
                    <div className="grid grid-cols-1 mid:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
                        {images.map((src, index) => (
                            <div className="pb-4" key={index}>
                                <Card
                                    key={src}
                                    className="rounded-lg overflow-hidden"
                                >
                                    <div className="relative aspect-square">
                                        <Image
                                            alt="Image"
                                            fill
                                            src={src}
                                        />
                                    </div>
                                    <CardFooter className="p-2">
                                        <Button variant="secondary" className="w-full" onClick={() => window.open(src)}>
                                            <Download className="h-4 w-4 mr-2">
                                                Download
                                            </Download>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ImagePage;