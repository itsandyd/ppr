import Image from "next/image";
import Link from "next/link";

import { BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/format";

interface PluginCardProps {
    id: string;
    slug: string;
    name: string;
    imageUrl: string;
    description: string | null;
    type: string | null;
}

export const PluginCard = ({
    id,
    slug,
    name,
    imageUrl,
    type
}: PluginCardProps) => {
    return ( 
        <Link href={`/plugins/${slug}`}>
            <div className="group hover:shadow-lg transition overflow-hidden border rounded-lg p-3 h-full">
                <div className="relative w-full aspect-video rounded-md overflow-hidden">
                    <Image fill className="object-cover" src={imageUrl} alt={name}/>
                </div>
                <div className="flex flex-col pt-2">
                    <div className="text-lg md:text-base font-medium">
                        {name}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {type}
                    </p>
                    {/* <p className="text-sm text-muted-foreground mt-2">
                        {description}
                    </p> */}
                </div>
            </div>
        </Link>
     );
}