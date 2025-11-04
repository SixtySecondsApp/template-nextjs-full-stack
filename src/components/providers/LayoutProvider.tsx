"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

/**
 * Layout context types defining different application sections
 */
export type LayoutContext = "dashboard" | "community" | "admin";

/**
 * User roles for role-based navigation filtering
 */
export type UserRole = "OWNER" | "ADMIN" | "MODERATOR" | "MEMBER";

/**
 * Navigation item definition
 */
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  requiredRoles?: UserRole[];
}

/**
 * Navigation section grouping
 */
export interface NavSection {
  id: string;
  title: string;
  items: NavItem[];
  context: LayoutContext[];
}

/**
 * Layout context state
 */
interface LayoutContextState {
  // Current layout context
  context: LayoutContext;
  setContext: (context: LayoutContext) => void;

  // Sidebar state
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;

  // Active navigation
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;

  // User role for filtering
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;

  // Navigation helpers
  getFilteredNavSections: (sections: NavSection[]) => NavSection[];
  isItemVisible: (item: NavItem) => boolean;
}

const LayoutContext = createContext<LayoutContextState | undefined>(undefined);

interface LayoutProviderProps {
  children: React.ReactNode;
  initialContext?: LayoutContext;
  initialUserRole?: UserRole;
}

export function LayoutProvider({
  children,
  initialContext = "community",
  initialUserRole = "MEMBER",
}: LayoutProviderProps) {
  const [context, setContext] = useState<LayoutContext>(initialContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(initialUserRole);

  // Sidebar controls
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const openSidebar = useCallback(() => {
    setIsSidebarOpen(true);
  }, []);

  // Role-based visibility checker
  const isItemVisible = useCallback(
    (item: NavItem): boolean => {
      if (!item.requiredRoles || item.requiredRoles.length === 0) {
        return true;
      }

      const roleHierarchy: Record<UserRole, number> = {
        OWNER: 4,
        ADMIN: 3,
        MODERATOR: 2,
        MEMBER: 1,
      };

      const userRoleLevel = roleHierarchy[userRole];
      const requiredLevel = Math.min(
        ...item.requiredRoles.map((role) => roleHierarchy[role])
      );

      return userRoleLevel >= requiredLevel;
    },
    [userRole]
  );

  // Filter navigation sections based on context and role
  const getFilteredNavSections = useCallback(
    (sections: NavSection[]): NavSection[] => {
      return sections
        .filter((section) => section.context.includes(context))
        .map((section) => ({
          ...section,
          items: section.items.filter(isItemVisible),
        }))
        .filter((section) => section.items.length > 0);
    },
    [context, isItemVisible]
  );

  const value = useMemo<LayoutContextState>(
    () => ({
      context,
      setContext,
      isSidebarOpen,
      toggleSidebar,
      closeSidebar,
      openSidebar,
      activeSection,
      setActiveSection,
      userRole,
      setUserRole,
      getFilteredNavSections,
      isItemVisible,
    }),
    [
      context,
      isSidebarOpen,
      toggleSidebar,
      closeSidebar,
      openSidebar,
      activeSection,
      userRole,
      getFilteredNavSections,
      isItemVisible,
    ]
  );

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
}

/**
 * Hook to access layout context
 */
export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
}

/**
 * Hook to check if current context matches
 */
export function useIsContext(targetContext: LayoutContext): boolean {
  const { context } = useLayout();
  return context === targetContext;
}

/**
 * Hook to get context-aware navigation
 */
export function useContextNav(sections: NavSection[]): NavSection[] {
  const { getFilteredNavSections } = useLayout();
  return useMemo(() => getFilteredNavSections(sections), [sections, getFilteredNavSections]);
}
