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
import Image from 'next/image';
import { ImageIcon, Pencil, PlusCircle, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileUpload } from '../file-upload';
import { UploadDropzone } from '@/lib/uploadthing';

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

        axios.post('/api/coaching/listings', data)
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
        });
    };

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
        <div className="flex flex-col gap-8 theme-transition">
            <Heading 
                title="What's your area of expertise?" 
                subtitle="Pick a specialty" 
            />
            
            <div className="grid grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto px-1">
                {categories.map((item) => (
                    <div key={item.label} className="col-span-1">
                        <CategoryInput
                            onClick={(value) => setCustomValue('category', value)}
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
        <div className="flex flex-col gap-8 theme-transition"> 
            <Heading 
                title="Where are you from?"
                subtitle="Enter a location"
            />
            <div className="theme-transition">
                <CountrySelect
                    value={watch('location')}
                    onChange={(value) => setCustomValue('location', value)}
                />
            </div>
            {location && (
                <div className="h-[35vh] theme-transition">
                    <Map 
                        center={location?.latlng}
                    />
                </div>
            )}
        </div>
        );
    }

    if (step === STEPS.INFO) {
        bodyContent = (
            <div className="flex flex-col gap-8 theme-transition">
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
            </div>
        );
    }

    if (step === STEPS.IMAGES) {
        bodyContent = (
            <div className="flex flex-col gap-6 theme-transition">
                <Heading
                    title="Add your profile picture"
                    subtitle="This will be your main image"
                />
                
                {imageSrc ? (
                    <div className="flex flex-col gap-4 items-center">
                        <div className="relative aspect-square w-full max-w-[300px] mx-auto overflow-hidden rounded-full border-2 border-neutral-200 dark:border-neutral-700">
                            <Image 
                                alt="Profile picture"
                                fill
                                className="object-cover"
                                src={imageSrc}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                onClick={() => setCustomValue('imageSrc', '')} 
                                variant="outline"
                                className="text-red-500 border-red-500 hover:bg-red-500/10"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Remove
                            </Button>
                            <Button 
                                onClick={toggleEdit}
                                variant="outline"
                            >
                                <Pencil className="h-4 w-4 mr-2" />
                                Change
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full flex flex-col items-center justify-center">
                        {isEditing ? (
                            <div className="w-full max-w-[500px] mx-auto">
                                <UploadDropzone
                                    endpoint="coachingImages"
                                    onClientUploadComplete={(res) => {
                                        setCustomValue('imageSrc', res?.[0].url);
                                        toggleEdit();
                                        toast.success("Profile picture uploaded!");
                                    }}
                                    onUploadError={(error: Error) => {
                                        toast.error(`Upload failed: ${error.message}`);
                                    }}
                                    className="dark:border-neutral-700 dark:bg-neutral-800"
                                />
                                <div className="text-xs text-muted-foreground mt-4 dark:text-neutral-400 text-center"> 
                                    Square image recommended for best results
                                </div>
                                <Button 
                                    onClick={toggleEdit} 
                                    variant="outline"
                                    className="mt-4 mx-auto"
                                >
                                    Cancel
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center">
                                <div className="mx-auto w-32 h-32 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4 border-2 border-dashed border-neutral-300 dark:border-neutral-700">
                                    <ImageIcon className="h-10 w-10 text-neutral-500 dark:text-neutral-400" />
                                </div>
                                <Button 
                                    onClick={toggleEdit}
                                    className="bg-[#3B97D8] hover:bg-[#3B97D8]/90"
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload profile picture
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (step === STEPS.DESCRIPTION) {
        bodyContent = (
            <div className="flex flex-col gap-6 theme-transition">
                <Heading
                    title="Describe your coaching style"
                    subtitle="Tell potential students what makes your coaching approach unique"
                />
                
                <div className="space-y-2">
                    <h3 className="font-medium text-white">Coaching profile title</h3>
                    <Input
                        id="title"
                        label="Title"
                        disabled={isLoading}
                        register={register}
                        errors={errors}
                        required
                        placeholder="E.g., Professional Music Producer with 10+ Years Experience"
                    />
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        Your title appears in search results and should highlight your expertise.
                    </p>
                </div>

                <div className="space-y-2">
                    <h3 className="font-medium text-white">About your coaching</h3>
                    <div className="bg-neutral-800 p-4 rounded-md border border-neutral-700">
                        <p className="text-neutral-300 mb-2">
                            <span className="font-bold">Pro Tip:</span> A detailed description helps students understand your teaching style and expertise.
                        </p>
                        <p className="text-neutral-400 text-sm">
                            Include your experience, teaching methods, gear/software you specialize in, and any successful students you&apos;ve worked with.
                        </p>
                    </div>
                    <Input
                        id="description"
                        label="Description"
                        disabled={isLoading}
                        register={register}
                        errors={errors}
                        required
                        isTextArea
                        rows={6}
                        placeholder="Share your background, teaching approach, and what makes your coaching style unique..."
                    />
                </div>
            </div>
        );
    }

    if (step === STEPS.PRICE) {
        bodyContent = (
            <div className="flex flex-col gap-6 theme-transition">
                <Heading
                    title="Set your coaching rate"
                    subtitle="How much do you charge per hour?"
                />
                <div className="space-y-2">
                    <h3 className="font-medium text-white">Hourly rate</h3>
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
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        Set a competitive rate based on your experience and expertise.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <Modal
            title="Register as a Coach"
            isOpen={rentModal.isOpen}
            body={bodyContent}
            onSubmit={handleSubmit(onSubmit)}
            secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
            secondaryActionLabel={secondaryActionLabel}
            actionLabel={actionLabel}
            onClose={rentModal.onClose}
            disabled={isLoading}
        />
    );
};

export default RentModal;
