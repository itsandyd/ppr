"use client";

import { useState, useMemo } from 'react';
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form';
import Modal from './Modal';
import Heading from '../Heading';
import CategoryInput from '../inputs/CategoryInput';
import { categories } from '../navbar/Categories';

import CountrySelect from '../inputs/CountrySelect';
import dynamic from 'next/dynamic';
import Counter from '../inputs/Counter';

import Input from '../inputs/Input';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import useRentModal from '@/hooks/useRentModal';
import ImageUpload from '@/components/ui/image-upload';
import { FileUpload } from '../file-upload';
import Image from 'next/image';
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import Input from '../inputs/Input';

enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5,
}

const RentModal = () => {
    const rentModal = useRentModal();
    const [step, setStep] = useState(STEPS.CATEGORY);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm<FieldValues>({
        defaultValues: {
            category: '',
            location: '',
            guestCount: 1,
            roomCount: 1,
            bathroomCount: 1,
            imageSrc: '',
            price: 1,
            title: '',
            description: '',
        },
    });

    const category = watch('category');
    const location = watch('location');
    const guestCount = watch('guestCount');
    const roomCount = watch('roomCount');
    const bathroomCount = watch('bathroomCount');
    const imageSrc = watch('imageSrc');
    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing((current) => !current);

    const Map = useMemo(() => dynamic(() => import('../Map'), {
        ssr: false,
    }), [location]);
        

    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldDirty: true,
            shouldValidate: true,
            shouldTouch: true,
        });
    };

    const onBack = () => {
        setStep((value) => value - 1);
    };

    const onNext = () => {
        setStep((value) => value + 1);
    };

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        if (step !== STEPS.PRICE) {
            return onNext();
        }
        setIsLoading(true);

        axios.post('/api/listings', data)
        .then(() => {
            toast.success('Listing created!');
            router.refresh();
            reset();
            setStep(STEPS.CATEGORY);
            rentModal.onClose();
        })
        .catch((error) => {
            toast.error('Something went wrong.')
        }).finally(() => {
            setIsLoading(false);
        }
        )
    }

    const actionLabel = useMemo(() => {
        if (step === STEPS.PRICE) {
            return 'Create';
        }
        return 'Next';
    }, [step]);

    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.CATEGORY) {
            return undefined;
        }
        return 'Back';
    }, [step]);

    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading title="What's your area of expertise?" subtitle="Pick a specialty" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
                {categories.map((item) => (
                    <div key={item.label} className="col-span-1">
                        <CategoryInput
                            onClick={() => setCustomValue('category', item.label)}
                            selected={category === item.label}
                            label={item.label}
                            icon={item.icon}
                        />
                    </div>
                ))}
            </div>
        </div>
    );

    if (step === STEPS.LOCATION) {
        bodyContent = ( 
        <div className="flex flex-col gap-8"> 
            <Heading 
                title="Where are you from?"
                subtitle="Enter a location"
            />
            <CountrySelect
                value={watch('location')}
                onChange={(value) => setCustomValue('location', value)}
            />
            <Map 
                center={location?.latlng}
            />
        </div>
        )
    }

    if (step === STEPS.INFO) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Introduce Yourself as a Coach"
                    subtitle="Share your expertise and setup"
                />
                <Counter 
                    title="What is your experience?"
                    subtitle="How many years have you been producing music?"
                    value={guestCount}
                    onChange={(value) => setCustomValue('guestCount', value)}
                />
                {/* <hr />
                <Counter 
                    title="Rooms"
                    subtitle="How many rooms do you have?"
                    value={roomCount}
                    onChange={(value) => setCustomValue('roomCount', value)}
                />
                <hr />
                <Counter 
                    title="Bathrooms"
                    subtitle="How many bathrooms do you have?"
                    value={bathroomCount}
                    onChange={(value) => setCustomValue('bathroomCount', value)}
                />   */}
            </div>
        )
    }

    if (step === STEPS.IMAGES) {
        bodyContent = (
            <div className="flex flex-col">
            <Heading
                title="Add your profile picture"
                subtitle="This will be your main image"
            />
            <div className="font-medium flex items-center justify-between">
              {/* Profile Picture */}
              <Button onClick={toggleEdit} variant="ghost">
                {isEditing && (
                  <>Cancel</>
                )}
                {!isEditing && !imageSrc && (
                  <>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add an image
                  </>
                )}
                {isEditing && (
                  <>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit an image
                  </>
                )}
              </Button>
            </div>
            {!isEditing && (
              !imageSrc ? (
              <div>
                <ImageIcon className="h-10 w-10 text-slate-500 mr-2" />
              </div>
            ) : (
              <div className="relative aspect-video mt-2">
                <Image 
                  alt="upload"
                  fill
                  className="object-cover rounded-md"
                  src={imageSrc}
                />
              </div>
            )
          )}
            {isEditing && (
             <div>
                <FileUpload 
                  endpoint="coachingImages"
                  onChange={(url) =>{
                    if (url) {
                      setCustomValue('imageSrc', url);
                      toggleEdit();
                    }
                  }}
                />
                <div className="text-xs text-muted-foreground mt-4"> 
                  16:9 aspect ratio recommended
                </div>
             </div>
            )}
          </div>
        );
      }

    if (step === STEPS.DESCRIPTION) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Describe yourself to students"
                    subtitle="Write a description"
                    />
                    <Input 
                        id="title"
                        label="Name"
                        disabled={isLoading}
                        register={register}
                        errors={errors}
                        required
                    />
                    {/* <hr /> */}
                    <Input 
                        id="description"
                        label="Description"
                        disabled={isLoading}
                        register={register}
                        errors={errors}
                        required
                    />
            </div>
        )};

    if (step === STEPS.PRICE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading 
                    title="Now, set your price"
                    subtitle="How much do you want to charge per coaching session?"
                />
                <Input
                    id="price"
                    label="Price"
                    formatPrice
                    type="number"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
            </div>
        )};

    return (
        <Modal
            onClose={rentModal.onClose}
            isOpen={rentModal.isOpen}
            onSubmit={handleSubmit(onSubmit)}
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
            title="Register as a coach"
            body={bodyContent}
        />
    );
};

export default RentModal;
