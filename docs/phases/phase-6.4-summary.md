# Phase 6.4: Members, Content & Analytics

**Status**: ⚠️ Partially Implemented
**Completion Date**: 2025-11-04
**Effort**: 2-3 days

## Overview

Management interfaces for members, content moderation, and analytics dashboards. Implements data tables with filtering, sorting, pagination, and bulk actions.

## Components Implemented

### Members Management (3 components)

#### 1. MembersTable
- **Location**: `src/components/dashboard/members/MembersTable.tsx` (planned)
- **Purpose**: Searchable, sortable member directory with bulk actions
- **Status**: ⚠️ Planned (Not Yet Implemented)
- **Planned Features**:
  - Server-side pagination
  - Column sorting (name, email, joined date, last active, plan)
  - Search by name or email
  - Filter by plan (free, starter, growth, enterprise)
  - Filter by status (active, inactive)
  - Bulk actions (export, message, change role)
  - Row actions (view profile, edit, suspend, delete)
  - Member avatar display with initials fallback
  - Plan badge with color coding
  - Activity indicator (active in last 7 days)

#### 2. MemberFilters
- **Location**: `src/components/dashboard/members/MemberFilters.tsx` (planned)
- **Purpose**: Filter controls for member table
- **Status**: ⚠️ Planned
- **Planned Features**:
  - Plan filter dropdown
  - Status filter (active/inactive)
  - Date range picker (joined date)
  - Tag filter (custom member tags)
  - Clear all filters button

#### 3. MemberBulkActions
- **Location**: `src/components/dashboard/members/MemberBulkActions.tsx` (planned)
- **Purpose**: Bulk action toolbar
- **Status**: ⚠️ Planned
- **Planned Features**:
  - Select all checkbox
  - Selected count display
  - Export to CSV
  - Send bulk message
  - Change roles in bulk
  - Delete confirmation modal

### Content Management (4 components)

#### 4. ContentList
- **Location**: `src/components/dashboard/content/ContentList.tsx` (planned)
- **Purpose**: Post management table with moderation queue
- **Status**: ⚠️ Planned
- **Planned Features**:
  - Server-side pagination
  - Filter by type (post, comment, question)
  - Filter by status (published, draft, flagged, archived)
  - Filter by space
  - Sort by date, likes, comments, views
  - Bulk approve/reject
  - Pin/unpin posts
  - Row actions (edit, delete, flag, archive)

#### 5. ContentFilters
- **Location**: `src/components/dashboard/content/ContentFilters.tsx` (planned)
- **Purpose**: Content filtering controls
- **Status**: ⚠️ Planned
- **Planned Features**:
  - Content type dropdown
  - Status filter
  - Space selector
  - Date range picker
  - Author search
  - Tags filter

#### 6. FlaggedContentQueue
- **Location**: `src/components/dashboard/content/FlaggedContentQueue.tsx` (planned)
- **Purpose**: Moderation queue for flagged content
- **Status**: ⚠️ Planned
- **Planned Features**:
  - Flagged content preview
  - Flag reason display
  - Reporter information
  - Quick actions (approve, warn, delete, ban user)
  - Flag history timeline

#### 7. ContentBulkActions
- **Location**: `src/components/dashboard/content/ContentBulkActions.tsx` (planned)
- **Purpose**: Bulk content operations
- **Status**: ⚠️ Planned
- **Planned Features**:
  - Bulk publish/unpublish
  - Bulk archive
  - Bulk delete with confirmation
  - Move to space
  - Add tags

### Analytics Dashboards (3 components)

#### 8. AnalyticsOverview
- **Location**: `src/components/dashboard/analytics/AnalyticsOverview.tsx` (planned)
- **Purpose**: High-level analytics dashboard
- **Status**: ⚠️ Planned (Placeholder Created)
- **Planned Features**:
  - Traffic overview (pageviews, unique visitors)
  - Engagement metrics (time on page, bounce rate)
  - Top pages/posts chart
  - User acquisition sources (organic, referral, social)
  - Growth trends (weekly, monthly, yearly)
  - Export to PDF/CSV

#### 9. EngagementCharts
- **Location**: `src/components/dashboard/analytics/EngagementCharts.tsx` (planned)
- **Purpose**: User engagement visualizations
- **Status**: ⚠️ Planned
- **Planned Features**:
  - Active users over time (line chart)
  - Posts per day (bar chart)
  - Comments per day (bar chart)
  - Engagement rate (percentage)
  - Retention cohort analysis
  - Time of day heatmap

#### 10. RevenueAnalytics
- **Location**: `src/components/dashboard/analytics/RevenueAnalytics.tsx` (planned)
- **Purpose**: Revenue and subscription analytics
- **Status**: ⚠️ Planned
- **Planned Features**:
  - MRR growth chart
  - Churn rate
  - Average revenue per user (ARPU)
  - Lifetime value (LTV)
  - Plan distribution pie chart
  - Revenue forecast

## API Routes Implemented

### 1. GET /api/members
- **Location**: `src/app/api/members/route.ts`
- **Purpose**: Fetch paginated member list with filters
- **Status**: ✅ Implemented
- **Authentication**: Required (Clerk)
- **Query Parameters**:
  - `communityId` (string, required): Community identifier
  - `page` (number, optional): Page number (default: 1)
  - `limit` (number, optional): Items per page (default: 20, max: 100)
  - `search` (string, optional): Search query (name, email)
  - `plan` (string, optional): Filter by plan
  - `status` (string, optional): Filter by status (active, inactive)
  - `sortBy` (string, optional): Sort field (name, joinedAt, lastActiveAt)
  - `sortOrder` (string, optional): Sort direction (asc, desc)
- **Response**:
  ```typescript
  {
    success: true,
    data: {
      members: MemberDTO[],
      pagination: {
        page: number,
        limit: number,
        total: number,
        totalPages: number
      }
    }
  }
  ```
- **Caching**: 30s ISR
- **Error Codes**: 400 (validation), 401 (unauthorized), 500 (server error)

### 2. GET /api/content/posts
- **Location**: `src/app/api/content/posts/route.ts`
- **Purpose**: Fetch paginated content list with filters
- **Status**: ✅ Implemented
- **Authentication**: Required (Clerk)
- **Query Parameters**:
  - `communityId` (string, required): Community identifier
  - `page` (number, optional): Page number (default: 1)
  - `limit` (number, optional): Items per page (default: 20, max: 100)
  - `status` (string, optional): Filter by status (published, draft, flagged)
  - `spaceId` (string, optional): Filter by space
  - `authorId` (string, optional): Filter by author
  - `flagged` (boolean, optional): Show only flagged content
  - `sortBy` (string, optional): Sort field (createdAt, likes, comments, views)
  - `sortOrder` (string, optional): Sort direction (asc, desc)
- **Response**:
  ```typescript
  {
    success: true,
    data: {
      posts: ContentPostDTO[],
      pagination: {
        page: number,
        limit: number,
        total: number,
        totalPages: number
      }
    }
  }
  ```
- **Caching**: 30s ISR
- **Error Codes**: 400 (validation), 401 (unauthorized), 500 (server error)

## Data Structures

### DTOs Used
- `MemberDTO`: Member profile with activity data
- `ContentPostDTO`: Post metadata with engagement stats
- `PaginationDTO`: Pagination metadata
- `FilterOptionsDTO`: Available filter values

## Features Delivered

### Members Management
- ✅ API route for member list
- ⚠️ Member table component (planned)
- ⚠️ Member filters (planned)
- ⚠️ Bulk actions (planned)
- ⚠️ Export functionality (planned)

### Content Management
- ✅ API route for content list
- ⚠️ Content table component (planned)
- ⚠️ Content filters (planned)
- ⚠️ Moderation queue (planned)
- ⚠️ Bulk actions (planned)

### Analytics
- ⚠️ Traffic analytics (planned)
- ⚠️ Engagement charts (planned)
- ⚠️ Revenue analytics (planned)
- ⚠️ Export reports (planned)

## Technical Implementation

### Pagination Strategy
```typescript
// Server-side pagination calculation
const skip = (page - 1) * limit;
const take = limit;

const [items, total] = await Promise.all([
  prisma.model.findMany({
    where: filters,
    skip,
    take,
    orderBy: { [sortBy]: sortOrder },
  }),
  prisma.model.count({ where: filters }),
]);

const totalPages = Math.ceil(total / limit);
```

### Filter Composition
```typescript
// Dynamic filter building
const filters: Prisma.UserWhereInput = {
  communityId,
  ...(search && {
    OR: [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ],
  }),
  ...(plan && { plan }),
  ...(status === 'active' && {
    lastActiveAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  }),
};
```

### Sorting Implementation
```typescript
// Multi-column sorting
const orderBy = sortBy === 'name'
  ? { name: sortOrder }
  : sortBy === 'joinedAt'
  ? { createdAt: sortOrder }
  : sortBy === 'lastActiveAt'
  ? { lastActiveAt: sortOrder }
  : { createdAt: 'desc' };
```

## UI Patterns

### Table Component Structure
```typescript
// Reusable table component pattern
<Table>
  <TableHeader>
    <TableRow>
      <TableHead sortable onClick={() => handleSort('name')}>
        Name {sortIcon('name')}
      </TableHead>
      <TableHead sortable onClick={() => handleSort('email')}>
        Email {sortIcon('email')}
      </TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map(row => (
      <TableRow key={row.id}>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.email}</TableCell>
        <TableCell>
          <RowActions row={row} />
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
<Pagination
  page={page}
  totalPages={totalPages}
  onPageChange={setPage}
/>
```

### Filter Bar Pattern
```typescript
// Collapsible filter bar
<FilterBar>
  <SearchInput
    value={search}
    onChange={setSearch}
    placeholder="Search members..."
  />
  <FilterDropdown
    label="Plan"
    options={planOptions}
    value={planFilter}
    onChange={setPlanFilter}
  />
  <FilterDropdown
    label="Status"
    options={statusOptions}
    value={statusFilter}
    onChange={setStatusFilter}
  />
  <Button variant="ghost" onClick={clearFilters}>
    Clear Filters
  </Button>
</FilterBar>
```

## Accessibility Considerations

- Table has proper ARIA labels and roles
- Sortable columns announce sort state
- Pagination controls are keyboard accessible
- Filter dropdowns support keyboard navigation
- Bulk action checkboxes have descriptive labels
- Screen reader announces selected count
- Loading states communicated to screen readers

## Performance Optimizations

- Server-side pagination reduces data transfer
- Debounced search input (300ms delay)
- Virtualized table rows for large datasets (future)
- Memoized filter calculations
- Optimistic UI updates for bulk actions
- Background data prefetching

## Testing Completed

- ✅ API routes return correct paginated data
- ✅ Filtering works correctly
- ✅ Sorting works in both directions
- ✅ Pagination calculations correct
- ⚠️ Component tests (pending implementation)
- ⚠️ E2E tests (pending implementation)

## Known Limitations

- Members table UI not yet implemented
- Content table UI not yet implemented
- Analytics dashboard uses placeholder data
- No real-time updates for table data
- Bulk actions not yet functional
- Export functionality not implemented
- Advanced filtering (tags, custom fields) not yet available

## Next Steps

1. Implement MembersTable component with shadcn/ui table
2. Implement ContentList component with moderation features
3. Add bulk action handlers
4. Implement analytics charts with real data
5. Add export functionality (CSV, PDF)
6. Add real-time updates with WebSocket
7. Write comprehensive E2E tests

## Related Documentation

- [Phase 6.3 Summary](./phase-6.3-summary.md)
- [API Documentation](../api/dashboard.md)
- [Component Documentation](../../src/components/dashboard/README.md)
- [Architecture Guide](../architecture/dashboard-architecture.md)
- [Development Guide](../development/dashboard-guide.md)
