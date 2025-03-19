import { SidebarProvider } from "../../components/providers/sidebar-provider";

export default function AuthorLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      {children}
    </SidebarProvider>
  );
} 