# Dashboard Testing Guide

Comprehensive testing strategy for the Sixty Community admin dashboard across all architecture layers.

## Testing Pyramid

```
         /\
        /E2E\        Playwright (10%)
       /------\
      /        \     Integration (30%)
     /Integration\
    /------------\
   /              \
  /    Unit Tests  \  Jest + Testing Library (60%)
 /------------------\
```

## Running Tests

```bash
# All unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e

# Single test file
npm run test -- MetricCard.test.tsx

# Debug mode
npm run test -- --debug
```

## Unit Testing (Domain & Application Layers)

### Component Tests

```typescript
// MetricCard.test.tsx
import { render, screen } from '@testing-library/react';
import { MetricCard } from '@/components/dashboard/home/MetricCard';
import { Users } from 'lucide-react';

describe('MetricCard', () => {
  const defaultProps = {
    title: 'Total Members',
    value: '1,247',
    change: '+12%',
    changeType: 'positive' as const,
    icon: <Users />,
  };

  it('renders metric information correctly', () => {
    render(<MetricCard {...defaultProps} />);

    expect(screen.getByText('Total Members')).toBeInTheDocument();
    expect(screen.getByText('1,247')).toBeInTheDocument();
    expect(screen.getByText('+12%')).toBeInTheDocument();
  });

  it('displays positive trend with green color', () => {
    render(<MetricCard {...defaultProps} changeType="positive" />);

    const changeElement = screen.getByText('+12%');
    expect(changeElement).toHaveClass('text-green-600');
  });

  it('displays negative trend with red color', () => {
    render(<MetricCard {...defaultProps} change="-5%" changeType="negative" />);

    const changeElement = screen.getByText('-5%');
    expect(changeElement).toHaveClass('text-red-600');
  });

  it('shows skeleton when loading', () => {
    const { container } = render(<MetricCard {...defaultProps} loading />);

    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });
});
```

### Use Case Tests

```typescript
// get-dashboard-metrics.usecase.test.ts
import { GetDashboardMetricsUseCase } from '@/application/use-cases/dashboard/get-dashboard-metrics.usecase';
import { FakeDashboardRepository } from '@/tests/fakes/dashboard.repository.fake';

describe('GetDashboardMetricsUseCase', () => {
  let useCase: GetDashboardMetricsUseCase;
  let repository: FakeDashboardRepository;

  beforeEach(() => {
    repository = new FakeDashboardRepository();
    useCase = new GetDashboardMetricsUseCase(repository);
  });

  it('returns dashboard metrics', async () => {
    const result = await useCase.execute({
      communityId: 'test-community',
      timeFilter: '30d',
    });

    expect(result).toMatchObject({
      members: expect.objectContaining({
        value: expect.any(Number),
        formattedValue: expect.any(String),
        change: expect.any(Number),
        changeType: expect.stringMatching(/positive|negative|neutral/),
      }),
      posts: expect.any(Object),
      comments: expect.any(Object),
      monthlyRecurringRevenue: expect.any(Object),
    });
  });

  it('throws error for invalid community ID', async () => {
    await expect(
      useCase.execute({ communityId: '', timeFilter: '30d' })
    ).rejects.toThrow('COMMUNITY_ID_REQUIRED');
  });

  it('throws error for invalid time filter', async () => {
    await expect(
      useCase.execute({ communityId: 'test', timeFilter: 'invalid' as any })
    ).rejects.toThrow('INVALID_TIME_FILTER');
  });
});
```

### Fake Repository Pattern

```typescript
// tests/fakes/dashboard.repository.fake.ts
export class FakeDashboardRepository implements IDashboardRepository {
  private metrics: Map<string, any> = new Map();

  async getMetrics(communityId: string, timeFilter: TimeFilter): Promise<DashboardMetricsDTO> {
    return {
      members: {
        id: 'members',
        label: 'Total Members',
        icon: 'Users',
        value: 100,
        formattedValue: '100',
        change: 10,
        changeType: 'positive',
        changeDescription: '+10%',
        comparisonPeriod: `vs last ${timeFilter}`,
      },
      // ... other metrics
    };
  }

  // ... other methods
}
```

## Integration Testing (Infrastructure Layer)

### Repository Tests

```typescript
// dashboard.repository.prisma.test.ts
import { DashboardRepositoryPrisma } from '@/infrastructure/repositories/dashboard.repository.prisma';
import { PrismaClient } from '@prisma/client';

describe('DashboardRepositoryPrisma', () => {
  let repository: DashboardRepositoryPrisma;
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient();
    repository = new DashboardRepositoryPrisma();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('fetches metrics from database', async () => {
    const metrics = await repository.getMetrics('test-community', '7d');

    expect(metrics.members.value).toBeGreaterThanOrEqual(0);
    expect(metrics.posts.value).toBeGreaterThanOrEqual(0);
  });

  it('filters soft-deleted records', async () => {
    // Create a soft-deleted record
    await prisma.user.create({
      data: { name: 'Deleted User', email: 'deleted@test.com', deletedAt: new Date() },
    });

    const metrics = await repository.getMetrics('test-community', '7d');

    // Metrics should not include soft-deleted records
    expect(metrics.members.value).not.toBeGreaterThan(0);
  });
});
```

### API Route Tests

```typescript
// app/api/dashboard/metrics/route.test.ts
import { GET } from './route';
import { NextRequest } from 'next/server';

// Mock Clerk auth
jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(() => ({ userId: 'test-user' })),
}));

describe('GET /api/dashboard/metrics', () => {
  it('returns metrics data', async () => {
    const request = new NextRequest('http://localhost/api/dashboard/metrics?communityId=123&timeFilter=30d');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('members');
  });

  it('returns 401 for unauthenticated requests', async () => {
    // Mock auth to return null userId
    jest.spyOn(require('@clerk/nextjs/server'), 'auth').mockReturnValueOnce({ userId: null });

    const request = new NextRequest('http://localhost/api/dashboard/metrics?communityId=123');
    const response = await GET(request);

    expect(response.status).toBe(401);
  });

  it('returns 400 for invalid parameters', async () => {
    const request = new NextRequest('http://localhost/api/dashboard/metrics'); // Missing communityId
    const response = await GET(request);

    expect(response.status).toBe(400);
  });
});
```

## E2E Testing (Presentation Layer)

### Playwright Tests

```typescript
// e2e/dashboard/home.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Dashboard Home Tab', () => {
  test.beforeEach(async ({ page }) => {
    // Login (assuming Clerk test helpers)
    await page.goto('/sign-in');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password');
    await page.click('[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('displays metric cards', async ({ page }) => {
    await expect(page.getByText('Total Members')).toBeVisible();
    await expect(page.getByText('Total Posts')).toBeVisible();
    await expect(page.getByText('Total Comments')).toBeVisible();
    await expect(page.getByText('MRR')).toBeVisible();
  });

  test('metric cards show values and changes', async ({ page }) => {
    // Check for numeric values
    await expect(page.getByText(/\d{1,3}(,\d{3})*/)).toBeVisible();

    // Check for percentage changes
    await expect(page.getByText(/[+-]?\d+(\.\d+)?%/)).toBeVisible();
  });

  test('activity graph renders', async ({ page }) => {
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('time filter changes graph data', async ({ page }) => {
    await page.click('text=Last 30 days');
    await page.click('text=Last 7 days');

    // Wait for graph to update
    await page.waitForTimeout(1000);

    // Verify graph updated (check data points changed)
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('recent activity feed displays items', async ({ page }) => {
    const feedItems = page.locator('[data-testid="activity-item"]');
    await expect(feedItems).toHaveCount(5); // Assuming 5 recent items
  });

  test('welcome banner can be dismissed', async ({ page }) => {
    const banner = page.getByRole('banner', { name: /welcome/i });
    await expect(banner).toBeVisible();

    await page.click('[aria-label="Close welcome banner"]');

    await expect(banner).not.toBeVisible();
  });
});
```

### Accessibility Tests

```typescript
// e2e/dashboard/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Dashboard Accessibility', () => {
  test('home tab passes accessibility checks', async ({ page }) => {
    await page.goto('/dashboard');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/dashboard');

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();

    // Navigate to metric cards
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press('Tab');
    }

    // Enter should activate focused element
    await page.keyboard.press('Enter');
  });

  test('screen reader announcements work', async ({ page }) => {
    await page.goto('/dashboard');

    // Check for ARIA labels
    await expect(page.getByRole('region', { name: 'Dashboard metrics' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Recent activity' })).toBeVisible();
  });
});
```

## Test Coverage Goals

- **Unit Tests**: ≥80% coverage for Domain and Application layers
- **Integration Tests**: ≥70% coverage for Infrastructure layer
- **E2E Tests**: Critical user paths (login, view metrics, navigate tabs)

## Test Data Management

### Fixtures

```typescript
// tests/fixtures/metrics.fixture.ts
export const mockMetricsData = {
  members: {
    id: 'members',
    label: 'Total Members',
    value: 1247,
    formattedValue: '1,247',
    change: 12,
    changeType: 'positive',
    changeDescription: '+12%',
    comparisonPeriod: 'vs last 30 days',
  },
  // ... other metrics
};
```

### Test Database

```bash
# Set up test database
DATABASE_URL="postgresql://user:password@localhost:5432/sixty_test"

# Run migrations
npx prisma migrate deploy

# Seed test data
npx prisma db seed
```

## CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run test:e2e
      - uses: codecov/codecov-action@v3
```

## Related Documentation

- [Development Guide](../development/dashboard-guide.md)
- [Architecture Guide](../architecture/dashboard-architecture.md)
- [Component Documentation](../../src/components/dashboard/README.md)
- [API Documentation](../api/dashboard.md)
