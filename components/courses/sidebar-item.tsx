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
        "flex items-center w-full text-sm font-[500] transition-all hover:bg-slate-300/20",
        isActive && "bg-slate-200/20"
      )}
    >
      <div className="flex items-center gap-x-2 py-4 pl-6">
        <Icon
          size={22}
          className={cn(
            "text-slate-600",
            isActive && "text-white dark:text-gray-200"
          )}
        />
        {label}
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-slate-700 h-full transition-all",
          isActive && "opacity-100"
        )}
      />
    </button>
  )
}