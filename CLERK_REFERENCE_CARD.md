# Clerk Authentication - Reference Card

## Files Overview

| File | Purpose | Status |
|------|---------|--------|
| `middleware.ts` | Route protection | ✅ Done |
| `src/app/layout.tsx` | ClerkProvider | ✅ Done |
| `src/app/page.tsx` | Home page | ✅ Done |
| `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx` | Sign-in | ✅ Done |
| `src/app/(auth)/sign-up/[[...sign-up]]/page.tsx` | Sign-up | ✅ Done |
| `src/app/(protected)/dashboard/page.tsx` | Dashboard | ✅ Done |
| `src/app/api/webhooks/clerk/route.ts` | Webhooks | ✅ Done |
| `src/lib/prisma.ts` | Database | ✅ Done |
| `.env` | Config | ⚠️ Add `CLERK_WEBHOOK_SECRET` |

## Routes

### Public Routes (No auth needed)
- `/` - Homepage
- `/sign-in` - Sign in
- `/sign-up` - Sign up
- `/api/webhooks/clerk` - Webhook endpoint

### Protected Routes (Auth required)
- `/dashboard` - User dashboard
- Any other route not listed above

## Key Code Snippets

### Get Current User (Server Component)
```typescript
import { currentUser } from "@clerk/nextjs/server";

const user = await currentUser();
if (user) {
  console.log(user.id);        // Clerk user ID
  console.log(user.emailAddresses[0]?.emailAddress);
}
```

### Get Database User
```typescript
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const clerkUser = await currentUser();
const dbUser = await prisma.user.findUnique({
  where: { clerkId: clerkUser.id }
});
```

### Use in Client Component
```typescript
"use client";
import { useUser } from "@clerk/nextjs";

export default function Component() {
  const { user, isLoaded } = useUser();
  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>Not signed in</div>;
  return <div>Hi {user.firstName}</div>;
}
```

### Add Sign Out Button
```typescript
"use client";
import { UserButton } from "@clerk/nextjs";

export default function Header() {
  return <UserButton />;
}
```

## Common Commands

### Local Development
```bash
# Start dev server
npm run dev

# View database
npx prisma studio

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name migration_name
```

### Railway
```bash
# View logs
railway logs

# View logs with filter
railway logs | grep webhook

# Access database
railway db shell

# View environment
railway env
```

### Clerk
```bash
# Tunnel for local webhook testing
npm install -g @clerk/cli
clerk tunnel --url http://localhost:3000
```

## Configuration

### .env Variables
```bash
# Required - already set
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Required - you need to add this
CLERK_WEBHOOK_SECRET=whsec_...

# Already set by Railway
DATABASE_URL=postgresql://...
```

### Clerk Webhook Setup
1. Dashboard → Webhooks → Create Endpoint
2. URL: `https://your-domain.com/api/webhooks/clerk`
3. Events: `user.created`, `user.updated`, `user.deleted`
4. Copy signing secret to `.env` as `CLERK_WEBHOOK_SECRET`

## Webhook Events

### user.created
**Triggered**: User signs up
**Handler**: Creates record in `users` table
**Fields**: `clerkId`, `email`, `firstName`, `lastName`, `imageUrl`

### user.updated
**Triggered**: User updates profile
**Handler**: Updates existing record
**Fields**: All fields above

### user.deleted
**Triggered**: User deleted from Clerk
**Handler**: Soft-deletes (sets `deletedAt` timestamp)
**Behavior**: User hidden but not permanently deleted

## Database Queries

### Get Active Users Only
```typescript
const users = await prisma.user.findMany({
  where: { deletedAt: null }
});
```

### Get All Users (including deleted)
```typescript
const users = await prisma.user.findMany();
```

### Find User by Clerk ID
```typescript
const user = await prisma.user.findUnique({
  where: { clerkId: "user_123" }
});
```

### Find User by Email
```typescript
const user = await prisma.user.findUnique({
  where: { email: "user@example.com" }
});
```

### Get User with Relations
```typescript
const user = await prisma.user.findUnique({
  where: { clerkId: "user_123" },
  include: {
    memberships: true,
    posts: true,
    comments: true
  }
});
```

## Troubleshooting Quick Fix

### Problem: "CLERK_WEBHOOK_SECRET not found"
```bash
# Check .env exists
cat .env | grep CLERK_WEBHOOK_SECRET

# If missing, add it
echo "CLERK_WEBHOOK_SECRET=whsec_your_secret" >> .env
```

### Problem: "Webhook signature verification failed"
```bash
# 1. Verify secret is correct
# 2. Check endpoint URL matches Clerk config
# 3. Look at Railway logs:
railway logs | grep "verification failed"
```

### Problem: "User not created in database"
```bash
# 1. Check webhook was triggered
# Clerk Dashboard → Webhooks → Your endpoint → View deliveries

# 2. Check database connection
npx prisma studio

# 3. Check logs
npm run dev
# Look for "Created user" or error messages
```

### Problem: "Middleware redirecting unexpectedly"
```bash
# 1. Verify NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is set
echo $NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

# 2. Check middleware.ts has correct public routes
# 3. Restart dev server
npm run dev
```

## Performance Tips

1. **Use ISR for Dashboard**:
   ```typescript
   export const revalidate = 30; // Revalidate every 30s
   ```

2. **Cache User Queries**:
   ```typescript
   const cache = 'force-cache';
   const user = await fetchUser(id, { next: { revalidate: 60 } });
   ```

3. **Optimize Includes**:
   ```typescript
   // Only fetch what you need
   include: {
     memberships: {
       select: { id: true, role: true, community: true }
     }
   }
   ```

## Monitoring

### Check Health
```bash
curl https://your-app.railway.app/api/health
```

### Monitor Webhooks
```bash
railway logs | grep "POST /api/webhooks/clerk"
```

### Track Database
```bash
npx prisma studio
# Watch users table for new entries
```

## Deployment Checklist

- [ ] `CLERK_WEBHOOK_SECRET` in `.env`
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` in Railway
- [ ] `CLERK_SECRET_KEY` in Railway
- [ ] `CLERK_WEBHOOK_SECRET` in Railway
- [ ] `DATABASE_URL` in Railway
- [ ] Webhook endpoint URL updated in Clerk
- [ ] `npm run build` passes
- [ ] Deployed to Railway
- [ ] Webhook test event succeeds
- [ ] Sign-up creates user in database

## Documentation Links

- **Full Setup**: `CLERK_SETUP.md`
- **Quick Start**: `CLERK_QUICK_START.md`
- **Checklist**: `CLERK_IMPLEMENTATION_CHECKLIST.md`
- **Summary**: `CLERK_SETUP_SUMMARY.md`
- **This Card**: `CLERK_REFERENCE_CARD.md`

---

**Quick Start**:
1. Add `CLERK_WEBHOOK_SECRET` to `.env`
2. Run `npm run dev`
3. Go to `http://localhost:3000`
4. Click "Sign Up" and test
5. Check `npx prisma studio` for user
