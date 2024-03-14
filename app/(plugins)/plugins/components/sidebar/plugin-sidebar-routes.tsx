"use client"

import { BarChart, Compass, DotIcon, Layout, List, Music2Icon, Newspaper, PlusCircle } from "lucide-react"

import { usePathname } from "next/navigation";
import { TbBuildingCommunity } from "react-icons/tb";
import { SidebarItem } from "./plugin-sidebar-item";

const guestRoutes = [
    // {
    //     icon: Layout,
    //     label: "Dashboard",
    //     href: "/plugins/dashboard"
    // },
    // {
    //     icon: Compass,
    //     label: "Search",
    //     href: "/plugins/search"
    // },
    // {
    //     icon: DotIcon,
    //     label: "Amp Simulations",
    //     href: "/plugins/amp-simulations"
    // },
    // {
    //     icon: DotIcon,
    //     label: "Autotune",
    //     href: "/plugins/autotune"
    // },
    // {
    //     icon: DotIcon,
    //     label: "Bitcrushers",
    //     href: "/plugins/bitcrushers"
    // },
    // {
    //     icon: TbBuildingCommunity,
    //     label: "Community",
    //     href: "/community"
    // },
    {
        icon: PlusCircle,
        label: "List Your Own Plugin",
        href: "/plugins/dashboard/author/list"
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

export const PluginSidebarRoutes = () => {
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