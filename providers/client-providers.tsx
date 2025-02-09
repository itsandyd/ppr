"use client";

import { ThemeProvider } from "./theme-provider";
import { SocketProvider } from "./socket-provider";
import { ToasterProvider } from "./toast-provider";
import { ModalProvider } from "./modal-provider";
import { QueryProvider } from "./query-provider";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
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
  );
} 