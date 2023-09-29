import Image from "next/image";
import Link from "next/link";
import { IconBadge } from "./icon-badge";
import { BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/format";

interface CourseCardProps {
    id: string;
    title: string;
    imageUrl: string;
    chaptersLength: number;
    price: number;
    progress: number | null;
    courseCategory: string | null;
}

export const CourseCard = ({
    id,
    title,
    imageUrl,
    chaptersLength,
    price,
    progress,
    courseCategory,
}: CourseCardProps) => {
    return ( 
        <Link href={`/academy/courses/${id}`}>
            <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
                <div className="relative w-full aspect-video rounded-md overflow-hidden">
                    <Image fill className="object-cover" src={imageUrl} alt={title}/>
                </div>
                <div className="flex flex-col pt-2">
                    <div className="text-lg md:text-base font-medium">
                        {title}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {courseCategory}
                    </p>
                    {/* <div className="flex items-center gap-x-1 text-slate-500">
                        <IconBadge size="sm" icon={BookOpen}/>
                        <span>
                            {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters" }
                        </span>
                    </div> */}
                </div>
                {progress !== null ? (
                    <div>
                        Todo progress
                    </div>
                ) : (
                    <p className="text-md md:text-sm font-medium text-slate-700">
                        {formatPrice(price)}
                    </p>
                )}
            </div>
        </Link>
     );
}