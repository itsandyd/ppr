"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useUploadThing } from "@/lib/uploadthing";

interface FileResponse {
  url: string;
  name: string;
  size: number;
}

interface ElevenLabsUploaderProps {
  audioData: string;
  audioFilename: string;
  chapterId: string;
  onUploadComplete?: (audioUrl: string) => void;
  onUploadError?: (error: Error) => void;
  onUploadStart?: () => void;
}

export function ElevenLabsUploader({
  audioData,
  audioFilename,
  chapterId,
  onUploadComplete,
  onUploadError,
  onUploadStart
}: ElevenLabsUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  
  // Initialize UploadThing
  const { startUpload, isUploading: isUploadingUT } = useUploadThing("elevenLabsAudio", {
    onClientUploadComplete: async (res: FileResponse[]) => {
      if (!res?.[0]?.url) {
        setError("No URL returned from upload");
        return;
      }
      
      const url = res[0].url;
      console.log("Upload complete! URL:", url);
      
      try {
        // Update chapter with the permanent URL
        await axios.post('/api/chapters/update-audio', {
          chapterId,
          audioUrl: url
        });
        
        console.log("Chapter updated with audio URL:", url);
        setIsComplete(true);
        toast.success("Audio uploaded successfully");
        
        if (onUploadComplete) {
          onUploadComplete(url);
        }
      } catch (err) {
        console.error("Error updating chapter:", err);
        setError("Upload succeeded but failed to update chapter");
        
        if (onUploadError) {
          onUploadError(new Error("Failed to update chapter with audio URL"));
        }
      }
    },
    onUploadError: (error: Error) => {
      console.error("Upload error:", error);
      setError(error.message);
      
      if (onUploadError) {
        onUploadError(error);
      }
    },
    onUploadBegin: () => {
      console.log("Upload starting...");
      setIsUploading(true);
      
      if (onUploadStart) {
        onUploadStart();
      }
    },
  });
  
  // Create the file once when the component mounts
  useEffect(() => {
    const createFile = async () => {
      try {
        if (!audioData) return;
        
        // Convert base64 to binary
        const byteCharacters = atob(audioData);
        const byteArray = new Uint8Array(byteCharacters.length);
        
        for (let i = 0; i < byteCharacters.length; i++) {
          byteArray[i] = byteCharacters.charCodeAt(i);
        }
        
        // Create a file from the binary data
        const newFile = new File(
          [byteArray], 
          audioFilename, 
          { type: 'audio/mpeg' }
        );
        
        console.log(`Created file: ${newFile.name}, size: ${newFile.size} bytes`);
        setFile(newFile);
        
        // Start upload automatically
        await startUpload([newFile]);
      } catch (err) {
        console.error("Error creating file:", err);
        setError("Failed to process audio data");
        
        if (onUploadError) {
          onUploadError(err instanceof Error ? err : new Error("Failed to create file from audio data"));
        }
      }
    };
    
    createFile();
  }, [audioData, audioFilename, startUpload]);
  
  // Always use isUploadingUT from the hook instead of our own state
  const isCurrentlyUploading = isUploadingUT || isUploading;
  
  return (
    <div className="mt-2">
      <div className="flex items-center gap-2">
        {isCurrentlyUploading ? (
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading audio {file ? `(${Math.round(file.size / 1024)} KB)` : ''}...
          </div>
        ) : isComplete ? (
          <span className="text-sm text-green-600">Audio uploaded successfully</span>
        ) : error ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-red-600">{error}</span>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => window.location.reload()}
              disabled={isCurrentlyUploading}
            >
              Retry
            </Button>
          </div>
        ) : file ? (
          <div className="text-sm text-muted-foreground">
            Starting upload for {Math.round(file.size / 1024)} KB audio file...
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            Processing audio data...
          </div>
        )}
      </div>
    </div>
  );
} 