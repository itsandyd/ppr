"use client"

import { BarChart, Compass, Layout, List, Newspaper } from "lucide-react"
import { SidebarItem } from "./sidebar-item"
import { usePathname } from "next/navigation";
import { TbBuildingCommunity } from "react-icons/tb";

const guestRoutes = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/academy/dashboard"
    },
    {
        icon: Compass,
        label: "Browse",
        href: "/academy/search"
    },
    // {
    //     icon: TbBuildingCommunity,
    //     label: "Community",
    //     href: "/community"
    // },
    {
        icon: Newspaper,
        label: "List Your Own Course",
        href: "/agency/"
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

export const SidebarRoutes = () => {
    const pathname = usePathname();

    const isTeacherPage = pathname?.includes("/courses/teacher");

    const routes = isTeacherPage ? teacherRoutes : guestRoutes;

    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <SidebarItem 
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />
            ))}
        </div>
    )
}