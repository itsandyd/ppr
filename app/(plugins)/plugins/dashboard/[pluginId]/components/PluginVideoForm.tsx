"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/courses/file-upload";
import { Pencil, PlusCircle, Video, Wand2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ElevenLabsUploader } from "@/components/uploadthing/elevenlabs-uploader";

interface PluginVideoFormProps {
  initialData: {
    videoUrl?: string | null;
    audioUrl?: string | null;
    description?: string | null;
    videoScript?: string | null;
  };
  pluginId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1, {
    message: "Video is required",
  }),
});

export const PluginVideoForm = ({
  initialData,
  pluginId,
}: PluginVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scriptText, setScriptText] = useState("");
  const [processingStage, setProcessingStage] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [audioData, setAudioData] = useState<{
    base64: string;
    filename: string;
    pluginId: string;
  } | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'complete' | 'error'>('idle');
  
  const router = useRouter();

  const toggleEdit = () => setIsEditing(!isEditing);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) {
      setScriptText(initialData.videoScript || initialData.description || "");
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/plugins/${pluginId}`, values);
      toast.success("Plugin updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleGenerate = async () => {
    if (!initialData.videoScript && !initialData.description) {
      toast.error("Please add a video script or description first");
      return;
    }

    const textToUse = initialData.videoScript || initialData.description || "";

    try {
      setIsProcessing(true);
      setProcessingStage("Generating audio with ElevenLabs...");
      setUploadStatus('idle');
      
      const toastId = toast.loading('Generating audio from text...');
      
      const audioResponse = await axios.post("/api/plugins/elevenlabs", {
        text: textToUse,
        pluginId: pluginId
      });
      
      toast.dismiss(toastId);
      
      if (audioResponse.data.audioUrl) {
        toast.success("Audio generated successfully!");
        setProcessingStage("Audio ready! Click 'Create Video' to continue...");
        setUploadStatus('complete');
        
        // Set audioData with empty base64 as a marker that we have server-uploaded audio
        setAudioData({
          base64: "",
          filename: audioResponse.data.audioUrl,
          pluginId: pluginId
        });
      }
      else if (audioResponse.data.audioData) {
        setAudioData({
          base64: audioResponse.data.audioData,
          filename: audioResponse.data.audioFilename,
          pluginId: pluginId
        });

        toast.success("Audio generated successfully!");
        setProcessingStage("Audio ready for upload! Please wait for upload to complete...");
      } 
      else {
        throw new Error('Failed to generate audio - no data or URL received');
      }
    } catch (error: any) {
      console.error("Error generating audio:", error);
      
      if (error.response) {
        console.log('Response status:', error.response.status);
        console.log('Response data:', error.response.data);
        
        if (error.response.status === 404) {
          toast.error("Plugin not found. Please make sure you have the correct access.");
        } else if (error.response.status === 403) {
          toast.error("You don't have permission to edit this plugin. Only admins or the plugin owner can generate scripts.");
        } else {
          toast.error(`Failed to generate audio: ${error.response.status} ${error.response.statusText}`);
        }
      } else if (error.request) {
        console.log('No response received:', error.request);
        toast.error("Failed to generate audio: No response from server");
      } else {
        toast.error(`Failed to generate audio: ${error.message}`);
      }
    }
  };

  const handleCreateVideo = async (audioUrl: string) => {
    try {
      setProcessingStage("Creating video with generated audio...");
      const videoToastId = toast.loading('Creating video with AI...');
      
      // Check if we have a permanent audio URL from uploadthing or directly from server
      console.log("Using audio URL:", audioUrl);
      
      if (!audioUrl) {
        toast.error("No audio URL found. Please regenerate audio.");
        toast.dismiss(videoToastId);
        return;
      }
      
      console.log('Starting video generation with params:', {
        audioUrl,
        coverImageUrl: coverImageUrl || "",
        pluginId,
        textLength: (scriptText || initialData.description || "").length
      });
      
      // Process the audio and cover image to create a video
      const videoResponse = await axios.post("/api/plugins/video-generator", {
        audioUrl: audioUrl,
        coverImageUrl: coverImageUrl || "", 
        pluginId: pluginId,
        textLength: (scriptText || initialData.description || "").length
      }, {
        // Add longer timeout for video generation
        timeout: 60000, // 60 seconds
      });
      
      toast.dismiss(videoToastId);
      
      if (!videoResponse.data.videoUrl) {
        throw new Error('Failed to generate video: No video URL returned');
      }
      
      const videoUrl = videoResponse.data.videoUrl;
      console.log("Video generated successfully:", videoUrl);
      
      // Check if it's likely a placeholder video
      const isPlaceholder = videoUrl.includes("fal.cdn") && !audioUrl.includes(pluginId);
      
      // Update the plugin with the new video URL
      await onSubmit({ videoUrl });
      setIsModalOpen(false);
      
      if (isPlaceholder) {
        toast.success("Demo video created with placeholder content", { duration: 5000 });
        toast((t) => (
          <div>
            <p className="font-medium">Your video was created with placeholder content</p>
            <p className="text-sm mt-1 text-muted-foreground">
              Due to technical limitations, we&apos;ve created a demo video with placeholder content.
              You can upload your own video for a more customized result.
            </p>
            <div className="mt-3">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  toggleEdit();
                }}
                className="px-3 py-2 bg-blue-500 text-white rounded-md text-sm w-full"
              >
                Upload Custom Video
              </button>
            </div>
          </div>
        ), { duration: 10000 });
      } else {
        toast.success("Video generated successfully");
      }
    } catch (error: any) {
      console.error("Error generating video:", error);
      
      // Get detailed error information
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
        
        const errorMessage = error.response.data?.message || 
                            (typeof error.response.data === 'string' ? error.response.data : 'Unknown server error');
        
        // Special handling for FFmpeg errors
        if (errorMessage.includes("ffmpeg error")) {
          toast.error("Video generation failed: There was a problem processing your audio or image files. The system will try to create a simpler version.");
        } else if (errorMessage.includes("service is currently unavailable") || error.response.status === 503) {
          toast.error("Video generation is unavailable in the production environment due to server limitations. Please upload a video manually.");
        } else {
          toast.error(`Video generation failed: ${errorMessage}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
        toast.error("Video generation failed: No response received from server");
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error(`Video generation failed: ${error.message}`);
      }
      
      // Show fallback options
      toast((t) => (
        <div>
          <p className="font-medium">Video generation failed. You can:</p>
          <div className="mt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                setIsEditing(true);
                toggleModal();
              }}
              className="px-3 py-2 bg-slate-200 dark:bg-slate-700 rounded-md text-sm"
            >
              Try again later
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                toggleEdit();
              }}
              className="px-3 py-2 bg-blue-500 text-white rounded-md text-sm"
            >
              Upload video manually
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                // Try with sample audio if we have a generated script
                if (initialData.videoScript) {
                  toast.loading("Trying with sample audio...");
                  setProcessingStage("Using fallback method...");
                  handleGenerate();
                } else {
                  toast.error("No script available for fallback method");
                }
              }}
              className="px-3 py-2 bg-green-500 text-white rounded-md text-sm"
            >
              Try with sample audio
            </button>
          </div>
        </div>
      ), { duration: 10000 });
    } finally {
      setIsProcessing(false);
      setProcessingStage("");
    }
  };

  return (
    <div className="mt-6 border bg-card/50 dark:bg-card/50 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Demo Video
        <div className="flex gap-x-2">
          <Button 
            onClick={toggleModal} 
            variant="outline"
            disabled={isEditing}
          >
            <Wand2 className="h-4 w-4 mr-2" />
            AI Generate
          </Button>
          <Button onClick={toggleEdit} variant="outline" size="sm">
            {isEditing && (
              <>Cancel</>
            )}
            {!isEditing && !initialData.videoUrl && (
              <>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add a video
              </>
            )}
            {!isEditing && initialData.videoUrl && (
              <>
                <Pencil className="h-4 w-4 mr-2" />
                Edit video
              </>
            )}
          </Button>
        </div>
      </div>
      {!isEditing && (
        !initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-sky-100/50 dark:bg-sky-900/20 rounded-md">
            <Video className="h-10 w-10 text-slate-400 dark:text-slate-600" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <video
              className="w-full h-full rounded-md"
              src={initialData.videoUrl}
              controls
            />
          </div>
        )
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="pluginVideo"
            onChange={(url?: string) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Upload a demo video of your plugin in action
          </div>
        </div>
      )}

      <Modal
        title="Generate Video with AI"
        description="Create a video by combining your cover image with AI-generated audio from your script"
        isOpen={isModalOpen}
        onClose={toggleModal}
      >
        <div className="space-y-4 py-2 pb-4">
          {/* Alert for temporary limitations */}
          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-3 rounded-md">
            <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200">Video Generation Limitations</h4>
            <p className="text-xs mt-1 text-amber-700 dark:text-amber-300">
              Due to technical limitations, video generation may use a placeholder video for demonstration purposes.
              For best results, prepare your audio file independently and upload it manually.
            </p>
          </div>
          
          {/* Show audio upload progress when audio data exists */}
          {audioData && (
            <div className="w-full p-2 bg-slate-100 rounded-md">
              <div className="text-sm font-medium mb-2">Audio Processing</div>
              <ElevenLabsUploader
                audioData={audioData.base64}
                audioFilename={audioData.filename}
                pluginId={audioData.pluginId}
                onUploadComplete={(url: string) => {
                  setUploadStatus('complete');
                  toast.success("Audio uploaded successfully");
                  // Start video generation now that audio is ready
                  handleCreateVideo(url);
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
              placeholder="Enter the script for your plugin demonstration video..."
              value={scriptText}
              onChange={(e) => setScriptText(e.target.value)}
              rows={8}
              className="resize-none"
              disabled={isProcessing}
            />
            {initialData.description && !scriptText && (
              <div className="mt-2 text-xs text-muted-foreground">
                <p>If left empty, your plugin description will be used as the script.</p>
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
              Upload a custom cover image for your video or leave empty to use the plugin image.
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
                  This may take up to 2-3 minutes depending on script length.
                </p>
                
                {/* Only show the "Create Video" button when audio is ready */}
                {audioData && uploadStatus === 'complete' && (
                  <Button
                    onClick={() => handleCreateVideo(audioData.filename)}
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
              {isProcessing ? "Processing..." : "Generate Video"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}; 