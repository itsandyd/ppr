'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import * as z from "zod";
import Image from 'next/image';
import { IconType } from 'react-icons';

import Container from '@/app/components/Container';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { categories } from '@/lib/coaching/constants';
import type { CategoryType } from '@/lib/coaching/constants';
import CategoryInput from '@/components/coaching/inputs/CategoryInput';

// Define an interface for category items
interface CategoryItem {
  label: string;
  icon: IconType;
  description: string;
}

// Create form schema with zod
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(1, "Price must be at least 1"),
  category: z.string().min(1, "Category is required"),
  customCategory: z.string().optional(),
  imageSrc: z.string().optional(),
});

type ListingFormValues = z.infer<typeof formSchema>;

const CreateListing = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string>('');

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 100,
      category: '',
      customCategory: '',
      imageSrc: ''
    }
  });

  const watchCategory = form.watch('category');
  const isCustomCategory = watchCategory === 'Custom';

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Preview image
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setImageSrc(event.target.result);
          form.setValue("imageSrc", event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit = async (data: ListingFormValues) => {
    setIsLoading(true);
    
    try {
      // Use the custom category if selected
      if (data.category === 'Custom' && data.customCategory) {
        data.category = data.customCategory;
      }
      
      // First upload the image if provided
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        
        const uploadResponse = await axios.post('/api/upload-image', formData);
        data.imageSrc = uploadResponse.data.url;
      }
      
      // Create the listing
      await axios.post('/api/coaching/listings', data);
      
      toast.success('Listing created successfully!');
      router.push('/coaching/listings-management');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto mt-16">
        <Card>
          <CardHeader>
            <CardTitle>Create a Coaching Listing</CardTitle>
            <CardDescription>Share your expertise with others</CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              disabled={isLoading} 
                              placeholder="Your coaching service title" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              disabled={isLoading} 
                              placeholder="Describe your coaching service"
                              rows={5}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (USD)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                              <Input 
                                {...field} 
                                type="number"
                                disabled={isLoading} 
                                className="pl-7"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[40vh] overflow-y-auto">
                            {categories.map((item: CategoryItem) => (
                              <div key={item.label} className="col-span-1">
                                <CategoryInput
                                  onClick={(categoryValue: string) => field.onChange(categoryValue)}
                                  selected={field.value === item.label}
                                  label={item.label}
                                  icon={item.icon}
                                />
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {isCustomCategory && (
                      <FormField
                        control={form.control}
                        name="customCategory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Custom Category</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                disabled={isLoading} 
                                placeholder="Enter your custom category"
                              />
                            </FormControl>
                            <FormDescription>
                              Create your own category that best describes your coaching expertise
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <FormField
                      control={form.control}
                      name="imageSrc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image</FormLabel>
                          <FormControl>
                            <div className="relative h-[250px] w-full border-2 rounded-md p-2 flex flex-col justify-center items-center gap-4 text-neutral-600">
                              {imageSrc ? (
                                <div className="relative h-full w-full">
                                  <Image
                                    src={imageSrc}
                                    alt="Listing"
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    className="rounded-md"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setImageFile(null);
                                      setImageSrc('');
                                      field.onChange('');
                                    }}
                                    className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                  </svg>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      handleImageUpload(e);
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  />
                                  <div>Click to upload an image</div>
                                </>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 w-full">
                  <Button 
                    type="submit"
                    disabled={isLoading || (isCustomCategory && !form.getValues('customCategory'))}
                  >
                    {isLoading ? 'Creating...' : 'Create Listing'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default CreateListing; 