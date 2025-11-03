# Clerk.com Authentication Setup - Phase 1

Complete setup guide for Clerk.com integration with Next.js 15 App Router and Prisma ORM.

## Overview

This implementation provides:
- User authentication via Clerk.com
- Automatic user database synchronization via webhooks
- Protected routes with middleware
- Soft-delete user pattern
- Type-safe authentication context

## Installation Status

✅ **Completed**:
- `@clerk/nextjs` package installed
- `svix` package for webhook verification installed
- Prisma schema validated and generated
- Middleware configured for route protection
- Webhook handler implemented
- Prisma client configured

## File Structure

```
project-root/
├── middleware.ts                          # Route protection middleware
├── .env                                   # (update with CLERK_WEBHOOK_SECRET)
├── src/
│   ├── app/
│   │   ├── layout.tsx                     # ClerkProvider wrapper
│   │   ├── api/
│   │   │   └── webhooks/
│   │   │       └── clerk/
│   │   │           └── route.ts           # Webhook handler
│   │   ├── (auth)/
│   │   │   ├── sign-in/
│   │   │   │   └── [[...sign-in]]/
│   │   │   │       └── page.tsx           # (template provided below)
│   │   │   └── sign-up/
│   │   │       └── [[...sign-up]]/
│   │   │           └── page.tsx           # (template provided below)
│   │   └── (protected)/                   # Routes requiring authentication
│   │       ├── dashboard/
│   │       │   └── page.tsx               # (example protected route)
│   │       └── layout.tsx                 # (optional layout for protected routes)
│   └── lib/
│       └── prisma.ts                      # Prisma client singleton
└── prisma/
    └── schema.prisma                      # Database schema
```

## Step-by-Step Implementation

### Step 1: Environment Variables

Add the webhook secret to your `.env` file. Get this from Clerk dashboard:

**Clerk Dashboard**:
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Navigate to **Webhooks** → **Create Endpoint**
4. Set Endpoint URL to: `https://your-domain.com/api/webhooks/clerk`
5. Subscribe to events: `user.created`, `user.updated`, `user.deleted`
6. Copy the Signing Secret

**Add to `.env`**:
```bash
# Already configured:
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Add this new line:
CLERK_WEBHOOK_SECRET=whsec_...
```

### Step 2: Middleware Configuration

File: `/middleware.ts` ✅ **Already created**

The middleware:
- Protects all routes except public ones (/, /sign-in, /sign-up)
- Automatically redirects unauthenticated users to sign-in
- Allows webhooks to bypass authentication

### Step 3: ClerkProvider Integration

File: `/src/app/layout.tsx` ✅ **Already updated**

The root layout now wraps the app with `<ClerkProvider>`, making Clerk available throughout the application.

### Step 4: Create Sign-In Page

File: `/src/app/(auth)/sign-in/[[...sign-in]]/page.tsx`

```typescript
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn />
    </div>
  );
}
```

**Directory creation**:
```bash
mkdir -p src/app/\(auth\)/sign-in/\\[\\[...sign-in\\]\\]
touch src/app/\(auth\)/sign-in/\\[\\[...sign-in\\]\\]/page.tsx
```

### Step 5: Create Sign-Up Page

File: `/src/app/(auth)/sign-up/[[...sign-up]]/page.tsx`

```typescript
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp />
    </div>
  );
}
```

**Directory creation**:
```bash
mkdir -p src/app/\(auth\)/sign-up/\\[\\[...sign-up\\]\\]
touch src/app/\(auth\)/sign-up/\\[\\[...sign-up\\]\\]/page.tsx
```

### Step 6: Webhook Handler

File: `/src/app/api/webhooks/clerk/route.ts` ✅ **Already created**

The webhook handler:
- Verifies Clerk webhook signatures using Svix
- Creates users on `user.created` event
- Updates users on `user.updated` event
- Soft-deletes users on `user.deleted` event (sets `deletedAt`)

**Key features**:
- Type-safe event handling
- Proper error logging
- Svix signature verification
- Automatic retry on 500 errors

### Step 7: Update Homepage (Optional)

File: `/src/app/page.tsx`

Add a sign-in button for logged-out users:

```typescript
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Home() {
  const user = await currentUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-4xl font-bold">Welcome to Sixty Community</h1>
        <p className="text-lg text-gray-600">
          Join our community platform to connect with others.
        </p>
        <Link
          href="/sign-up"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Get Started
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Welcome, {user.firstName}!</h1>
      <p className="text-lg text-gray-600 mt-2">
        You're now signed in to Sixty Community.
      </p>
      <Link
        href="/dashboard"
        className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
```

### Step 8: Create Protected Dashboard (Example)

File: `/src/app/(protected)/dashboard/page.tsx`

```typescript
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <UserButton />
      </div>

      <div className="grid gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-2">Welcome</h2>
          <p className="text-gray-600">
            Hello, {user.firstName} {user.lastName}
          </p>
          <p className="text-gray-500 text-sm mt-2">{user.emailAddresses[0]?.emailAddress}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-2">Communities</h2>
          <p className="text-gray-600">
            You haven't joined any communities yet.
          </p>
        </div>
      </div>
    </div>
  );
}
```

## Database Synchronization

### How It Works

1. **User Signs Up**: Clerk creates user record
2. **Webhook Fired**: Clerk sends `user.created` event
3. **Verified**: Webhook signature verified using Svix
4. **Synced**: User created in PostgreSQL database
5. **Updates**: Future Clerk updates automatically sync
6. **Deletion**: When user is deleted from Clerk, marked as soft-deleted in database

### User Soft-Delete Pattern

The `User` model includes `deletedAt` field:

```prisma
model User {
  id        String   @id @default(cuid())
  clerkId   String   @unique
  email     String   @unique
  firstName String?
  lastName  String?
  imageUrl  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime? // Soft delete - set by webhook

  @@index([clerkId])
  @@index([email])
  @@map("users")
}
```

When querying users, exclude soft-deleted records:

```typescript
// Get active users only
const activeUsers = await prisma.user.findMany({
  where: {
    deletedAt: null,
  },
});

// Get including soft-deleted (admin only)
const allUsers = await prisma.user.findMany();
```

## Testing the Integration

### Local Development

1. **Start Next.js dev server**:
   ```bash
   npm run dev
   ```

2. **Test sign-up flow**:
   - Navigate to `http://localhost:3000`
   - Click "Get Started"
   - Sign up with test email
   - Verify database record created:
     ```bash
     npx prisma studio
     ```

3. **Test sign-in flow**:
   - Sign out and navigate to `http://localhost:3000`
   - Should redirect to sign-in
   - Sign in with test account
   - Should have access to dashboard

### Webhook Testing (Local)

For local webhook testing, use [Clerk Tunnel](https://clerk.com/docs/deployments/clerk-tunnel):

```bash
# Install Clerk CLI
npm install -g @clerk/cli

# Start tunnel to expose localhost:3000
clerk tunnel --url http://localhost:3000
```

Then update Clerk webhook to point to tunnel URL.

### Production Deployment

1. **Add environment variables to Railway**:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `CLERK_WEBHOOK_SECRET`

2. **Configure Clerk webhook**:
   - Set endpoint to: `https://your-railway-domain.com/api/webhooks/clerk`
   - Test with sample events from Clerk dashboard

3. **Verify webhook delivery**:
   - Check Railway logs for webhook requests
   - Monitor error rates

## API Reference

### Middleware

**Location**: `/middleware.ts`

Automatically protects all routes except:
- `/` (homepage)
- `/sign-in` (sign-in page)
- `/sign-up` (sign-up page)
- `/api/webhooks/clerk` (webhook endpoint)

### Webhook Handler

**Location**: `/src/app/api/webhooks/clerk/route.ts`

**Endpoint**: `POST /api/webhooks/clerk`

**Events Handled**:
- `user.created`: Creates new user in database
- `user.updated`: Updates user record
- `user.deleted`: Soft-deletes user (sets `deletedAt`)

**Error Handling**:
- Returns 400 for missing headers or verification failure
- Returns 500 for processing errors (triggers Clerk retry)
- Returns 200 for successful processing

### Prisma Client

**Location**: `/src/lib/prisma.ts`

Singleton instance with proper connection pooling:

```typescript
import { prisma } from '@/lib/prisma';

// Use throughout app
const user = await prisma.user.findUnique({
  where: { clerkId: 'user_123' },
});
```

## Common Tasks

### Get Current User in Server Components

```typescript
import { currentUser } from "@clerk/nextjs/server";

export default async function Component() {
  const user = await currentUser();

  if (!user) return null;

  return <div>Hello, {user.firstName}</div>;
}
```

### Get Current User in Client Components

```typescript
"use client";

import { useUser } from "@clerk/nextjs";

export default function Component() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>Not signed in</div>;

  return <div>Hello, {user.firstName}</div>;
}
```

### Get User from Database

```typescript
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from '@/lib/prisma';

export default async function Component() {
  const clerkUser = await currentUser();

  if (!clerkUser) return null;

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  return <div>User: {dbUser?.email}</div>;
}
```

### Add UserButton to Header

```typescript
"use client";

import { UserButton } from "@clerk/nextjs";

export default function TopNav() {
  return (
    <header className="flex justify-between items-center p-4">
      <h1>My App</h1>
      <UserButton />
    </header>
  );
}
```

## Troubleshooting

### Users Not Syncing to Database

**Check webhook**:
1. Go to Clerk Dashboard → Webhooks
2. Look for failed deliveries (red X)
3. Click to see error details
4. Common issues:
   - `CLERK_WEBHOOK_SECRET` missing or incorrect
   - Endpoint URL wrong
   - Network timeout (slow server response)

**Check logs**:
```bash
# Railway logs
railway logs

# Look for webhook processing errors
```

**Test manually**:
```bash
# Get webhook secret from Clerk dashboard
curl -X POST http://localhost:3000/api/webhooks/clerk \
  -H "Content-Type: application/json" \
  -H "svix-id: msg_test" \
  -H "svix-timestamp: 1234567890" \
  -H "svix-signature: v1,base64-signature" \
  -d '{"type":"user.created","data":{"id":"user_123","email_addresses":[{"email_address":"test@example.com"}]}}'
```

### Middleware Redirecting to Sign-In Unexpectedly

**Issue**: All routes redirect to sign-in

**Solution**:
1. Verify `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set
2. Check middleware routes aren't too restrictive
3. Ensure sign-in/sign-up routes are in `isPublicRoute` matcher

### Prisma Connection Issues

**Issue**: "Cannot find a way to connect to a database server"

**Solution**:
```bash
# Verify DATABASE_URL
echo $DATABASE_URL

# Test connection
npx prisma db execute --stdin < /dev/null

# Check connection pooling settings
# Add to .env if needed:
# DATABASE_URL="postgresql://...?schema=public"
```

## Next Steps

1. ✅ Setup phase complete
2. Create sign-in/sign-up pages (optional - can use Clerk hosted)
3. Add user role/permissions system
4. Integrate with communities feature
5. Setup Stripe for monetization

## Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Next.js Integration](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk Webhooks](https://clerk.com/docs/webhooks/overview)
- [Svix Documentation](https://docs.svix.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js 15 Documentation](https://nextjs.org/docs)

## Summary

Your Clerk.com authentication is now configured with:
- ✅ Automatic user synchronization via webhooks
- ✅ Protected routes with middleware
- ✅ Soft-delete user pattern
- ✅ Type-safe database integration
- ✅ Ready for production deployment

Next: Create sign-in/sign-up pages and test the authentication flow end-to-end.
