# Unified Sidebar Component System

A context-aware, role-based sidebar navigation system that seamlessly adapts across Dashboard, Community, and Admin sections while maintaining consistent design.

## 📁 File Structure

```
src/components/
├── providers/
│   └── LayoutProvider.tsx          # Context and state management
└── layout/
    ├── UnifiedSidebar.tsx          # Main sidebar component
    ├── UnifiedSidebar.example.tsx  # Usage examples
    ├── UNIFIED_SIDEBAR_README.md   # This file
    └── sidebar/
        ├── index.ts                # Subcomponent exports
        ├── SidebarHeader.tsx       # Logo and community switcher
        ├── SidebarNav.tsx          # Navigation sections
        ├── SidebarNavItem.tsx      # Individual nav items
        └── SidebarFooter.tsx       # User profile and settings
```

## 🎯 Core Features

### 1. Context Awareness
- **Dashboard Context**: Management-focused navigation (Analytics, Members, Content, Settings)
- **Community Context**: User-focused navigation (Feed, Forum, Courses, Members, Events)
- **Admin Context**: Platform administration (Users, Content, Moderation, Billing, Settings)

### 2. Role-Based Access Control
Navigation items automatically filter based on user role:
- **OWNER**: Full access to all features
- **ADMIN**: Administrative access (excludes billing)
- **MODERATOR**: Content moderation and member management
- **MEMBER**: Basic community features

### 3. Responsive Design
- **Desktop (≥1024px)**: Fixed sidebar at 280px width
- **Mobile (<1024px)**: Overlay sidebar with backdrop
- **Keyboard Navigation**: Escape key to close, full keyboard support

### 4. Design Consistency
- Gradient logo header matching Community Example
- Active state: Full primary background
- Smooth transitions and hover effects
- Accessible with ARIA attributes

## 🚀 Quick Start

### Basic Setup

```tsx
// app/layout.tsx or app/(protected)/layout.tsx
import { LayoutProvider } from "@/components/providers/LayoutProvider";
import { UnifiedSidebar } from "@/components/layout/UnifiedSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider initialContext="community" initialUserRole="MEMBER">
      <div className="flex min-h-screen">
        <UnifiedSidebar
          userName="John Doe"
          userEmail="john@example.com"
          communityName="My Community"
          communityInitials="MC"
        />
        <main className="flex-1">{children}</main>
      </div>
    </LayoutProvider>
  );
}
```

### With Mobile Toggle

```tsx
// components/layout/AppHeader.tsx
"use client";

import { useLayout } from "@/components/providers/LayoutProvider";
import { Menu } from "lucide-react";

export function AppHeader() {
  const { toggleSidebar } = useLayout();

  return (
    <header className="border-b border-border bg-background">
      <div className="flex h-14 items-center gap-4 px-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 hover:bg-accent rounded-md"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">My App</h1>
      </div>
    </header>
  );
}
```

## 🔧 API Reference

### LayoutProvider

Context provider for layout state management.

```tsx
interface LayoutProviderProps {
  children: React.ReactNode;
  initialContext?: "dashboard" | "community" | "admin";
  initialUserRole?: "OWNER" | "ADMIN" | "MODERATOR" | "MEMBER";
}
```

### useLayout Hook

Access layout context and controls.

```tsx
const {
  // Context management
  context,                        // Current context
  setContext,                     // Change context

  // Sidebar state
  isSidebarOpen,                  // Sidebar open state
  toggleSidebar,                  // Toggle sidebar
  closeSidebar,                   // Close sidebar
  openSidebar,                    // Open sidebar

  // Navigation
  activeSection,                  // Active navigation section
  setActiveSection,               // Set active section

  // User role
  userRole,                       // Current user role
  setUserRole,                    // Change user role

  // Helpers
  getFilteredNavSections,         // Filter sections by context/role
  isItemVisible,                  // Check if item is visible
} = useLayout();
```

### UnifiedSidebar Component

```tsx
interface UnifiedSidebarProps {
  userName?: string;                      // User display name
  userEmail?: string;                     // User email
  userAvatar?: string;                    // User avatar URL
  communityName?: string;                 // Community name
  communityInitials?: string;             // Community initials (logo)
  showCommunitySwitcher?: boolean;        // Show community switcher
  onCommunitySwitcherClick?: () => void;  // Community switcher handler
  onSettingsClick?: () => void;           // Settings click handler
  onLogoutClick?: () => void;             // Logout click handler
}
```

## 📋 Navigation Configuration

Navigation is defined in `UnifiedSidebar.tsx` as an array of `NavSection` objects:

```tsx
const navigationSections: NavSection[] = [
  {
    id: "section-id",
    title: "Section Title",
    context: ["dashboard", "community", "admin"],  // Which contexts to show in
    items: [
      {
        id: "item-id",
        label: "Item Label",
        href: "/path",
        icon: IconComponent,
        badge: "3",                                  // Optional badge
        requiredRoles: ["OWNER", "ADMIN"],          // Optional role filter
      },
    ],
  },
];
```

### Adding New Navigation Items

1. **Add to existing section**:
```tsx
items: [
  // ... existing items
  {
    id: "new-feature",
    label: "New Feature",
    href: "/dashboard/new-feature",
    icon: Star,
    requiredRoles: ["ADMIN"],
  },
]
```

2. **Create new section**:
```tsx
{
  id: "custom-section",
  title: "Custom Section",
  context: ["dashboard"],
  items: [
    // ... your items
  ],
}
```

## 🎨 Styling

The sidebar uses Tailwind CSS with design tokens from `globals.css`:

### Key Classes
- `bg-card`: Sidebar background
- `border-border`: Border color
- `bg-primary`: Active item background
- `text-primary-foreground`: Active item text
- `hover:bg-accent`: Hover state

### Customizing
Override CSS variables in your theme:

```css
:root {
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --accent: oklch(0.97 0 0);
  --border: oklch(0.922 0 0);
}
```

## ♿ Accessibility

The sidebar implements comprehensive accessibility features:

- **Semantic HTML**: `<aside>`, `<nav>`, proper heading hierarchy
- **ARIA Labels**: `aria-label`, `aria-current`, `aria-expanded`
- **Keyboard Navigation**:
  - Tab/Shift+Tab to navigate items
  - Enter/Space to activate links
  - Escape to close mobile sidebar
- **Focus Management**: Visible focus indicators
- **Screen Reader Support**: Meaningful labels and context

## 📱 Responsive Behavior

### Desktop (≥1024px)
- Fixed sidebar always visible
- 280px width
- No overlay

### Mobile (<1024px)
- Sidebar hidden by default
- Slides in from left when opened
- Dark overlay backdrop
- Closes on backdrop click or Escape key

## 🔄 Context Switching

Switch between contexts dynamically:

```tsx
"use client";

import { useLayout } from "@/components/providers/LayoutProvider";

export function ContextSwitcher() {
  const { setContext } = useLayout();

  return (
    <div className="flex gap-2">
      <button onClick={() => setContext("dashboard")}>Dashboard</button>
      <button onClick={() => setContext("community")}>Community</button>
      <button onClick={() => setContext("admin")}>Admin</button>
    </div>
  );
}
```

## 🔐 Role-Based Filtering

Control visibility with `requiredRoles`:

```tsx
{
  id: "admin-only",
  label: "Admin Panel",
  href: "/admin",
  icon: Shield,
  requiredRoles: ["OWNER", "ADMIN"],  // Only visible to OWNER and ADMIN
}
```

**Role Hierarchy**:
- OWNER: Level 4 (highest)
- ADMIN: Level 3
- MODERATOR: Level 2
- MEMBER: Level 1

If a user is ADMIN, they can see items requiring ADMIN, MODERATOR, or MEMBER roles.

## 🧩 Subcomponents

All subcomponents are modular and can be used independently:

```tsx
import {
  SidebarHeader,
  SidebarNav,
  SidebarNavItem,
  SidebarFooter,
} from "@/components/layout/sidebar";

// Build custom sidebar
function CustomSidebar() {
  return (
    <aside className="w-[280px] flex flex-col">
      <SidebarHeader communityName="Custom" />
      {/* Custom navigation */}
      <SidebarFooter userName="User" />
    </aside>
  );
}
```

## 🐛 Troubleshooting

### Navigation items not appearing
- Check if `context` matches item's `context` array
- Verify user `userRole` meets `requiredRoles`
- Ensure section has visible items after filtering

### Mobile sidebar not working
- Verify `LayoutProvider` wraps your layout
- Check `toggleSidebar` is called on menu button
- Ensure no CSS `overflow: hidden` on parent containers

### Styling issues
- Verify Tailwind config includes component paths
- Check CSS custom properties are defined in `globals.css`
- Ensure dark mode classes work if using dark theme

## 📚 Examples

See `UnifiedSidebar.example.tsx` for complete working examples:
- Dashboard layout with admin role
- Community layout with member role
- Dynamic context and role switching
- Mobile-friendly headers with sidebar toggle

## 🎯 Best Practices

1. **Initialize LayoutProvider early**: Wrap at root layout level
2. **Set correct initial values**: Match context to route (`/dashboard` → `dashboard`)
3. **Sync user role**: Update `userRole` when user authentication changes
4. **Handle logout**: Clear state and redirect in `onLogoutClick`
5. **Optimize navigation config**: Only define items needed for each context
6. **Use semantic routes**: Keep href structure consistent (`/context/feature`)

## 📝 Migration Guide

### From old Sidebar component

**Before**:
```tsx
import { Sidebar } from "@/components/layout/Sidebar";

<Sidebar />
```

**After**:
```tsx
import { LayoutProvider } from "@/components/providers/LayoutProvider";
import { UnifiedSidebar } from "@/components/layout/UnifiedSidebar";

<LayoutProvider initialContext="community">
  <UnifiedSidebar userName="User" />
</LayoutProvider>
```

## 🤝 Contributing

When adding navigation items:
1. Add to appropriate section in `navigationSections`
2. Use consistent icon style (lucide-react)
3. Set proper `requiredRoles` for access control
4. Test across all contexts and roles
5. Update this README if adding new features

## 📄 License

Part of the Sixty Community platform. See project LICENSE for details.
