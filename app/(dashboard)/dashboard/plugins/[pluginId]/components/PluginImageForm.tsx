"use client";

import * as z from "zod";
import axios from "axios";

import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


import { Course, Plugin } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "@/components/courses/file-upload";

interface ImageFormProps {
  initialData: Plugin
  pluginId: string;
};

const formSchema = z.object({
  image: z.string().min(1, {
    message: "Image is required",
  }),
});

export const PluginImageForm = ({
  initialData,
  pluginId
}: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/plugins/${pluginId}`, values);
      toast.success("Plugin updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Plugin image
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && (
            <>Cancel</>
          )}
          {!isEditing && !initialData?.image && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add an image
            </>
          )}
          {isEditing && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit an image
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        !initialData?.image ? (
        <div>
          <ImageIcon className="h-10 w-10 text-slate-500 mr-2" />
        </div>
      ) : (
        <div className="relative aspect-video mt-2">
          <Image 
            alt="upload"
            fill
            className="object-cover rounded-md"
            src={initialData?.image}
          />
        </div>
      )
    )}
      {isEditing && (
       <div>
          <FileUpload 
            endpoint="courseImage"
            onChange={(url) =>{
              if (url) {
                onSubmit({
                  image: url
                })
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4"> 
            16:9 aspect ratio recommended
          </div>
       </div>
      )}
    </div>
  )
}

export default PluginImageForm;