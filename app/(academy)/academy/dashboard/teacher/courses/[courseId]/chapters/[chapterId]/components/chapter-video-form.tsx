"use client";

import * as z from "zod";
import axios from "axios";

import { Pencil, PlusCircle, Video, Wand2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Course, CourseChapter, MuxData } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "@/components/courses/file-upload";
import MuxPlayer from "@mux/mux-player-react";
import { Markdown } from "@/components/markdown";
import { ElevenLabsUploader } from "@/components/uploadthing/elevenlabs-uploader";

interface ChapterVideoProps {
  initialData: CourseChapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
};

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId
}: ChapterVideoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scriptText, setScriptText] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState("");
  const [audioData, setAudioData] = useState<{
    base64: string;
    filename: string;
    chapterId: string;
  } | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'complete' | 'error'>('idle');

  const toggleEdit = () => setIsEditing((current) => !current);
  const toggleModal = () => {
    setIsModalOpen((current) => !current);
    // Pre-populate with chapter description when opening the modal
    if (!isModalOpen && initialData.description) {
      setScriptText(initialData.description);
    }
  };

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toast.success("Chapter updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }

  const handleGenerate = async () => {
    if (!scriptText && !initialData.description) {
      toast.error("Please provide a script or add chapter content first");
      return;
    }

    // Use script from textarea if provided, otherwise use chapter description
    const textToUse = scriptText || initialData.description || "";

    try {
      setIsProcessing(true);
      setProcessingStage("Generating audio with ElevenLabs...");
      setUploadStatus('idle');  // Reset upload status when generating new audio
      
      // Call the Eleven Labs API to generate audio from text
      const toastId = toast.loading('Generating audio from text...');
      
      // First, get the audio data
      const audioResponse = await axios.post("/api/elevenlabs", {
        text: textToUse,
        chapterId: chapterId
      });
      
      toast.dismiss(toastId);
      
      // Check if we received a direct URL (server uploaded successfully)
      if (audioResponse.data.audioUrl) {
        // Server handled upload directly
        toast.success("Audio generated and uploaded successfully!");
        setProcessingStage("Audio ready! Click 'Create Video' to continue...");
        setUploadStatus('complete');  // Set upload as complete if server handled it
        
        // Even though we don't need the client-side uploader, we'll set a placeholder
        // to make the UI state machine work properly
        setAudioData({
          base64: "",
          filename: audioResponse.data.audioUrl, // Use URL as filename (it's not used anyway)
          chapterId: chapterId
        });
      }
      // Otherwise, check if we received audio data for client-side upload
      else if (audioResponse.data.audioData) {
        // Store the audio data for the client-side uploader component
        setAudioData({
          base64: audioResponse.data.audioData,
          filename: audioResponse.data.audioFilename,
          chapterId: chapterId
        });

        // Show a success message for audio generation
        toast.success("Audio generated successfully!");
        
        // Show the "Send to Video Generator" button by setting a state
        setProcessingStage("Audio ready for upload! Please wait for upload to complete...");
      } 
      else {
        throw new Error('Failed to generate audio - no data or URL received');
      }
      
    } catch (error) {
      console.error("Error generating audio:", error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to generate audio. Please try again.";
        
      toast.error(errorMessage);
      setIsProcessing(false);
      setProcessingStage("");
    }
  };

  // New function to handle sending audio to video generator
  const handleCreateVideo = async () => {
    if (!audioData) {
      toast.error("No audio data available. Please generate audio first.");
      return;
    }

    if (uploadStatus !== 'complete') {
      toast.error("Please wait for audio upload to complete before creating the video.");
      return;
    }

    try {
      setProcessingStage("Creating video with generated audio...");
      const videoToastId = toast.loading('Creating video with AI...');
      
      // Check if we have a permanent audio URL from uploadthing
      console.log("Fetching chapter data to get audio URL...");
      const chapterResponse = await axios.get(`/api/chapters/${chapterId}`);
      const audioUrl = chapterResponse.data?.audioUrl;
      
      console.log("Retrieved audio URL:", audioUrl);
      
      if (!audioUrl) {
        toast.error("No audio URL found. Please regenerate audio.");
        toast.dismiss(videoToastId);
        return;
      }
      
      if (audioUrl.startsWith('elevenlabs-temp-')) {
        toast.error("Audio upload not complete. Please wait for audio to finish uploading or try again.");
        toast.dismiss(videoToastId);
        return;
      }
      
      console.log("Audio URL is valid, proceeding with video generation");
      
      // Process the audio and cover image to create a video
      const videoResponse = await axios.post("/api/video-generator", {
        audioUrl: audioUrl, // Use the permanently stored audio URL
        coverImageUrl: coverImageUrl || "", 
        chapterId: chapterId,
        textLength: (scriptText || initialData.description || "").length
      });
      
      toast.dismiss(videoToastId);
      
      if (!videoResponse.data.videoUrl) {
        throw new Error('Failed to generate video');
      }
      
      const videoUrl = videoResponse.data.videoUrl;
      console.log("Video generated successfully:", videoUrl);
      
      setGeneratedVideoUrl(videoUrl);
      toast.success("Video generated successfully");
      
      // Automatically save the generated video
      await onSubmit({ videoUrl });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error generating video:", error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to generate video. Please try again.";
        
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
      setProcessingStage("");
    }
  };

  return (
    <div className="mt-6 border rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
         Chapter video
        <div className="flex gap-x-2">
          <Button 
            onClick={toggleModal} 
            variant="outline"
            disabled={isEditing}
          >
            <Wand2 className="h-4 w-4 mr-2" />
            AI Generate
          </Button>
          <Button onClick={toggleEdit} variant="ghost">
            {isEditing && (
              <>Cancel</>
            )}
            {!isEditing && !initialData?.videoUrl && (
              <>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add a video
              </>
            )}
            {!isEditing && initialData?.videoUrl && (
              <>
                <Pencil className="h-4 w-4 mr-2" />
                Edit video
              </>
            )}
          </Button>
        </div>
      </div>
      {!isEditing && (
        !initialData?.videoUrl ? (
        <div>
          <Video className="h-10 w-10 mr-2" />
        </div>
      ) : (
        <div className="relative aspect-video mt-2">
          {/* {initialData?.muxData?.playbackId ? (
            <MuxPlayer 
              playbackId={initialData.muxData.playbackId}
            />
          ) : ( */}
            {/* // If we don't have MuxData, use a standard video player with the direct URL */}
            <video 
              className="w-full h-full rounded-md" 
              src={initialData.videoUrl} 
              controls
            />
          {/* )} */}
        </div>
      )
    )}
      {isEditing && (
       <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4"> 
            Upload this chapter&apos;s video.
          </div>
       </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process. Refresh the page if video does not appear.
        </div>
      )}

      <Modal
        title="Generate Video with AI"
        description="Create a video by combining your cover image with AI-generated audio from your script"
        isOpen={isModalOpen}
        onClose={toggleModal}
      >
        <div className="space-y-4 py-2 pb-4">
          {/* Show audio upload progress when audio data exists */}
          {audioData && (
            <div className="w-full p-2 bg-slate-100 rounded-md">
              <div className="text-sm font-medium mb-2">Audio Processing</div>
              <ElevenLabsUploader
                audioData={audioData.base64}
                audioFilename={audioData.filename}
                chapterId={audioData.chapterId}
                onUploadComplete={(url: string) => {
                  setUploadStatus('complete');
                  toast.success("Audio uploaded successfully");
                  // We'll update the stage to show the Create Video button
                  setProcessingStage("Audio uploaded! Click 'Create Video' to continue...");
                }}
                onUploadError={(error: Error) => {
                  setUploadStatus('error');
                  toast.error(`Upload failed: ${error.message}`);
                  setProcessingStage("Audio upload failed. Please try again.");
                }}
                onUploadStart={() => {
                  setUploadStatus('uploading');
                  setProcessingStage("Uploading audio file...");
                }}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Script for AI Voice</Label>
            <Textarea
              placeholder="Enter the script for your chapter video..."
              value={scriptText}
              onChange={(e) => setScriptText(e.target.value)}
              rows={8}
              className="resize-none"
              disabled={isProcessing}
            />
            {initialData.description && !scriptText && (
              <div className="mt-2 text-xs text-muted-foreground">
                <p>If left empty, your chapter description will be used as the script:</p>
                <div className="p-2 mt-1 bg-muted rounded-md max-h-[100px] overflow-y-auto">
                  <Markdown value={initialData.description} />
                </div>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>Cover Image (Optional)</Label>
            <div className="w-full">
              <FileUpload
                endpoint="courseImage"
                onChange={(url) => {
                  if (url) {
                    setCoverImageUrl(url);
                  }
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Upload a custom cover image or leave empty to use the course cover.
            </p>
          </div>
          
          {isProcessing && (
            <div className="p-4 rounded-md bg-muted">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full animate-pulse w-full"></div>
                </div>
                <p className="text-sm text-center">{processingStage}</p>
                <p className="text-xs text-muted-foreground text-center">
                  This may take up to 1-2 minutes depending on text length.
                </p>
                
                {/* Only show the "Create Video" button when audio is ready */}
                {audioData && uploadStatus === 'complete' && (
                  <Button
                    onClick={handleCreateVideo}
                    className="mt-2"
                    variant="default"
                  >
                    Create Video
                  </Button>
                )}

                {/* If upload is still in progress, show a loading indicator */}
                {audioData && uploadStatus === 'uploading' && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="animate-spin h-4 w-4 text-primary">⟳</div>
                    <p className="text-sm">Uploading audio...</p>
                  </div>
                )}

                {/* If upload failed, show a retry button */}
                {audioData && uploadStatus === 'error' && (
                  <Button
                    onClick={handleGenerate}
                    className="mt-2"
                    variant="destructive"
                  >
                    Retry Audio Generation
                  </Button>
                )}
              </div>
            </div>
          )}
          
          <div className="pt-6 space-x-2 flex items-center justify-end w-full">
            <Button
              disabled={isProcessing}
              variant="outline"
              onClick={toggleModal}
            >
              Cancel
            </Button>
            <Button
              disabled={isProcessing || (!scriptText && !initialData.description)}
              onClick={handleGenerate}
            >
              {isProcessing && !audioData ? "Processing..." : "Generate Audio"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ChapterVideoForm;