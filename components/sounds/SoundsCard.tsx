import Image from "next/image";
import Link from "next/link";

import { BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/format";

interface PluginCardProps {
    id: string;
    slug: string;
    name: string;
    imageUrl: string
    description?: string | null; // Assuming you want to display the description
    category: string | null; // Assuming you want to display the category name
}

export const SoundsCard = ({
    id,
    slug,
    name,
    imageUrl,
    description,
    category,
}: PluginCardProps) => {
    return (
        <Link 
            href={`/sounds/${slug}`}
            className="group rounded-xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:shadow-md transition"
        >
            <div className="relative w-full aspect-video rounded-md overflow-hidden">
                <Image fill className="object-cover" src={imageUrl} alt={name}/>
            </div>
            <div className="flex flex-col p-4"> 
                <div className="text-lg md:text-base font-medium">
                    {name}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                    {category}
                </p>
                {/* <p className="text-sm text-muted-foreground mt-2">
                    {description}
                </p> */}
            </div>
        </Link>
     );
}