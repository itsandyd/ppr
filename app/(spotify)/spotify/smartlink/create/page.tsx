"use client"

import { Button } from "@/components/ui/button";
import { Collapsible } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { useState } from "react";

import { useForm } from "react-hook-form";

export default function CreateSmartLinkPage() {
  const { register, handleSubmit } = useForm();
  const [preview, setPreview] = useState<{ artistName?: string; trackTitle?: string }>({});

  const onSubmit = (data: any) => {
    setPreview(data);
  };

  return (
    <div className="flex">
      <div className="w-1/2 p-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Collapsible title="Source">
            <Input {...register("source")} placeholder="Enter source or track URL" />
          </Collapsible>
          {/* Add other sections here */}
          <Button type="submit">Submit</Button>
        </form>
      </div>
      <div className="w-1/2 p-4">
        {/* Display the mobile phone preview here */}
        <h2>Preview</h2>
        <p>Artist Name:</p>
        {preview.artistName}
        <p>Track Title:</p>
        {preview.trackTitle}
        {/* Add other preview fields here */}
      </div>
    </div>
  );
}