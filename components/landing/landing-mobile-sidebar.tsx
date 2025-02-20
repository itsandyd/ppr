"use client";

import Link from "next/link";
import Image from "next/image";
import { Montserrat } from 'next/font/google'
import { BookIcon, Code, ComputerIcon, ImageIcon, LayoutDashboard, MessageSquare, Music, Settings, UserIcon, VideoIcon, Gift, Users } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { BsSoundwave } from "react-icons/bs";
import { GiTeacher } from "react-icons/gi";

const poppins = Montserrat ({ weight: '600', subsets: ['latin'] });

const routes = [
    {
      label: 'Sounds',
      icon: Music,
      href: '/sounds',
    },
    {
      label: 'Plugins',
      icon: BsSoundwave,
      href: '/plugins',
    },
    {
      label: 'Academy',
      icon: BookIcon,
      href: '/academy',
    },
    {
      label: 'AI',
      icon: ComputerIcon,
      href: '/ai',
    },
    {
      label: 'Music',
      icon: Music,
      href: '/music',
    },
    {
      label: 'Freebies',
      icon: Gift,
      href: '/freebies',
    },
    {
      label: 'Community',
      icon: Users,
      href: 'https://discord.gg/pauseplayrepeat',
    },
];

export const LandingMobileSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-background">
      <div className="px-3 py-2 flex-1">
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href} 
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-lg transition",
                "hover:bg-accent hover:text-accent-foreground",
                pathname === route.href 
                  ? "bg-accent text-accent-foreground" 
                  : "text-muted-foreground"
              )}
            >
              <div className="flex items-center gap-x-3 flex-1">
                <route.icon className="h-5 w-5" />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};