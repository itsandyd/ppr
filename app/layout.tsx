import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/react';
import { ClientProviders } from "@/providers/client-providers";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PausePlayRepeat",
  description: "A platform for music production",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body 
          className={cn(
            font.className, 
            "bg-background text-foreground dark:bg-background dark:text-foreground transition-colors"
          )}
        >
          <ClientProviders>{children}</ClientProviders>
          <SpeedInsights />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}

