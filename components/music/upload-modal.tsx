

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";


import { useRouter } from "next/navigation";
import uniqueid from "uniqid";
import { toast } from "react-hot-toast";
// import { FileUpload } from "../file-upload";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

const formSchema = z.object({
    author: z.string().min(1, {
        message: "Author name is required",
    }),
    title: z.string().min(1, {
        message: "Song title is required",
    }),
    song: z.array(z.any()).min(1, {
        message: "Song file is required",
    }),
    // image: z.array(z.any()).min(1, {
    //     message: "Image file is required",
    // }),
})

export const UploadModal = () => {
    const { isOpen, onClose, type } = useModal();
    // const { user } = useUser();
    // const supabaseClient = useSupabaseClient();
    const router = useRouter();

    // const { userId } = auth();

    const isModalOpen = isOpen && type === "uploadSong";

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            author: '',
            title: '',
            song: [],
            // image: [],
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
        //   setIsLoading(true);
      
        //   const imageFile = values.image[0];
          const songFile = values.song[0];
      
          if ( !songFile ) {
            toast.error("Missing fields");
            return;
          }
      
          const uniqueID = uniqueid();
      
          // Upload Song
          // Upload Image
          // replace your supabaseClient code with Prisma Client code
        //   const song = await db.song.create({
        //     data: {
        //       author: values.author,
        //       title: values.title,
        //       id: uniqueID,
        //       songPath: `song-${values.title}-${uniqueID}`,
            //   user: userId || "",
            //   songFile: `song-${values.title}-${uniqueID}`,
            //   imageFile: `image-${values.title}-${uniqueID}`
              // any other fields you have
        //     },
        //   });

        //   if (!song) {
        //     toast.error("Something went wrong");
        //     return;
        //   }
      
          router.refresh();
        //   setIsLoading(false);
          toast.success("Song uploaded successfully");
          form.reset();
          onClose();
          
        } catch (error) {
          toast.error("Something went wrong");
        } finally {
        //   setIsLoading(false);
        }
      }

    const handleClose = () => {
        form.reset();
        onClose();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Upload a song
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Upload an mp3 file
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                        >
                                            Song Title
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Enter song title"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="author"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                        >
                                            Song Author
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Enter author name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="song"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            {/* <FileUpload
                                                endpoint="songFile"
                                                value={field.value}
                                                onChange={field.onChange}
                                            /> */}
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            {/* <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <FileUpload
                                                endpoint="imageFile"
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            /> */}
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant="default" type="submit" disabled={isLoading}>
                                Upload
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default UploadModal;