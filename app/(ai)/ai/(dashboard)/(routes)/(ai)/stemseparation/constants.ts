import * as z from "zod"

export const formSchema = z.object({
    audioFile: z.any().refine(file => file instanceof File, {
        message: "Audio file is required",
    }),
    clip_mode: z.enum(["rescale", "clamp"]).default("rescale"),
    stem: z.enum(["vocals", "bass", "drums", "guitar", "piano", "other"]),
    shifts: z.number().default(1),
    overlap: z.number().default(0.25),
    output_format: z.enum(["mp3", "wav", "flac"]),
    mp3_bitrate: z.number().default(320),
    float32: z.enum(["Yes", "No"]).default("No"),
    model_name: z.enum(["htdemucs", "htdemucs_ft", "htdemucs_6s", "hdemucs_mmi", "mdx", "mdx_q", "mdx_extra", "mdx_extra_q"]),
})
