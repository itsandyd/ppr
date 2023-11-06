"use client"

import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  facebookAccount: z.string().nonempty({ message: "Facebook account is required." }),
  facebookFanPage: z.string().optional(),
  facebookAdsAccount: z.string().optional(),
  instagramAccount: z.string().optional(),
  pixel: z.string().optional(),
  // ... add other fields here
});

export default function AdCampaignForm() {
    const form = useForm({
      resolver: zodResolver(formSchema),
    });
  
    return (
        <div className="p-24">
            <h1 className="text-3xl font-bold mb-4">Create ad campaign</h1>
      <Form {...form}>
        <FormField
  control={form.control}
  name="facebookAccount"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Facebook Account</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormDescription>Connect your Facebook account to set up the Ad campaign.</FormDescription>
    </FormItem>
  )}
/>
        <FormField
          control={form.control}
          name="facebookFanPage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facebook Fan Page</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="facebookAdsAccount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facebook Ads Account</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="instagramAccount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instagram Account</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pixel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pixel</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </Form>
      </div>
    );
  }