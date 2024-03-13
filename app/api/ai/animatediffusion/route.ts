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
    const { 
      prompt, 
      negative_prompt, 
      base_model, 
      steps, 
      guidance_scale, 
      frames, 
      width, 
      height, 
      seed, 
      zoom_in_motion_strength,
      zoom_out_motion_strength,
      pan_left_motion_strength,
      pan_right_motion_strength,
      pan_up_motion_strength,
      pan_down_motion_strength,
      rolling_clockwise_motion_strength,
      rolling_anticlockwise_motion_strength,
      output_format
    } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!prompt) {
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
      "lucataco/animate-diff:beecf59c4aee8d81bf04f0381033dfa10dc16e845b4ae00d281e2fa377e48a9f",
      {
        input: {
          prompt: prompt,
          negative_prompt: negative_prompt,
          base_model: base_model,
          steps: steps,
          guidance_scale: guidance_scale,
          frames: frames,
          width: width,
          height: height,
          seed: seed,
          zoom_in_motion_strength: zoom_in_motion_strength,
          zoom_out_motion_strength: zoom_out_motion_strength,
          pan_left_motion_strength: pan_left_motion_strength,
          pan_right_motion_strength: pan_right_motion_strength,
          pan_up_motion_strength: pan_up_motion_strength,
          pan_down_motion_strength: pan_down_motion_strength,
          rolling_clockwise_motion_strength: rolling_clockwise_motion_strength,
          rolling_anticlockwise_motion_strength: rolling_anticlockwise_motion_strength,
          output_format: output_format
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