# UI Implementation Phases
## Building Out the Community Feed Features

This document outlines the implementation phases for the community feed UI components that have been styled in `globals.css`. These map to **Phase 2** (Forums: Posts, Comments) in the main `phases.json`.

---

## Overview

**Current Status**: ✅ Design system styled and applied
**Next Steps**: Build functional components with real data integration
**Timeline**: 2-3 weeks (100 hours estimated from Phase 2)
**Priority**: Critical (V1 MVP Core)

---

## Phase 2.1: Post Composer with Autosave
**Estimated Time**: 2-3 days
**Status**: Pending
**Files**:
- `src/components/community/PostComposer.tsx` ✅ (styled, needs backend integration)
- `src/app/api/posts/draft/route.ts` (new)
- `src/domain/post/post.entity.ts` (new)

### Tasks:
1. **Backend Integration**
   - [ ] Create Post domain entity with title, body, attachments
   - [ ] Create draft post API endpoint (`POST /api/posts/draft`)
   - [ ] Implement Prisma schema for Post with `isDraft` flag
   - [ ] Add soft delete support (7-day retention)

2. **Autosave Logic**
   - [ ] Implement 5-second debounced autosave
   - [ ] Add localStorage fallback for offline drafts
   - [ ] Show "Draft saved ✓" indicator on success
   - [ ] Handle autosave failures gracefully

3. **File Uploads**
   - [ ] Integrate S3 upload for images (5x10MB limit)
   - [ ] Add file attachment support (PDFs, docs up to 25MB)
   - [ ] Show upload progress indicators
   - [ ] Implement file type validation

4. **Tool Buttons**
   - [ ] Connect Attach button to file picker
   - [ ] Connect Image button to image picker with preview
   - [ ] Build Poll creation modal (Phase 2.2 dependency)
   - [ ] Build Video embed modal (YouTube/Vimeo URLs)

**Acceptance Criteria**:
- ✅ Draft saves automatically every 5 seconds
- ✅ "Draft saved" indicator appears on successful save
- ✅ Images upload to S3 and show preview
- ✅ File attachments work with size validation
- ✅ Draft persists across page refreshes

---

## Phase 2.2: Post Cards with Interactions
**Estimated Time**: 2-3 days
**Status**: Pending
**Files**:
- `src/components/community/CommunityPostCard.tsx` ✅ (styled, needs backend)
- `src/app/api/posts/[id]/like/route.ts` (new)
- `src/app/api/posts/[id]/comments/route.ts` (new)

### Tasks:
1. **Post Data Integration**
   - [ ] Create `ListPosts` use case with filtering (All, New, Top)
   - [ ] Build API endpoint `GET /api/posts?filter=all|new|top`
   - [ ] Implement infinite scroll with pagination
   - [ ] Add loading states and skeletons

2. **Like Functionality**
   - [ ] Create Like domain entity
   - [ ] Build like/unlike API endpoint
   - [ ] Update UI optimistically (immediate feedback)
   - [ ] Show "liked by" list in tooltip

3. **Comment System**
   - [ ] Create Comment domain entity with 2-level threading
   - [ ] Build comment API endpoints (create, list, delete)
   - [ ] Implement comment count display
   - [ ] Add "new comment" indicator with timestamp

4. **Post Actions**
   - [ ] Implement Share button (copy link, social share)
   - [ ] Add post options menu (edit, delete, report)
   - [ ] Build confirmation modals for destructive actions
   - [ ] Add role-based action visibility (owner/admin only)

**Acceptance Criteria**:
- ✅ Posts load from database with pagination
- ✅ Like button works with optimistic UI updates
- ✅ Comment count is accurate and clickable
- ✅ Post options menu shows based on user role
- ✅ Share button copies link to clipboard

---

## Phase 2.3: Filter Bar with State Management
**Estimated Time**: 1 day
**Status**: Pending
**Files**:
- `src/components/community/FilterBar.tsx` ✅ (styled, needs state)
- `src/hooks/usePostFilters.ts` (new)

### Tasks:
1. **Filter State Management**
   - [ ] Create `usePostFilters` custom hook
   - [ ] Implement URL query params for filter state
   - [ ] Add filter to API requests
   - [ ] Persist filter preference in localStorage

2. **Filter Types**
   - [ ] **All**: Show all posts (default)
   - [ ] **New**: Sort by created date DESC
   - [ ] **Active**: Sort by last comment date DESC
   - [ ] **Top**: Sort by like count DESC (7-day window)
   - [ ] **Solved**: Filter posts marked as solved (V2)
   - [ ] **Trending**: Algorithm-based (V2 feature)

3. **Visual States**
   - [ ] Highlight active filter chip
   - [ ] Show loading state during filter change
   - [ ] Smooth scroll to top on filter change

**Acceptance Criteria**:
- ✅ Filter selection updates URL params
- ✅ Active filter is highlighted
- ✅ Posts re-fetch with correct sorting
- ✅ Filter preference persists across sessions

---

## Phase 2.4: Hero Banner with Dynamic Content
**Estimated Time**: 1 day
**Status**: Pending
**Files**:
- `src/components/community/HeroBanner.tsx` ✅ (styled, needs CMS)
- `src/app/api/community/banner/route.ts` (new)

### Tasks:
1. **Admin Configuration**
   - [ ] Create Banner entity (title, subtitle, background gradient)
   - [ ] Build admin UI to customize banner
   - [ ] Add visibility toggle (show/hide banner)
   - [ ] Allow custom background image upload

2. **Dynamic Content**
   - [ ] Fetch banner content from database
   - [ ] Support markdown in subtitle
   - [ ] Add CTA button option (link, text, style)
   - [ ] Implement A/B testing for banners (V3)

**Acceptance Criteria**:
- ✅ Banner content is editable by admins
- ✅ Custom gradients and images work
- ✅ Banner can be hidden completely
- ✅ CTA button links to correct destination

---

## Phase 2.5: Right Sidebar Widgets
**Estimated Time**: 2 days
**Status**: Pending
**Files**:
- `src/components/community/CommunityInfoWidget.tsx` ✅ (styled)
- `src/components/community/LeaderboardWidget.tsx` ✅ (styled)
- `src/components/community/EventsWidget.tsx` ✅ (styled)
- `src/app/api/community/stats/route.ts` (new)
- `src/app/api/leaderboard/route.ts` (new)

### Tasks:
1. **Community Info Widget**
   - [ ] Create real-time member count query
   - [ ] Show online members (WebSocket integration)
   - [ ] Display admin count
   - [ ] Link to full member directory

2. **Leaderboard Widget**
   - [ ] Implement points system (V2 gamification)
   - [ ] Show top 5 members by contribution
   - [ ] Calculate points: post (5pts), comment (2pts), like received (1pt)
   - [ ] Add gradient rank badges (1st, 2nd, 3rd)
   - [ ] Link to full leaderboard page

3. **Events Widget**
   - [ ] Fetch upcoming events from database
   - [ ] Show next 3 events with dates
   - [ ] Display attendee count with RSVP status
   - [ ] Link to full calendar page (V2)
   - [ ] Add "Add to Calendar" button

**Acceptance Criteria**:
- ✅ Community stats are accurate and real-time
- ✅ Leaderboard shows top 5 contributors
- ✅ Events widget shows next 3 upcoming events
- ✅ All widgets link to full pages

---

## Phase 2.6: Comments Thread (2-Level)
**Estimated Time**: 2-3 days
**Status**: Pending
**Files**:
- `src/components/community/CommentThread.tsx` (new)
- `src/components/community/CommentCard.tsx` (new)
- `src/app/api/posts/[id]/comments/route.ts` (Phase 2.2)

### Tasks:
1. **Comment Structure**
   - [ ] Build Comment domain entity with parent/child relationships
   - [ ] Implement 2-level threading limit (V1 constraint)
   - [ ] Create comment tree rendering logic
   - [ ] Add "Load more replies" for collapsed threads

2. **Comment Composer**
   - [ ] Build inline comment input
   - [ ] Add @mention autocomplete
   - [ ] Implement markdown preview
   - [ ] Show character count (500 char limit)

3. **Comment Actions**
   - [ ] Like comments (same as posts)
   - [ ] Edit own comments (15-minute window)
   - [ ] Delete own comments (soft delete)
   - [ ] Report inappropriate comments

4. **Real-time Updates**
   - [ ] Add WebSocket listener for new comments
   - [ ] Show "new comment" indicator
   - [ ] Auto-scroll to new comment
   - [ ] Highlight mentioned user in comment

**Acceptance Criteria**:
- ✅ Comments display in threaded structure
- ✅ Reply button creates nested comment
- ✅ Threading stops at 2 levels deep
- ✅ @mentions trigger notifications
- ✅ New comments appear in real-time

---

## Phase 2.7: Search with Filters
**Estimated Time**: 2 days
**Status**: Pending (Phase 4 dependency)
**Files**:
- `src/components/layout/TopNav.tsx` ✅ (search box styled)
- `src/app/api/search/route.ts` (new)
- `src/app/search/page.tsx` (new)

### Tasks:
1. **Search Implementation**
   - [ ] Implement PostgreSQL full-text search
   - [ ] Search posts by title, body, and tags
   - [ ] Search members by name and bio
   - [ ] Add search result highlighting

2. **Search UI**
   - [ ] Build search results page
   - [ ] Show result count and filters
   - [ ] Add result type tabs (Posts, Members)
   - [ ] Implement "no results" state

3. **Advanced Features (V2)**
   - [ ] Search within courses
   - [ ] Add autocomplete suggestions
   - [ ] Implement fuzzy search
   - [ ] Add search history

**Acceptance Criteria**:
- ✅ Search returns relevant posts and members
- ✅ Results show highlighted matches
- ✅ Search works with special characters
- ✅ Empty state shows helpful message

---

## Integration Checklist

### Database Schema Required:
- [ ] `Post` model (title, body, authorId, communityId, isDraft, deletedAt)
- [ ] `Comment` model (body, authorId, postId, parentId, deletedAt)
- [ ] `Like` model (userId, postId, commentId)
- [ ] `Draft` model (postId, userId, content, savedAt)
- [ ] `Attachment` model (postId, url, type, size)

### API Endpoints Required:
- [ ] `POST /api/posts` - Create post
- [ ] `GET /api/posts` - List posts with filters
- [ ] `GET /api/posts/[id]` - Get single post
- [ ] `PUT /api/posts/[id]` - Update post
- [ ] `DELETE /api/posts/[id]` - Soft delete post
- [ ] `POST /api/posts/[id]/like` - Toggle like
- [ ] `POST /api/posts/[id]/comments` - Add comment
- [ ] `POST /api/posts/draft` - Save draft
- [ ] `GET /api/community/stats` - Get community stats
- [ ] `GET /api/leaderboard` - Get top contributors

### State Management:
- [ ] Posts state (React Query or SWR)
- [ ] User session state (Clerk)
- [ ] Filter state (URL params + localStorage)
- [ ] Draft state (localStorage + API sync)

### Testing Requirements:
- [ ] Unit tests for domain entities
- [ ] Integration tests for API routes
- [ ] E2E tests for post creation flow
- [ ] E2E tests for comment threading
- [ ] Performance tests for feed loading

---

## Success Metrics

### Phase 2 Completion Criteria:
- ✅ Users can create posts with rich text
- ✅ Autosave prevents draft loss (0% data loss target)
- ✅ Like and comment interactions work smoothly
- ✅ Feed loads with < 2s response time (p95)
- ✅ Filter changes update feed within 500ms
- ✅ All components match design system styling

### Performance Targets:
- **Feed Initial Load**: < 2 seconds (p95)
- **Autosave Latency**: < 500ms
- **Like Action Response**: < 200ms (optimistic UI)
- **Comment Post**: < 1 second
- **Filter Change**: < 500ms

### Quality Gates:
- ✅ All TypeScript types defined
- ✅ 80%+ unit test coverage
- ✅ All API endpoints have error handling
- ✅ Soft delete implemented on all entities
- ✅ Loading and error states for all async operations

---

## Dependencies

### External Services:
- **AWS S3**: Image and file uploads
- **AWS SES**: Email notifications (Phase 4)
- **Clerk**: User authentication
- **Prisma**: Database ORM
- **WebSocket** (optional for V1): Real-time updates

### Internal Dependencies:
- Phase 1: Foundation must be complete (auth, roles, navigation)
- Phase 4: Search integration (can be done in parallel)
- Phase 11 (V2): Gamification for leaderboard points

---

## Next Steps After Phase 2

Once Phase 2 is complete:
1. **Phase 3**: Version History & Undelete (1 week)
2. **Phase 4**: Search, @Mentions, Notifications (1-2 weeks)
3. **Phase 5**: Basic Courses (2 weeks)
4. **Phase 6**: Monetization with Stripe (2 weeks)

Total V1 MVP timeline: **12-16 weeks** to launch

---

## Notes

- This document focuses on **UI implementation** for styled components
- Backend architecture follows **Hexagonal Architecture** (see `.cursor/rules/`)
- All dates relative to Phase 2 start date
- Styling is complete ✅ - focus is on functionality
- V1 MVP constraints: No AI features, basic analytics only
