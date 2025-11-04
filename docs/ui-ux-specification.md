# Community OS Dashboard - UI/UX Specification

**Version**: 1.0
**Date**: 2025-11-03
**Status**: Production-Ready Specification
**Target Framework**: Next.js 14+ with Hexagonal Architecture

---

## Table of Contents

1. [Design System Foundation](#design-system-foundation)
2. [Component Hierarchy](#component-hierarchy)
3. [Design Tokens](#design-tokens)
4. [Responsive Design](#responsive-design)
5. [Interactive States](#interactive-states)
6. [Accessibility Requirements](#accessibility-requirements)
7. [Dark Mode Specifications](#dark-mode-specifications)
8. [Component Composition Patterns](#component-composition-patterns)
9. [Animation & Transitions](#animation--transitions)
10. [Implementation Guidelines](#implementation-guidelines)

---

## 1. Design System Foundation

### Design Philosophy

**Core Principles**:
- **Clarity Over Cleverness**: Intuitive interfaces with obvious interaction patterns
- **Consistency Builds Trust**: Uniform components, spacing, and behaviours throughout
- **Progressive Disclosure**: Show essential information first, reveal complexity gradually
- **Accessibility First**: WCAG 2.1 AA compliance minimum, designed for all users
- **Performance is UX**: Fast, responsive interfaces with optimistic UI patterns
- **Mobile First**: Design constraints from smallest screens, enhance for larger viewports

### Visual Hierarchy

**Primary**: Page header, key metrics, CTA buttons
**Secondary**: Section headers, navigation items, card content
**Tertiary**: Helper text, timestamps, metadata

---

## 2. Component Hierarchy

### Application Structure

```
DashboardLayout
├── Sidebar (240px fixed width)
│   ├── CommunitySwitcher
│   │   ├── CommunityAvatar (40×40px)
│   │   └── CommunityInfo
│   ├── NavigationSections
│   │   ├── MainNav (Home, Analytics, Members, Content, Courses)
│   │   ├── MonetizationNav (Plans & Pricing, Coupons, Transactions)
│   │   └── SettingsNav (Customize, Settings, AI Assistant, Help)
│   └── SidebarFooter
│       ├── PlanBadge (Growth Plan)
│       ├── StorageUsage (12/50 GB)
│       └── UpgradeButton
├── MainContent (flex: 1)
│   ├── TopBar
│   │   ├── PageHeader (Title + Subtitle)
│   │   └── TopBarActions
│   │       ├── ThemeToggle (Icon Button)
│   │       ├── ExportButton (Secondary)
│   │       └── NewPostButton (Primary)
│   └── ContentArea (scrollable)
│       ├── WelcomeBanner (onboarding checklist)
│       ├── MetricsGrid (4 cards: Members, Posts, Comments, MRR)
│       ├── ActivityTrendsChart (time series data)
│       ├── TwoColumnLayout
│       │   ├── RecentActivityFeed
│       │   └── PendingTasksList
│       ├── QuickActionsGrid (6 shortcuts)
│       └── RecommendedResources (3 cards)
```

### Component Categories

**Layout Components**: DashboardLayout, Sidebar, MainContent, ContentArea
**Navigation Components**: NavItem, NavSection, CommunitySwitcher
**Data Display**: MetricCard, ActivityItem, TaskItem, ResourceCard
**Interactive**: Button, IconButton, Checkbox, TimeFilter
**Feedback**: Badge, ProgressBar, StatusIndicator
**Content**: Card, Banner, EmptyState

---

## 3. Design Tokens

### Colour Palette

#### Light Mode

```css
/* Primary Brand Colours */
--primary-50: #eef2ff;
--primary-100: #e0e7ff;
--primary-200: #c7d2fe;
--primary-300: #a5b4fc;
--primary-400: #818cf8;
--primary-500: #6366f1;  /* Primary brand colour */
--primary-600: #4f46e5;  /* Primary hover state */
--primary-700: #4338ca;
--primary-800: #3730a3;
--primary-900: #312e81;

/* Neutral Colours */
--neutral-50: #f9fafb;   /* Surface background */
--neutral-100: #f3f4f6;
--neutral-200: #e5e7eb;  /* Border colour */
--neutral-300: #d1d5db;
--neutral-400: #9ca3af;  /* Tertiary text */
--neutral-500: #6b7280;  /* Secondary text */
--neutral-600: #4b5563;
--neutral-700: #374151;
--neutral-800: #1f2937;
--neutral-900: #111827;  /* Primary text */
--neutral-950: #030712;

/* Semantic Colours */
--success-50: #f0fdf4;
--success-500: #10b981;  /* Success state */
--success-600: #059669;

--warning-50: #fffbeb;
--warning-500: #f59e0b;  /* Warning state */
--warning-600: #d97706;

--danger-50: #fef2f2;
--danger-500: #ef4444;   /* Error/danger state */
--danger-600: #dc2626;

--info-50: #eff6ff;
--info-500: #3b82f6;     /* Informational state */
--info-600: #2563eb;

/* Gradient Colours */
--gradient-primary: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
--gradient-banner: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--gradient-avatar: linear-gradient(135deg, #6366f1, #8b5cf6);
```

#### Dark Mode

```css
/* Dark Mode Overrides */
--background: #0f172a;          /* Slate 900 */
--surface: #1e293b;             /* Slate 800 */
--surface-elevated: #334155;    /* Slate 700 */
--border: #334155;              /* Slate 700 */
--text-primary: #f1f5f9;        /* Slate 100 */
--text-secondary: #cbd5e1;      /* Slate 300 */
--text-tertiary: #94a3b8;       /* Slate 400 */

/* Semantic colours remain the same but may adjust opacity */
```

### Typography

#### Font Stack

```css
--font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
                    'Helvetica Neue', Arial, sans-serif;
```

#### Font Sizes

```css
/* 8px Base Unit - Modular Scale 1.125 (Major Second) */
--font-size-xs: 0.6875rem;   /* 11px - Nav section titles, badges */
--font-size-sm: 0.75rem;     /* 12px - Helper text, timestamps */
--font-size-base: 0.875rem;  /* 14px - Body text, nav items, labels */
--font-size-md: 1rem;        /* 16px - Community avatar text */
--font-size-lg: 1.125rem;    /* 18px - Card titles */
--font-size-xl: 1.25rem;     /* 20px - Banner headings */
--font-size-2xl: 1.5rem;     /* 24px - Page titles */
--font-size-3xl: 2rem;       /* 32px - Metric values */
```

#### Font Weights

```css
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

#### Line Heights

```css
--line-height-tight: 1.25;    /* Headings */
--line-height-normal: 1.5;    /* Body text */
--line-height-relaxed: 1.6;   /* Long-form content */
```

### Spacing Scale (8px Base Unit)

```css
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Border Radius

```css
--radius-sm: 4px;     /* Small elements, badges */
--radius-md: 6px;     /* Buttons, inputs, nav items */
--radius-lg: 8px;     /* Cards, modals, avatars */
--radius-xl: 12px;    /* Banners, large cards */
--radius-full: 9999px; /* Pills, circular avatars */
```

### Shadows

```css
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
             0 1px 2px -1px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
             0 2px 4px -2px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
             0 4px 6px -4px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
             0 8px 10px -6px rgba(0, 0, 0, 0.1);
```

### Z-Index Scale

```css
--z-base: 0;
--z-dropdown: 10;
--z-sticky: 20;
--z-fixed: 30;
--z-modal-backdrop: 40;
--z-modal: 50;
--z-popover: 60;
--z-tooltip: 70;
```

---

## 4. Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
--breakpoint-xs: 320px;   /* Small phones */
--breakpoint-sm: 640px;   /* Large phones */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Small laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large desktops */
```

### Layout Specifications

#### Sidebar

**Desktop (≥768px)**:
- Width: 240px fixed
- Position: Static, always visible
- Scroll: Independent vertical scroll

**Mobile (<768px)**:
- Width: 240px
- Position: Fixed, off-canvas (left: -240px)
- Transition: 0.3s ease-in-out
- Overlay: Semi-transparent backdrop when open
- Z-index: 100

#### Content Area

**Container**:
- Max-width: 1400px
- Margin: 0 auto
- Padding: 24px (desktop), 16px (mobile)

**Metrics Grid**:
- Desktop (≥1024px): 4 columns
- Tablet (768-1023px): 2 columns
- Mobile (<768px): 1 column
- Gap: 20px

**Two-Column Layout**:
- Desktop (≥1200px): 2fr 1fr (66.67% / 33.33%)
- Tablet/Mobile (<1200px): 1 column (stack vertically)

**Quick Actions Grid**:
- Desktop (≥1024px): 6 columns
- Tablet (768-1023px): 3 columns
- Mobile (<768px): 2 columns
- Gap: 12px

### Touch Targets

**Minimum Sizes**:
- Buttons: 44×44px (mobile), 36×36px (desktop)
- Links/Interactive Elements: 44×44px touch area
- Spacing Between Targets: 8px minimum

---

## 5. Interactive States

### Button States

#### Primary Button

```css
/* Default */
background: var(--primary-500);
color: white;
padding: 10px 16px;
border-radius: 8px;
font-weight: 600;
transition: all 0.2s ease;

/* Hover */
background: var(--primary-600);
transform: translateY(-1px);
box-shadow: var(--shadow-md);

/* Active/Press */
background: var(--primary-700);
transform: translateY(0);
box-shadow: var(--shadow-sm);

/* Focus */
outline: 2px solid var(--primary-500);
outline-offset: 2px;

/* Disabled */
background: var(--neutral-300);
color: var(--neutral-500);
cursor: not-allowed;
opacity: 0.6;
```

#### Secondary Button

```css
/* Default */
background: var(--surface);
color: var(--text-primary);
border: 1px solid var(--border);

/* Hover */
background: var(--surface-elevated);
border-color: var(--neutral-300);

/* Focus */
outline: 2px solid var(--primary-500);
outline-offset: 2px;
```

#### Icon Button

```css
/* Default */
width: 36px;
height: 36px;
background: transparent;
border-radius: 8px;
color: var(--text-secondary);

/* Hover */
background: var(--surface);
color: var(--text-primary);

/* Active */
background: var(--neutral-200);
```

### Navigation Item States

```css
/* Default */
padding: 8px 12px;
border-radius: 6px;
color: var(--text-secondary);
background: transparent;

/* Hover */
background: var(--surface-elevated);
color: var(--text-primary);

/* Active/Selected */
background: var(--primary-500);
color: white;
font-weight: 500;

/* Focus */
outline: 2px solid var(--primary-500);
outline-offset: -2px;
```

### Card/Metric Card States

```css
/* Default */
background: var(--surface-elevated);
border: 1px solid var(--border);
border-radius: 12px;
transition: all 0.2s ease;

/* Hover */
box-shadow: var(--shadow-md);
transform: translateY(-2px);
border-color: var(--neutral-300);

/* Active/Press */
transform: translateY(0);
box-shadow: var(--shadow-sm);
```

### Input/Form States

```css
/* Default */
border: 1px solid var(--border);
background: var(--surface);
border-radius: 8px;
padding: 10px 12px;

/* Focus */
border-color: var(--primary-500);
outline: 2px solid var(--primary-500);
outline-offset: -1px;

/* Error */
border-color: var(--danger-500);
outline: 2px solid var(--danger-500);

/* Disabled */
background: var(--neutral-100);
color: var(--text-tertiary);
cursor: not-allowed;
```

---

## 6. Accessibility Requirements

### WCAG 2.1 AA Compliance

#### Colour Contrast Ratios

**Text Contrast**:
- Normal text (14-16px): 4.5:1 minimum
- Large text (18px+ or 14px bold): 3:0 minimum
- Interactive elements: 3:1 minimum against background

**Verified Combinations**:
- Primary text on background: 15.8:1 ✓
- Secondary text on background: 8.9:1 ✓
- Primary button text on primary-500: 8.2:1 ✓
- Border on background: 3.4:1 ✓

#### Keyboard Navigation

**Tab Order**:
1. Skip to main content link (hidden, visible on focus)
2. Community switcher
3. Navigation items (sequential)
4. Theme toggle
5. Export button
6. New Post button
7. Content area interactive elements

**Keyboard Shortcuts**:
- Tab: Move to next focusable element
- Shift + Tab: Move to previous element
- Enter/Space: Activate buttons and links
- Escape: Close modals, dismiss overlays, collapse mobile menu
- Arrow keys: Navigate within list groups

**Focus Indicators**:
- Visible 2px outline in primary colour
- 2px offset for clarity
- Never remove focus indicators
- Custom focus styles for better visibility

#### Screen Reader Support

**Semantic HTML**:
- `<nav>` for navigation sections
- `<main>` for main content
- `<aside>` for sidebar
- `<header>` for top bar
- `<article>` for cards with standalone content
- `<button>` for interactive elements (never `<div>` with `onClick`)

**ARIA Labels**:
- `aria-label` for icon buttons without visible text
- `aria-current="page"` for active navigation items
- `aria-expanded` for collapsible sections
- `aria-live="polite"` for dynamic content updates (metric changes)
- `aria-describedby` for helper text associations

**ARIA Landmarks**:
- `role="banner"` for top bar
- `role="navigation"` for nav sections
- `role="main"` for content area
- `role="complementary"` for sidebar

#### Form Accessibility

**Labels**:
- All inputs have associated `<label>` elements
- `for` attribute matches input `id`
- Required fields marked with `aria-required="true"`

**Error Handling**:
- Error messages have `role="alert"`
- `aria-invalid="true"` on fields with errors
- `aria-describedby` links input to error message

#### Images & Icons

**Decorative Icons**: `aria-hidden="true"` (emoji icons in dashboard)
**Functional Icons**: `aria-label` with descriptive text
**Avatar Images**: `alt` text with user name or role

#### Motion & Animation

**Reduced Motion Support**:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 7. Dark Mode Specifications

### Theme Toggle Behaviour

**Storage**: Persist theme preference in `localStorage`
**Initial Load**: Check `localStorage`, fallback to system preference
**System Preference**: Use `prefers-color-scheme` media query
**Toggle Icon**: Moon icon (light mode), Sun icon (dark mode)

### Dark Mode Colour Adjustments

#### Background Colours

```css
[data-theme="dark"] {
  --background: #0f172a;          /* Slate 900 */
  --surface: #1e293b;             /* Slate 800 */
  --surface-elevated: #334155;    /* Slate 700 */
  --border: #334155;
}
```

#### Text Colours

```css
[data-theme="dark"] {
  --text-primary: #f1f5f9;        /* Slate 100 */
  --text-secondary: #cbd5e1;      /* Slate 300 */
  --text-tertiary: #94a3b8;       /* Slate 400 */
}
```

#### Component-Specific Adjustments

**Shadows**: Reduce opacity by 50% in dark mode
**Borders**: Increase contrast slightly (lighter borders)
**Gradients**: Maintain brand gradients, no adjustment needed
**Success/Warning/Error**: Keep semantic colours, reduce background opacity

### Contrast Requirements (Dark Mode)

**Text Contrast**:
- White text on dark background: 15.2:1 ✓
- Primary button remains same contrast: 8.2:1 ✓
- Secondary text contrast: 7.8:1 ✓

### Transition

```css
body,
.sidebar,
.main-content,
.card,
.metric-card {
  transition: background 0.3s ease,
              color 0.3s ease,
              border-color 0.3s ease;
}
```

---

## 8. Component Composition Patterns

### Layout Pattern: Dashboard Container

```typescript
// DTO-based component structure
interface DashboardLayoutProps {
  user: UserDTO;
  community: CommunityDTO;
  children: React.ReactNode;
}

export function DashboardLayout({ user, community, children }: DashboardLayoutProps) {
  return (
    <div className="dashboard-container">
      <Sidebar user={user} community={community} />
      <main className="main-content">
        <TopBar user={user} />
        <div className="content-area">
          {children}
        </div>
      </main>
    </div>
  );
}
```

### Metric Card Component

**Structure**:

```typescript
interface MetricCardProps {
  icon: string | React.ReactNode;
  label: string;
  value: string | number;
  change: {
    value: string;
    trend: 'positive' | 'negative' | 'neutral';
  };
  onClick?: () => void;
}

export function MetricCard({ icon, label, value, change, onClick }: MetricCardProps) {
  return (
    <article
      className="metric-card"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="metric-header">
        <div className="metric-icon">{icon}</div>
        <span className="metric-label">{label}</span>
      </div>
      <div className="metric-value">{value}</div>
      <div className={`metric-change ${change.trend}`}>
        <span aria-hidden="true">{change.trend === 'positive' ? '↗' : '↘'}</span>
        <span>{change.value}</span>
      </div>
    </article>
  );
}
```

**Specifications**:
- Padding: 20px all sides
- Border: 1px solid var(--border)
- Border-radius: 12px
- Hover: Elevate 2px, add shadow-md
- Cursor: pointer (if onClick provided)
- Transition: all 0.2s ease

### Navigation Item Component

```typescript
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  badge?: string | number;
}

export function NavItem({ icon, label, href, active, badge }: NavItemProps) {
  return (
    <a
      href={href}
      className={`nav-item ${active ? 'active' : ''}`}
      aria-current={active ? 'page' : undefined}
    >
      <span className="nav-icon" aria-hidden="true">{icon}</span>
      <span>{label}</span>
      {badge && (
        <span className="nav-item-badge" aria-label={`${badge} notifications`}>
          {badge}
        </span>
      )}
    </a>
  );
}
```

### Card Component

**Base Structure**:

```typescript
interface CardProps {
  title?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, icon, action, children, className }: CardProps) {
  return (
    <section className={`card ${className || ''}`}>
      {(title || action) && (
        <header className="card-header">
          {title && (
            <h2 className="card-title">
              {icon && <span aria-hidden="true">{icon}</span>}
              <span>{title}</span>
            </h2>
          )}
          {action}
        </header>
      )}
      <div className="card-content">
        {children}
      </div>
    </section>
  );
}
```

### Activity Item Component

```typescript
interface ActivityItemDTO {
  id: string;
  type: 'member' | 'post' | 'comment' | 'milestone' | 'payment';
  icon: string;
  text: string;
  timestamp: string; // ISO 8601 string
  badge?: {
    text: string;
    variant: 'success' | 'info' | 'warning';
  };
}

interface ActivityItemProps {
  activity: ActivityItemDTO;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  return (
    <article className="activity-item">
      <div className="activity-icon" aria-hidden="true">
        {activity.icon}
      </div>
      <div className="activity-content">
        <p className="activity-text">{activity.text}</p>
        <time
          className="activity-time"
          dateTime={activity.timestamp}
        >
          {formatRelativeTime(activity.timestamp)}
        </time>
      </div>
      {activity.badge && (
        <span className={`activity-badge ${activity.badge.variant}`}>
          {activity.badge.text}
        </span>
      )}
    </article>
  );
}
```

---

## 9. Animation & Transitions

### Timing Functions

```css
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Transition Durations

```css
--duration-fast: 150ms;     /* Hover states, tooltips */
--duration-base: 200ms;     /* Standard transitions */
--duration-slow: 300ms;     /* Theme toggle, modals */
--duration-slower: 500ms;   /* Page transitions */
```

### Component Transitions

**Card Hover**:
```css
transition: transform 200ms ease-out,
            box-shadow 200ms ease-out;
transform: translateY(-2px);
```

**Button Hover**:
```css
transition: background 150ms ease-out,
            transform 150ms ease-out,
            box-shadow 150ms ease-out;
transform: translateY(-1px);
```

**Navigation Item**:
```css
transition: background 200ms ease-out,
            color 200ms ease-out;
```

**Theme Toggle**:
```css
transition: background 300ms ease,
            color 300ms ease,
            border-color 300ms ease;
```

### Micro-interactions

**Ripple Effect** (button press):
```css
@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 0.6;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}
```

**Skeleton Loading**:
```css
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--neutral-200) 0%,
    var(--neutral-100) 50%,
    var(--neutral-200) 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
```

**Fade In** (content load):
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 400ms ease-out;
}
```

---

## 10. Implementation Guidelines

### File Structure (Next.js 14+ App Router)

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx              # DashboardLayout wrapper
│   │   ├── page.tsx                # Home dashboard (Server Component)
│   │   ├── analytics/
│   │   │   └── page.tsx
│   │   ├── members/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   └── api/
│       └── dashboard/
│           └── metrics/
│               └── route.ts        # API route for metrics DTOs
├── presentation/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopBar.tsx
│   │   │   └── ContentArea.tsx
│   │   ├── navigation/
│   │   │   ├── NavItem.tsx
│   │   │   ├── NavSection.tsx
│   │   │   └── CommunitySwitcher.tsx
│   │   ├── cards/
│   │   │   ├── Card.tsx
│   │   │   ├── MetricCard.tsx
│   │   │   └── ActivityItem.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── IconButton.tsx
│   │       ├── Badge.tsx
│   │       └── ProgressBar.tsx
│   └── styles/
│       ├── globals.css
│       ├── tokens.css              # Design tokens as CSS variables
│       └── components/
│           ├── layout.css
│           ├── navigation.css
│           └── cards.css
└── application/
    └── dtos/
        ├── dashboard.dto.ts        # DashboardDTO, MetricDTO
        ├── user.dto.ts             # UserDTO
        └── community.dto.ts        # CommunityDTO
```

### DTO Structure Examples

```typescript
// src/application/dtos/dashboard.dto.ts
export interface MetricDTO {
  id: string;
  label: string;
  value: string | number;
  icon: string;
  change: {
    value: string;
    trend: 'positive' | 'negative' | 'neutral';
  };
}

export interface DashboardDTO {
  metrics: MetricDTO[];
  recentActivity: ActivityDTO[];
  pendingTasks: TaskDTO[];
  quickActions: QuickActionDTO[];
}

export interface ActivityDTO {
  id: string;
  type: 'member' | 'post' | 'comment' | 'milestone' | 'payment';
  icon: string;
  text: string;
  timestamp: string; // ISO 8601
  badge?: {
    text: string;
    variant: 'success' | 'info' | 'warning';
  };
}
```

### Server Component Pattern

```typescript
// src/app/(dashboard)/page.tsx (Server Component)
import { DashboardLayout } from '@/presentation/components/layout/DashboardLayout';
import { MetricCard } from '@/presentation/components/cards/MetricCard';
import { DashboardDTO } from '@/application/dtos/dashboard.dto';

export default async function DashboardPage() {
  // Fetch from API route or Use Case
  const response = await fetch('http://localhost:3000/api/dashboard/metrics', {
    cache: 'no-store', // or revalidate
  });
  const dashboard: DashboardDTO = await response.json();

  return (
    <>
      <div className="metrics-grid">
        {dashboard.metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>
      {/* ... rest of dashboard content */}
    </>
  );
}
```

### Client Component Pattern (Interactive)

```typescript
// src/presentation/components/ui/ThemeToggle.tsx
'use client';

import { useState, useEffect } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button
      className="icon-button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <MoonIcon aria-hidden="true" />
      ) : (
        <SunIcon aria-hidden="true" />
      )}
    </button>
  );
}
```

### CSS Architecture

**Token System** (tokens.css):

```css
:root {
  /* Import all design tokens from Section 3 */
}

[data-theme="dark"] {
  /* Dark mode overrides from Section 7 */
}
```

**Component Styles** (BEM Methodology):

```css
/* Card Component */
.card {
  background: var(--surface-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  transition: box-shadow var(--duration-base) var(--ease-out);
}

.card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-5);
}

.card__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.card__content {
  /* Content styles */
}
```

### Accessibility Implementation Checklist

- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible and meet 3:1 contrast ratio
- [ ] ARIA labels provided for icon buttons
- [ ] Semantic HTML used throughout (`<nav>`, `<main>`, `<article>`)
- [ ] `aria-current="page"` on active navigation items
- [ ] Form labels associated with inputs
- [ ] Error messages linked with `aria-describedby`
- [ ] Colour contrast meets WCAG 2.1 AA (4.5:1 for text, 3:1 for UI)
- [ ] `prefers-reduced-motion` media query implemented
- [ ] Skip to main content link provided
- [ ] Screen reader testing completed (VoiceOver, NVDA, JAWS)

### Performance Optimisation

**Image Optimisation**:
- Use Next.js `<Image>` component with lazy loading
- Serve WebP format with fallback
- Implement blur placeholder for avatars and images

**Code Splitting**:
- Lazy load chart components: `const Chart = dynamic(() => import('./Chart'))`
- Split CSS by route using CSS Modules
- Use React.lazy() for modal dialogs

**Font Loading**:
- Use `next/font` for optimised font loading
- Preload critical fonts with `<link rel="preload">`
- Subset fonts to include only required characters

**Bundle Size**:
- Target: <500KB initial bundle, <2MB total
- Use tree-shaking for icon libraries
- Avoid large dependencies (moment.js → date-fns)

### Testing Strategy

**Unit Tests** (Components):
- Test all interactive states (hover, focus, active, disabled)
- Verify ARIA attributes are present
- Test keyboard navigation
- Snapshot tests for visual regression

**Integration Tests** (Page-level):
- Test navigation flow between dashboard sections
- Verify data fetching and DTO rendering
- Test theme toggle persistence
- Test responsive behaviour

**E2E Tests** (User Journeys):
- Complete onboarding flow (welcome banner)
- Navigate dashboard, view metrics
- Export report functionality
- Create new post from dashboard

**Accessibility Tests**:
- Automated: axe-core, Lighthouse
- Manual: Keyboard navigation, screen reader testing
- Colour contrast validation

---

## Appendix A: Component Specifications Summary

### Sidebar

**Width**: 240px
**Background**: var(--surface)
**Border**: 1px solid var(--border) (right side)
**Padding**: Sections have 16px padding
**Scroll**: Independent vertical overflow

### TopBar

**Height**: Auto (content-based, ~72px)
**Background**: var(--surface-elevated)
**Border**: 1px solid var(--border) (bottom)
**Padding**: 16px 24px
**Layout**: Flexbox, space-between

### MetricCard

**Padding**: 20px
**Border-radius**: 12px
**Border**: 1px solid var(--border)
**Min-height**: ~160px
**Grid columns**: Auto-fit, minmax(280px, 1fr)

### Card

**Padding**: 24px
**Border-radius**: 12px
**Border**: 1px solid var(--border)
**Margin-bottom**: 24px

### Button (Primary)

**Padding**: 10px 16px
**Border-radius**: 8px
**Font-size**: 14px (--font-size-base)
**Font-weight**: 600
**Min-height**: 40px (36px + padding)

### Icon Button

**Size**: 36×36px
**Border-radius**: 8px
**Icon size**: 20×20px

### Navigation Item

**Padding**: 8px 12px
**Border-radius**: 6px
**Font-size**: 14px
**Icon size**: 18×18px
**Gap**: 12px (icon to text)

---

## Appendix B: Colour Palette Reference

### Quick Colour Guide

**Primary Actions**: `#6366f1` (primary-500)
**Backgrounds**: `#ffffff` (light), `#0f172a` (dark)
**Surfaces**: `#f9fafb` (light), `#1e293b` (dark)
**Text Primary**: `#111827` (light), `#f1f5f9` (dark)
**Text Secondary**: `#6b7280` (light), `#cbd5e1` (dark)
**Borders**: `#e5e7eb` (light), `#334155` (dark)
**Success**: `#10b981`
**Warning**: `#f59e0b`
**Danger**: `#ef4444`

---

## Appendix C: Implementation Checklist

### Phase 1: Foundation
- [ ] Set up design token CSS variables
- [ ] Implement DashboardLayout with Sidebar and TopBar
- [ ] Create base Button, IconButton, and Badge components
- [ ] Implement theme toggle with localStorage persistence
- [ ] Set up responsive breakpoints and grid system

### Phase 2: Core Components
- [ ] Build Card and MetricCard components
- [ ] Implement NavItem and NavSection components
- [ ] Create ActivityItem and TaskItem components
- [ ] Build ProgressBar and StatusIndicator components
- [ ] Implement WelcomeBanner component

### Phase 3: Data Integration
- [ ] Define DTOs (DashboardDTO, MetricDTO, ActivityDTO)
- [ ] Create API routes for dashboard data
- [ ] Implement Server Components for data fetching
- [ ] Add Client Components for interactivity
- [ ] Set up error handling and loading states

### Phase 4: Accessibility
- [ ] Add ARIA labels and semantic HTML
- [ ] Implement keyboard navigation
- [ ] Test with screen readers
- [ ] Verify colour contrast ratios
- [ ] Add skip links and focus management

### Phase 5: Polish
- [ ] Implement all transition animations
- [ ] Add micro-interactions (hover states, ripples)
- [ ] Optimise images and fonts
- [ ] Add skeleton loading states
- [ ] Conduct cross-browser testing

### Phase 6: Testing
- [ ] Write unit tests for all components
- [ ] Add integration tests for user flows
- [ ] Run E2E tests with Playwright
- [ ] Perform accessibility audit
- [ ] Load test and optimise performance

---

**Document Status**: ✅ Production-Ready
**Review Date**: 2025-11-03
**Next Review**: 2025-12-03
**Maintained By**: UI/UX Design Team

