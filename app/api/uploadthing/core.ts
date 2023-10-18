import { auth } from "@clerk/nextjs";

import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();
 
const handleAuth = () => {
    const userId = auth();
    if (!userId) throw new Error("Unauthorized");
    return { userId: userId };
}
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 }})
        .middleware(() => handleAuth()) 
        .onUploadComplete(() => {}),
    messageFile: f(["image", "pdf", "video", "audio" ])
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
    courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 }})
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
    courseAttachment: f(["text", "image", "video", "audio", "pdf"])
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
    chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: "512GB" } })
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
    songImageFile: f({ image: { maxFileSize: "128MB", maxFileCount: 1 }})
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
    songMusicFile: f({ audio: { maxFileSize: "128MB", maxFileCount: 1 }})
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
    coachingImages: f({ image: { maxFileSize: "4MB", maxFileCount: 1 }})
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;