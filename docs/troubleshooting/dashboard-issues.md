# Dashboard Troubleshooting Guide

Common issues and solutions for the Sixty Community admin dashboard.

## Table of Contents

- [Authentication Issues](#authentication-issues)
- [Data Loading Issues](#data-loading-issues)
- [UI/UX Issues](#ui-ux-issues)
- [Performance Issues](#performance-issues)
- [Build & Deployment Issues](#build--deployment-issues)
- [Database Issues](#database-issues)

## Authentication Issues

### Issue: 401 Unauthorized on API Calls

**Symptoms**: API requests return `{ success: false, message: "Unauthorized" }` with status 401

**Causes**:
- Clerk session expired or invalid
- Missing authentication cookies
- Environment variables not set

**Solutions**:
```bash
# 1. Check Clerk environment variables
echo $NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
echo $CLERK_SECRET_KEY

# 2. Verify Clerk configuration
# app/layout.tsx should have ClerkProvider wrapper

# 3. Clear cookies and re-login
# Browser DevTools → Application → Cookies → Clear All

# 4. Check Clerk dashboard
# Verify domain is allowed in Clerk settings
```

### Issue: Redirect Loop on Sign-In

**Symptoms**: Continuous redirects between `/sign-in` and `/dashboard`

**Causes**:
- Middleware configuration incorrect
- Clerk public routes not configured

**Solutions**:
```typescript
// middleware.ts
import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ['/sign-in', '/sign-up', '/api/webhooks/(.*)'],
  ignoredRoutes: ['/api/health'],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
```

## Data Loading Issues

### Issue: Metrics Not Loading

**Symptoms**: Metric cards show loading skeleton indefinitely

**Causes**:
- API route returning errors
- Network request failing
- TanStack Query configuration issue

**Solutions**:
```bash
# 1. Check browser console for errors
# DevTools → Console

# 2. Inspect network requests
# DevTools → Network → Filter by XHR/Fetch
# Look for failed /api/dashboard/metrics requests

# 3. Check API route logs
# Vercel → Functions → Logs
# Or locally: Check terminal output

# 4. Test API directly
curl -X GET 'http://localhost:3000/api/dashboard/metrics?communityId=123' \
  -H 'Cookie: __clerk_session=...'

# 5. Verify TanStack Query configuration
# Check queryKey and queryFn in component
```

### Issue: Activity Feed Empty

**Symptoms**: "No recent activity" message when activity exists

**Causes**:
- No data in database
- Soft delete filtering activities
- API query parameters incorrect

**Solutions**:
```sql
-- Check database for activity
SELECT * FROM posts WHERE community_id = 'your-id' AND deleted_at IS NULL LIMIT 10;
SELECT * FROM comments WHERE community_id = 'your-id' AND deleted_at IS NULL LIMIT 10;

-- Check for soft-deleted records
SELECT COUNT(*) FROM posts WHERE deleted_at IS NOT NULL;
```

```typescript
// Verify API call
const { data } = useQuery({
  queryKey: ['dashboard', 'activity', communityId],
  queryFn: async () => {
    const response = await fetch(`/api/dashboard/activity?communityId=${communityId}&limit=10`);
    console.log('Activity response:', await response.json()); // Debug
    return response.json();
  },
});
```

## UI/UX Issues

### Issue: Dark Mode Not Working

**Symptoms**: Theme toggle doesn't change theme, or styles break in dark mode

**Causes**:
- ThemeProvider not wrapping app
- next-themes not installed
- Dark mode classes missing

**Solutions**:
```bash
# 1. Install next-themes
npm install next-themes

# 2. Verify ThemeProvider in layout
# app/layout.tsx
import { ThemeProvider } from '@/components/theme/ThemeProvider';

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

# 3. Add dark mode classes to components
<div className="bg-white dark:bg-gray-800">
```

### Issue: Responsive Layout Broken on Mobile

**Symptoms**: Sidebar overlaps content, components overflow screen

**Causes**:
- Missing mobile breakpoints
- Fixed widths instead of responsive
- Sidebar not using off-canvas pattern

**Solutions**:
```tsx
// Use responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

// Use responsive visibility
<div className="hidden md:block"> {/* Desktop only */}
<div className="md:hidden"> {/* Mobile only */}

// Use responsive padding
<div className="p-4 md:p-6 xl:p-8">
```

### Issue: Charts Not Rendering

**Symptoms**: Activity graph shows blank canvas or error

**Causes**:
- Chart.js not loaded
- Canvas size 0 or invalid
- Data format incorrect

**Solutions**:
```bash
# 1. Install Chart.js
npm install chart.js react-chartjs-2

# 2. Verify canvas has dimensions
<canvas style={{ width: '100%', height: '300px' }} />

# 3. Check data format
const data = {
  labels: ['Jan', 'Feb', 'Mar'],
  datasets: [{
    label: 'Activity',
    data: [10, 20, 15],
    // ... other config
  }]
};

# 4. Use code splitting for Chart.js
import dynamic from 'next/dynamic';

const ActivityGraph = dynamic(() => import('./ActivityGraph'), {
  ssr: false,
  loading: () => <ActivityGraphSkeleton />,
});
```

## Performance Issues

### Issue: Slow Page Load

**Symptoms**: Dashboard takes >3s to load

**Causes**:
- No caching on API routes
- Too many database queries
- Large JavaScript bundles

**Solutions**:
```typescript
// 1. Enable ISR caching
export const revalidate = 30; // 30 seconds cache

// 2. Use parallel queries
const [metrics, activity] = await Promise.all([
  getMetrics(communityId),
  getActivity(communityId),
]);

// 3. Analyze bundle size
npm run build
npm run analyze # If @next/bundle-analyzer installed

// 4. Code split heavy dependencies
import dynamic from 'next/dynamic';

const ChartComponent = dynamic(() => import('chart.js'), {
  ssr: false,
});
```

### Issue: High Database Load

**Symptoms**: Slow API responses, high CPU on Railway

**Causes**:
- No database indexes
- N+1 query problems
- Missing query optimization

**Solutions**:
```sql
-- Add indexes
CREATE INDEX idx_posts_community_created ON posts(community_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_community_active ON users(community_id, last_active_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_comments_post ON comments(post_id, created_at DESC) WHERE deleted_at IS NULL;
```

```typescript
// Use Prisma select to fetch only needed fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    // Don't fetch all fields
  },
});

// Use include instead of separate queries
const posts = await prisma.post.findMany({
  include: {
    author: {
      select: { name: true, avatar: true },
    },
    _count: {
      select: { comments: true, likes: true },
    },
  },
});
```

## Build & Deployment Issues

### Issue: Build Fails with "Module not found"

**Symptoms**: `Error: Cannot find module '@/components/...'`

**Causes**:
- Incorrect import paths
- TypeScript path mapping not configured
- Missing files

**Solutions**:
```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

```bash
# Check file exists
ls -la src/components/dashboard/home/MetricCard.tsx

# Fix import
# ❌ import { MetricCard } from '@/components/MetricCard';
# ✅ import { MetricCard } from '@/components/dashboard/home/MetricCard';
```

### Issue: Prisma Client Not Generated

**Symptoms**: `Cannot find module '@prisma/client'` or `PrismaClient is not a constructor`

**Causes**:
- Prisma client not generated after schema changes
- Build command missing prisma generate

**Solutions**:
```bash
# Generate Prisma client
npx prisma generate

# Update build command
# package.json
"scripts": {
  "build": "prisma generate && next build"
}

# Vercel build settings
# Build Command: prisma generate && npm run build
```

### Issue: Environment Variables Not Working

**Symptoms**: `undefined` for `process.env.NEXT_PUBLIC_...`

**Causes**:
- Variables not prefixed with `NEXT_PUBLIC_`
- Not set in Vercel dashboard
- Using client-side without prefix

**Solutions**:
```env
# ✅ Client-side variables need NEXT_PUBLIC_ prefix
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."

# ✅ Server-side variables don't need prefix
CLERK_SECRET_KEY="sk_..."

# Vercel: Settings → Environment Variables → Add each variable
```

## Database Issues

### Issue: Connection Pool Exhausted

**Symptoms**: `Error: Can't reach database server` or `Too many clients`

**Causes**:
- Too many Prisma Client instances
- Not closing connections
- Connection limit reached

**Solutions**:
```typescript
// Use singleton Prisma client
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

```bash
# Railway: Increase connection limit
# Dashboard → PostgreSQL → Settings → Connection Limit
```

### Issue: Migration Fails

**Symptoms**: `Migration failed to apply` or schema drift detected

**Causes**:
- Database and schema out of sync
- Failed migration not resolved
- Manual schema changes

**Solutions**:
```bash
# Check migration status
npx prisma migrate status

# Resolve failed migration
npx prisma migrate resolve --rolled-back "20231104_migration_name"

# Force reset (⚠️ DATA LOSS - dev only)
npx prisma migrate reset

# Production: Create new migration
npx prisma migrate dev --name fix_schema_drift
npx prisma migrate deploy
```

## Getting Help

### Debug Checklist

1. ✅ Check browser console for JavaScript errors
2. ✅ Check network tab for failed requests
3. ✅ Check Vercel function logs for API errors
4. ✅ Verify environment variables are set
5. ✅ Test API routes directly with cURL
6. ✅ Check database connectivity
7. ✅ Review recent code changes
8. ✅ Clear browser cache and cookies

### Useful Commands

```bash
# Check Next.js version
npm list next

# Verify environment
npm run env

# Type check
npm run typecheck

# Lint
npm run lint

# Test build locally
npm run build
npm start

# Check Prisma schema
npx prisma validate

# View Prisma studio (database GUI)
npx prisma studio
```

### Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Vercel Support](https://vercel.com/support)
- [Railway Support](https://railway.app/help)

## Related Documentation

- [Development Guide](../development/dashboard-guide.md)
- [Deployment Guide](../deployment/dashboard-deployment.md)
- [Architecture Guide](../architecture/dashboard-architecture.md)
- [API Documentation](../api/dashboard.md)
