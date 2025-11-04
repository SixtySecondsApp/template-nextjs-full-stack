# Phase 6.2: Admin Dashboard Layout & Navigation

**Status**: ⚠️ Planned (Not Yet Implemented)
**Priority**: High
**Estimated Effort**: 3-4 days

## Overview

Complete dashboard layout infrastructure with responsive sidebar navigation, top bar with actions, and mobile-first responsive design following WCAG 2.1 AA accessibility standards.

## Planned Components

This phase will implement the foundational layout components for the admin dashboard:

### Navigation Components

#### 1. DashboardSidebar
- **Purpose**: Main navigation container with grouped sections
- **Location**: `src/components/dashboard/sidebar/DashboardSidebar.tsx`
- **Features**:
  - Responsive collapse/expand behaviour
  - Grouped navigation sections (Overview, Content, Members, Settings)
  - Active state based on current URL
  - Keyboard navigation support
  - ARIA labels for screen readers

#### 2. NavSection
- **Purpose**: Grouped navigation items with optional collapsing
- **Location**: `src/components/dashboard/sidebar/NavSection.tsx`
- **Features**:
  - Collapsible sections with expand/collapse animation
  - Section headings with proper ARIA labels
  - Icon support for visual identification

#### 3. NavItem
- **Purpose**: Individual navigation links with active states
- **Location**: `src/components/dashboard/sidebar/NavItem.tsx`
- **Features**:
  - Active state highlighting
  - Icon and label support
  - Keyboard focus states
  - Badge support for notifications

#### 4. CommunitySwitcher
- **Purpose**: Dropdown for switching between communities
- **Location**: `src/components/dashboard/sidebar/CommunitySwitcher.tsx`
- **Features**:
  - Community avatar display
  - Search/filter for communities
  - Create new community option
  - Recent communities quick access

#### 5. SidebarFooter
- **Purpose**: Plan badge, storage indicator, and theme toggle
- **Location**: `src/components/dashboard/sidebar/SidebarFooter.tsx`
- **Features**:
  - Current plan display with upgrade prompt
  - Storage usage progress bar
  - Dark mode toggle
  - User profile quick access

### Top Bar Components

#### 6. TopBar
- **Purpose**: Page title, breadcrumbs, and action buttons
- **Location**: `src/components/dashboard/top-bar/TopBar.tsx`
- **Features**:
  - Dynamic page title
  - Breadcrumb navigation
  - Mobile menu toggle button
  - Action button slot

#### 7. TopBarActions
- **Purpose**: Context-specific action buttons
- **Location**: `src/components/dashboard/top-bar/TopBarActions.tsx`
- **Features**:
  - Slot for page-specific actions
  - Responsive button grouping
  - Dropdown for overflow actions

### Mobile Components

#### 8. MobileSidebar
- **Purpose**: Off-canvas sidebar for mobile devices
- **Location**: `src/components/dashboard/sidebar/MobileSidebar.tsx`
- **Features**:
  - Slide-in animation
  - Overlay backdrop
  - Focus trap when open
  - Touch gesture support
  - Close on route change

#### 9. MobileHeader
- **Purpose**: Mobile-optimised top bar
- **Location**: `src/components/dashboard/top-bar/MobileHeader.tsx`
- **Features**:
  - Hamburger menu button
  - Compact page title
  - Essential actions only

## Features Planned

### Responsive Design
- **Mobile** (<768px): Off-canvas sidebar, compact top bar
- **Tablet** (768px-1024px): Collapsible sidebar
- **Desktop** (>1024px): Full sidebar with all features

### Keyboard Navigation
- `Tab`: Navigate between interactive elements
- `Enter/Space`: Activate buttons and links
- `Escape`: Close mobile sidebar
- `Arrow Keys`: Navigate within dropdowns

### Accessibility (WCAG 2.1 AA)
- Semantic HTML structure
- ARIA labels for all interactive elements
- Focus indicators on all focusable elements
- Screen reader announcements for state changes
- Minimum contrast ratio 4.5:1

### Dark Mode Support
- All components support dark mode
- Smooth theme transitions
- System preference detection
- User preference persistence

### State Management
- Zustand store for sidebar open/close state
- URL-based active navigation item
- Local storage for user preferences
- Session storage for temporary state

## Technical Specifications

### Styling
- **Framework**: Tailwind CSS
- **Icons**: lucide-react
- **Animations**: Tailwind CSS transitions
- **Responsive**: Mobile-first approach

### State Management
```typescript
// src/store/navigation.store.ts
interface NavigationState {
  sidebarOpen: boolean;
  activePath: string;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setActivePath: (path: string) => void;
}
```

### Layout Structure
```typescript
// src/app/(dashboard)/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar />
      <MobileSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
```

## Navigation Structure

```
Home
├── Overview (dashboard metrics)
└── Activity (recent activity feed)

Content
├── Posts (all posts management)
├── Comments (moderation queue)
├── Courses (course builder)
└── Media (media library)

Members
├── All Members (member directory)
├── Roles & Permissions (access control)
└── Invitations (pending invites)

Engagement
├── Analytics (charts and graphs)
├── Events (calendar view)
└── Notifications (broadcast messages)

Settings
├── General (community info)
├── Branding (logos and colors)
├── Integrations (third-party services)
└── Billing (subscription management)
```

## Implementation Checklist

- [ ] Create Zustand navigation store
- [ ] Implement DashboardSidebar component
- [ ] Implement NavSection component
- [ ] Implement NavItem component
- [ ] Implement CommunitySwitcher dropdown
- [ ] Implement SidebarFooter component
- [ ] Implement TopBar component
- [ ] Implement TopBarActions slot
- [ ] Implement MobileSidebar with overlay
- [ ] Implement MobileHeader component
- [ ] Add keyboard navigation support
- [ ] Add ARIA labels and roles
- [ ] Test responsive behaviour
- [ ] Test dark mode switching
- [ ] Test accessibility with screen reader
- [ ] Write component unit tests
- [ ] Write E2E navigation tests

## Dependencies

```json
{
  "zustand": "^4.5.0",
  "lucide-react": "^0.294.0",
  "next": "^14.0.0",
  "react": "^18.2.0",
  "tailwindcss": "^3.4.0"
}
```

## Success Criteria

- [ ] All breakpoints render correctly
- [ ] Keyboard navigation works throughout
- [ ] Screen reader announces all state changes
- [ ] Theme toggle works in all components
- [ ] Mobile sidebar closes on route change
- [ ] Active states reflect current route
- [ ] Performance: <100ms interaction response
- [ ] Accessibility: WCAG 2.1 AA compliant

## Next Phase

After completing Phase 6.2, proceed to **Phase 6.3: Home Tab & Metrics** to implement dashboard content components.

## Related Documentation

- [Dashboard Architecture](../architecture/dashboard-architecture.md)
- [Component Documentation](../../src/components/dashboard/README.md)
- [Development Guide](../development/dashboard-guide.md)
- [Testing Guide](../testing/dashboard-tests.md)
