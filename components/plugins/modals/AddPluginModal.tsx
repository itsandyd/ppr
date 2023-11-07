import { useState } from 'react';
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Heading from './Heading';
import Input from './Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

enum STEPS {
    INFO = 0,
    DESCRIPTION = 1,
}

interface AddPluginModalProps {
    onClose: () => void;
  }

  const AddPluginModal: React.FC<AddPluginModalProps> = ({ onClose }) => {
    const [step, setStep] = useState(STEPS.INFO);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            author: '',
            description: '',
            image: '',
        },
    });

    const onBack = () => {
        setStep((value) => value - 1);
    };

    const onNext = () => {
        setStep((value) => value + 1);
    };

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        if (step !== STEPS.DESCRIPTION) {
            return onNext();
        }
        setIsLoading(true);

        axios.post('/api/plugins', data)
        .then(() => {
            toast.success('Plugin added!');
            router.refresh();
            reset();
            setStep(STEPS.INFO);
        })
        .catch((error) => {
            toast.error('Something went wrong.')
        }).finally(() => {
            setIsLoading(false);
        }
        )
    }

    const actionLabel = step === STEPS.DESCRIPTION ? 'Add' : 'Next';
    const secondaryActionLabel = step === STEPS.INFO ? undefined : 'Back';

    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading title="Add a new plugin" subtitle="Enter plugin information" />
            <Input 
                id="name"
                label="Name"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <Input 
                id="author"
                label="Author"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
        </div>
    );

    if (step === STEPS.DESCRIPTION) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="Describe the plugin" subtitle="Enter a description" />
                <Input 
                    id="description"
                    label="Description"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{actionLabel}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>{bodyContent}</CardDescription>
            </CardContent>
        </Card>
    );
};

export default AddPluginModal;