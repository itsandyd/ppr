import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Loader2, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";

export const VectorSetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const onSetup = async () => {
    try {
      setIsLoading(true);
      setStatus("idle");

      const response = await axios.post("/api/admin/setup-vectors");

      if (response.data.success) {
        setStatus("success");
        toast.success("Vector columns set up successfully!");
      } else {
        throw new Error(response.data.error || "Failed to set up vector columns");
      }
    } catch (error: any) {
      console.error("Error:", error);
      setStatus("error");
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-x-4">
        <Button
          onClick={onSetup}
          disabled={isLoading}
          variant="default"
          size="lg"
        >
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Set Up Vector Columns
        </Button>

        {status === "success" && (
          <div className="flex items-center text-sm text-emerald-500 gap-x-2">
            <Check className="w-4 h-4" />
            <p>Vector columns set up successfully!</p>
          </div>
        )}

        {status === "error" && (
          <div className="flex items-center text-sm text-destructive gap-x-2">
            <XCircle className="w-4 h-4" />
            <p>Failed to set up vector columns</p>
          </div>
        )}
      </div>
    </Card>
  );
}; 