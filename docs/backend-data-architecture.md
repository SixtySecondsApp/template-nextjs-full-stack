# Backend Data Architecture for Community OS Dashboard

## Overview

This document defines the complete backend data architecture for the Community OS dashboard, following hexagonal architecture principles with clear separation between domain, application, and infrastructure layers.

## 1. Database Schema (Prisma Models)

### Core Entities

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ============================================================================
// COMMUNITY MODELS
// ============================================================================

model Community {
  id          String   @id @default(uuid())
  name        String
  slug        String   @unique
  avatar      String?  // URL to avatar/logo
  description String?

  // Plan and limits
  planType    PlanType @default(FREE)
  storageUsed Int      @default(0) // in bytes
  storageLimit Int     @default(53687091200) // 50GB default

  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?

  // Relations
  members     Member[]
  posts       Post[]
  comments    Comment[]
  transactions Transaction[]
  activities   Activity[]
  tasks       Task[]
  spaces      Space[]
  courses     Course[]
  coupons     Coupon[]

  @@map("communities")
}

enum PlanType {
  FREE
  STARTER
  GROWTH
  ENTERPRISE
}

// ============================================================================
// MEMBER MODELS
// ============================================================================

model Member {
  id          String   @id @default(uuid())

  // User details
  userId      String   // Clerk user ID
  email       String
  name        String
  avatar      String?

  // Community relationship
  communityId String
  community   Community @relation(fields: [communityId], references: [id], onDelete: Cascade)

  // Membership details
  role        MemberRole @default(MEMBER)
  plan        MemberPlan @default(FREE)
  status      MemberStatus @default(ACTIVE)

  // Activity metrics
  postCount   Int      @default(0)
  commentCount Int     @default(0)
  lastActiveAt DateTime @default(now())

  // Timestamps
  joinedAt    DateTime @default(now())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?

  // Relations
  posts       Post[]
  comments    Comment[]
  activities  Activity[]
  transactions Transaction[]

  @@unique([communityId, userId])
  @@index([communityId, deletedAt])
  @@index([communityId, lastActiveAt])
  @@map("members")
}

enum MemberRole {
  OWNER
  ADMIN
  MODERATOR
  MEMBER
}

enum MemberPlan {
  FREE
  STARTER
  GROWTH
  ENTERPRISE
}

enum MemberStatus {
  ACTIVE
  PENDING
  SUSPENDED
  ARCHIVED
}

// ============================================================================
// CONTENT MODELS
// ============================================================================

model Space {
  id          String   @id @default(uuid())

  // Space details
  name        String
  slug        String
  description String?
  icon        String?

  // Community relationship
  communityId String
  community   Community @relation(fields: [communityId], references: [id], onDelete: Cascade)

  // Ordering
  order       Int      @default(0)

  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?

  // Relations
  posts       Post[]

  @@unique([communityId, slug])
  @@index([communityId, deletedAt])
  @@map("spaces")
}

model Post {
  id          String   @id @default(uuid())

  // Post content
  title       String
  content     String   @db.Text
  excerpt     String?

  // Author
  authorId    String
  author      Member   @relation(fields: [authorId], references: [id], onDelete: Cascade)

  // Community and Space
  communityId String
  community   Community @relation(fields: [communityId], references: [id], onDelete: Cascade)
  spaceId     String?
  space       Space?   @relation(fields: [spaceId], references: [id], onDelete: SetNull)

  // Status
  status      PostStatus @default(DRAFT)
  isPinned    Boolean  @default(false)
  isFeatured  Boolean  @default(false)

  // Engagement metrics
  viewCount   Int      @default(0)
  likeCount   Int      @default(0)
  commentCount Int     @default(0)

  // Moderation
  flagCount   Int      @default(0)
  isModerated Boolean  @default(false)

  // Publishing
  publishedAt DateTime?

  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?

  // Relations
  comments    Comment[]
  activities  Activity[]

  @@index([communityId, deletedAt, publishedAt])
  @@index([authorId, deletedAt])
  @@index([spaceId, deletedAt])
  @@index([communityId, status, deletedAt])
  @@map("posts")
}

enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
  FLAGGED
}

model Comment {
  id          String   @id @default(uuid())

  // Comment content
  content     String   @db.Text

  // Author
  authorId    String
  author      Member   @relation(fields: [authorId], references: [id], onDelete: Cascade)

  // Post relationship
  postId      String
  post        Post     @relation(fields: [postId], references: [id], onDelete: Cascade)

  // Community relationship
  communityId String
  community   Community @relation(fields: [communityId], references: [id], onDelete: Cascade)

  // Threading
  parentId    String?
  parent      Comment? @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)
  replies     Comment[] @relation("CommentReplies")

  // Engagement
  likeCount   Int      @default(0)

  // Moderation
  flagCount   Int      @default(0)
  isModerated Boolean  @default(false)

  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?

  // Relations
  activities  Activity[]

  @@index([postId, deletedAt])
  @@index([authorId, deletedAt])
  @@index([communityId, deletedAt])
  @@map("comments")
}

// ============================================================================
// COURSE MODELS
// ============================================================================

model Course {
  id          String   @id @default(uuid())

  // Course details
  title       String
  description String?  @db.Text
  thumbnail   String?

  // Community relationship
  communityId String
  community   Community @relation(fields: [communityId], references: [id], onDelete: Cascade)

  // Status
  status      CourseStatus @default(DRAFT)

  // Ordering
  order       Int      @default(0)

  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?

  @@index([communityId, deletedAt])
  @@map("courses")
}

enum CourseStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

// ============================================================================
// MONETIZATION MODELS
// ============================================================================

model Transaction {
  id          String   @id @default(uuid())

  // Amount
  amount      Decimal  @db.Decimal(10, 2)
  currency    String   @default("USD")

  // Member and Community
  memberId    String
  member      Member   @relation(fields: [memberId], references: [id], onDelete: Cascade)
  communityId String
  community   Community @relation(fields: [communityId], references: [id], onDelete: Cascade)

  // Transaction details
  type        TransactionType
  status      TransactionStatus @default(PENDING)
  description String?

  // Payment provider
  providerId  String?  // Stripe payment intent ID
  providerType String? // "stripe", "paypal", etc.

  // Metadata
  metadata    Json?

  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?

  @@index([communityId, deletedAt, createdAt])
  @@index([memberId, deletedAt])
  @@map("transactions")
}

enum TransactionType {
  SUBSCRIPTION
  ONE_TIME
  REFUND
  CREDIT
}

enum TransactionStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
  CANCELLED
}

model Coupon {
  id          String   @id @default(uuid())

  // Coupon details
  code        String
  description String?

  // Community relationship
  communityId String
  community   Community @relation(fields: [communityId], references: [id], onDelete: Cascade)

  // Discount
  discountType DiscountType
  discountValue Decimal @db.Decimal(10, 2)

  // Limits
  maxUses     Int?
  usedCount   Int      @default(0)

  // Validity
  startsAt    DateTime
  expiresAt   DateTime?

  // Status
  isActive    Boolean  @default(true)

  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?

  @@unique([communityId, code])
  @@index([communityId, deletedAt])
  @@map("coupons")
}

enum DiscountType {
  PERCENTAGE
  FIXED_AMOUNT
}

// ============================================================================
// ANALYTICS & ACTIVITY MODELS
// ============================================================================

model Activity {
  id          String   @id @default(uuid())

  // Activity details
  type        ActivityType
  description String

  // Actor (member who performed the action)
  actorId     String?
  actor       Member?  @relation(fields: [actorId], references: [id], onDelete: SetNull)

  // Community relationship
  communityId String
  community   Community @relation(fields: [communityId], references: [id], onDelete: Cascade)

  // Related entities
  postId      String?
  post        Post?    @relation(fields: [postId], references: [id], onDelete: Cascade)
  commentId   String?
  comment     Comment? @relation(fields: [commentId], references: [id], onDelete: Cascade)

  // Metadata
  metadata    Json?

  // Badges (e.g., "Milestone")
  badge       String?

  // Timestamps
  createdAt   DateTime @default(now())
  deletedAt   DateTime?

  @@index([communityId, deletedAt, createdAt(sort: Desc)])
  @@index([actorId, deletedAt])
  @@map("activities")
}

enum ActivityType {
  MEMBER_JOINED
  MEMBER_LEFT
  POST_CREATED
  POST_UPDATED
  POST_DELETED
  COMMENT_CREATED
  COMMENT_UPDATED
  COMMENT_DELETED
  PAYMENT_RECEIVED
  MILESTONE_REACHED
  COURSE_COMPLETED
}

model Metric {
  id          String   @id @default(uuid())

  // Community relationship
  communityId String

  // Metric details
  type        MetricType
  value       Decimal  @db.Decimal(10, 2)

  // Time period
  periodStart DateTime
  periodEnd   DateTime

  // Comparison
  previousValue Decimal? @db.Decimal(10, 2)
  changePercent Decimal? @db.Decimal(5, 2)

  // Metadata
  metadata    Json?

  // Timestamps
  createdAt   DateTime @default(now())

  @@unique([communityId, type, periodStart])
  @@index([communityId, type, periodStart])
  @@map("metrics")
}

enum MetricType {
  MEMBER_COUNT
  POST_COUNT
  COMMENT_COUNT
  VIEW_COUNT
  ENGAGEMENT_RATE
  MRR
  NEW_MEMBERS
  ACTIVE_MEMBERS
  CHURN_RATE
}

// ============================================================================
// TASK MODELS
// ============================================================================

model Task {
  id          String   @id @default(uuid())

  // Task details
  title       String
  description String?
  type        TaskType
  priority    TaskPriority @default(NORMAL)

  // Community relationship
  communityId String
  community   Community @relation(fields: [communityId], references: [id], onDelete: Cascade)

  // Status
  status      TaskStatus @default(PENDING)
  completedAt DateTime?

  // Related entity
  relatedId   String?  // ID of related post, member, etc.
  relatedType String?  // "post", "member", etc.

  // Metadata
  metadata    Json?

  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?

  @@index([communityId, status, deletedAt])
  @@index([communityId, priority, status, deletedAt])
  @@map("tasks")
}

enum TaskType {
  MODERATION_REVIEW
  MEMBER_APPROVAL
  PAYMENT_METHOD
  SETUP_STEP
  TRIAL_EXPIRING
  CONTENT_REVIEW
}

enum TaskPriority {
  LOW
  NORMAL
  HIGH
  URGENT
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  DISMISSED
}
```

## 2. API Endpoint Specifications

### 2.1 Dashboard Metrics Endpoint

**`GET /api/dashboard/metrics`**

**Query Parameters:**
- `communityId` (required): Community identifier
- `period` (optional): Time period - `7d`, `30d`, `90d`, `1y` (default: `30d`)

**Response:**
```typescript
{
  success: boolean;
  data: {
    members: {
      current: number;
      change: number;
      changePercent: number;
      trend: "up" | "down" | "stable";
    };
    posts: {
      current: number;
      change: number;
      changePercent: number;
      trend: "up" | "down" | "stable";
    };
    comments: {
      current: number;
      change: number;
      changePercent: number;
      trend: "up" | "down" | "stable";
    };
    mrr: {
      current: number;
      change: number;
      changePercent: number;
      trend: "up" | "down" | "stable";
      currency: string;
    };
  };
}
```

**Caching Strategy:**
- TTL: 5 minutes
- Cache key: `dashboard:metrics:${communityId}:${period}`
- Invalidate on: Member join/leave, post creation, transaction completion

---

### 2.2 Activity Feed Endpoint

**`GET /api/dashboard/activity`**

**Query Parameters:**
- `communityId` (required): Community identifier
- `limit` (optional): Number of activities to return (default: 20, max: 100)
- `offset` (optional): Pagination offset (default: 0)
- `type` (optional): Filter by activity type

**Response:**
```typescript
{
  success: boolean;
  data: {
    activities: Array<{
      id: string;
      type: ActivityType;
      description: string;
      actorName?: string;
      actorAvatar?: string;
      badge?: string;
      relatedPost?: {
        id: string;
        title: string;
      };
      createdAt: string;
    }>;
    hasMore: boolean;
    total: number;
  };
}
```

**Caching Strategy:**
- TTL: 1 minute
- Cache key: `dashboard:activity:${communityId}:${limit}:${offset}`
- Invalidate on: Any new activity creation

---

### 2.3 Tasks Endpoint

**`GET /api/dashboard/tasks`**

**Query Parameters:**
- `communityId` (required): Community identifier
- `status` (optional): Filter by status (default: `PENDING`)
- `priority` (optional): Filter by priority

**Response:**
```typescript
{
  success: boolean;
  data: {
    tasks: Array<{
      id: string;
      title: string;
      description?: string;
      type: TaskType;
      priority: TaskPriority;
      status: TaskStatus;
      relatedId?: string;
      relatedType?: string;
      createdAt: string;
    }>;
    total: number;
    pendingCount: number;
    urgentCount: number;
  };
}
```

**`PATCH /api/dashboard/tasks/:taskId`**

**Request Body:**
```typescript
{
  status: TaskStatus;
}
```

**Response:**
```typescript
{
  success: boolean;
  data: {
    id: string;
    status: TaskStatus;
    completedAt?: string;
  };
}
```

**Caching Strategy:**
- No caching (real-time data)
- Invalidate activity cache on task completion

---

### 2.4 Members Endpoint

**`GET /api/members`**

**Query Parameters:**
- `communityId` (required): Community identifier
- `limit` (optional): Number of members to return (default: 20, max: 100)
- `offset` (optional): Pagination offset (default: 0)
- `search` (optional): Search by name or email
- `plan` (optional): Filter by member plan
- `status` (optional): Filter by member status
- `sortBy` (optional): `joinedAt`, `lastActiveAt`, `postCount` (default: `lastActiveAt`)
- `order` (optional): `asc`, `desc` (default: `desc`)

**Response:**
```typescript
{
  success: boolean;
  data: {
    members: Array<{
      id: string;
      userId: string;
      name: string;
      email: string;
      avatar?: string;
      role: MemberRole;
      plan: MemberPlan;
      status: MemberStatus;
      postCount: number;
      commentCount: number;
      joinedAt: string;
      lastActiveAt: string;
    }>;
    hasMore: boolean;
    total: number;
  };
}
```

**`GET /api/members/:memberId`**

**Response:**
```typescript
{
  success: boolean;
  data: {
    id: string;
    userId: string;
    name: string;
    email: string;
    avatar?: string;
    role: MemberRole;
    plan: MemberPlan;
    status: MemberStatus;
    postCount: number;
    commentCount: number;
    joinedAt: string;
    lastActiveAt: string;
    recentActivity: Array<{
      id: string;
      type: ActivityType;
      description: string;
      createdAt: string;
    }>;
  };
}
```

**Caching Strategy:**
- TTL: 2 minutes
- Cache key: `members:list:${communityId}:${params}`
- Invalidate on: Member update, post/comment creation

---

### 2.5 Content Endpoints

**`GET /api/content`**

**Query Parameters:**
- `communityId` (required): Community identifier
- `limit` (optional): Number of posts to return (default: 20, max: 100)
- `offset` (optional): Pagination offset (default: 0)
- `spaceId` (optional): Filter by space
- `status` (optional): Filter by post status
- `authorId` (optional): Filter by author
- `sortBy` (optional): `createdAt`, `publishedAt`, `viewCount`, `likeCount`, `commentCount` (default: `publishedAt`)
- `order` (optional): `asc`, `desc` (default: `desc`)

**Response:**
```typescript
{
  success: boolean;
  data: {
    posts: Array<{
      id: string;
      title: string;
      excerpt?: string;
      author: {
        id: string;
        name: string;
        avatar?: string;
      };
      space?: {
        id: string;
        name: string;
      };
      status: PostStatus;
      viewCount: number;
      likeCount: number;
      commentCount: number;
      flagCount: number;
      publishedAt?: string;
      createdAt: string;
    }>;
    hasMore: boolean;
    total: number;
  };
}
```

**`POST /api/content`**

**Request Body:**
```typescript
{
  title: string;
  content: string;
  excerpt?: string;
  spaceId?: string;
  status?: PostStatus;
  isPinned?: boolean;
  isFeatured?: boolean;
}
```

**Response:**
```typescript
{
  success: boolean;
  data: {
    id: string;
    title: string;
    status: PostStatus;
    publishedAt?: string;
    createdAt: string;
  };
}
```

**`GET /api/content/:postId`**

**Response:**
```typescript
{
  success: boolean;
  data: {
    id: string;
    title: string;
    content: string;
    excerpt?: string;
    author: {
      id: string;
      name: string;
      avatar?: string;
    };
    space?: {
      id: string;
      name: string;
    };
    status: PostStatus;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    flagCount: number;
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
  };
}
```

**Caching Strategy:**
- TTL: 5 minutes for lists, 10 minutes for individual posts
- Cache key: `content:list:${communityId}:${params}` or `content:post:${postId}`
- Invalidate on: Post creation, update, or deletion

---

## 3. Data Aggregation Strategies

### 3.1 Real-time Metrics Calculation

**Approach: Pre-aggregated Daily Metrics**

1. **Background Job**: Daily cron job at midnight UTC
2. **Process**:
   - Calculate metrics for previous day
   - Store in `Metric` table with appropriate `periodStart`/`periodEnd`
   - Calculate comparison to previous period
3. **Metrics Calculated**:
   - Member count (current total)
   - New members (daily)
   - Active members (7-day, 30-day)
   - Post count (daily, cumulative)
   - Comment count (daily, cumulative)
   - Engagement rate (comments/posts ratio)
   - MRR (monthly recurring revenue)
   - Churn rate (monthly)

### 3.2 Activity Aggregation

**Approach: Event-driven Activity Creation**

1. **Domain Events**: Publish events for all user actions
2. **Activity Handler**: Subscribe to events and create activity records
3. **Batch Processing**: Group similar activities (e.g., "5 new members joined" instead of 5 separate records)
4. **Pruning**: Archive activities older than 90 days

### 3.3 Counter Denormalization

**Approach: Increment/Decrement Counters**

Maintain counters on parent entities:
- `Member.postCount` - increment on post creation, decrement on deletion
- `Post.commentCount` - increment on comment creation, decrement on deletion
- `Post.viewCount` - increment on view (batch update every 5 minutes)
- `Post.likeCount` - increment/decrement on like/unlike

**Implementation Pattern**:
```typescript
// In use case after post creation
await prisma.$transaction([
  prisma.post.create({ data: postData }),
  prisma.member.update({
    where: { id: authorId },
    data: { postCount: { increment: 1 } }
  })
]);
```

### 3.4 Dashboard Metrics Calculation

**Real-time Calculation Strategy**:

```typescript
// Metrics calculation logic
async function calculateDashboardMetrics(communityId: string, period: string) {
  const { start, end, compareStart } = getPeriodDates(period);

  // Parallel queries for efficiency
  const [
    currentMembers,
    previousMembers,
    currentPosts,
    previousPosts,
    currentComments,
    previousComments,
    currentMRR,
    previousMRR
  ] = await Promise.all([
    prisma.member.count({
      where: {
        communityId,
        deletedAt: null,
        joinedAt: { lte: end }
      }
    }),
    prisma.member.count({
      where: {
        communityId,
        deletedAt: null,
        joinedAt: { lte: compareStart }
      }
    }),
    prisma.post.count({
      where: {
        communityId,
        deletedAt: null,
        createdAt: { gte: start, lte: end }
      }
    }),
    prisma.post.count({
      where: {
        communityId,
        deletedAt: null,
        createdAt: { gte: compareStart, lte: start }
      }
    }),
    prisma.comment.count({
      where: {
        communityId,
        deletedAt: null,
        createdAt: { gte: start, lte: end }
      }
    }),
    prisma.comment.count({
      where: {
        communityId,
        deletedAt: null,
        createdAt: { gte: compareStart, lte: start }
      }
    }),
    calculateMRR(communityId, end),
    calculateMRR(communityId, compareStart)
  ]);

  return {
    members: calculateChange(currentMembers, previousMembers),
    posts: calculateChange(currentPosts, previousPosts),
    comments: calculateChange(currentComments, previousComments),
    mrr: calculateChange(currentMRR, previousMRR)
  };
}
```

---

## 4. Caching Strategy

### 4.1 Cache Layers

**Layer 1: Application Memory Cache (Redis)**
- TTL: 1-10 minutes depending on data volatility
- Used for: Dashboard metrics, activity feeds, member lists
- Invalidation: Event-driven on data changes

**Layer 2: Database Query Cache**
- TTL: Built-in Prisma query caching
- Used for: Frequently accessed reference data (spaces, plans)
- Invalidation: Automatic based on query parameters

**Layer 3: CDN Edge Cache**
- TTL: 5-30 minutes for public content
- Used for: Public posts, user avatars, static assets
- Invalidation: Purge on content updates

### 4.2 Cache Key Patterns

```
dashboard:metrics:{communityId}:{period}
dashboard:activity:{communityId}:{limit}:{offset}
members:list:{communityId}:{params_hash}
members:detail:{memberId}
content:list:{communityId}:{params_hash}
content:post:{postId}
```

### 4.3 Cache Invalidation Strategy

**Event-Driven Invalidation**:

```typescript
// After member joins
eventBus.publish(new MemberJoinedEvent(memberId, communityId));

// In cache invalidation handler
async function handleMemberJoined(event: MemberJoinedEvent) {
  await redis.del(`dashboard:metrics:${event.communityId}:*`);
  await redis.del(`dashboard:activity:${event.communityId}:*`);
  await redis.del(`members:list:${event.communityId}:*`);
}
```

### 4.4 Cache Warming

**Proactive Cache Population**:

1. **On Community Creation**: Pre-populate empty state metrics
2. **On User Login**: Warm cache for their communities
3. **Scheduled Job**: Refresh popular community data every 5 minutes

---

## 5. Real-time Update Considerations

### 5.1 WebSocket Integration

**Use Cases for Real-time Updates**:
- New activity notifications
- Live member count updates
- Real-time task alerts
- Live comment feeds

**Implementation Strategy**:

```typescript
// Server-side: Publish events via WebSocket
io.to(`community:${communityId}`).emit('activity:new', {
  id: activity.id,
  type: activity.type,
  description: activity.description,
  createdAt: activity.createdAt
});

// Client-side: Subscribe to updates
socket.on('activity:new', (activity) => {
  // Update UI without full refresh
  updateActivityFeed(activity);
});
```

### 5.2 Optimistic UI Updates

**Client-side Strategy**:

1. **Immediate UI Update**: Show change immediately
2. **API Call**: Execute mutation in background
3. **Rollback on Error**: Revert UI if API call fails
4. **Sync on Success**: Update with server response

### 5.3 Polling Fallback

**For Non-critical Updates**:

- Poll every 30 seconds for activity feed
- Poll every 60 seconds for metrics
- Use HTTP caching headers to minimize server load

### 5.4 Server-Sent Events (SSE)

**Alternative to WebSockets**:

```typescript
// Server endpoint
app.get('/api/dashboard/events', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send updates every 5 seconds
  const interval = setInterval(async () => {
    const metrics = await getLatestMetrics(communityId);
    res.write(`data: ${JSON.stringify(metrics)}\n\n`);
  }, 5000);

  req.on('close', () => clearInterval(interval));
});
```

---

## 6. Data Validation Schemas

### 6.1 Dashboard Metrics Request

```typescript
import { z } from 'zod';

export const DashboardMetricsQuerySchema = z.object({
  communityId: z.string().uuid(),
  period: z.enum(['7d', '30d', '90d', '1y']).default('30d')
});

export type DashboardMetricsQuery = z.infer<typeof DashboardMetricsQuerySchema>;
```

### 6.2 Activity Feed Request

```typescript
export const ActivityFeedQuerySchema = z.object({
  communityId: z.string().uuid(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  type: z.nativeEnum(ActivityType).optional()
});

export type ActivityFeedQuery = z.infer<typeof ActivityFeedQuerySchema>;
```

### 6.3 Task Update Request

```typescript
export const TaskUpdateSchema = z.object({
  status: z.nativeEnum(TaskStatus)
});

export type TaskUpdateInput = z.infer<typeof TaskUpdateSchema>;
```

### 6.4 Content Creation Request

```typescript
export const CreatePostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  excerpt: z.string().max(500).optional(),
  spaceId: z.string().uuid().optional(),
  status: z.nativeEnum(PostStatus).default('DRAFT'),
  isPinned: z.boolean().default(false),
  isFeatured: z.boolean().default(false)
});

export type CreatePostInput = z.infer<typeof CreatePostSchema>;
```

### 6.5 Member Query Request

```typescript
export const MemberQuerySchema = z.object({
  communityId: z.string().uuid(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  search: z.string().optional(),
  plan: z.nativeEnum(MemberPlan).optional(),
  status: z.nativeEnum(MemberStatus).optional(),
  sortBy: z.enum(['joinedAt', 'lastActiveAt', 'postCount']).default('lastActiveAt'),
  order: z.enum(['asc', 'desc']).default('desc')
});

export type MemberQuery = z.infer<typeof MemberQuerySchema>;
```

---

## 7. Hexagonal Architecture Implementation

### 7.1 Layer Structure

```
src/
├── domain/
│   ├── member/
│   │   ├── member.entity.ts
│   │   └── member.events.ts
│   ├── post/
│   │   ├── post.entity.ts
│   │   └── post.events.ts
│   ├── activity/
│   │   ├── activity.entity.ts
│   │   └── activity.events.ts
│   └── metric/
│       ├── metric.entity.ts
│       └── metric-calculator.ts
├── application/
│   ├── dto/
│   │   ├── dashboard-metrics.dto.ts
│   │   ├── activity-feed.dto.ts
│   │   ├── member.dto.ts
│   │   └── post.dto.ts
│   ├── mappers/
│   │   ├── member-dto.mapper.ts
│   │   ├── post-dto.mapper.ts
│   │   └── activity-dto.mapper.ts
│   └── use-cases/
│       ├── dashboard/
│       │   ├── get-dashboard-metrics.usecase.ts
│       │   ├── get-activity-feed.usecase.ts
│       │   └── get-pending-tasks.usecase.ts
│       ├── members/
│       │   ├── list-members.usecase.ts
│       │   └── get-member-details.usecase.ts
│       └── content/
│           ├── list-posts.usecase.ts
│           ├── create-post.usecase.ts
│           └── get-post-details.usecase.ts
├── ports/
│   └── repositories.ts
├── infrastructure/
│   ├── mappers/
│   │   ├── member-prisma.mapper.ts
│   │   ├── post-prisma.mapper.ts
│   │   └── activity-prisma.mapper.ts
│   ├── prisma/
│   │   ├── member.repository.prisma.ts
│   │   ├── post.repository.prisma.ts
│   │   ├── activity.repository.prisma.ts
│   │   └── metric.repository.prisma.ts
│   ├── cache/
│   │   ├── redis-cache.service.ts
│   │   └── cache-keys.ts
│   └── events/
│       ├── simple-event-bus.ts
│       └── handlers/
│           ├── member-joined.handler.ts
│           ├── post-created.handler.ts
│           └── activity-created.handler.ts
└── app/api/
    ├── dashboard/
    │   ├── metrics/route.ts
    │   ├── activity/route.ts
    │   └── tasks/route.ts
    ├── members/
    │   ├── route.ts
    │   └── [memberId]/route.ts
    └── content/
        ├── route.ts
        └── [postId]/route.ts
```

### 7.2 Repository Interfaces (Ports)

```typescript
// src/ports/repositories.ts

import { Member } from "@/domain/member/member.entity";
import { Post } from "@/domain/post/post.entity";
import { Activity } from "@/domain/activity/activity.entity";
import { Metric } from "@/domain/metric/metric.entity";

export interface IMemberRepository {
  create(member: Member): Promise<Member>;
  findById(id: string): Promise<Member | null>;
  findByCommunity(communityId: string, options?: QueryOptions): Promise<Member[]>;
  countByCommunity(communityId: string): Promise<number>;
  update(member: Member): Promise<Member>;
  archive(id: string): Promise<void>;
  findByUserId(userId: string, communityId: string): Promise<Member | null>;
}

export interface IPostRepository {
  create(post: Post): Promise<Post>;
  findById(id: string): Promise<Post | null>;
  findByCommunity(communityId: string, options?: QueryOptions): Promise<Post[]>;
  findByAuthor(authorId: string, options?: QueryOptions): Promise<Post[]>;
  findBySpace(spaceId: string, options?: QueryOptions): Promise<Post[]>;
  countByCommunity(communityId: string, filters?: PostFilters): Promise<number>;
  update(post: Post): Promise<Post>;
  archive(id: string): Promise<void>;
  incrementViewCount(id: string): Promise<void>;
}

export interface IActivityRepository {
  create(activity: Activity): Promise<Activity>;
  findByCommunity(communityId: string, options?: QueryOptions): Promise<Activity[]>;
  findByActor(actorId: string, options?: QueryOptions): Promise<Activity[]>;
  countByCommunity(communityId: string): Promise<number>;
  archive(id: string): Promise<void>;
  pruneOlderThan(date: Date): Promise<number>;
}

export interface IMetricRepository {
  create(metric: Metric): Promise<Metric>;
  findByCommunityAndPeriod(
    communityId: string,
    type: string,
    start: Date,
    end: Date
  ): Promise<Metric[]>;
  findLatestByCommunity(communityId: string, type: string): Promise<Metric | null>;
}

export interface ITaskRepository {
  create(task: Task): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  findByCommunity(communityId: string, options?: TaskQueryOptions): Promise<Task[]>;
  countByCommunity(communityId: string, status?: TaskStatus): Promise<number>;
  update(task: Task): Promise<Task>;
  archive(id: string): Promise<void>;
}

// Query options types
export interface QueryOptions {
  limit?: number;
  offset?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface PostFilters {
  status?: string;
  spaceId?: string;
  authorId?: string;
}

export interface TaskQueryOptions extends QueryOptions {
  status?: TaskStatus;
  priority?: TaskPriority;
}
```

### 7.3 Use Case Example

```typescript
// src/application/use-cases/dashboard/get-dashboard-metrics.usecase.ts

import { IMemberRepository, IPostRepository, IActivityRepository } from "@/ports/repositories";
import { DashboardMetricsDTO } from "@/application/dto/dashboard-metrics.dto";

export enum GetDashboardMetricsError {
  COMMUNITY_NOT_FOUND = "COMMUNITY_NOT_FOUND",
  INVALID_PERIOD = "INVALID_PERIOD",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR"
}

export class GetDashboardMetricsUseCase {
  constructor(
    private readonly memberRepository: IMemberRepository,
    private readonly postRepository: IPostRepository,
    private readonly activityRepository: IActivityRepository,
    private readonly cacheService: ICacheService
  ) {}

  async execute(input: {
    communityId: string;
    period: string;
  }): Promise<DashboardMetricsDTO> {
    try {
      // Check cache first
      const cacheKey = `dashboard:metrics:${input.communityId}:${input.period}`;
      const cached = await this.cacheService.get<DashboardMetricsDTO>(cacheKey);

      if (cached) {
        return cached;
      }

      // Calculate period dates
      const { start, end, compareStart } = this.getPeriodDates(input.period);

      // Parallel queries for efficiency
      const [
        currentMembers,
        previousMembers,
        currentPosts,
        previousPosts,
        currentComments,
        previousComments
      ] = await Promise.all([
        this.memberRepository.countByCommunity(input.communityId),
        this.memberRepository.countByCommunity(input.communityId), // with date filter
        this.postRepository.countByCommunity(input.communityId, {
          createdAt: { gte: start, lte: end }
        }),
        this.postRepository.countByCommunity(input.communityId, {
          createdAt: { gte: compareStart, lte: start }
        }),
        // ... similar for comments
      ]);

      // Build DTO
      const metrics: DashboardMetricsDTO = {
        members: this.calculateMetric(currentMembers, previousMembers),
        posts: this.calculateMetric(currentPosts, previousPosts),
        comments: this.calculateMetric(currentComments, previousComments),
        mrr: await this.calculateMRR(input.communityId, end, compareStart)
      };

      // Cache for 5 minutes
      await this.cacheService.set(cacheKey, metrics, 300);

      return metrics;
    } catch (error) {
      throw new Error(GetDashboardMetricsError.INTERNAL_SERVER_ERROR);
    }
  }

  private calculateMetric(current: number, previous: number) {
    const change = current - previous;
    const changePercent = previous > 0 ? (change / previous) * 100 : 0;
    const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'stable';

    return {
      current,
      change,
      changePercent: Math.round(changePercent * 10) / 10,
      trend
    };
  }

  private getPeriodDates(period: string) {
    // Implementation for calculating date ranges
  }

  private async calculateMRR(communityId: string, end: Date, compareStart: Date) {
    // Implementation for MRR calculation
  }
}
```

---

## 8. Performance Optimization Guidelines

### 8.1 Database Indexing

**Critical Indexes**:

```prisma
// Already included in schema above
@@index([communityId, deletedAt])
@@index([communityId, lastActiveAt])
@@index([communityId, status, deletedAt])
@@index([communityId, deletedAt, createdAt(sort: Desc)])
```

### 8.2 Query Optimization

**Use Prisma Select**:
```typescript
// Only fetch required fields
const members = await prisma.member.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    avatar: true,
    // Exclude large fields
  }
});
```

**Batch Operations**:
```typescript
// Use transactions for consistency
await prisma.$transaction([
  prisma.post.create({ data: postData }),
  prisma.member.update({
    where: { id: authorId },
    data: { postCount: { increment: 1 } }
  }),
  prisma.activity.create({ data: activityData })
]);
```

### 8.3 Pagination Best Practices

**Cursor-based Pagination** for large datasets:

```typescript
const posts = await prisma.post.findMany({
  take: 20,
  skip: 1,
  cursor: lastPostId ? { id: lastPostId } : undefined,
  where: { communityId, deletedAt: null },
  orderBy: { createdAt: 'desc' }
});
```

### 8.4 Background Job Processing

**Jobs to Implement**:

1. **Daily Metrics Calculation** (midnight UTC)
2. **Activity Feed Pruning** (weekly)
3. **View Count Batch Update** (every 5 minutes)
4. **Cache Warming** (every 5 minutes for popular communities)

---

## Summary

This backend architecture provides:

✅ **Comprehensive data model** with 15 core entities
✅ **6 main API endpoints** with detailed specifications
✅ **Multi-layer caching strategy** with Redis and CDN
✅ **Real-time updates** via WebSocket/SSE
✅ **Strict validation schemas** using Zod
✅ **Hexagonal architecture** with clear layer separation
✅ **Performance optimization** through indexing and aggregation
✅ **Scalability** via denormalization and background jobs

All following hexagonal architecture principles with domain-first design, ports/adapters pattern, and infrastructure isolation.
