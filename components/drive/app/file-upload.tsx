"use client";

import toast from "react-hot-toast";

import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { Value } from "@radix-ui/react-select";

interface FileUploadProps {
    onChange: (url?: string) => void;
    endpoint: keyof typeof ourFileRouter;
    value?: string; // Add this line
  };

  export const FileUpload = ({
    onChange,
    endpoint,
    value,
  }: FileUploadProps) => {
    return (
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          // Use the uploaded file URL if available, otherwise use the default value
          onChange(res?.[0].url || value);
        }}
        onUploadError={(error: Error) => {
          toast.error(`${error?.message}`);
        }}
      />
    )
  }