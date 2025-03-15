'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Image from 'next/image';
import { IconType } from 'react-icons';

import Container from '@/app/components/Container';
import Heading from '@/components/coaching/Heading';
import Input from '@/components/coaching/inputs/Input';
import { categories } from '../constants';
import CategoryInput from '@/components/coaching/inputs/CategoryInput';
import Button from '@/components/coaching/Button';

// Define an interface for category items
interface CategoryItem {
  label: string;
  icon: IconType;
  description: string;
}

const CreateListing = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm<FieldValues>({
    defaultValues: {
      title: '',
      description: '',
      price: 100,
      category: '',
      imageSrc: ''
    }
  });

  const category = watch('category');
  
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Preview image
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setImageSrc(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    
    try {
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
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6">
          <Heading
            title="Create a Coaching Listing"
            subtitle="Share your expertise with others"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex flex-col gap-8">
                <Input
                  id="title"
                  label="Title"
                  disabled={isLoading}
                  register={register}
                  errors={errors}
                  required
                />
                
                <div className="flex flex-col gap-2">
                  <div className="font-medium">Description</div>
                  <textarea
                    id="description"
                    disabled={isLoading}
                    {...register('description', { required: true })}
                    placeholder="Describe your coaching service"
                    className="p-4 border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed"
                    rows={5}
                  />
                  {errors.description && (
                    <div className="text-red-500">This field is required</div>
                  )}
                </div>
                
                <Input
                  id="price"
                  label="Price (USD)"
                  formatPrice
                  type="number"
                  disabled={isLoading}
                  register={register}
                  errors={errors}
                  required
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-8">
              <div>
                <div className="font-medium mb-2">Category</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
                  {categories.map((item: CategoryItem) => (
                    <div key={item.label} className="col-span-1">
                      <CategoryInput
                        onClick={(categoryValue: string) => setCustomValue('category', categoryValue)}
                        selected={category === item.label}
                        label={item.label}
                        icon={item.icon}
                      />
                    </div>
                  ))}
                </div>
                {errors.category && (
                  <div className="text-red-500 mt-2">Please select a category</div>
                )}
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="font-medium">Image</div>
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
                        onClick={() => {
                          setImageFile(null);
                          setImageSrc('');
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
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div>Click to upload an image</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 w-full">
            <Button
              label={isLoading ? 'Creating...' : 'Create Listing'}
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CreateListing; 