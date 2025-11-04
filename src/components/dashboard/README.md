# Dashboard Components

Complete component library for the Sixty Community admin dashboard following Hexagonal Architecture principles and WCAG 2.1 AA accessibility standards.

## Table of Contents

- [Architecture](#architecture)
- [Component Catalog](#component-catalog)
  - [Navigation Components](#navigation-components)
  - [Metrics Components](#metrics-components)
  - [Activity Components](#activity-components)
  - [Task & Action Components](#task--action-components)
  - [Welcome & Resources](#welcome--resources)
  - [Members Management](#members-management)
  - [Content Management](#content-management)
  - [Analytics Components](#analytics-components)
- [Shared Patterns](#shared-patterns)
- [Usage Examples](#usage-examples)
- [Styling Guidelines](#styling-guidelines)
- [Accessibility](#accessibility)
- [Testing](#testing)

## Architecture

```
dashboard/
├── sidebar/          # Navigation sidebar (Phase 6.2 - planned)
│   ├── DashboardSidebar.tsx
│   ├── NavSection.tsx
│   ├── NavItem.tsx
│   ├── CommunitySwitcher.tsx
│   ├── SidebarFooter.tsx
│   └── MobileSidebar.tsx
│
├── top-bar/          # Top bar with actions (Phase 6.2 - planned)
│   ├── TopBar.tsx
│   ├── TopBarActions.tsx
│   └── MobileHeader.tsx
│
├── home/             # Home tab components (Phase 6.3 - implemented)
│   ├── MetricsGrid.tsx
│   ├── MetricCard.tsx
│   ├── MetricCardSkeleton.tsx
│   ├── ActivityGraph.tsx
│   ├── ActivityGraphSkeleton.tsx
│   ├── ActivityFeed.tsx
│   ├── ActivityFeedSkeleton.tsx
│   ├── RecentActivity.tsx
│   ├── PendingTasks.tsx
│   ├── QuickActions.tsx
│   ├── WelcomeBanner.tsx
│   ├── WelcomeBannerSkeleton.tsx
│   └── RecommendedResources.tsx
│
├── members/          # Members management (Phase 6.4 - partially implemented)
│   ├── MembersTable.tsx (planned)
│   ├── MemberFilters.tsx (planned)
│   └── MemberBulkActions.tsx (planned)
│
├── content/          # Content management (Phase 6.4 - partially implemented)
│   ├── ContentList.tsx (planned)
│   ├── ContentFilters.tsx (planned)
│   ├── FlaggedContentQueue.tsx (planned)
│   └── ContentBulkActions.tsx (planned)
│
└── analytics/        # Analytics dashboards (Phase 6.4 - partially implemented)
    ├── AnalyticsOverview.tsx (planned)
    ├── EngagementCharts.tsx (planned)
    └── RevenueAnalytics.tsx (planned)
```

## Component Catalog

### Navigation Components

#### DashboardSidebar
**Location**: `sidebar/DashboardSidebar.tsx`
**Status**: ⚠️ Planned (Phase 6.2)
**Purpose**: Main navigation container with sections

**Planned Props**:
```typescript
// No props - consumes Zustand store
```

**Planned Features**:
- Responsive collapse/expand
- Grouped navigation sections
- Active state based on URL
- Keyboard navigation support

**Planned Usage**:
```tsx
import { DashboardSidebar } from '@/components/dashboard/sidebar/DashboardSidebar';

<DashboardSidebar />
```

---

#### NavSection
**Location**: `sidebar/NavSection.tsx`
**Status**: ⚠️ Planned (Phase 6.2)
**Purpose**: Grouped navigation items with collapsing

**Planned Props**:
```typescript
interface NavSectionProps {
  title: string;
  icon?: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  children: React.ReactNode;
}
```

**Planned Usage**:
```tsx
<NavSection title="Content" icon={<FileText />} collapsible>
  <NavItem href="/posts" icon={<FileText />} label="Posts" />
  <NavItem href="/comments" icon={<MessageCircle />} label="Comments" />
</NavSection>
```

---

#### NavItem
**Location**: `sidebar/NavItem.tsx`
**Status**: ⚠️ Planned (Phase 6.2)
**Purpose**: Individual navigation link with active states

**Planned Props**:
```typescript
interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: number | string;
  isActive?: boolean;
}
```

**Planned Usage**:
```tsx
<NavItem
  href="/posts"
  icon={<FileText />}
  label="Posts"
  badge={5}
/>
```

---

### Metrics Components

#### MetricsGrid
**Location**: `home/MetricsGrid.tsx`
**Status**: ✅ Implemented (Phase 6.3)
**Purpose**: Container for metric cards with responsive layout

**Props**:
```typescript
// No props - fetches data internally with TanStack Query
```

**Features**:
- Responsive grid (1/2/4 columns)
- Loading skeleton states
- Error boundary
- TanStack Query integration

**Usage**:
```tsx
import { MetricsGrid } from '@/components/dashboard/home/MetricsGrid';

<MetricsGrid />
```

**Dependencies**:
- `/api/dashboard/metrics` API route
- `MetricCard` component
- `MetricCardSkeleton` component

---

#### MetricCard
**Location**: `home/MetricCard.tsx`
**Status**: ✅ Implemented (Phase 6.3)
**Purpose**: Individual metric display with trend indicator

**Props**:
```typescript
interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: MetricChangeType; // 'positive' | 'negative' | 'neutral'
  icon: React.ReactNode;
  loading?: boolean;
}
```

**Features**:
- Color-coded trends (green/red/grey)
- Trend icons (TrendingUp, TrendingDown, Minus)
- Hover animation with elevation
- Dark mode support
- Automatic skeleton when loading

**Usage**:
```tsx
import { MetricCard } from '@/components/dashboard/home/MetricCard';
import { Users } from 'lucide-react';

<MetricCard
  title="Total Members"
  value="1,247"
  change="+12%"
  changeType="positive"
  icon={<Users />}
/>
```

**Visual States**:
- Positive: Green text with TrendingUp icon
- Negative: Red text with TrendingDown icon
- Neutral: Grey text with Minus icon

---

#### MetricCardSkeleton
**Location**: `home/MetricCardSkeleton.tsx`
**Status**: ✅ Implemented (Phase 6.3)
**Purpose**: Loading skeleton for metric cards

**Props**: None

**Features**:
- Animated pulse effect
- Matches card layout
- Dark mode compatible

**Usage**:
```tsx
import { MetricCardSkeleton } from '@/components/dashboard/home/MetricCardSkeleton';

<MetricCardSkeleton />
```

---

### Activity Components

#### ActivityGraph
**Location**: `home/ActivityGraph.tsx`
**Status**: ✅ Implemented (Phase 6.3)
**Purpose**: Line chart showing activity trends

**Props**: None (fetches data internally)

**Features**:
- Chart.js line chart
- Time filter dropdown (7d, 30d, 90d, 1y)
- Responsive canvas sizing
- Gradient fill
- Dark mode theme
- Smooth animations
- Hover tooltips

**Usage**:
```tsx
import { ActivityGraph } from '@/components/dashboard/home/ActivityGraph';

<ActivityGraph />
```

**Dependencies**:
- Chart.js
- `/api/dashboard/activity` API route

---

#### ActivityFeed
**Location**: `home/ActivityFeed.tsx`
**Status**: ✅ Implemented (Phase 6.3)
**Purpose**: Recent activity list with icons

**Props**:
```typescript
interface ActivityFeedProps {
  activities: ActivityItemDTO[];
  loading?: boolean;
}
```

**Features**:
- Activity type icons (UserPlus, FileText, MessageCircle, etc.)
- Relative timestamps ("2 hours ago")
- Badge support
- Empty state
- Dark mode support

**Usage**:
```tsx
import { ActivityFeed } from '@/components/dashboard/home/ActivityFeed';

const activities = [
  {
    id: '1',
    type: 'member_joined',
    icon: 'UserPlus',
    text: 'John Doe joined',
    description: 'New member signup',
    timestamp: '2025-11-04T10:00:00Z',
    relativeTime: '2 hours ago',
    badge: 'New',
    metadata: {},
  }
];

<ActivityFeed activities={activities} />
```

**Activity Types**:
- `member_joined` → UserPlus icon
- `post_created` → FileText icon
- `comment_added` → MessageCircle icon
- `milestone` → Trophy icon
- `payment_received` → DollarSign icon
- `course_completed` → GraduationCap icon
- `event_scheduled` → Calendar icon

---

#### RecentActivity
**Location**: `home/RecentActivity.tsx`
**Status**: ✅ Implemented (Phase 6.3)
**Purpose**: Activity feed container with data fetching

**Props**: None

**Features**:
- TanStack Query integration
- Loading skeleton
- Error handling
- Empty state

**Usage**:
```tsx
import { RecentActivity } from '@/components/dashboard/home/RecentActivity';

<RecentActivity />
```

---

### Task & Action Components

#### PendingTasks
**Location**: `home/PendingTasks.tsx`
**Status**: ✅ Implemented (Phase 6.3)
**Purpose**: Urgent tasks requiring attention

**Props**: None (uses mock data currently)

**Features**:
- Urgency indicators (low, medium, high, urgent)
- Color-coded badges
- Action buttons
- Dismiss functionality
- Task count badges
- Empty state

**Usage**:
```tsx
import { PendingTasks } from '@/components/dashboard/home/PendingTasks';

<PendingTasks />
```

**Urgency Levels**:
- `low` → Blue badge
- `medium` → Yellow badge
- `high` → Orange badge
- `urgent` → Red badge

---

#### QuickActions
**Location**: `home/QuickActions.tsx`
**Status**: ✅ Implemented (Phase 6.3)
**Purpose**: Grid of quick action buttons

**Props**: None

**Features**:
- Responsive grid (2/3 columns)
- Icon + label + description
- Hover effects
- Permission-based visibility (future)

**Usage**:
```tsx
import { QuickActions } from '@/components/dashboard/home/QuickActions';

<QuickActions />
```

**Available Actions**:
- Create Post → `/posts/new`
- Invite Members → `/members/invite`
- Launch Course → `/courses/new`
- Schedule Event → `/events/new`
- Send Notification → `/notifications/new`
- View Analytics → `/analytics`

---

### Welcome & Resources

#### WelcomeBanner
**Location**: `home/WelcomeBanner.tsx`
**Status**: ✅ Implemented (Phase 6.3)
**Purpose**: Greeting with setup checklist

**Props**: None

**Features**:
- Personalised greeting with time of day
- Setup progress indicator
- Collapsible checklist
- Dismiss functionality
- Confetti on completion
- Progress percentage

**Usage**:
```tsx
import { WelcomeBanner } from '@/components/dashboard/home/WelcomeBanner';

<WelcomeBanner />
```

**Setup Steps**:
1. Upload community logo
2. Customise branding colours
3. Create first space
4. Invite first members
5. Create welcome post
6. Enable notifications

---

#### RecommendedResources
**Location**: `home/RecommendedResources.tsx`
**Status**: ✅ Implemented (Phase 6.3)
**Purpose**: Curated resources for community owners

**Props**: None

**Features**:
- Resource type icons
- External link indicators
- Estimated time
- Categories (guide, video, webinar, etc.)
- Hover effects

**Usage**:
```tsx
import { RecommendedResources } from '@/components/dashboard/home/RecommendedResources';

<RecommendedResources />
```

**Resource Types**:
- `guide` → BookOpen icon
- `video` → Video icon
- `webinar` → Calendar icon
- `case_study` → FileText icon
- `template` → FileText icon
- `tutorial` → PlayCircle icon

---

### Members Management

#### MembersTable
**Location**: `members/MembersTable.tsx`
**Status**: ⚠️ Planned (Phase 6.4)
**Purpose**: Searchable member directory

**Planned Props**:
```typescript
interface MembersTableProps {
  communityId: string;
}
```

**Planned Features**:
- Server-side pagination
- Column sorting
- Search by name/email
- Filter by plan/status
- Bulk actions
- Row actions (view, edit, suspend, delete)

**Planned Usage**:
```tsx
import { MembersTable } from '@/components/dashboard/members/MembersTable';

<MembersTable communityId="123" />
```

---

### Content Management

#### ContentList
**Location**: `content/ContentList.tsx`
**Status**: ⚠️ Planned (Phase 6.4)
**Purpose**: Post management table

**Planned Props**:
```typescript
interface ContentListProps {
  communityId: string;
}
```

**Planned Features**:
- Server-side pagination
- Filter by type/status/space
- Sort by date/likes/comments/views
- Bulk approve/reject
- Pin/unpin posts
- Row actions (edit, delete, flag, archive)

**Planned Usage**:
```tsx
import { ContentList } from '@/components/dashboard/content/ContentList';

<ContentList communityId="123" />
```

---

### Analytics Components

#### AnalyticsOverview
**Location**: `analytics/AnalyticsOverview.tsx`
**Status**: ⚠️ Planned (Phase 6.4)
**Purpose**: High-level analytics dashboard

**Planned Props**:
```typescript
interface AnalyticsOverviewProps {
  communityId: string;
  timeRange: TimeFilter;
}
```

**Planned Features**:
- Traffic overview charts
- Engagement metrics
- Top pages/posts
- User acquisition sources
- Growth trends
- Export functionality

**Planned Usage**:
```tsx
import { AnalyticsOverview } from '@/components/dashboard/analytics/AnalyticsOverview';

<AnalyticsOverview communityId="123" timeRange="30d" />
```

---

## Shared Patterns

### Loading States
All components implement loading skeletons:
```tsx
if (loading) {
  return <ComponentNameSkeleton />;
}
```

### Error Handling
Components show error states:
```tsx
if (error) {
  return (
    <div className="p-4 border border-red-200 rounded-lg">
      <p className="text-red-600">Error: {error.message}</p>
    </div>
  );
}
```

### Empty States
Components show empty states when no data:
```tsx
if (data.length === 0) {
  return (
    <div className="text-center py-12">
      <Icon className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">No data available</p>
      <Button className="mt-4">Create First Item</Button>
    </div>
  );
}
```

### Dark Mode
All components support dark mode:
```tsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  {/* Content */}
</div>
```

## Usage Examples

### Complete Home Tab
```tsx
import { MetricsGrid } from '@/components/dashboard/home/MetricsGrid';
import { ActivityGraph } from '@/components/dashboard/home/ActivityGraph';
import { RecentActivity } from '@/components/dashboard/home/RecentActivity';
import { PendingTasks } from '@/components/dashboard/home/PendingTasks';
import { QuickActions } from '@/components/dashboard/home/QuickActions';
import { WelcomeBanner } from '@/components/dashboard/home/WelcomeBanner';
import { RecommendedResources } from '@/components/dashboard/home/RecommendedResources';

export default function HomePage() {
  return (
    <div className="space-y-6 p-6">
      <WelcomeBanner />
      <MetricsGrid />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityGraph />
        <RecentActivity />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PendingTasks />
        <QuickActions />
      </div>
      <RecommendedResources />
    </div>
  );
}
```

### Responsive Layout
```tsx
// Mobile: Single column
// Tablet: 2 columns
// Desktop: 4 columns
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
  <MetricCard {...props} />
</div>
```

## Styling Guidelines

### Tailwind CSS Classes
```css
/* Spacing */
p-6        /* padding: 1.5rem */
gap-6      /* gap: 1.5rem */
space-y-6  /* margin-top: 1.5rem (except first child) */

/* Layout */
grid                    /* display: grid */
grid-cols-1            /* 1 column */
md:grid-cols-2         /* 2 columns on tablet+ */
xl:grid-cols-4         /* 4 columns on desktop+ */

/* Colors */
bg-white dark:bg-gray-800                 /* Background */
text-gray-900 dark:text-white             /* Text */
border-gray-200 dark:border-gray-700      /* Border */

/* Effects */
hover:shadow-md         /* Elevation on hover */
hover:-translate-y-1    /* Lift on hover */
transition-all          /* Smooth transitions */

/* Responsive */
sm:  /* 640px+ */
md:  /* 768px+ */
lg:  /* 1024px+ */
xl:  /* 1280px+ */
2xl: /* 1536px+ */
```

### Design Tokens
```css
/* Colours */
--primary: hsl(var(--primary));
--secondary: hsl(var(--secondary));
--accent: hsl(var(--accent));
--destructive: hsl(var(--destructive));

/* Backgrounds */
--background: hsl(var(--background));
--foreground: hsl(var(--foreground));
--card: hsl(var(--card));
--card-foreground: hsl(var(--card-foreground));

/* Borders */
--border: hsl(var(--border));
--input: hsl(var(--input));

/* Radius */
--radius: 0.5rem;
```

## Accessibility

### WCAG 2.1 AA Compliance
- ✅ Minimum contrast ratio 4.5:1
- ✅ Keyboard navigation support
- ✅ Focus indicators visible
- ✅ ARIA labels on interactive elements
- ✅ Screen reader announcements
- ✅ Semantic HTML structure

### Keyboard Shortcuts
- `Tab`: Navigate between elements
- `Enter/Space`: Activate buttons and links
- `Escape`: Close modals/dropdowns
- `Arrow Keys`: Navigate within dropdowns

### Screen Reader Support
```tsx
<button
  aria-label="Close welcome banner"
  aria-pressed={isOpen}
  onClick={handleClose}
>
  <X className="h-4 w-4" />
</button>
```

### Focus Management
```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
>
  {/* Focus trap active */}
</div>
```

## Testing

### Unit Testing
```typescript
import { render, screen } from '@testing-library/react';
import { MetricCard } from './MetricCard';

describe('MetricCard', () => {
  it('displays metric value and change', () => {
    render(
      <MetricCard
        title="Members"
        value="1,247"
        change="+12%"
        changeType="positive"
        icon={<Users />}
      />
    );

    expect(screen.getByText('1,247')).toBeInTheDocument();
    expect(screen.getByText('+12%')).toBeInTheDocument();
  });

  it('shows skeleton when loading', () => {
    const { container } = render(
      <MetricCard
        title="Members"
        value="1,247"
        change="+12%"
        changeType="positive"
        icon={<Users />}
        loading
      />
    );

    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });
});
```

### Integration Testing
```typescript
import { render, waitFor, screen } from '@testing-library/react';
import { MetricsGrid } from './MetricsGrid';

describe('MetricsGrid', () => {
  it('fetches and displays metrics', async () => {
    render(<MetricsGrid />);

    await waitFor(() => {
      expect(screen.getByText(/members/i)).toBeInTheDocument();
    });
  });
});
```

### E2E Testing (Playwright)
```typescript
import { test, expect } from '@playwright/test';

test('home tab displays metrics', async ({ page }) => {
  await page.goto('/dashboard');

  await expect(page.getByText('Total Members')).toBeVisible();
  await expect(page.getByText('Total Posts')).toBeVisible();

  // Check metric values
  await expect(page.getByText(/\d{1,3}(,\d{3})*/)).toBeVisible();
});
```

## Related Documentation

- [Phase 6.2 Summary](../../docs/phases/phase-6.2-summary.md)
- [Phase 6.3 Summary](../../docs/phases/phase-6.3-summary.md)
- [Phase 6.4 Summary](../../docs/phases/phase-6.4-summary.md)
- [API Documentation](../../docs/api/dashboard.md)
- [Architecture Guide](../../docs/architecture/dashboard-architecture.md)
- [Development Guide](../../docs/development/dashboard-guide.md)
- [Testing Guide](../../docs/testing/dashboard-tests.md)
