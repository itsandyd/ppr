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

const MusicPage = () => {
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

  const selectedApiRoute = form.watch("apiRoute");

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
        title="Sample Generation"
        description="Generate Music Samples from a prompt."
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
            <FormField
              control={form.control}
              name="apiRoute"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-12">
                  <div className="w-full h-auto py-2">
                    <div className="text-l font-bold">Model</div>
                    <div className="py-2">
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an API route" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="/api/ai/riffusion">Riffusion - Generates images of spectrograms converted to audio clips from a text prompt.</SelectItem>
                          <SelectItem value="/api/ai/musicgen">MusicGen - Generates music using 4 sets of codes analyzed 50 times per second from a 32kHz EnCodec tokenizer.</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <FormDescription className="w-full whitespace-nowrap">
                      Select the model to use for music generation.
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-12">
                  <div className="text-l font-bold">Describe your sound</div>
                  <FormControl className="m-0 p-0">
                    <Input
                      className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                      disabled={isLoading}
                      placeholder="Piano solo"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {selectedApiRoute === "/api/ai/riffusion" && (
              <FormField
                name="notLike"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-12">
                    <div className="text-l font-bold">What you don&apos;t want in your sound</div>
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="No heavy metal"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            {selectedApiRoute === "/api/ai/riffusion" && (
              <FormField
                control={form.control}
                name="seed_image_id"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-12">
                    <div className="w-full h-auto py-2">
                      <div className="text-l font-bold">Seed Image ID</div>
                      <div className="py-2">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a seed image ID" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="agile">agile</SelectItem>
                            <SelectItem value="marim">marim</SelectItem>
                            <SelectItem value="mask_beat_lines_80">mask_beat_lines_80</SelectItem>
                            <SelectItem value="mask_gradient_dark">mask_gradient_dark</SelectItem>
                            <SelectItem value="mask_gradient_top_70">mask_gradient_top_70</SelectItem>
                            <SelectItem value="mask_gradient_top_fifth_75">mask_gradient_top_fifth_75</SelectItem>
                            <SelectItem value="mask_gradient_top_75">mask_gradient_top_75</SelectItem>
                            <SelectItem value="mask_top_third_95">mask_top_third_95</SelectItem>
                            <SelectItem value="motorway">motorway</SelectItem>
                            <SelectItem value="og_beat">og_beat</SelectItem>
                            <SelectItem value="vibes">vibes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <FormDescription className="w-full whitespace-nowrap">
                        Select the seed image ID for Riffusion.
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            )}
            {selectedApiRoute !== "/api/ai/riffusion" && (
              <FormField
                name="duration"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-12">
                    <div className="text-l font-bold">Duration</div>
                    <FormControl className="m-0 p-0">
                      <Slider
                        defaultValue={[field.value]}
                        max={30}
                        min={1}
                        step={1}
                        onValueChange={(values: any) => field.onChange(values[0])}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            {selectedApiRoute === "/api/ai/riffusion" && (
              <FormField
                name="alpha"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-12">
                    <div className="text-l font-bold">Interpolation Alpha</div>
                    <FormControl className="m-0 p-0">
                      <Slider
                        defaultValue={[field.value]}
                        max={1}
                        min={0}
                        step={0.1}
                        onValueChange={(values) => field.onChange(values[0])}
                      />
                    </FormControl>
                    <FormDescription className="w-full whitespace-nowrap">
                      Interpolation alpha if using two prompts. A value of 0 uses prompt_a fully, a value of 1 uses prompt_b fully.
                    </FormDescription>
                  </FormItem>
                )}
              />
            )}
            {selectedApiRoute === "/api/ai/riffusion" && (
              <FormField
                name="denoise"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-12">
                    <div className="text-l font-bold">Denoising Number</div>
                    <FormControl className="m-0 p-0">
                      <Slider
                        defaultValue={[field.value]}
                        max={1}
                        min={0}
                        step={0.1}
                        onValueChange={(values) => field.onChange(values[0])}
                      />
                    </FormControl>
                    <FormDescription className="w-full whitespace-nowrap">
                      How much to transform input spectrogram.
                    </FormDescription>
                  </FormItem>
                )}
              />
            )}
            {selectedApiRoute === "/api/ai/riffusion" && (
              <FormField
                name="num_inference_steps"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-12">
                    <div className="text-l font-bold">Number of Inference Steps</div>
                    <FormControl className="m-0 p-0">
                      <Slider
                        defaultValue={[field.value]}
                        max={100}
                        min={1}
                        step={1}
                        onValueChange={(values: any) => field.onChange(values[0])}
                      />
                    </FormControl>
                    <FormDescription className="w-full whitespace-nowrap">
                      Number of steps to run the diffusion model.
                    </FormDescription>
                  </FormItem>
                )}
              />
            )}
            <Button className="col-span-12 w-full" type="submit" disabled={isLoading} size="icon">
              Generate
            </Button>
            <Button className="col-span-12 w-full" variant="link" onClick={() => window.open('https://rsxdalv.github.io/musicgen-prompts/', '_blank')}>
              View Prompt Examples
            </Button>
          </form>
        </Form>
        {isLoading && (
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
        )}
      </div>
    </div>
  );
}

export default MusicPage;