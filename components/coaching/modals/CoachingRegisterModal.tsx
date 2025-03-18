"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form';
import Modal from './Modal';
import Heading from '../Heading';
import CategoryInput from '../inputs/CategoryInput';
import { categories } from '@/lib/coaching/constants';

import CountrySelect from '../inputs/CountrySelect';
import dynamic from 'next/dynamic';
import Counter from '../inputs/Counter';

import Input from '../inputs/Input';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import useCoachingRegisterModal from '@/hooks/useCoachingRegisterModal';
import Image from 'next/image';
import { ImageIcon, Pencil, PlusCircle, X, Upload, ExternalLink, CreditCard, Calendar, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileUpload } from '../file-upload';
import { UploadDropzone } from '@/lib/uploadthing';

// Debug import
console.log("UploadDropzone imported:", typeof UploadDropzone);

enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5,
    PAYMENT_INFO = 6,
    COMMUNICATION = 7,
    CREDENTIALS = 8,
    AVAILABILITY = 9,
    TERMS = 10
}

const CoachingRegisterModal = () => {
    const coachingRegisterModal = useCoachingRegisterModal();
    const [step, setStep] = useState(STEPS.CATEGORY);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();

    // Debug logging
    useEffect(() => {
        console.log('CoachingRegisterModal - Modal open state:', coachingRegisterModal.isOpen);
    }, [coachingRegisterModal.isOpen]);

    // Move the IMAGES step debug logging here, outside the conditional
    useEffect(() => {
        if (step === STEPS.IMAGES) {
            console.log("IMAGES step mounted");
            console.log("UploadDropzone component:", typeof UploadDropzone);
        }
    }, [step]);

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
            customCategory: '',
            location: '',
            guestCount: 1,
            roomCount: 1,
            bathroomCount: 1,
            imageSrc: '',
            price: 1,
            title: '',
            description: '',
            // New fields for coach registration
            discordUsername: '',
            discordId: '',
            alternativeContact: '',
            professionalBackground: '',
            certifications: '',
            notableProjects: '',
            timezone: '',
            available: {
                Monday: false,
                Tuesday: false,
                Wednesday: false,
                Thursday: false,
                Friday: false,
                Saturday: false,
                Sunday: false,
            },
            availableHours: '',
            // Stripe Connect fields
            stripeAccountId: '', // Stores Stripe account ID
            stripeConnectInitiated: false, // Flag to know if they started the process
            acceptTerms: false,
        },
    });

    const category = watch('category');
    const customCategory = watch('customCategory');
    const location = watch('location');
    const guestCount = watch('guestCount');
    const roomCount = watch('roomCount');
    const bathroomCount = watch('bathroomCount');
    const imageSrc = watch('imageSrc');
    const toggleEdit = () => setIsEditing((current) => !current);

    const Map = useMemo(() => dynamic(() => import('../Map'), {
        ssr: false,
    }), []);
        
    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldDirty: true,
            shouldValidate: true,
            shouldTouch: true,
        });
    };

    const onBack = () => {
        setUploadError(null);
        setStep((value) => value - 1);
    };

    const onNext = () => {
        setUploadError(null);
        setStep((value) => value + 1);
    };

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        if (step !== STEPS.TERMS) {
            return onNext();
        }
        
        setIsLoading(true);

        // Validate required fields
        if (!data.category || !data.location || !data.imageSrc || !data.price || !data.title || 
            !data.description || !data.discordUsername || !data.timezone || !data.acceptTerms) {
            toast.error('Please fill in all required fields');
            setIsLoading(false);
            return;
        }

        // Check if Stripe Connect process was initiated
        if (!data.stripeConnectInitiated) {
            toast.error('Please initiate the Stripe Connect process before continuing');
            setStep(STEPS.PAYMENT_INFO);
            setIsLoading(false);
            return;
        }

        // Prepare days availability as JSON
        const availableDays = JSON.stringify(data.available || {});

        // Now posting to coach creation endpoint instead of listings
        axios.post('/api/coaching/coaches', {
            ...data,
            // Use customCategory when 'Custom' is selected
            category: data.category === 'Custom' ? data.customCategory : data.category,
            availableDays
        })
        .then(() => {
            toast.success('Coach profile created! You can now create coaching listings.');
            router.refresh();
            reset();
            setStep(STEPS.CATEGORY);
            coachingRegisterModal.onClose();
            
            // Optionally redirect to create-listing page
            router.push('/coaching/create-listing');
        })
        .catch((error) => {
            console.error('Error creating coach profile:', error);
            toast.error(error?.response?.data?.error || 'Something went wrong.')
        }).finally(() => {
            setIsLoading(false);
        });
    };

    const actionLabel = useMemo(() => {
        if (step === STEPS.TERMS) {
            return 'Create Coach Profile';
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

            {/* Show input field if Custom category is selected */}
            {category === 'Custom' && (
                <div className="flex flex-col gap-2">
                    <h3 className="font-medium text-white">Specify your custom category</h3>
                    <Input
                        id="customCategory"
                        label="Custom Category"
                        disabled={isLoading}
                        register={register}
                        errors={errors}
                        required={category === 'Custom'}
                        placeholder="E.g., Sound Design, Mastering, etc."
                    />
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Please specify your area of expertise as it will appear to students
                    </p>
                </div>
            )}
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
            <div className="flex flex-col gap-8 theme-transition">
                <Heading 
                    title="Add a photo of yourself" 
                    subtitle="Show students who they'll be learning from" 
                />
                
                <div className="max-w-lg mx-auto w-full flex flex-col gap-4">
                    {imageSrc ? (
                        <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-green-500 transition">
                            <Image 
                                alt="Uploaded image"
                                fill
                                style={{ objectFit: 'cover' }}
                                src={imageSrc}
                            />
                            <button 
                                onClick={() => setCustomValue('imageSrc', '')}
                                className="absolute bottom-2 right-2 bg-rose-500 p-2 rounded-full shadow-sm hover:bg-rose-600 transition"
                            >
                                <X className="h-4 w-4 text-white" />
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Debug button to help troubleshoot */}
                            <button 
                                onClick={() => console.log('Debug button clicked - uploadthing available:', !!UploadDropzone)}
                                className="mb-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md p-2 text-sm"
                            >
                                Debug UploadThing
                            </button>
                            
                            {isUploading && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-md flex flex-col items-center">
                                        <div className="h-10 w-10 mb-2 rounded-full border-2 border-neutral-400 border-t-[#3B97D8] animate-spin"></div>
                                        <p className="font-medium">Uploading...</p>
                                    </div>
                                </div>
                            )}
                            
                            {/* Basic, unstyled UploadDropzone */}
                            <div className="mt-2">
                                <UploadDropzone
                                    endpoint="coachingImages"
                                    onUploadBegin={(fileName) => {
                                        console.log("Upload started:", fileName);
                                        setIsUploading(true);
                                        setUploadError(null);
                                    }}
                                    onClientUploadComplete={(res) => {
                                        console.log("Upload completed:", res);
                                        setIsUploading(false);
                                        if (res && res[0]) {
                                            setCustomValue('imageSrc', res[0].url);
                                            toast.success('Image uploaded successfully');
                                        }
                                    }}
                                    onUploadError={(error) => {
                                        console.error("Upload error:", error);
                                        setIsUploading(false);
                                        setUploadError(error?.message || 'Something went wrong');
                                        toast.error(`Upload failed: ${error?.message || 'Something went wrong'}`);
                                    }}
                                    config={{ mode: "auto" }}
                                    content={{
                                        allowedContent: "Image files up to 4MB"
                                    }}
                                />
                            </div>
                        </>
                    )}

                    {uploadError && (
                        <div className="text-sm text-red-500 mt-1">
                            Error: {uploadError}
                        </div>
                    )}

                    <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                        <p>Upload a professional photo that clearly shows your face. This helps build trust with potential students.</p>
                    </div>
                </div>
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

    if (step === STEPS.PAYMENT_INFO) {
        bodyContent = (
            <div className="flex flex-col gap-6 theme-transition">
                <Heading
                    title="Connect your payment account"
                    subtitle="We use Stripe to handle secure payments and transfers"
                />
                
                <div className="space-y-4">
                    <div className="bg-neutral-800 p-4 rounded-md border border-neutral-700">
                        <p className="text-neutral-300 mb-2">
                            <span className="font-bold">Important:</span> You&apos;ll need to connect a Stripe account to receive payments from your students.
                        </p>
                        <p className="text-neutral-400 text-sm">
                            Stripe is our payment processor and allows us to safely transfer your earnings directly to your bank account.
                        </p>
                    </div>
                    
                    <Button 
                        onClick={async () => {
                            try {
                                setIsLoading(true);
                                // Call our API to create a Stripe Connect account
                                const response = await axios.post('/api/stripe/connect-account');
                                
                                // Store any relevant Stripe information we need for later
                                if (response.data.accountId) {
                                    setCustomValue('stripeAccountId', response.data.accountId);
                                }
                                
                                // Redirect to Stripe's onboarding
                                if (response.data.url) {
                                    // Set a flag to know the user has initiated Stripe Connect
                                    setCustomValue('stripeConnectInitiated', true);
                                    toast.success("Redirecting to Stripe Connect...");
                                    
                                    // Open in a new tab so they can return to the form
                                    window.open(response.data.url, '_blank');
                                }
                            } catch (error: any) {
                                console.error("Stripe Connect error:", {
                                    message: error.message,
                                    response: error.response?.data,
                                    status: error.response?.status
                                });
                                
                                // Display a more specific error message
                                const errorMessage = error.response?.data?.error 
                                    || error.response?.data 
                                    || error.message 
                                    || "Failed to initiate Stripe Connect";
                                    
                                toast.error(errorMessage);
                            } finally {
                                setIsLoading(false);
                            }
                        }}
                        className="w-full bg-[#6772E5] hover:bg-[#6772E5]/90"
                        disabled={isLoading}
                    >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Connect with Stripe
                    </Button>
                    
                    {watch('stripeConnectInitiated') && (
                        <div className="bg-green-900/20 border border-green-500 rounded-md p-3 mt-3">
                            <div className="flex items-center text-green-500">
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                <p className="text-sm font-medium">Stripe Connect initiated</p>
                            </div>
                            <p className="text-xs text-green-400 mt-1">
                                Please complete your Stripe onboarding in the new tab. You can continue with registration here once you&apos;ve started the process.
                            </p>
                        </div>
                    )}
                    
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
                        We&apos;ll save your coach profile now. You can complete your Stripe onboarding later if needed.
                    </div>
                </div>
            </div>
        );
    }

    if (step === STEPS.COMMUNICATION) {
        bodyContent = (
            <div className="flex flex-col gap-6 theme-transition">
                <Heading
                    title="How will you connect with students?"
                    subtitle="Set up your communication channels"
                />
                
                <div className="space-y-4">
                    <div className="bg-neutral-800 p-4 rounded-md border border-neutral-700 mb-4">
                        <p className="text-neutral-300 text-sm">
                            <span className="font-bold">Why Discord?</span> We use Discord for coaching sessions because it offers high-quality voice/video calls, screen sharing, and file sharing in one place.
                        </p>
                    </div>
                
                    <div className="space-y-2">
                        <h3 className="font-medium text-white">Discord Username</h3>
                        <Input
                            id="discordUsername"
                            label="Discord Username"
                            disabled={isLoading}
                            register={register}
                            errors={errors}
                            required
                            placeholder="username#0000"
                        />
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            This is where your coaching sessions will take place.
                        </p>
                    </div>
                    
                    <div className="space-y-2">
                        <h3 className="font-medium text-white">Discord User ID (Optional)</h3>
                        <Input
                            id="discordId"
                            label="Discord ID"
                            disabled={isLoading}
                            register={register}
                            errors={errors}
                            placeholder="Your 18-digit Discord ID"
                        />
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Not sure how to find this? <a href="https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Learn how here</a>
                        </p>
                    </div>
                    
                    <div className="space-y-2">
                        <h3 className="font-medium text-white">Alternative Contact Method (Optional)</h3>
                        <Input
                            id="alternativeContact"
                            label="Alternative Contact"
                            disabled={isLoading}
                            register={register}
                            errors={errors}
                            placeholder="Email, Zoom link, etc."
                        />
                    </div>
                </div>
            </div>
        );
    }

    if (step === STEPS.CREDENTIALS) {
        bodyContent = (
            <div className="flex flex-col gap-6 theme-transition">
                <Heading
                    title="Your coaching credentials"
                    subtitle="Share your professional background and certifications"
                />
                
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h3 className="font-medium text-white">Professional background</h3>
                        <Input
                            id="professionalBackground"
                            label="Background"
                            disabled={isLoading}
                            register={register}
                            errors={errors}
                            isTextArea
                            rows={3}
                            placeholder="E.g., Senior audio engineer at Studio XYZ, Grammy-nominated producer"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <h3 className="font-medium text-white">Certifications (Optional)</h3>
                        <Input
                            id="certifications"
                            label="Certifications"
                            disabled={isLoading}
                            register={register}
                            errors={errors}
                            isTextArea
                            rows={3}
                            placeholder="E.g., Ableton Certified Trainer, Logic Pro Master, etc."
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <h3 className="font-medium text-white">Notable clients/projects (Optional)</h3>
                        <Input
                            id="notableProjects"
                            label="Notable Projects"
                            disabled={isLoading}
                            register={register}
                            errors={errors}
                            isTextArea
                            rows={3}
                            placeholder="Share any notable work you've done (artists, labels, projects)"
                        />
                    </div>
                </div>
            </div>
        );
    }

    if (step === STEPS.AVAILABILITY) {
        bodyContent = (
            <div className="flex flex-col gap-6 theme-transition">
                <Heading
                    title="Your coaching availability"
                    subtitle="Let students know when you're available"
                />
                
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h3 className="font-medium text-white">Time zone</h3>
                        <select
                            className="w-full p-4 bg-neutral-700 border-neutral-600 rounded-md"
                            {...register('timezone', { required: true })}
                        >
                            <option value="">Select your time zone</option>
                            <option value="UTC-8">Pacific Time (UTC-8)</option>
                            <option value="UTC-7">Mountain Time (UTC-7)</option>
                            <option value="UTC-6">Central Time (UTC-6)</option>
                            <option value="UTC-5">Eastern Time (UTC-5)</option>
                            <option value="UTC+0">Greenwich Mean Time (UTC+0)</option>
                            <option value="UTC+1">Central European Time (UTC+1)</option>
                            <option value="UTC+2">Eastern European Time (UTC+2)</option>
                            <option value="UTC+5:30">Indian Standard Time (UTC+5:30)</option>
                            <option value="UTC+8">China Standard Time (UTC+8)</option>
                            <option value="UTC+9">Japan Standard Time (UTC+9)</option>
                            <option value="UTC+10">Australian Eastern Standard Time (UTC+10)</option>
                        </select>
                        {errors.timezone && (
                            <p className="text-red-500 text-xs">Time zone is required</p>
                        )}
                    </div>
                    
                    <div className="space-y-2">
                        <h3 className="font-medium text-white">Weekly availability</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                <div key={day} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id={`day-${day}`}
                                        {...register(`available.${day}`)}
                                        className="w-4 h-4"
                                    />
                                    <label htmlFor={`day-${day}`} className="text-white">{day}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <h3 className="font-medium text-white">Typical hours</h3>
                        <Input
                            id="availableHours"
                            label="Available Hours"
                            disabled={isLoading}
                            register={register}
                            errors={errors}
                            placeholder="E.g., Weekdays 6-10pm, Weekends 10am-4pm"
                        />
                    </div>

                    <div className="bg-neutral-800 p-4 rounded-md border border-neutral-700">
                        <p className="text-neutral-300 text-sm">
                            <Calendar className="h-4 w-4 inline-block mr-2" />
                            You&apos;ll be able to set up your detailed availability calendar after completing registration.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (step === STEPS.TERMS) {
        bodyContent = (
            <div className="flex flex-col gap-6 theme-transition">
                <Heading
                    title="Almost done!"
                    subtitle="Review and accept our coach policies"
                />
                
                <div className="space-y-4">
                    <div className="bg-neutral-800 p-4 rounded-md border border-neutral-700 max-h-[30vh] overflow-y-auto">
                        <h4 className="font-medium text-white mb-2">Coach Terms of Service</h4>
                        <p className="text-sm text-neutral-300">
                            As a coach on our platform, you agree to:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-neutral-300">
                            <li>Respond to booking requests within 24 hours</li>
                            <li>Maintain professional communication with students</li>
                            <li>Provide the agreed services for the full booked duration</li>
                            <li>Give at least 24 hours notice for any cancellations</li>
                            <li>Allow the platform to handle all payments (15% service fee applies)</li>
                            <li>Uphold our community guidelines and code of conduct</li>
                            <li>Participate in our feedback system to maintain quality</li>
                            <li>Comply with our confidentiality and privacy policies</li>
                        </ul>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                        <input
                            type="checkbox"
                            id="terms"
                            {...register('acceptTerms', { required: true })}
                            className="mt-1"
                        />
                        <label htmlFor="terms" className="text-sm">
                            I agree to the Coach Terms of Service and understand my responsibilities as a coach
                        </label>
                    </div>
                    {errors.acceptTerms && (
                        <p className="text-red-500 text-xs">You must agree to the terms to continue</p>
                    )}

                    <div className="bg-neutral-800/50 p-4 rounded-md mt-4">
                        <div className="flex items-center text-neutral-300">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                            <p className="text-sm">
                                After creating your coach profile, you&apos;ll be able to create multiple coaching listings for different services!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Modal
            title="Register as a Coach"
            isOpen={coachingRegisterModal.isOpen}
            body={bodyContent}
            onSubmit={handleSubmit(onSubmit)}
            secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
            secondaryActionLabel={secondaryActionLabel}
            actionLabel={actionLabel}
            onClose={coachingRegisterModal.onClose}
            disabled={isLoading}
        />
    );
};

export default CoachingRegisterModal;
