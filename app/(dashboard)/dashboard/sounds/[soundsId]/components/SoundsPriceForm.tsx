"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Course, Plugin } from "@prisma/client";
import { formatPrice } from "@/lib/format";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PriceFormProps {
  initialData: Plugin;
  soundsId: string;
};

const formSchema = z.object({
    price: z.coerce.number().optional(),
    pricingType: z.enum(['FREE', 'PAID']),
    purchaseUrl: z.string().url().optional(), // For PAID plugins
    optInFormUrl: z.string().url().optional(), // For FREE plugins, ensure this matches your validation requirements
  });

export const SoundsPriceForm = ({
  initialData,
  soundsId
}: PriceFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData?.price || undefined,
      pricingType: initialData?.pricingType || 'FREE', // Assuming 'pricingType' is part of your Plugin model
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const pricingType = form.watch("pricingType");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/sounds/${soundsId}`, values);
      toast.success("Sounds updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Sounds price
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit price
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
  <div>
    <p className={cn("text-sm mt-2", !initialData.price && "text-slate-500 italic")}>
      {initialData.pricingType === "PAID" && initialData.price
        ? `${formatPrice(initialData.price)} (Paid)`
        : initialData.pricingType === "PAID"
        ? "Paid (No price set)"
        : "Free"}
    </p>
    {initialData.pricingType === "FREE" && initialData.optInFormUrl && (
      <p className="text-sm mt-2">
        Opt-In URL: <a href={initialData.optInFormUrl} className="text-blue-500 hover:underline">{initialData.optInFormUrl}</a>
      </p>
    )}
  </div>
)}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="pricingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pricing Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pricing type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="FREE">Free</SelectItem>
                      <SelectItem value="PAID">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose whether your plugin is free or paid.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {pricingType === "PAID" && (
            <FormField
  control={form.control}
  name="purchaseUrl"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Purchase URL</FormLabel>
      <Input
        type="text"
        placeholder="Enter the URL where the plugin can be purchased"
        {...field}
        disabled={form.watch("pricingType") !== "PAID"} // Disable input if pricingType is not PAID
      />
      <FormDescription>
        Provide the URL where users can purchase this plugin.
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
            )}
    {pricingType === "FREE" && (
<FormField
  control={form.control}
  name="optInFormUrl"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Opt-In URL</FormLabel>
      <Input
        type="text"
        placeholder="Enter the URL for user opt-in"
        {...field}
        disabled={form.watch("pricingType") !== "FREE"} // Disable input if pricingType is not FREE
      />
      <FormDescription>
        Provide the URL where users can opt-in or register to access the plugin for free.
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
            )}

                     {/* <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      disabled={isSubmitting}
                      placeholder="Set a price for your plugin"
                      {...field}
                      />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}

export default SoundsPriceForm;