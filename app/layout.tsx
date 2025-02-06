import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "../providers/theme-provider";
import { cn } from "@/lib/utils";
import { ModalProvider } from "../providers/modal-provider";
import { SocketProvider } from "../providers/socket-provider";
import { QueryProvider } from "../providers/query-provider";
import { ToasterProvider } from "@/providers/toast-provider";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/react';

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
      <html lang="en" suppressHydrationWarning className="transition-colors">
        <body 
          className={cn(
            font.className, 
            "bg-background text-foreground dark:bg-background dark:text-foreground transition-colors"
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem={true}
            storageKey="discord-theme"
          >
            <SocketProvider>
              <ToasterProvider />
              <ModalProvider />
              <QueryProvider>{children}</QueryProvider>
            </SocketProvider>
            <SpeedInsights />
            <Analytics />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

