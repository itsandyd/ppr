import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Replicate from "replicate";
import { auth } from "@clerk/nextjs";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

// export const runtime = 'edge'; // Specify the runtime as 'edge'

export async function POST(
  req: NextRequest
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { audioFile, stem, clip_mode, model_name, overlap, shifts, output_format, mp3_bitrate, float32 } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // if (!audioFile) {
    //   return new NextResponse("File is required", { status: 400 });
    // }

    const response = await replicate.run(
      "cjwbw/demucs:25a173108cff36ef9f80f854c162d01df9e6528be175794b81158fa03836d953",
      {
        input: {
          audio: audioFile,
          model_name: model_name,
          stem: stem,
          clip_mode,
          shifts: shifts,
          overlap: overlap,
          mp3_bitrate: mp3_bitrate,
          float32: float32,
          output_format: output_format,
        }
      }
    );

    return NextResponse.json(response);
  } catch (error) {
    console.log('[MUSIC_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
