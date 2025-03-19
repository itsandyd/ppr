"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { SidebarProvider } from "../../../components/providers/sidebar-provider";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconBadge } from "@/components/courses/icon-badge";
import { LayoutDashboard } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Title is required",
  }),
});

const CreatePage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ""
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/plugins", values);
      router.push(`/plugins/dashboard/plugins/${response.data.id}`);
      toast.success("Plugin created");
    } catch {
      toast.error("Something went wrong");
    }
  }

  return ( 
    <SidebarProvider>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Create a New Plugin</h1>
            <span className="text-sm text-muted-foreground">
              Start by giving your plugin a name
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} variant="success" />
              <h2 className="text-xl font-bold">
                Plugin Details
              </h2>
            </div>
            
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 mt-8"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Plugin Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="e.g. 'My Plugin'"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        What is the name of your plugin?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-x-2">
                  <Link href="/plugins">
                    <Button
                      type="button"
                      variant="ghost"
                    >
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                  >
                    Continue
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </SidebarProvider>
   );
}
 
export default CreatePage;