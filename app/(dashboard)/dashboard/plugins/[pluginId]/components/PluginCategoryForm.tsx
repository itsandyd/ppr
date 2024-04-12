"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Course, Plugin } from "@prisma/client";
import { Combobox } from "@/components/ui/combobox";

interface CategoryFormProps { 
  initialData: Plugin;
  pluginId: string;
  effectCategories: { label: string; value: string;  }[];
  instrumentCategories: { label: string; value: string;  }[];
  types: { label: string; value: string;  }[];
};

const formSchema = z.object({
  pluginTypeId: z.string().min(1),
  pluginCategoryId: z.string().min(1),
});

export const PluginCategoryForm = ({
  initialData,
  pluginId,
  effectCategories,
  instrumentCategories,
  types,
}: CategoryFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null | undefined>(null);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pluginTypeId: initialData?.pluginTypeId || "",
      pluginCategoryId: initialData?.categoryId || "",
    },
});

  const { isSubmitting, isValid } = form.formState;

  useEffect(() => {
    const subscription = form.watch((value) => {
      setSelectedType(value.pluginTypeId);
    });

    return () => subscription.unsubscribe();
  }, [form.watch, form ]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values); 
      await axios.patch(`/api/plugins/${pluginId}`, values);
      toast.success("Plugin category updated"); // Updated success message
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }

  const selectedOption = types.find((option) => option.value === selectedType);
  const categoryOptions = selectedType === 'effect' ? effectCategories : instrumentCategories;

  return (
    <div className="mt-6 border rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Plugin Type
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Type
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className={cn("text-sm mt-2", !initialData.categoryId && "italic"
        )}>
          {selectedOption?.label || "No category"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="pluginTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      options={types}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pluginCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      options={categoryOptions}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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

export default PluginCategoryForm;