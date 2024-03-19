"use client"

import { BarChart, BellDotIcon, Compass, DotIcon, Home, Layout, List, Music2Icon, Newspaper, PlusCircle } from "lucide-react"

import { usePathname } from "next/navigation";
import { ProfileSidebarItem } from "./ProfileSidebarItem";

const guestRoutes = [
    {
        icon: Home,
        label: "Home",
        href: "/profile"
    },
    // {
    //     icon: BellDotIcon,
    //     label: "Paid Plugins",
    //     href: "/plugins/paid"
    // },
    // {
    //     icon: PlusCircle,
    //     label: "List Your Own Plugin",
    //     href: "/plugins/dashboard/author/list"
    // }
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

export const ProfileSidebarRoutes = () => {
    const pathname = usePathname();

    const isTeacherPage = pathname?.includes("/courses/teacher");

    const routes = isTeacherPage ? teacherRoutes : guestRoutes;

    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <ProfileSidebarItem 
                    icon={route.icon}
                    key={route.href}
                    label={route.label}
                    href={route.href}
                />
            ))}
        </div>
    )
}