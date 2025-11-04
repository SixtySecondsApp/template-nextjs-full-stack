# Dashboard Deployment Guide

Production deployment guide for the Sixty Community admin dashboard to Vercel and Railway.

## Environment Variables

### Required Variables

```env
# Database (Railway provides automatically)
DATABASE_URL="postgresql://user:password@host:port/database"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Application
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NODE_ENV="production"
```

### Optional Variables

```env
# Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# Monitoring
SENTRY_DSN="https://..."
```

## Vercel Deployment

### Prerequisites
- Vercel account
- GitHub repository
- Railway PostgreSQL database

### Setup Steps

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login
   vercel login

   # Link project
   vercel link
   ```

2. **Configure Environment Variables**
   ```bash
   # Via CLI
   vercel env add DATABASE_URL
   vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   vercel env add CLERK_SECRET_KEY

   # Or via Vercel Dashboard
   # Settings → Environment Variables
   ```

3. **Deploy**
   ```bash
   # Production deployment
   vercel --prod

   # Or push to main branch (auto-deploy)
   git push origin main
   ```

### Build Configuration

```json
// vercel.json
{
  "buildCommand": "prisma generate && npm run build",
  "framework": "nextjs",
  "installCommand": "npm ci",
  "devCommand": "npm run dev",
  "regions": ["lhr1"],
  "env": {
    "DATABASE_URL": "@database-url"
  }
}
```

### Build Settings (Vercel Dashboard)
- **Framework Preset**: Next.js
- **Build Command**: `prisma generate && npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm ci`
- **Node.js Version**: 18.x

## Railway Database

### PostgreSQL Setup

1. **Create Database**
   - Go to Railway dashboard
   - New Project → Add PostgreSQL
   - Copy DATABASE_URL

2. **Run Migrations**
   ```bash
   # Set DATABASE_URL in .env
   DATABASE_URL="postgresql://..."

   # Run migrations
   npx prisma migrate deploy

   # Verify
   npx prisma db pull
   ```

3. **Enable Extensions** (if needed)
   ```sql
   -- Connect to Railway database
   psql $DATABASE_URL

   -- Enable extensions
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   CREATE EXTENSION IF NOT EXISTS "pgcrypto";
   ```

## Database Migrations

### Production Migration Workflow

```bash
# 1. Create migration locally
npx prisma migrate dev --name add_dashboard_metrics

# 2. Test migration
npm run test

# 3. Commit migration files
git add prisma/migrations
git commit -m "Add dashboard metrics migration"

# 4. Push to repository
git push origin main

# 5. Vercel auto-deploys and runs migrations
# (via prisma generate in build command)

# 6. Manually run migration if needed
# (connect to Railway database)
npx prisma migrate deploy
```

### Migration Safety

```bash
# Always backup before migrations
pg_dump $DATABASE_URL > backup.sql

# Verify migration SQL
cat prisma/migrations/*/migration.sql

# Rollback if needed (manual)
psql $DATABASE_URL < backup.sql
```

## Performance Optimization

### Next.js Build Optimizations

```javascript
// next.config.js
module.exports = {
  // Enable SWC minification
  swcMinify: true,

  // Image optimization
  images: {
    domains: ['your-cdn.com'],
    formats: ['image/avif', 'image/webp'],
  },

  // Disable source maps in production
  productionBrowserSourceMaps: false,

  // Enable React strict mode
  reactStrictMode: true,

  // Compression
  compress: true,

  // Reduce bundle size
  experimental: {
    optimizeCss: true,
  },
};
```

### Caching Strategy

```typescript
// API routes with ISR
export const revalidate = 30; // 30 seconds

// Static pages
export const dynamic = 'force-static';

// Dynamic pages with ISR
export const dynamic = 'force-dynamic';
export const revalidate = 60;
```

### Database Connection Pooling

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

## Monitoring & Observability

### Error Tracking (Sentry)

```bash
# Install Sentry
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard@latest -i nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
});
```

### Analytics (Vercel Analytics)

```bash
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

## Health Checks

### API Health Endpoint

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: 'healthy',
        app: 'healthy',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        services: {
          database: 'unhealthy',
          app: 'degraded',
        },
      },
      { status: 503 }
    );
  }
}
```

## Rollback Strategy

### Vercel Rollback

```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback <deployment-url>

# Or via dashboard: Deployments → Click deployment → Promote to Production
```

### Database Rollback

```bash
# Restore from backup
psql $DATABASE_URL < backup.sql

# Or rollback migration
npx prisma migrate resolve --rolled-back "20231104_add_metrics"
```

## Post-Deployment Checklist

- [ ] Environment variables set correctly
- [ ] Database migrations applied
- [ ] Health check endpoint responds
- [ ] Dashboard loads and displays metrics
- [ ] Authentication works (Clerk)
- [ ] API routes return correct data
- [ ] No console errors in browser
- [ ] Performance metrics acceptable (Lighthouse >90)
- [ ] Monitoring/alerting configured
- [ ] SSL certificate active
- [ ] Domain DNS configured

## Troubleshooting

### Build Failures

```bash
# Check build logs
vercel logs <deployment-url>

# Common issues:
# 1. Missing environment variables
# 2. Prisma schema out of sync
# 3. TypeScript errors

# Fix:
vercel env pull # Download env vars
npx prisma generate # Regenerate Prisma client
npm run typecheck # Check TypeScript
```

### Database Connection Issues

```bash
# Test connection
npx prisma db pull

# Check DATABASE_URL format
# Should be: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require

# Railway requires SSL
DATABASE_URL="postgresql://...?sslmode=require"
```

## Related Documentation

- [Development Guide](../development/dashboard-guide.md)
- [Architecture Guide](../architecture/dashboard-architecture.md)
- [Testing Guide](../testing/dashboard-tests.md)
- [Troubleshooting Guide](../troubleshooting/dashboard-issues.md)
