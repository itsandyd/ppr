import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import toast from "react-hot-toast";

const formSchema = z.object({
  folderName: z.string().min(1, {
    message: "Folder name is required",
  }),
});

interface FormInput {
  folderName: string;
}

interface NewFolderFormProps {
  onSubmit: (data: FormInput) => void;
  onClose: () => void;
}

export function NewFolderForm({ onSubmit, onClose }: NewFolderFormProps) {
    const form = useForm<FormInput>({
      resolver: zodResolver(formSchema),
    });
  
    const handleSubmit = form.handleSubmit(async (data) => {
        try {
          // Replace this with the actual API endpoint and method for creating a new folder
          const response = await axios.post("/api/storage/folders", data);
          onSubmit(data);
          form.reset();
          toast.success("Folder created");
        } catch {
          toast.error("Something went wrong");
        }
      });
  
    return (
      <Form {...form}>
        <form onSubmit={handleSubmit}>
          <FormField
            control={form.control}
            name="folderName"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>New folder name</FormLabel> */}
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-2">
          <Button type="submit" className="mr-2">Create Folder</Button> 
          <Button type="button" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </Form>
    );
  }