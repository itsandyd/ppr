import * as z from "zod"

export const formSchema = z.object({
    prompt: z.string().min(1, {
        message: "Prompt is required"
    }),
    notLike: z.string().min(1, {
        message: "Prompt is required"
    }),
    duration: z.number().min(1, {
        message: "Duration must be at least 1 second"
    }).max(30, {
        message: "Duration must be no more than 30 seconds"
    }),
    apiRoute: z.string(),
    seed_image_id: z.string().optional(),
    alpha: z.number().default(0.5),
    denoise: z.number().default(0.75),
    num_inference_steps: z.number().default(50),
})
