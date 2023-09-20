"use client"

import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage} from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const formSchema = z.object({
    name: z.string().nonempty({ message: "Please enter a store name." }),
    // description: z.string().nonempty({ message: "Please enter a store description." }),
    // url: z.string().nonempty({ message: "Please enter a store URL." }),
    // currency: z.string().nonempty({ message: "Please enter a store currency." }),
    // stripeAccountId: z.string().nonempty({ message: "Please enter a stripe account ID." }),
});

export const StoreModal = () => {
    const storeModal = useStoreModal();

    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            // description: "",
            // url: "",
            // currency: "",
            // stripeAccountId: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
          setLoading(true);
          const response = await axios.post('/api/stores', values);
          window.location.assign(`/dashboard/${response.data.id}`);
        } catch (error) {
          toast.error('Something went wrong');
        } finally {
          setLoading(false);
        }
      };

    return (

    <Modal
        title="Create a store"
        description="Create a store to sell your sounds."
        isOpen={storeModal.isOpen}
        onClose={storeModal.onClose}
    >
        <div>
            <div className="space-y-4 pb-2 py-2">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Store name</FormLabel>
                        <FormControl>
                            <Input placeholder="PausePlayRepeat Store"{...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                    />
                    <div className="pt-6 space-x-2 flex items-center justify-end w-full"> 
                        <Button 
                        variant="outline" 
                        onClick={storeModal.onClose}
                        disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button 
                        disabled={loading}
                        type="submit"
                        >
                            Continue
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
        </div>
    </Modal>
    )
}

export default StoreModal;