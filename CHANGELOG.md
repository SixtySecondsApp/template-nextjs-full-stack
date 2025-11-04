# Changelog

All notable changes to the Sixty Community admin dashboard will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned - Phase 6.2 (Layout & Navigation)
- Dashboard sidebar with responsive navigation
- Top bar with page title and actions
- Mobile off-canvas sidebar
- Community switcher dropdown
- Navigation sections with active states
- Dark mode toggle in sidebar footer
- Keyboard navigation support
- WCAG 2.1 AA accessibility compliance

## [0.3.0] - 2025-11-04 (Phase 6.4 - Partially Implemented)

### Added - Members Management
- API route `GET /api/members` for paginated member list
- Server-side pagination with filters (plan, status)
- Column sorting (name, joinedAt, lastActiveAt)
- Search by name or email
- `GetMembersUseCase` for member data orchestration
- `MemberDTO` for member data transfer

### Added - Content Management
- API route `GET /api/content/posts` for paginated content list
- Filtering by status, space, author, flagged state
- Column sorting (createdAt, likes, comments, views)
- `GetContentPostsUseCase` for content data orchestration
- `ContentPostDTO` for post metadata transfer

### Planned - UI Components (Phase 6.4)
- MembersTable component with pagination and filters
- ContentList component with moderation features
- AnalyticsOverview component with charts
- Bulk actions for members and content
- Export functionality (CSV, PDF)

### Infrastructure
- `DashboardRepositoryPrisma` pagination methods
- Dynamic filter composition for members and content
- Soft delete filtering on all queries
- Multi-column sorting support

## [0.2.0] - 2025-11-04 (Phase 6.3 - Complete)

### Added - Metrics Components
- `MetricsGrid` component for responsive metric card layout
- `MetricCard` component with trend indicators (positive, negative, neutral)
- `MetricCardSkeleton` component for loading states
- Color-coded trend visualization (green, red, grey)
- Hover animations with elevation effect

### Added - Activity Components
- `ActivityGraph` component with Chart.js line chart integration
- Time filter dropdown (7d, 30d, 90d, 1y)
- Gradient fill and smooth animations
- Dark mode theme support for charts
- `ActivityGraphSkeleton` component
- `ActivityFeed` component with activity type icons
- `RecentActivity` container with TanStack Query
- `ActivityFeedSkeleton` component
- Relative timestamp display ("2 hours ago")
- Activity type classification (member_joined, post_created, etc.)

### Added - Task & Action Components
- `PendingTasks` component with urgency indicators
- Color-coded urgency badges (low, medium, high, urgent)
- Task action buttons and dismiss functionality
- `QuickActions` grid component
- 6 predefined quick actions (Create Post, Invite Members, etc.)
- Responsive grid layout (2 cols mobile, 3 cols desktop)

### Added - Welcome & Resources
- `WelcomeBanner` component with personalized greeting
- Time-of-day based greeting (Good morning, afternoon, evening)
- Setup checklist with 6 steps
- Progress indicator with percentage calculation
- Collapsible checklist interface
- Dismiss functionality
- Confetti animation on completion
- `WelcomeBannerSkeleton` component
- `RecommendedResources` component
- Resource type icons (guide, video, webinar, etc.)
- External link indicators
- Estimated time to complete display

### Added - API Routes
- `GET /api/dashboard/metrics` endpoint
  - Aggregated dashboard metrics with time period comparison
  - Query parameters: communityId, timeFilter
  - Response caching: 30s ISR + 60s stale-while-revalidate
  - Error handling: 400, 401, 500 status codes
- `GET /api/dashboard/activity` endpoint
  - Recent activity items for activity feed
  - Query parameters: communityId, limit (1-100)
  - Response caching: 30s ISR + 60s stale-while-revalidate
  - Activity type classification

### Added - Use Cases
- `GetDashboardMetricsUseCase`
  - Orchestrates metric aggregation from domain entities
  - Calculates time period comparisons
  - Formats values for presentation
  - Error handling: COMMUNITY_ID_REQUIRED, INVALID_TIME_FILTER
- `GetRecentActivityUseCase`
  - Fetches recent events and classifies by type
  - Calculates relative timestamps
  - Aggregates activity metadata
  - Error handling: COMMUNITY_ID_REQUIRED, INVALID_LIMIT

### Added - DTOs
- `MetricDTO`: Individual metric with trend data
- `DashboardMetricsDTO`: Complete metrics object (members, posts, comments, MRR)
- `ActivityItemDTO`: Activity feed item with type and metadata
- `PendingTaskDTO`: Task with urgency and action URL
- `QuickActionDTO`: Quick action definition
- `ResourceDTO`: Recommended resource with type and estimated time
- `SetupStepDTO`: Setup checklist step
- `SetupProgressDTO`: Setup progress tracker
- `ChartDataPointDTO`: Chart data point for activity graph
- `ActivityTrendsDTO`: Complete chart dataset

### Added - Repository Methods
- `DashboardRepositoryPrisma.getMetrics()`
  - Time range calculation
  - Current vs previous period data fetching
  - Percentage change calculation
  - Soft delete filtering
- `DashboardRepositoryPrisma.getRecentActivity()`
  - Activity event fetching with limit
  - Type classification and icon mapping
  - Relative time formatting

### Added - Mappers
- `DashboardMetricsDtoMapper`
  - Domain entities → DTOs
  - Value formatting (numbers, currency, percentages)
  - Comparison period text generation

### Improved
- Dark mode support across all new components
- Responsive design at all breakpoints (mobile, tablet, desktop)
- Loading skeleton states for better UX
- Empty states for components with no data
- Error boundary handling

### Technical
- TanStack Query integration for data fetching
- Chart.js integration with code splitting
- lucide-react icons for consistent iconography
- Tailwind CSS for styling
- TypeScript strict mode compliance
- Zod validation schemas for API routes

## [0.1.0] - 2025-11-03 (Initial Setup)

### Added - Foundation
- Next.js 14 App Router setup
- Prisma ORM integration
- Clerk authentication
- Hexagonal Architecture structure
  - Domain layer (`src/domain/`)
  - Application layer (`src/application/`)
  - Infrastructure layer (`src/infrastructure/`)
  - Presentation layer (`src/app/` + `src/components/`)
- Dashboard layout route group `(dashboard)`
- Basic dashboard page structure

### Added - Documentation
- ARCHITECTURE.md with Hexagonal Architecture overview
- Component documentation in README files
- API route documentation templates
- Testing guide structure
- Deployment guide for Vercel + Railway

### Infrastructure
- PostgreSQL database on Railway
- Prisma schema with User, Community, Post, Comment models
- Soft delete pattern with `deletedAt` column
- Database migrations setup
- Repository interface pattern (ports)
- Prisma repository implementations

### Development
- TypeScript configuration with strict mode
- ESLint and Prettier setup
- Tailwind CSS configuration
- Dark mode support with next-themes
- Development server with hot reload
- Git repository initialization

## Release Types

- **Major** (x.0.0): Breaking changes, major feature releases
- **Minor** (0.x.0): New features, backwards-compatible
- **Patch** (0.0.x): Bug fixes, minor improvements

## Change Categories

- **Added**: New features or components
- **Changed**: Changes to existing functionality
- **Deprecated**: Features marked for removal
- **Removed**: Removed features or components
- **Fixed**: Bug fixes
- **Security**: Security vulnerability fixes
- **Technical**: Under-the-hood improvements
- **Planned**: Future features in development

## Version History

| Version | Release Date | Phase | Status |
|---------|-------------|-------|--------|
| 0.3.0 | 2025-11-04 | Phase 6.4 | Partially Implemented |
| 0.2.0 | 2025-11-04 | Phase 6.3 | ✅ Complete |
| 0.1.0 | 2025-11-03 | Initial | ✅ Complete |

## Upcoming Releases

### v0.4.0 - Phase 6.2 Complete (Layout & Navigation)
- Dashboard sidebar implementation
- Top bar implementation
- Mobile navigation
- Navigation state management with Zustand
- Keyboard navigation
- Full accessibility compliance

### v0.5.0 - Phase 6.4 Complete (Management UIs)
- MembersTable component
- ContentList component
- AnalyticsOverview component
- Bulk action implementations
- Export functionality

### v1.0.0 - Production Ready
- All dashboard phases complete (6.2, 6.3, 6.4)
- Full test coverage (unit, integration, E2E)
- Performance optimizations
- Production monitoring and alerting
- Complete documentation
- Security audit passed
- Accessibility audit passed (WCAG 2.1 AA)
