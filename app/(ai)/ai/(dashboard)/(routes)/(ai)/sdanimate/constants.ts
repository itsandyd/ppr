import * as z from "zod"

export const formSchema = z.object({
  prompt_start: z.string().min(1, {
    message: "Prompt to start the animation with is required",
  }),
  prompt_end: z.string().min(1, {
    message: "Prompt to end the animation with is required",
  }),
  width: z
    .number()
    .optional()
    .refine((val) => val === undefined || (val >= 128 && val <= 1024), {
      message: "Width must be between 128 and 1024",
      path: ["width"],
    })
    .default(512),
  height: z
    .number()
    .optional()
    .refine((val) => val === undefined || (val >= 128 && val <= 768), {
      message: "Height must be between 128 and 768",
      path: ["height"],
    })
    .default(512),
  num_inference_steps: z.number().optional().default(50),
  prompt_strength: z.number().optional().default(0.8),
  num_animation_frames: z.number().optional().default(10),
  num_interpolation_steps: z.number().optional().default(5),
  guidance_scale: z.number().optional().default(7.5),
  gif_frames_per_second: z.number().optional().default(20),
  gif_ping_pong: z.boolean().optional(),
  film_interpolation: z.boolean().optional(),
  intermediate_output: z.boolean().optional(),
  seed: z.number().optional(),
  output_format: z.enum(["gif", "mp4"]).optional().default("gif"),
});

// export const amountOptions = [
//     {
//     value: "1",
//     label: "1 Photo"
//     },
//     {
//         value: "2",
//         label: "2 Photos"
//     },
//     {
//         value: "3",
//         label: "3 Photos"
//     },
//     {
//         value: "4",
//         label: "4 Photos"
//     },
//     {
//         value: "5",
//         label: "5 Photos"
//     },
// ];

// export const resolutionOptions = [
//     {
//         value: "256x256",
//         label: "256x256"
//     },
//     {
//         value: "512x512",
//         label: "512x512"
//     },
//     {
//         value: "1024x1024",
//         label: "1024x1024"
//     },
// ]