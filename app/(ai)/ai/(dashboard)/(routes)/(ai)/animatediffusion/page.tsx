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
          prompt: "photo of volcano, rocks, storm weather, wind, lava waves, lightning, 8k uhd, dslr, soft lighting, high quality, film grain, Fujifilm XT3",
          negative_prompt: "blur, haze, deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime, mutated hands and fingers, deformed, distorted, disfigured, poorly drawn, bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, disconnected limbs, mutation, mutated, ugly, disgusting, amputation",
          base_model: "realisticVisionV20_v20",
          steps: 25,
          guidance_scale: 0.5,
          frames: 16
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
  name="prompt"
  render={({ field }) => (
    <FormItem className="col-span-12">
      <div className="text-l font-bold">Prompt</div>
      <FormControl className="m-0 p-0">
        <Input
          className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
          disabled={isLoading}
          placeholder="Enter prompt"
          {...field}
        />
      </FormControl>
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="negative_prompt"
  render={({ field }) => (
    <FormItem className="col-span-12">
      <div className="text-l font-bold">Negative Prompt</div>
      <FormControl className="m-0 p-0">
        <Input
          className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
          disabled={isLoading}
          placeholder="Enter negative prompt"
          {...field}
        />
      </FormControl>
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="base_model"
  render={({ field }) => (
    <FormItem className="col-span-12">
      <div className="text-l font-bold">Base Model</div>
      <FormControl className="m-0 p-0">
        <Select {...field}>
          <SelectTrigger className="flex">
            <SelectValue placeholder="Select a base model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="realisticVisionV20_v20">realisticVisionV20_v20</SelectItem>
            <SelectItem value="lyriel_v16">lyriel_v16</SelectItem>
            <SelectItem value="majicmixRealistic_v5Preview">majicmixRealistic_v5Preview</SelectItem>
            <SelectItem value="rcnzCartoon3d_v10">rcnzCartoon3d_v10</SelectItem>
            <SelectItem value="toonyou_beta3">toonyou_beta3</SelectItem>
          </SelectContent>
        </Select>
      </FormControl>
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="steps"
  render={({ field }) => (
    <FormItem className="col-span-12">
      <div className="text-l font-bold">Number of inference steps</div>
      <FormControl className="m-0 p-0">
        <Slider
          defaultValue={[field.value]}
          max={100} // adjust this to the maximum number of steps you want to allow
          step={1}
          onChange={values => field.onChange(values)}
        />
      </FormControl>
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="guidance_scale"
  render={({ field }) => (
    <FormItem className="col-span-12">
      <div className="text-l font-bold">Guidance Scale</div>
      <FormControl className="m-0 p-0">
        <Slider
          defaultValue={[field.value]}
          max={10} // adjust this to the maximum value you want to allow
          step={0.1}
          onChange={values => field.onChange(values)}
        />
      </FormControl>
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="frames"
  render={({ field }) => (
    <FormItem className="col-span-12">
      <div className="text-l font-bold">Length of the video in frames</div>
      <FormControl className="m-0 p-0">
        <Slider
          defaultValue={[field.value]}
          max={100} // adjust this to the maximum number of frames you want to allow
          step={1}
          onChange={values => field.onChange(values)}
        />
      </FormControl>
    </FormItem>
  )}
/>
<FormField
control={form.control}
name="width"
render={({ field }) => (
<FormItem className="col-span-12">
<div className="text-l font-bold">Width in pixels</div>
<FormControl className="m-0 p-0">
<Input
className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
disabled={isLoading}
placeholder="Enter width"
type="number"
{...field}
/>
</FormControl>
</FormItem>
)}
/>

<FormField
control={form.control}
name="height"
render={({ field }) => (
<FormItem className="col-span-12">
<div className="text-l font-bold">Height in pixels</div>
<FormControl className="m-0 p-0">
<Input
className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
disabled={isLoading}
placeholder="Enter height"
type="number"
{...field}
/>
</FormControl>
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