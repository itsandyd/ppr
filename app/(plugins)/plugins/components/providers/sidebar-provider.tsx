"use client";

import { createContext, useContext, useState } from "react";

interface SidebarContextType {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleCollapse }}>
      <div data-collapsed={isCollapsed}>
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    // Log the component stack to help identify where the hook is being used incorrectly
    console.warn("SidebarProvider not found. The useSidebar hook must be used within a SidebarProvider component.", 
      new Error().stack);
    
    // Return a default implementation
    return {
      isCollapsed: false,
      toggleCollapse: () => {}
    };
  }
  return context;
} 