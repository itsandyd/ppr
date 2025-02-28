import { auth } from "@clerk/nextjs";

import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();
 
const handleAuth = () => {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");
    return { userId };
}
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 }})
        .middleware(() => handleAuth()) 
        .onUploadComplete(() => {}),
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
    aiMusicFile: f({ audio: { maxFileSize: "128MB", maxFileCount: 1 }})
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
    musicFile: f({ audio: { maxFileSize: "128MB", maxFileCount: 1 }})
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
    storageUpload: f(["text", "image", "video", "audio", "pdf", "blob"])
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
    subaccountLogo: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
    avatar: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
    agencyLogo: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
    media: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
    songImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
    playlistImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;