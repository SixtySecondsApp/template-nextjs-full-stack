/**
 * UnifiedSidebar Usage Example
 *
 * This file demonstrates how to use the UnifiedSidebar component system
 * with the LayoutProvider for context-aware navigation.
 */

"use client";

import { LayoutProvider } from "@/components/providers/LayoutProvider";
import { UnifiedSidebar } from "./UnifiedSidebar";
import { Menu } from "lucide-react";
import { useLayout } from "@/components/providers/LayoutProvider";

/**
 * Example: Dashboard Layout with Unified Sidebar
 */
function DashboardLayoutExample({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider initialContext="dashboard" initialUserRole="ADMIN">
      <div className="flex min-h-screen">
        {/* Unified Sidebar */}
        <UnifiedSidebar
          userName="John Doe"
          userEmail="john@example.com"
          communityName="My Community"
          communityInitials="MC"
          showCommunitySwitcher={true}
          onCommunitySwitcherClick={() => console.log("Switch community")}
          onSettingsClick={() => console.log("Open settings")}
          onLogoutClick={() => console.log("Logout")}
        />

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <DashboardHeader />
          <div className="p-6">{children}</div>
        </main>
      </div>
    </LayoutProvider>
  );
}

/**
 * Example: Community Layout with Unified Sidebar
 */
function CommunityLayoutExample({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider initialContext="community" initialUserRole="MEMBER">
      <div className="flex min-h-screen">
        {/* Unified Sidebar */}
        <UnifiedSidebar
          userName="Jane Smith"
          userEmail="jane@example.com"
          communityName="Learning Hub"
          communityInitials="LH"
          onSettingsClick={() => console.log("Open settings")}
          onLogoutClick={() => console.log("Logout")}
        />

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <CommunityHeader />
          <div className="p-6">{children}</div>
        </main>
      </div>
    </LayoutProvider>
  );
}

/**
 * Example: Mobile-friendly header with sidebar toggle
 */
function DashboardHeader() {
  const { toggleSidebar } = useLayout();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-4 px-4">
        {/* Mobile menu toggle */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 hover:bg-accent rounded-md transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-lg font-semibold">Dashboard</h1>

        <div className="ml-auto flex items-center gap-2">
          {/* Header actions */}
        </div>
      </div>
    </header>
  );
}

/**
 * Example: Community header with search
 */
function CommunityHeader() {
  const { toggleSidebar } = useLayout();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-4 px-4">
        {/* Mobile menu toggle */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 hover:bg-accent rounded-md transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search bar */}
        <div className="flex-1 max-w-md">
          <input
            type="search"
            placeholder="Search community..."
            className="w-full px-4 py-2 rounded-lg border border-border bg-background"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Header actions */}
        </div>
      </div>
    </header>
  );
}

/**
 * Example: Switching contexts dynamically
 */
function ContextSwitcherExample() {
  const { context, setContext, userRole, setUserRole } = useLayout();

  return (
    <div className="p-4 space-y-4 border rounded-lg">
      <div>
        <label className="block text-sm font-medium mb-2">
          Current Context: <strong>{context}</strong>
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setContext("dashboard")}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
          >
            Dashboard
          </button>
          <button
            onClick={() => setContext("community")}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
          >
            Community
          </button>
          <button
            onClick={() => setContext("admin")}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
          >
            Admin
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Current Role: <strong>{userRole}</strong>
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setUserRole("MEMBER")}
            className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground"
          >
            Member
          </button>
          <button
            onClick={() => setUserRole("MODERATOR")}
            className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground"
          >
            Moderator
          </button>
          <button
            onClick={() => setUserRole("ADMIN")}
            className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground"
          >
            Admin
          </button>
          <button
            onClick={() => setUserRole("OWNER")}
            className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground"
          >
            Owner
          </button>
        </div>
      </div>
    </div>
  );
}

// Export examples for reference
export {
  DashboardLayoutExample,
  CommunityLayoutExample,
  ContextSwitcherExample,
};
