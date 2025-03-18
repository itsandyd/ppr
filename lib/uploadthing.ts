"use client";

import {
  generateUploadButton,
  generateUploadDropzone,
  generateUploader,
  generateReactHelpers
} from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
export const Uploader = generateUploader<OurFileRouter>();

// Add the useUploadThing hook for direct access to upload functionality
export const { useUploadThing } = generateReactHelpers<OurFileRouter>(); 