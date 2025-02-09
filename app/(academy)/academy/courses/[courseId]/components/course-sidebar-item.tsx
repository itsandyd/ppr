"use client"

import { cn } from "@/lib/utils";
import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface CourseSidebarItemProps {
    label: string;
    id: string;
    isCompleted: boolean;
    courseId: string;
    isLocked: boolean;
}

export const CourseSidebarItem = ({
    label,
    id,
    isCompleted,
    courseId,
    isLocked,
}: CourseSidebarItemProps) => {
    const pathname = usePathname();
    const router = useRouter();

    const Icon = isLocked ? Lock : (isCompleted ? CheckCircle : PlayCircle);
    const isActive = pathname?.includes(id);

    const onClick = () => {
        router.push(`/academy/courses/${courseId}/chapters/${id}`);
    };

    return (
        <button
            onClick={onClick}
            type="button"
            className={cn(
                "flex items-center gap-x-2 text-sm text-gray-400 font-medium px-3 py-2 transition-all hover:text-white hover:bg-gray-700/50",
                isActive && "text-white bg-gray-700/50",
                isCompleted && "text-emerald-400 hover:text-emerald-300"
            )}
        >
            <Icon className={cn(
                "h-4 w-4",
                isActive && "text-white",
                isCompleted && "text-emerald-400",
                isLocked && "text-gray-400"
            )} />
            <span>{label}</span>
        </button>
    )
}