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
import Navbar from "@/components/coaching/navbar/Navbar";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingMobileSidebar } from "@/components/landing/landing-mobile-navbar";
import { useEffect } from "react";

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
        <body className={cn(font.className, "bg-white dark:bg-[#313338]")}>
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
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

