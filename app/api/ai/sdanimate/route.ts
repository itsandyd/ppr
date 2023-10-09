import Replicate from "replicate";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";
// import { checkSubscription } from "@/lib/subscription";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt_start, amount, prompt_end, width, height, num_inference_steps, 
      prompt_strength, 
      num_animation_frames, 
      num_interpolation_steps, 
      guidance_scale, 
      gif_frames_per_second, 
      negativePrompt, gifPingPong, filmInterpolation, intermediateOutput, seed, outputFormat } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!prompt_start) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    // Handle the new fields
    // if (!amount) {
    //   return new NextResponse("Amount is required", { status: 400 });
    // }

    // if (!negativePrompt) {
    //   return new NextResponse("Negative prompt is required", { status: 400 });
    // }

    const response = await replicate.run(
      "andreasjansson/stable-diffusion-animation:ca1f5e306e5721e19c473e0d094e6603f0456fe759c10715fcd6c1b79242d4a5",
      {
        input: {
          prompt_start: prompt_start,
          prompt_end: prompt_end,
          width: width,
          height: height,
          num_inference_steps: num_inference_steps,
          prompt_strength: prompt_strength,
          num_animation_frames: num_animation_frames,
          num_interpolation_steps: num_interpolation_steps,
          guidance_scale: guidance_scale,
          gif_frames_per_second: gif_frames_per_second,
          gif_ping_pong: gifPingPong,
          film_interpolation: filmInterpolation,
          intermediate_output: intermediateOutput,
          seed: seed,
          output_format: outputFormat
        }
      }
    );

    // await db.prompt.create({
    //   data: {
    //     prompt: prompt,
    //     // num_outputs: amount,
    //     // negativePrompt: negativePrompt,
    //     userId: userId,
    //   }
    // });

    return NextResponse.json(response);

  } catch (error) {
    console.log('[SDANIMATE_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};