"use client"

import { BarChart, BellDotIcon, Compass, DotIcon, HeartHandshake, Landmark, Layout, List, Music2Icon, Newspaper, PlusCircle } from "lucide-react"

import { usePathname } from "next/navigation";
import { TbBuildingCommunity } from "react-icons/tb";
import { SoundSidebarItem } from "./SoundSidebarItem";


const guestRoutes = [
    {
        icon: HeartHandshake,
        label: "Free Sounds",
        href: "/sounds/free"
    },
    {
        icon: Landmark,
        label: "Paid Sounds",
        href: "/sounds/paid"
    },
    {
        icon: PlusCircle,
        label: "List Your Own Sounds",
        href: "/sounds/dashboard/author/list"
    }
];

const teacherRoutes = [
    {
        icon: List,
        label: "Courses",
        href: "/academy/dashboard/teacher/courses"
    },
    {
        icon: BarChart,
        label: "Analytics",
        href: "/academy/dashboard/teacher/analytics"
    },

]

export const SoundSidebarRoutes = () => {
    const pathname = usePathname();

    const isTeacherPage = pathname?.includes("/courses/teacher");

    const routes = isTeacherPage ? teacherRoutes : guestRoutes;

    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <SoundSidebarItem 
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />
            ))}
        </div>
    )
}