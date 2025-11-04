# Dashboard Development Guide

Complete guide for developing and extending the Sixty Community admin dashboard.

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm
- PostgreSQL database
- Clerk account for authentication

### Installation
```bash
# Clone and install
git clone <repository-url>
cd sixty-community
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run Prisma migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### Project Structure
```
sixty-community/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (dashboard)/          # Dashboard layout group
│   │   │   ├── layout.tsx        # Dashboard layout wrapper
│   │   │   ├── page.tsx          # Home tab
│   │   │   ├── members/          # Members tab
│   │   │   ├── content/          # Content tab
│   │   │   └── analytics/        # Analytics tab
│   │   └── api/                  # API routes
│   │       └── dashboard/        # Dashboard API routes
│   ├── components/               # React components
│   │   └── dashboard/            # Dashboard components
│   ├── application/              # Application layer
│   │   ├── use-cases/            # Business logic orchestration
│   │   ├── dto/                  # Data Transfer Objects
│   │   ├── ports/                # Repository interfaces
│   │   └── mappers/              # DTO mappers
│   ├── domain/                   # Domain layer
│   │   └── dashboard/            # Domain entities
│   └── infrastructure/           # Infrastructure layer
│       └── repositories/         # Prisma repositories
├── docs/                         # Documentation
└── prisma/                       # Database schema
```

## Adding a New Dashboard Tab

### 1. Create Page Component
```typescript
// src/app/(dashboard)/settings/page.tsx
export default function SettingsPage() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      {/* Your content */}
    </div>
  );
}
```

### 2. Add Navigation Item (When Phase 6.2 is Complete)
```typescript
// src/components/dashboard/sidebar/DashboardSidebar.tsx (planned)
<NavSection title="Settings">
  <NavItem href="/settings" icon={<Settings />} label="General" />
</NavSection>
```

### 3. Create Tab Components
```typescript
// src/components/dashboard/settings/SettingsForm.tsx
'use client';

export function SettingsForm() {
  // Component logic
  return <form>{/* Form fields */}</form>;
}
```

### 4. Add API Routes (if needed)
```typescript
// src/app/api/settings/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  // Fetch and return data
}
```

## Component Patterns

### Server Component (Static)
```typescript
// Fetch data on server
async function getData() {
  const response = await fetch('...', {
    next: { revalidate: 30 },
  });
  return response.json();
}

export default async function Page() {
  const data = await getData();
  return <YourComponent data={data} />;
}
```

### Client Component (Interactive)
```typescript
'use client';

import { useState } from 'react';

export function YourComponent() {
  const [state, setState] = useState(initialState);

  const handleEvent = () => {
    setState(newState);
  };

  return <div onClick={handleEvent}>{/* Content */}</div>;
}
```

### Using TanStack Query
```typescript
'use client';

import { useQuery } from '@tanstack/react-query';

export function YourComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['resource', id],
    queryFn: () => fetchResource(id),
    staleTime: 30000,
  });

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage />;

  return <div>{data.name}</div>;
}
```

## Styling Guidelines

### Tailwind CSS Utilities
```tsx
// Spacing
<div className="p-6 gap-6 space-y-6">

// Layout
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

// Colors
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">

// Effects
<div className="hover:shadow-md hover:-translate-y-1 transition-all">

// Responsive
<div className="hidden md:block lg:flex">
```

### Design Tokens
```css
/* Use CSS variables for consistency */
background-color: hsl(var(--background));
color: hsl(var(--foreground));
border-color: hsl(var(--border));
border-radius: var(--radius);
```

### Dark Mode Support
```tsx
// Always provide dark mode styles
<div className="bg-white dark:bg-gray-800">
<button className="bg-blue-500 dark:bg-blue-600">
```

## API Development

### Creating a New API Route
```typescript
// 1. Create Zod schema for validation
const QuerySchema = z.object({
  communityId: z.string().min(1),
  page: z.coerce.number().min(1).optional().default(1),
});

// 2. Create GET/POST handler
export async function GET(request: NextRequest) {
  try {
    // 3. Authenticate
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // 4. Validate input
    const searchParams = request.nextUrl.searchParams;
    const params = QuerySchema.parse({
      communityId: searchParams.get('communityId'),
      page: searchParams.get('page'),
    });

    // 5. Invoke use case
    const useCase = new YourUseCase(new YourRepository());
    const result = await useCase.execute(params);

    // 6. Return DTO
    return NextResponse.json({ success: true, data: result }, {
      status: 200,
      headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' },
    });
  } catch (error) {
    // 7. Handle errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: 'Validation error', errors: error.issues }, { status: 400 });
    }
    console.error('API error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
```

### Creating Use Cases
```typescript
// src/application/use-cases/your-feature/your-action.usecase.ts
export enum YourActionError {
  INVALID_INPUT = 'INVALID_INPUT',
  NOT_FOUND = 'NOT_FOUND',
}

export class YourActionUseCase {
  constructor(private readonly repository: IYourRepository) {}

  async execute(input: YourInput): Promise<YourDTO> {
    // 1. Validate business rules
    if (!input.id) {
      throw new Error(YourActionError.INVALID_INPUT);
    }

    // 2. Fetch domain entities
    const entity = await this.repository.findById(input.id);
    if (!entity) {
      throw new Error(YourActionError.NOT_FOUND);
    }

    // 3. Execute domain logic
    entity.performAction(input.params);

    // 4. Persist changes
    const saved = await this.repository.save(entity);

    // 5. Map to DTO and return
    return YourDtoMapper.toDto(saved);
  }
}
```

## Database Operations

### Prisma Queries
```typescript
// Find with filters
const users = await prisma.user.findMany({
  where: {
    communityId,
    deletedAt: null, // Soft delete filter
    OR: [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ],
  },
  skip: (page - 1) * limit,
  take: limit,
  orderBy: { createdAt: 'desc' },
});

// Aggregations
const count = await prisma.user.count({ where: { communityId, deletedAt: null } });

// Transactions
await prisma.$transaction([
  prisma.user.create({ data: userData }),
  prisma.notification.create({ data: notificationData }),
]);
```

### Soft Delete Pattern
```typescript
// Always filter deletedAt: null
const active = await prisma.post.findMany({
  where: { deletedAt: null },
});

// Soft delete
await prisma.post.update({
  where: { id },
  data: { deletedAt: new Date() },
});

// Hard delete (use sparingly)
await prisma.post.delete({ where: { id } });
```

## Testing

### Component Testing
```typescript
import { render, screen } from '@testing-library/react';
import { MetricCard } from './MetricCard';

describe('MetricCard', () => {
  it('displays metric data', () => {
    render(<MetricCard title="Members" value="1,247" change="+12%" changeType="positive" icon={<Users />} />);

    expect(screen.getByText('1,247')).toBeInTheDocument();
    expect(screen.getByText('+12%')).toBeInTheDocument();
  });
});
```

### API Testing
```typescript
import { GET } from './route';

describe('GET /api/dashboard/metrics', () => {
  it('returns metrics data', async () => {
    const request = new Request('http://localhost/api/dashboard/metrics?communityId=123');
    const response = await GET(request);
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('members');
  });
});
```

## Performance Best Practices

### Frontend
- Use loading skeletons instead of spinners
- Implement code splitting for large dependencies
- Memoize expensive calculations
- Use TanStack Query caching effectively

### Backend
- Enable ISR caching on API routes
- Use Prisma select to fetch only needed fields
- Implement pagination for large datasets
- Use database indexes on frequently queried fields

### Database
```sql
-- Create indexes for common queries
CREATE INDEX idx_posts_community_created ON posts(community_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_community_active ON users(community_id, last_active_at DESC) WHERE deleted_at IS NULL;
```

## Accessibility Checklist

- [ ] All interactive elements have ARIA labels
- [ ] Keyboard navigation works throughout
- [ ] Focus states are visible
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Screen reader tested
- [ ] Forms have proper labels
- [ ] Error messages are announced
- [ ] Loading states are communicated

## Common Issues & Solutions

### Issue: Build fails with "Module not found"
**Solution**: Check import paths are correct and use `@/` prefix for absolute imports

### Issue: API returns 401 Unauthorized
**Solution**: Ensure Clerk session is active and environment variables are set

### Issue: Dark mode not working
**Solution**: Verify ThemeProvider wraps app and next-themes is installed

### Issue: Metrics not updating
**Solution**: Check TanStack Query cache settings and revalidation intervals

## Related Documentation

- [Architecture Guide](../architecture/dashboard-architecture.md)
- [API Documentation](../api/dashboard.md)
- [Component Documentation](../../src/components/dashboard/README.md)
- [Testing Guide](../testing/dashboard-tests.md)
- [Deployment Guide](../deployment/dashboard-deployment.md)
