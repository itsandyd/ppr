import { cn } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Pauseplayrepeat - Music Platform',
  description: 'A thriving community where artists and fans connect through the universal language of music.',
};

export default function MusicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={cn(
      "min-h-screen antialiased",
      "bg-white dark:bg-black",
      "text-zinc-900 dark:text-zinc-100",
      "flex flex-col",
    )}>
      {children}
    </div>
  );
} 