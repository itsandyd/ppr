import { Loader2 } from "lucide-react";
import Image from "next/image";

export const AiLoader = () => {
    return (
        <div className="h-full flex flex-col gap-y-4 items-center justify-center"> 
            <div className="w-10 h-10 relative animate-spin "> 
                <Loader2 />
            </div>
            <p>
                Generating...
            </p>
        </div>
    )
};
