import { createContext, useContext, useState, useMemo } from 'react';
import type { ReactNode } from 'react';

interface SidebarSection {
  href: string;
  label: string;
  isGroup?: boolean;
}

interface SidebarContextValue {
  sections: SidebarSection[];
  setSections: (s: SidebarSection[]) => void;
}

const SidebarContext = createContext<SidebarContextValue>({
  sections: [],
  setSections: () => {},
});

export function SidebarProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [sections, setSections] = useState<SidebarSection[]>([]);
  const value = useMemo(() => ({ sections, setSections }), [sections]);
  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
  return useContext(SidebarContext);
}
