# Unified Sidebar Quick Start Guide

Get up and running with the Unified Sidebar in 5 minutes.

## ⚡ Quick Installation

### Step 1: Wrap your app with LayoutProvider

```tsx
// app/layout.tsx
import { LayoutProvider } from "@/components/providers/LayoutProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LayoutProvider initialContext="community" initialUserRole="MEMBER">
          {children}
        </LayoutProvider>
      </body>
    </html>
  );
}
```

### Step 2: Add UnifiedSidebar to your layout

```tsx
// app/(protected)/layout.tsx
import { UnifiedSidebar } from "@/components/layout/UnifiedSidebar";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <UnifiedSidebar
        userName="John Doe"
        userEmail="john@example.com"
        communityName="My Community"
        communityInitials="MC"
      />
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

### Step 3: Add mobile menu button

```tsx
// components/Header.tsx
"use client";

import { useLayout } from "@/components/providers/LayoutProvider";
import { Menu } from "lucide-react";

export function Header() {
  const { toggleSidebar } = useLayout();

  return (
    <header className="lg:hidden border-b p-4">
      <button onClick={toggleSidebar} aria-label="Toggle menu">
        <Menu className="w-6 h-6" />
      </button>
    </header>
  );
}
```

## 🎯 Common Patterns

### Pattern 1: Dashboard with Admin Role

```tsx
<LayoutProvider initialContext="dashboard" initialUserRole="ADMIN">
  <UnifiedSidebar userName="Admin User" />
</LayoutProvider>
```

**Shows**: Home, Analytics, Members, Content, Settings

### Pattern 2: Community with Member Role

```tsx
<LayoutProvider initialContext="community" initialUserRole="MEMBER">
  <UnifiedSidebar userName="Member User" />
</LayoutProvider>
```

**Shows**: Feed, Forum, Courses, Members, Events

### Pattern 3: Dynamic Context Switching

```tsx
"use client";

import { useLayout } from "@/components/providers/LayoutProvider";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ContextManager() {
  const { setContext } = useLayout();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/dashboard")) {
      setContext("dashboard");
    } else if (pathname.startsWith("/admin")) {
      setContext("admin");
    } else {
      setContext("community");
    }
  }, [pathname, setContext]);

  return null;
}
```

### Pattern 4: Role-Based Features

```tsx
"use client";

import { useLayout } from "@/components/providers/LayoutProvider";

export function AdminFeature() {
  const { userRole } = useLayout();

  if (userRole !== "ADMIN" && userRole !== "OWNER") {
    return <div>Access denied</div>;
  }

  return <div>Admin content</div>;
}
```

## 🔧 Configuration

### Available Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `userName` | string | "User" | Display name in footer |
| `userEmail` | string | - | Email in footer dropdown |
| `userAvatar` | string | - | Avatar URL (uses initials if not provided) |
| `communityName` | string | "Community OS" | Name in header |
| `communityInitials` | string | "CO" | Logo initials |
| `showCommunitySwitcher` | boolean | false | Show community switcher button |
| `onCommunitySwitcherClick` | function | - | Community switcher handler |
| `onSettingsClick` | function | - | Settings click handler |
| `onLogoutClick` | function | - | Logout handler |

### Context Types

- `"dashboard"` - Management interface
- `"community"` - User-facing community
- `"admin"` - Platform administration

### User Roles

- `"OWNER"` - Full access (level 4)
- `"ADMIN"` - Administrative access (level 3)
- `"MODERATOR"` - Moderation access (level 2)
- `"MEMBER"` - Basic access (level 1)

## 📱 Responsive Breakpoints

- **Desktop**: ≥1024px (lg) - Sidebar always visible
- **Mobile**: <1024px - Sidebar as overlay

## 🎨 Styling

The sidebar automatically uses your theme tokens:

```css
/* Key tokens used */
--primary              /* Active background */
--primary-foreground   /* Active text */
--muted-foreground     /* Inactive text */
--accent               /* Hover background */
--border               /* Borders */
```

## 🐛 Troubleshooting

### Items not showing?
✅ Check context matches: `["dashboard"]` array includes current context
✅ Verify role access: User role meets `requiredRoles`

### Mobile sidebar not working?
✅ Ensure `LayoutProvider` wraps your app
✅ Add mobile toggle button with `toggleSidebar()`

### Styling looks wrong?
✅ Verify Tailwind config includes component paths
✅ Check CSS variables are defined in `globals.css`

## 📚 Full Documentation

See [UNIFIED_SIDEBAR_README.md](./UNIFIED_SIDEBAR_README.md) for complete API reference and advanced usage.

## 💡 Tips

1. **Set context based on route**: Use pathname to auto-switch context
2. **Sync role with auth**: Update `userRole` when user logs in
3. **Handle logout properly**: Clear state and redirect
4. **Use semantic routes**: Keep URLs consistent with context
5. **Test all roles**: Verify navigation for each role type

## 🎯 Next Steps

1. ✅ Install components (you're done!)
2. 📝 Customize navigation items in `UnifiedSidebar.tsx`
3. 🎨 Adjust colors in your theme
4. 🔐 Integrate with your auth system
5. 📱 Test on mobile devices

Happy coding! 🚀
