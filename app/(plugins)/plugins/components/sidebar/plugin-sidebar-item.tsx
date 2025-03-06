"use client";

import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { IconType } from "react-icons";

interface SidebarItemProps {
  icon: LucideIcon | IconType;
  label: string;
  href: string;
};

export const SidebarItem = ({
  icon: Icon,
  label,
  href,
}: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);

  const onClick = () => {
    router.push(href);
  }

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex items-center gap-x-2 text-sm font-[500] pl-6 transition-all theme-transition",
        isActive ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn(
            "theme-transition",
            isActive ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"
          )}
        />
        {label}
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-primary dark:border-white h-full transition-all theme-transition",
          isActive && "opacity-100"
        )}
      />
    </button>
  )
}