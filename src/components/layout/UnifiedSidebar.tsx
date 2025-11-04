"use client";

import { useEffect } from "react";
import {
  Home,
  BarChart3,
  Users,
  FileText,
  Settings,
  MessageSquare,
  BookOpen,
  Calendar,
  TrendingUp,
  Shield,
  Palette,
  Bell,
  CreditCard,
} from "lucide-react";
import { useLayout, NavSection } from "@/components/providers/LayoutProvider";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarNav } from "./sidebar/SidebarNav";
import { SidebarFooter } from "./sidebar/SidebarFooter";

/**
 * Navigation configuration for all contexts
 * Sections are filtered based on active context and user role
 */
const navigationSections: NavSection[] = [
  // Dashboard Navigation
  {
    id: "dashboard-main",
    title: "Main",
    context: ["dashboard"],
    items: [
      {
        id: "dashboard-home",
        label: "Home",
        href: "/dashboard",
        icon: Home,
      },
      {
        id: "dashboard-analytics",
        label: "Analytics",
        href: "/dashboard/analytics",
        icon: BarChart3,
        requiredRoles: ["OWNER", "ADMIN"],
      },
    ],
  },
  {
    id: "dashboard-management",
    title: "Management",
    context: ["dashboard"],
    items: [
      {
        id: "dashboard-members",
        label: "Members",
        href: "/dashboard/members",
        icon: Users,
        requiredRoles: ["OWNER", "ADMIN", "MODERATOR"],
      },
      {
        id: "dashboard-content",
        label: "Content",
        href: "/dashboard/content",
        icon: FileText,
        requiredRoles: ["OWNER", "ADMIN", "MODERATOR"],
      },
    ],
  },
  {
    id: "dashboard-settings",
    title: "Configuration",
    context: ["dashboard"],
    items: [
      {
        id: "dashboard-settings",
        label: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
        requiredRoles: ["OWNER", "ADMIN"],
      },
    ],
  },

  // Community Navigation
  {
    id: "community-main",
    title: "Main",
    context: ["community"],
    items: [
      {
        id: "community-feed",
        label: "Feed",
        href: "/community",
        icon: Home,
      },
      {
        id: "community-forum",
        label: "Forum",
        href: "/community/forum",
        icon: MessageSquare,
      },
    ],
  },
  {
    id: "community-learning",
    title: "Learning",
    context: ["community"],
    items: [
      {
        id: "community-courses",
        label: "Courses",
        href: "/community/courses",
        icon: BookOpen,
      },
    ],
  },
  {
    id: "community-engage",
    title: "Engage",
    context: ["community"],
    items: [
      {
        id: "community-members",
        label: "Members",
        href: "/community/members",
        icon: Users,
      },
      {
        id: "community-events",
        label: "Events",
        href: "/community/events",
        icon: Calendar,
      },
    ],
  },

  // Admin Navigation
  {
    id: "admin-overview",
    title: "Overview",
    context: ["admin"],
    items: [
      {
        id: "admin-dashboard",
        label: "Dashboard",
        href: "/admin",
        icon: Home,
        requiredRoles: ["OWNER", "ADMIN"],
      },
      {
        id: "admin-analytics",
        label: "Analytics",
        href: "/admin/analytics",
        icon: TrendingUp,
        requiredRoles: ["OWNER", "ADMIN"],
      },
    ],
  },
  {
    id: "admin-management",
    title: "Management",
    context: ["admin"],
    items: [
      {
        id: "admin-users",
        label: "Users",
        href: "/admin/users",
        icon: Users,
        requiredRoles: ["OWNER", "ADMIN"],
      },
      {
        id: "admin-content",
        label: "Content",
        href: "/admin/content",
        icon: FileText,
        requiredRoles: ["OWNER", "ADMIN"],
      },
      {
        id: "admin-moderation",
        label: "Moderation",
        href: "/admin/moderation",
        icon: Shield,
        requiredRoles: ["OWNER", "ADMIN", "MODERATOR"],
      },
    ],
  },
  {
    id: "admin-configuration",
    title: "Configuration",
    context: ["admin"],
    items: [
      {
        id: "admin-appearance",
        label: "Appearance",
        href: "/admin/appearance",
        icon: Palette,
        requiredRoles: ["OWNER", "ADMIN"],
      },
      {
        id: "admin-notifications",
        label: "Notifications",
        href: "/admin/notifications",
        icon: Bell,
        requiredRoles: ["OWNER", "ADMIN"],
      },
      {
        id: "admin-billing",
        label: "Billing",
        href: "/admin/billing",
        icon: CreditCard,
        requiredRoles: ["OWNER"],
      },
      {
        id: "admin-settings",
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
        requiredRoles: ["OWNER", "ADMIN"],
      },
    ],
  },
];

interface UnifiedSidebarProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  communityName?: string;
  communityInitials?: string;
  showCommunitySwitcher?: boolean;
  onCommunitySwitcherClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
}

export function UnifiedSidebar({
  userName,
  userEmail,
  userAvatar,
  communityName,
  communityInitials,
  showCommunitySwitcher = false,
  onCommunitySwitcherClick,
  onSettingsClick,
  onLogoutClick,
}: UnifiedSidebarProps) {
  const { isSidebarOpen, closeSidebar, getFilteredNavSections } = useLayout();

  // Get context-aware and role-filtered navigation
  const filteredSections = getFilteredNavSections(navigationSections);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSidebarOpen) {
        closeSidebar();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isSidebarOpen, closeSidebar]);

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-[280px] flex flex-col
          bg-card border-r border-border
          transition-transform duration-300 lg:translate-x-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        aria-label="Main navigation"
      >
        {/* Header */}
        <SidebarHeader
          communityName={communityName}
          communityInitials={communityInitials}
          showSwitcher={showCommunitySwitcher}
          onSwitcherClick={onCommunitySwitcherClick}
        />

        {/* Navigation */}
        <SidebarNav sections={filteredSections} onItemClick={closeSidebar} />

        {/* Footer */}
        <SidebarFooter
          userName={userName}
          userEmail={userEmail}
          userAvatar={userAvatar}
          onSettingsClick={onSettingsClick}
          onLogoutClick={onLogoutClick}
        />
      </aside>
    </>
  );
}
