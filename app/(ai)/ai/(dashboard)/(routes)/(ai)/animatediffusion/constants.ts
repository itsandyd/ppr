import * as z from "zod"

export const formSchema = z.object({
  prompt: z.string().optional().default("photo of volcano, rocks, storm weather, wind, lava waves, lightning, 8k uhd, dslr, soft lighting, high quality, film grain, Fujifilm XT3"),
  negative_prompt: z.string().optional().default("blur, haze, deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime, mutated hands and fingers, deformed, distorted, disfigured, poorly drawn, bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, disconnected limbs, mutation, mutated, ugly, disgusting, amputation"),
  base_model: z.enum(['realisticVisionV20_v20', 'lyriel_v16', 'majicmixRealistic_v5Preview', 'rcnzCartoon3d_v10', 'toonyou_beta3']).default('realisticVisionV20_v20'),
  steps: z.number().int().min(1).default(25),
  guidance_scale: z.number().min(0).max(10).default(7.5),
  frames: z.number().int().min(1).default(16),
  width: z.number().int().min(1).default(512),
  height: z.number().int().min(1).default(512),
  seed: z.number().int(),
  zoom_in_motion_strength: z.number().min(0).max(1),
  zoom_out_motion_strength: z.number().min(0).max(1),
  pan_left_motion_strength: z.number().min(0).max(1),
  pan_right_motion_strength: z.number().min(0).max(1),
  pan_up_motion_strength: z.number().min(0).max(1),
  pan_down_motion_strength: z.number().min(0).max(1),
  rolling_clockwise_motion_strength: z.number().min(0).max(1),
  rolling_anticlockwise_motion_strength: z.number().min(0).max(1),
  output_format: z.enum(['mp4', 'gif']),
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