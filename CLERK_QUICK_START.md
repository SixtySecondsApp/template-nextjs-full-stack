# Clerk.com Quick Start Guide - 5 Minutes to Complete Setup

## What's Already Done

✅ **Installed & Configured**:
- `@clerk/nextjs` package
- `svix` for webhook verification
- Middleware for route protection
- ClerkProvider in root layout
- Webhook handler endpoint
- Sign-in & sign-up pages
- Protected dashboard example
- Prisma integration

✅ **Build Status**: Compiles successfully, ready to deploy

## What You Need To Do (2 Steps)

### Step 1: Add Webhook Secret to .env (2 minutes)

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Go to **Webhooks** → **Create Endpoint**
4. Set endpoint URL: `https://your-domain.com/api/webhooks/clerk`
5. Subscribe to events:
   - ✓ `user.created`
   - ✓ `user.updated`
   - ✓ `user.deleted`
6. Copy the **Signing Secret** (starts with `whsec_`)

**Add to `.env`**:
```bash
CLERK_WEBHOOK_SECRET=whsec_your_secret_here
```

### Step 2: Deploy to Railway (3 minutes)

```bash
# 1. Commit changes
git add .
git commit -m "feat: Add Clerk authentication"

# 2. Push to main (triggers Railway auto-deploy)
git push origin main

# 3. Monitor Railway deployment
# Check: Railway Dashboard → Deployments
```

**Important**: Update the Clerk webhook endpoint URL in dashboard to your Railway domain:
```
https://your-railway-app.railway.app/api/webhooks/clerk
```

## File Structure Created

```
✓ middleware.ts
✓ src/app/layout.tsx (updated with ClerkProvider)
✓ src/app/page.tsx (updated with auth links)
✓ src/app/(auth)/sign-in/[[...sign-in]]/page.tsx
✓ src/app/(auth)/sign-up/[[...sign-up]]/page.tsx
✓ src/app/(protected)/dashboard/page.tsx
✓ src/app/api/webhooks/clerk/route.ts
✓ src/lib/prisma.ts
✓ CLERK_SETUP.md (full documentation)
✓ CLERK_QUICK_START.md (this file)
```

## How It Works

1. **User Signs Up**: Navigates to `http://localhost:3000/sign-up`
2. **Clerk Onboards**: Handles password/OAuth
3. **Webhook Triggered**: Clerk sends `user.created` event
4. **Database Synced**: Svix verifies signature, user created in PostgreSQL
5. **User Logged In**: Redirected to dashboard
6. **Dashboard**: Shows communities, profile, stats

## Testing Locally

```bash
# 1. Start dev server
npm run dev

# 2. Open browser
open http://localhost:3000

# 3. Click "Sign Up"
# 4. Use test email (e.g., test@example.com)
# 5. Set password
# 6. You're logged in!

# 7. Check database (Prisma Studio)
npx prisma studio
# View users table → user created!
```

## Next: Test Webhook Locally

For local webhook testing without Railway deployment:

```bash
# 1. Install Clerk CLI
npm install -g @clerk/cli

# 2. Start tunnel
clerk tunnel --url http://localhost:3000

# 3. Use tunnel URL in Clerk webhook config
# Example: https://quiet-raccoon-xyz.clerk.church/api/webhooks/clerk

# 4. Test webhook from Clerk Dashboard
# Go to Webhooks → Click endpoint → Test event
```

## Production Checklist

- [ ] Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` to Railway
- [ ] Add `CLERK_SECRET_KEY` to Railway
- [ ] Add `CLERK_WEBHOOK_SECRET` to Railway
- [ ] Update Clerk webhook endpoint to Railway domain
- [ ] Test sign-up flow in production
- [ ] Test sign-in flow in production
- [ ] Verify users in database
- [ ] Monitor Railway logs for errors

## Common Issues

### Issue: "Missing CLERK_WEBHOOK_SECRET"
**Fix**: Add to .env file (see Step 1 above)

### Issue: "Webhook signature verification failed"
**Fix**:
1. Verify webhook secret is correct
2. Check endpoint URL matches Clerk config
3. Look at Clerk dashboard → Webhooks → Failed deliveries

### Issue: "User not created in database"
**Check**:
1. Run `npx prisma studio` and look at users table
2. Check Railway logs: `railway logs | grep webhook`
3. Verify webhook is triggering in Clerk dashboard

### Issue: "Middleware redirecting to sign-in unexpectedly"
**Fix**: Ensure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set in browser

## Key Endpoints

| Path | Purpose |
|------|---------|
| `/` | Public homepage with auth links |
| `/sign-in` | Sign-in page (Clerk component) |
| `/sign-up` | Sign-up page (Clerk component) |
| `/dashboard` | Protected dashboard (requires auth) |
| `/api/webhooks/clerk` | Webhook receiver (public, verified) |

## Useful Commands

```bash
# View database in web UI
npx prisma studio

# Check current user in CLI
npm run dev
# Then: curl http://localhost:3000/api/user (after implementing)

# View Railway logs
railway logs

# Monitor Clerk webhooks
# Go to https://dashboard.clerk.com → Webhooks → View details
```

## What's Next?

1. **Create Communities Feature**: Phase 1 continuation
2. **Create Forum Posts**: Phase 2 feature
3. **Add User Roles**: Implement OWNER/ADMIN/MODERATOR
4. **Build Course System**: Phase 5 feature
5. **Integrate Stripe**: Phase 6 monetization

## Database Queries

```typescript
// Get current user from database
import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';

const clerkUser = await currentUser();
const dbUser = await prisma.user.findUnique({
  where: { clerkId: clerkUser.id }
});
```

## Resources

- [Clerk Docs](https://clerk.com/docs)
- [Clerk Next.js](https://clerk.com/docs/quickstarts/nextjs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js 15 Docs](https://nextjs.org/docs)

---

**Status**: ✅ Ready for deployment

**Time to complete**: 5 minutes
