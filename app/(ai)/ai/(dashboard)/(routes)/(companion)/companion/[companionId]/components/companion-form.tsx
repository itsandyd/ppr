"use client"

import * as z from "zod";
import { Category, Companion } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import axios from "axios";

import { useRouter } from "next/navigation";
import { CompanionImageUpload } from "@/components/ai/companion/companion-image-upload";
import { useToast } from "@/components/ui/use-toast";

const PREAMBLE = `You are an AI companion for music production! You are designed to enhance music producers creative process and help them achieve the perfect mix. You help professional music producers or music producers just starting out. You provide the tools and insights needed to refine a music production mix and bring musical visions to life. From suggesting EQ adjustments, recommending compression settings, or even helping music producers select the perfect reverb for their track, you are here to assist you every step of the way.`;

const SEED_CHAT = `User: Hey there! I'm working on a new track and could use some help with the mix.

AI: Hey! I'd love to help out. What specifically are you looking to improve in your mix?

User: The bass and drums are clashing a bit, and I'm having trouble making the vocals sit well in the mix.

AI: Got it. It sounds like there might be some frequency overlap between the bass and drums. Have you tried carving out some space in the EQ for each instrument?

User: I have cut some lows from the drums and boosted the bass around 80Hz, but it still doesn’t sound right.

AI: It's great that you've made those adjustments. Sometimes the clashing can also be because of the kick drum. Try sidechain compressing the bass to the kick drum. This will make the bass dip slightly every time the kick hits, creating more space in the mix. Also, for the vocals, have you applied any compression or EQ?

User: I have added some compression to the vocals, but I haven’t done much EQ.

AI: Compression is a good start. For the EQ on vocals, a common approach is to do a high-pass filter to remove unnecessary low frequencies, a slight boost in the high-mids for presence, and sometimes a small cut in the mid-range to avoid muddiness. Additionally, adding a touch of reverb can also help the vocals sit better in the mix. Would you like some suggestions on reverb settings?

User: Yes, that would be great. I am using a plate reverb right now.

AI: Plate reverb is a great choice for vocals. Try starting with a decay time of around 1.5-2 seconds and adjust from there to taste. Also, roll off some low frequencies on the reverb to avoid it getting too muddy. Lastly, make sure the wet/dry mix is not too high, start at around 20% and adjust to taste.

User: Awesome, I will try those settings. Thanks for your help!

AI: You're welcome! Feel free to reach out anytime if you need more help. Happy mixing!`


interface CompanionFormProps {
    initialData: Companion | null;
    categories: Category[];
}

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required",
    }),
    description: z.string().min(1, {
        message: "Description is required",
    }),
    instructions: z.string().min(200, {
        message: "Instructions require at least 200 characters.",
    }),
    seed: z.string().min(200, {
        message: "Seed require at least 200 characters.",
    }),
    src: z.string().min(1, {
        message: "Image is required.",
    }),
    categoryId: z.string().min(1, {
        message: "Category is required.",
    }),
});

export const CompanionForm = ({
    initialData,
    categories
}: CompanionFormProps) => {

    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            description: "",
            instructions: "",
            seed: "",
            src: "",
            categoryId: undefined,
        },
    });

    const isLoading = form.formState.isLoading;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (initialData) {
                // Update Companion Functionality
                await axios.patch(`/api/ai/companion/${initialData.id}`, values);
            } else {
                // Create companion functionality
                await axios.post(`/api/ai/companion`, values);
            }

            toast({
                description: "Your companion has been created.",
            });

            router.refresh();
            router.push("/ai/companion");
            
        } catch (error) {
            toast({
                variant: "destructive",
                description: "Something went wrong.",
            });
    }
}

    return (
        <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 pb-10"
                    >
                    <div className="space-y-2 w-full col-span-2">
                        <div>
                            <h3 className="text-lg font-medium">
                                General Information
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                General informaiton about your companion.
                            </p>
                        </div>
                        <Separator className="bg-primary/10"/>
                    </div>
                    <FormField
                        name="src"
                        render={({ field }) => (
                            <FormItem
                                className="flex flex-col items-center justify-center space-y-4">
                                <FormControl>
                                    <CompanionImageUpload 
                                        disabled={isLoading}
                                        onChange={field.onChange}
                                        value={field.value}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField 
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="col-span-2 md:col-span-1">
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input 
                                            disabled={isLoading}
                                            placeholder="Your Music Making Companion"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        This is how your companion will be named.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            name="description"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="col-span-2 md:col-span-1">
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input 
                                            disabled={isLoading}
                                            placeholder="A description of your Music Making Companion"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        This is how your companion will be described.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select disabled={isLoading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue defaultValue={field.value} placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select a category for your companion.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
                    </div>
                    <div className="space-y-2 w-full">
                        <div>
                            <h3 className="text-lg font-medium">
                                Configuration
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                Detailed instructions for your AI companion behavior.
                            </p>
                        </div>
                        <Separator className="bg-primary/10"/>
                    </div>
                    <FormField 
                            name="instructions"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="col-span-2 md:col-span-1">
                                    <FormLabel>Instructions</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            rows={7}
                                            className="bg-background resize-none" 
                                            disabled={isLoading}
                                            placeholder={PREAMBLE}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        Describe in detail your companion&apos;s behavior.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            name="seed"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="col-span-2 md:col-span-1">
                                    <FormLabel>Example Conversation</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            rows={7}
                                            className="bg-background resize-none" 
                                            disabled={isLoading}
                                            placeholder={SEED_CHAT}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        Write couple of examples of a human chatting with your AI companion, write expected answers.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="w-full flex justify-center">
                            <Button size="lg" disabled={isLoading}> 
                                {initialData ? "Edit your companion" : "Create your companion"}
                                <Wand2 className="w-4 h-4 ml-2"/>
                            </Button>
                        </div>
                </form>
            </Form>
        </div>
    );
}