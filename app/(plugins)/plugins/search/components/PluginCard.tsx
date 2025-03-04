import Image from "next/image";
import Link from "next/link";

import { BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/format";

interface PluginCardProps {
    id: string;
    slug: string | null;
    name: string;
    imageUrl: string;
    description: string | null;
    type: string | null;
    price: number | null;
}

export const PluginCard = ({
    id,
    slug,
    name,
    imageUrl,
    type,
    price
}: PluginCardProps) => {
    return ( 
        <Link href={`/plugins/${slug}`}>
            <div className="group hover:shadow-lg transition overflow-hidden border rounded-lg p-3 h-full transform hover:-translate-y-1 duration-300">
                <div className="relative w-full aspect-square rounded-md overflow-hidden">
                    <Image 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        src={imageUrl} 
                        alt={name}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {price && (
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white px-3 py-1 rounded-full text-xs">
                            {formatPrice(price)}
                        </div>
                    )}
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