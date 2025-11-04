# Dashboard API Routes

Complete API documentation for admin dashboard endpoints following Hexagonal Architecture with thin controllers, use case orchestration, and DTO responses.

## Table of Contents

- [Authentication](#authentication)
- [Caching Strategy](#caching-strategy)
- [Error Handling](#error-handling)
- [Metrics API](#metrics-api)
- [Activity API](#activity-api)
- [Members API](#members-api)
- [Content API](#content-api)
- [Data Structures](#data-structures)
- [Usage Examples](#usage-examples)

## Authentication

All dashboard API routes require Clerk authentication. Requests without valid authentication will receive a 401 response.

**Authentication Header**: Managed automatically by Clerk SDK

**Server-side Validation**:
```typescript
import { auth } from '@clerk/nextjs/server';

const { userId } = await auth();
if (!userId) {
  return NextResponse.json(
    { success: false, message: 'Unauthorized' },
    { status: 401 }
  );
}
```

**Frontend Usage**:
```typescript
// Clerk automatically adds authentication
const response = await fetch('/api/dashboard/metrics?communityId=123');
```

## Caching Strategy

All dashboard routes implement Incremental Static Regeneration (ISR) with stale-while-revalidate.

**Cache Configuration**:
```typescript
export const dynamic = 'force-dynamic';
export const revalidate = 30; // 30 seconds cache

// Response headers
headers: {
  'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
}
```

**Cache Behavior**:
- Fresh data for 30 seconds
- Stale data served for 60 seconds while revalidating
- Reduces database load
- Improves response times

## Error Handling

All routes follow consistent error response structure.

**Error Response Format**:
```typescript
{
  success: false,
  message: string,
  errors?: ZodIssue[]  // Only for validation errors
}
```

**HTTP Status Codes**:
- `200 OK`: Success
- `400 Bad Request`: Validation errors
- `401 Unauthorized`: Authentication required
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

**Error Example**:
```typescript
// Validation error (400)
{
  success: false,
  message: "Validation error",
  errors: [
    {
      code: "invalid_type",
      expected: "string",
      received: "undefined",
      path: ["communityId"],
      message: "Required"
    }
  ]
}

// Use case error (400)
{
  success: false,
  message: "COMMUNITY_ID_REQUIRED"
}

// Generic error (500)
{
  success: false,
  message: "Internal server error"
}
```

---

## Metrics API

### GET /api/dashboard/metrics

Fetch aggregated dashboard metrics with time period comparison.

**Endpoint**: `/api/dashboard/metrics`
**Method**: `GET`
**Authentication**: Required (Clerk)
**Caching**: 30s ISR + 60s stale-while-revalidate

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `communityId` | string | Yes | - | Community identifier |
| `timeFilter` | string | No | `'30d'` | Time period: `'7d'`, `'30d'`, `'90d'`, `'1y'` |

#### Response (200 OK)

```typescript
{
  success: true,
  data: {
    members: {
      id: "members",
      label: "Total Members",
      icon: "Users",
      value: 1247,
      formattedValue: "1,247",
      change: 12,
      changeType: "positive",
      changeDescription: "+12%",
      comparisonPeriod: "vs last 30 days"
    },
    posts: {
      id: "posts",
      label: "Total Posts",
      icon: "FileText",
      value: 486,
      formattedValue: "486",
      change: 8.5,
      changeType: "positive",
      changeDescription: "+8.5%",
      comparisonPeriod: "vs last 30 days"
    },
    comments: {
      id: "comments",
      label: "Total Comments",
      icon: "MessageCircle",
      value: 2341,
      formattedValue: "2,341",
      change: -3.2,
      changeType: "negative",
      changeDescription: "-3.2%",
      comparisonPeriod: "vs last 30 days"
    },
    monthlyRecurringRevenue: {
      id: "mrr",
      label: "MRR",
      icon: "DollarSign",
      value: 12450,
      formattedValue: "$12,450",
      change: 15.3,
      changeType: "positive",
      changeDescription: "+15.3%",
      comparisonPeriod: "vs last 30 days"
    },
    lastUpdated: "2025-11-04T10:00:00Z"
  }
}
```

#### Error Responses

**400 Bad Request** - Invalid parameters:
```typescript
{
  success: false,
  message: "Validation error",
  errors: [
    {
      code: "invalid_type",
      expected: "string",
      received: "undefined",
      path: ["communityId"],
      message: "Required"
    }
  ]
}
```

**400 Bad Request** - Invalid time filter:
```typescript
{
  success: false,
  message: "INVALID_TIME_FILTER"
}
```

**401 Unauthorized**:
```typescript
{
  success: false,
  message: "Unauthorized"
}
```

**500 Internal Server Error**:
```typescript
{
  success: false,
  message: "Internal server error"
}
```

#### Use Case

**Class**: `GetDashboardMetricsUseCase`
**Location**: `src/application/use-cases/dashboard/get-dashboard-metrics.usecase.ts`

**Input**:
```typescript
{
  communityId: string;
  timeFilter: TimeFilter; // '7d' | '30d' | '90d' | '1y'
}
```

**Output**: `DashboardMetricsDTO`

**Logic**:
1. Validate community ID
2. Calculate time range based on filter
3. Fetch current period metrics from repository
4. Fetch previous period metrics for comparison
5. Calculate percentage changes
6. Map to DTO with formatted values

#### Example

**Request**:
```typescript
const response = await fetch(
  '/api/dashboard/metrics?communityId=123&timeFilter=30d'
);
const data = await response.json();

if (data.success) {
  console.log('Members:', data.data.members.formattedValue);
  console.log('Change:', data.data.members.changeDescription);
}
```

**cURL**:
```bash
curl -X GET \
  'https://your-domain.com/api/dashboard/metrics?communityId=123&timeFilter=30d' \
  -H 'Cookie: __clerk_session=...'
```

---

## Activity API

### GET /api/dashboard/activity

Fetch recent activity items for the activity feed.

**Endpoint**: `/api/dashboard/activity`
**Method**: `GET`
**Authentication**: Required (Clerk)
**Caching**: 30s ISR + 60s stale-while-revalidate

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `communityId` | string | Yes | - | Community identifier |
| `limit` | number | No | `10` | Max items (1-100) |

#### Response (200 OK)

```typescript
{
  success: true,
  data: [
    {
      id: "act_1",
      type: "member_joined",
      icon: "UserPlus",
      text: "John Doe joined",
      description: "New member signup",
      timestamp: "2025-11-04T09:45:00Z",
      relativeTime: "2 hours ago",
      badge: "New",
      metadata: {
        userId: "user_123",
        userName: "John Doe"
      }
    },
    {
      id: "act_2",
      type: "post_created",
      icon: "FileText",
      text: "Jane Smith created a post",
      description: "How to get started with community building",
      timestamp: "2025-11-04T08:30:00Z",
      relativeTime: "4 hours ago",
      badge: null,
      metadata: {
        postId: "post_456",
        postTitle: "How to get started with community building",
        spaceId: "space_789"
      }
    },
    {
      id: "act_3",
      type: "comment_added",
      icon: "MessageCircle",
      text: "5 new comments",
      description: "Across 3 different posts",
      timestamp: "2025-11-04T07:15:00Z",
      relativeTime: "5 hours ago",
      badge: null,
      metadata: {
        commentCount: 5,
        postCount: 3
      }
    }
  ]
}
```

#### Activity Types

| Type | Icon | Description |
|------|------|-------------|
| `member_joined` | UserPlus | New member signup |
| `post_created` | FileText | New post published |
| `comment_added` | MessageCircle | New comment added |
| `milestone` | Trophy | Milestone achieved |
| `payment_received` | DollarSign | Subscription payment |
| `course_completed` | GraduationCap | Course completion |
| `event_scheduled` | Calendar | Event created |

#### Error Responses

**400 Bad Request** - Invalid parameters:
```typescript
{
  success: false,
  message: "Validation error",
  errors: [
    {
      code: "too_big",
      maximum: 100,
      type: "number",
      inclusive: true,
      path: ["limit"],
      message: "Number must be less than or equal to 100"
    }
  ]
}
```

**400 Bad Request** - Invalid limit:
```typescript
{
  success: false,
  message: "INVALID_LIMIT"
}
```

**401 Unauthorized**:
```typescript
{
  success: false,
  message: "Unauthorized"
}
```

**500 Internal Server Error**:
```typescript
{
  success: false,
  message: "Internal server error"
}
```

#### Use Case

**Class**: `GetRecentActivityUseCase`
**Location**: `src/application/use-cases/dashboard/get-recent-activity.usecase.ts`

**Input**:
```typescript
{
  communityId: string;
  limit: number; // 1-100
}
```

**Output**: `ActivityItemDTO[]`

**Logic**:
1. Validate community ID and limit
2. Fetch recent events from repository
3. Classify events by type
4. Calculate relative timestamps
5. Map to DTO array

#### Example

**Request**:
```typescript
const response = await fetch(
  '/api/dashboard/activity?communityId=123&limit=20'
);
const data = await response.json();

if (data.success) {
  data.data.forEach(activity => {
    console.log(`${activity.text} - ${activity.relativeTime}`);
  });
}
```

**cURL**:
```bash
curl -X GET \
  'https://your-domain.com/api/dashboard/activity?communityId=123&limit=20' \
  -H 'Cookie: __clerk_session=...'
```

---

## Members API

### GET /api/members

Fetch paginated member list with filters and sorting.

**Endpoint**: `/api/members`
**Method**: `GET`
**Authentication**: Required (Clerk)
**Caching**: 30s ISR
**Status**: ✅ Implemented

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `communityId` | string | Yes | - | Community identifier |
| `page` | number | No | `1` | Page number (≥1) |
| `limit` | number | No | `20` | Items per page (1-100) |
| `search` | string | No | - | Search by name or email |
| `plan` | string | No | - | Filter by plan (free, starter, growth, enterprise) |
| `status` | string | No | - | Filter by status (active, inactive) |
| `sortBy` | string | No | `joinedAt` | Sort field (name, joinedAt, lastActiveAt) |
| `sortOrder` | string | No | `desc` | Sort direction (asc, desc) |

#### Response (200 OK)

```typescript
{
  success: true,
  data: {
    members: [
      {
        id: "user_1",
        name: "John Doe",
        email: "john@example.com",
        avatar: "https://example.com/avatars/john.jpg",
        initials: "JD",
        plan: "growth",
        planAmount: "$29.99",
        joinedAt: "2025-10-01T00:00:00Z",
        joinedFormatted: "1 Nov 2025",
        lastActiveAt: "2025-11-04T10:00:00Z",
        lastActiveFormatted: "Just now",
        postsCount: 12,
        isActive: true
      }
    ],
    pagination: {
      page: 1,
      limit: 20,
      total: 1247,
      totalPages: 63
    }
  }
}
```

#### Error Responses

**400 Bad Request**:
```typescript
{
  success: false,
  message: "Validation error",
  errors: [...]
}
```

**401 Unauthorized**:
```typescript
{
  success: false,
  message: "Unauthorized"
}
```

**500 Internal Server Error**:
```typescript
{
  success: false,
  message: "Internal server error"
}
```

#### Use Case

**Class**: `GetMembersUseCase`
**Location**: `src/application/use-cases/dashboard/get-members.usecase.ts`

**Input**:
```typescript
{
  communityId: string;
  page: number;
  limit: number;
  search?: string;
  plan?: MemberPlan;
  status?: 'active' | 'inactive';
  sortBy?: 'name' | 'joinedAt' | 'lastActiveAt';
  sortOrder?: 'asc' | 'desc';
}
```

**Output**: `{ members: MemberDTO[], pagination: PaginationDTO }`

#### Example

**Request**:
```typescript
const response = await fetch(
  '/api/members?communityId=123&page=1&limit=20&plan=growth&sortBy=lastActiveAt&sortOrder=desc'
);
const data = await response.json();

if (data.success) {
  console.log(`Total members: ${data.data.pagination.total}`);
  data.data.members.forEach(member => {
    console.log(`${member.name} - ${member.plan}`);
  });
}
```

---

## Content API

### GET /api/content/posts

Fetch paginated content list with filters and sorting.

**Endpoint**: `/api/content/posts`
**Method**: `GET`
**Authentication**: Required (Clerk)
**Caching**: 30s ISR
**Status**: ✅ Implemented

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `communityId` | string | Yes | - | Community identifier |
| `page` | number | No | `1` | Page number (≥1) |
| `limit` | number | No | `20` | Items per page (1-100) |
| `status` | string | No | - | Filter by status (published, draft, flagged) |
| `spaceId` | string | No | - | Filter by space |
| `authorId` | string | No | - | Filter by author |
| `flagged` | boolean | No | `false` | Show only flagged content |
| `sortBy` | string | No | `createdAt` | Sort field (createdAt, likes, comments, views) |
| `sortOrder` | string | No | `desc` | Sort direction (asc, desc) |

#### Response (200 OK)

```typescript
{
  success: true,
  data: {
    posts: [
      {
        id: "post_1",
        title: "How to build a thriving community",
        author: "John Doe",
        authorId: "user_1",
        space: "General Discussion",
        spaceId: "space_1",
        createdAt: "2025-11-01T10:00:00Z",
        createdFormatted: "3 days ago",
        likes: 24,
        comments: 8,
        views: 142,
        isPinned: false,
        isFlagged: false
      }
    ],
    pagination: {
      page: 1,
      limit: 20,
      total: 486,
      totalPages: 25
    }
  }
}
```

#### Error Responses

**400 Bad Request**:
```typescript
{
  success: false,
  message: "Validation error",
  errors: [...]
}
```

**401 Unauthorized**:
```typescript
{
  success: false,
  message: "Unauthorized"
}
```

**500 Internal Server Error**:
```typescript
{
  success: false,
  message: "Internal server error"
}
```

#### Use Case

**Class**: `GetContentPostsUseCase`
**Location**: `src/application/use-cases/dashboard/get-content-posts.usecase.ts`

**Input**:
```typescript
{
  communityId: string;
  page: number;
  limit: number;
  status?: 'published' | 'draft' | 'flagged';
  spaceId?: string;
  authorId?: string;
  flagged?: boolean;
  sortBy?: 'createdAt' | 'likes' | 'comments' | 'views';
  sortOrder?: 'asc' | 'desc';
}
```

**Output**: `{ posts: ContentPostDTO[], pagination: PaginationDTO }`

#### Example

**Request**:
```typescript
const response = await fetch(
  '/api/content/posts?communityId=123&page=1&limit=20&status=published&sortBy=likes&sortOrder=desc'
);
const data = await response.json();

if (data.success) {
  console.log(`Total posts: ${data.data.pagination.total}`);
  data.data.posts.forEach(post => {
    console.log(`${post.title} - ${post.likes} likes`);
  });
}
```

---

## Data Structures

### MetricDTO
```typescript
interface MetricDTO {
  id: string;
  label: string;
  icon: string;
  value: number;
  formattedValue: string;
  change: number;
  changeType: MetricChangeType; // 'positive' | 'negative' | 'neutral'
  changeDescription: string;
  comparisonPeriod: string;
}
```

### DashboardMetricsDTO
```typescript
interface DashboardMetricsDTO {
  members: MetricDTO;
  posts: MetricDTO;
  comments: MetricDTO;
  monthlyRecurringRevenue: MetricDTO;
  lastUpdated: string; // ISO 8601 string
}
```

### ActivityItemDTO
```typescript
interface ActivityItemDTO {
  id: string;
  type: ActivityType;
  icon: string;
  text: string;
  description: string | null;
  timestamp: string; // ISO 8601 string
  relativeTime: string;
  badge: string | null;
  metadata: Record<string, unknown>;
}
```

### MemberDTO
```typescript
interface MemberDTO {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  initials: string;
  plan: MemberPlan; // 'free' | 'starter' | 'growth' | 'enterprise'
  planAmount: string | null;
  joinedAt: string; // ISO 8601 string
  joinedFormatted: string;
  lastActiveAt: string; // ISO 8601 string
  lastActiveFormatted: string;
  postsCount: number;
  isActive: boolean;
}
```

### ContentPostDTO
```typescript
interface ContentPostDTO {
  id: string;
  title: string;
  author: string;
  authorId: string;
  space: string;
  spaceId: string;
  createdAt: string; // ISO 8601 string
  createdFormatted: string;
  likes: number;
  comments: number;
  views: number;
  isPinned: boolean;
  isFlagged: boolean;
}
```

### PaginationDTO
```typescript
interface PaginationDTO {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
```

---

## Usage Examples

### React Query Hook
```typescript
import { useQuery } from '@tanstack/react-query';

function useMetrics(communityId: string, timeFilter: TimeFilter) {
  return useQuery({
    queryKey: ['dashboard', 'metrics', communityId, timeFilter],
    queryFn: async () => {
      const response = await fetch(
        `/api/dashboard/metrics?communityId=${communityId}&timeFilter=${timeFilter}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }
      const data = await response.json();
      return data.data;
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
  });
}

// Usage
function MetricsComponent() {
  const { data, isLoading, error } = useMetrics('123', '30d');

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage />;

  return <MetricsGrid metrics={data} />;
}
```

### Server Component (Next.js)
```typescript
// app/(dashboard)/page.tsx
async function getMetrics(communityId: string, timeFilter: TimeFilter) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/metrics?communityId=${communityId}&timeFilter=${timeFilter}`,
    {
      next: { revalidate: 30 },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch metrics');
  }

  const data = await response.json();
  return data.data;
}

export default async function DashboardPage() {
  const metrics = await getMetrics('123', '30d');

  return <MetricsGrid metrics={metrics} />;
}
```

### Error Handling
```typescript
async function fetchMetrics(communityId: string, timeFilter: TimeFilter) {
  try {
    const response = await fetch(
      `/api/dashboard/metrics?communityId=${communityId}&timeFilter=${timeFilter}`
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data.data;
  } catch (error) {
    console.error('Metrics fetch error:', error);
    throw error;
  }
}
```

---

## Related Documentation

- [Phase 6.3 Summary](../phases/phase-6.3-summary.md)
- [Phase 6.4 Summary](../phases/phase-6.4-summary.md)
- [Component Documentation](../../src/components/dashboard/README.md)
- [Architecture Guide](../architecture/dashboard-architecture.md)
- [Development Guide](../development/dashboard-guide.md)
- [Testing Guide](../testing/dashboard-tests.md)
