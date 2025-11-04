# 🧪 Comprehensive Testing Strategy - Sixty Community Platform

## Overview

This document outlines the complete testing strategy for the Sixty Community unified platform, following **Hexagonal Architecture** principles with layer-specific testing methodologies.

## 📊 Testing Pyramid

```
                    ▲
                   ╱ ╲
                  ╱   ╲
                 ╱ E2E ╲          ~75 tests (Critical flows)
                ╱───────╲         Playwright - Browser/API
               ╱         ╲
              ╱Integration╲       ~150 tests (Repository layer)
             ╱─────────────╲      Vitest + Test Database
            ╱               ╲
           ╱   Use Cases     ╲    ~300 tests (Business logic)
          ╱─────────────────╲    Vitest + Fake Repositories
         ╱                   ╲
        ╱   Domain Entities   ╲   ~400 tests (Pure logic)
       ╱───────────────────────╲  Vitest - No dependencies
      ▼
```

## 🎯 Testing Goals

- **Coverage**: Achieve >80% code coverage across all layers
- **Quality**: Maintain <1% test flakiness rate
- **Speed**: Unit tests <100ms, Integration <1s, E2E <10s per test
- **Maintainability**: Tests should be easy to understand and update
- **Confidence**: Tests should catch regressions before production

## 📁 Test Organization

### Directory Structure

```
/tests
├── setup.ts                    # Global test setup
├── README.md                   # Testing documentation
├── TEMPLATES.md                # Test templates
├── helpers/
│   ├── fake-repositories/      # In-memory implementations
│   │   └── fake-post.repository.ts
│   ├── test-data-builders/     # Test data factories
│   └── assertions/             # Custom assertions
├── unit/
│   ├── domain/                 # Domain entity tests
│   │   ├── user/
│   │   ├── post/
│   │   │   └── post.entity.test.ts
│   │   ├── comment/
│   │   └── community/
│   └── application/            # Use Case tests
│       ├── use-cases/
│       │   └── create-post.usecase.test.ts
│       └── dtos/
├── integration/
│   ├── repositories/           # Prisma repository tests
│   │   └── post.repository.prisma.test.ts
│   └── mappers/                # Mapper tests
└── e2e/
    ├── api/                    # API route tests
    │   ├── auth.spec.ts
    │   ├── posts.spec.ts
    │   └── comments.spec.ts
    ├── ui/                     # UI flow tests
    │   ├── authentication.spec.ts
    │   └── post-creation.spec.ts
    └── fixtures/
        └── test-data.ts
```

## 🏗️ Layer-Specific Testing

### Layer 1: Domain Layer (Unit Tests)

**Purpose**: Test pure business logic with zero external dependencies

**Framework**: Vitest
**Coverage Target**: >90%
**Test Isolation**: No mocks needed

**What to Test**:
- ✅ Entity creation and validation
- ✅ Business rules enforcement
- ✅ Domain events generation
- ✅ Value object behavior
- ✅ Entity state transitions
- ✅ Edge cases and boundary conditions

**Example Test**:
```typescript
describe('Post Entity', () => {
  it('should enforce title length constraints', () => {
    expect(() => Post.create({ title: '', body: 'Content' }))
      .toThrow('Title cannot be empty');
  });
});
```

**Location**: `tests/unit/domain/` or `src/domain/**/__tests__/`

### Layer 2: Application Layer (Use Case Tests)

**Purpose**: Test business logic orchestration with fake dependencies

**Framework**: Vitest + Fake Repositories
**Coverage Target**: >85%
**Test Isolation**: In-memory fake repositories

**What to Test**:
- ✅ Use case execution flow
- ✅ Repository interactions
- ✅ Domain event publishing
- ✅ DTO mapping
- ✅ Error handling
- ✅ Business logic orchestration
- ✅ Transaction boundaries

**Example Test**:
```typescript
describe('CreatePostUseCase', () => {
  let fakePostRepo: FakePostRepository;

  beforeEach(() => {
    fakePostRepo = new FakePostRepository();
  });

  it('should create post and publish event', async () => {
    const useCase = new CreatePostUseCase(fakePostRepo);
    const result = await useCase.execute({
      title: 'Test',
      body: 'Content'
    });

    expect(result).toHaveProperty('id');
    expect(fakePostRepo.getCount()).toBe(1);
  });
});
```

**Location**: `tests/unit/application/` or `src/application/**/__tests__/`

### Layer 3: Infrastructure Layer (Integration Tests)

**Purpose**: Test repository implementations with real Prisma + test database

**Framework**: Vitest + Test Database
**Coverage Target**: >80%
**Test Isolation**: Test database with setup/teardown

**What to Test**:
- ✅ Database persistence
- ✅ Query correctness
- ✅ Soft delete pattern
- ✅ Data mapping (DB ↔ Domain)
- ✅ Transactions
- ✅ Concurrency handling
- ✅ Database constraints

**Example Test**:
```typescript
describe('PostRepositoryPrisma', () => {
  beforeEach(async () => {
    await prisma.post.deleteMany();
  });

  it('should persist post to database', async () => {
    const post = Post.create({ /* ... */ });
    await repository.create(post);

    const found = await repository.findById(post.id);
    expect(found).not.toBeNull();
  });

  it('should exclude soft-deleted posts', async () => {
    await repository.softDelete(post.id);
    const found = await repository.findById(post.id);
    expect(found).toBeNull();
  });
});
```

**Location**: `tests/integration/`

### Layer 4: Presentation Layer (E2E Tests)

**Purpose**: Test complete request/response flow through API routes

**Framework**: Playwright
**Coverage Target**: >75% for critical flows
**Test Isolation**: Test database + Clerk test mode

**What to Test**:
- ✅ HTTP method handling (GET, POST, PATCH, DELETE)
- ✅ Request validation (Zod schemas)
- ✅ Authentication & authorization
- ✅ Response status codes
- ✅ Error responses
- ✅ Cross-browser compatibility
- ✅ Performance metrics

**Example Test**:
```typescript
test('POST /api/posts - should create post', async ({ request }) => {
  const response = await request.post('/api/posts', {
    data: { title: 'Test', body: 'Content' }
  });

  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(201);

  const json = await response.json();
  expect(json.data).toHaveProperty('id');
});
```

**Location**: `tests/e2e/`

## 🎬 Critical Test Scenarios

### 1. Authentication Flow
```
✓ Sign in with Clerk → Dashboard → Community navigation
✓ Sign up flow
✓ Password reset
✓ Session management
✓ Protected route access
```

### 2. Post Creation
```
✓ Create draft → Publish → View → Edit → Delete
✓ Rich text editing
✓ Image upload
✓ Category selection
✓ Version history
```

### 3. Commenting System
```
✓ Add comment → Reply (nested) → Like → Edit → Delete
✓ @mentions
✓ Comment threading (max 2 levels)
✓ Real-time updates
```

### 4. Sidebar Navigation
```
✓ Context switching between communities
✓ Role-based visibility
✓ Space/Channel navigation
✓ Responsive collapse
```

### 5. Theme Switching
```
✓ Light/dark mode toggle
✓ Persistence across sessions
✓ Smooth transitions
✓ All components support both themes
```

### 6. Responsive Design
```
✓ Mobile viewport (320px - 767px)
✓ Tablet viewport (768px - 1023px)
✓ Desktop viewport (1024px+)
✓ Touch interactions on mobile
```

## 🛠️ Testing Frameworks

### Vitest Configuration

**File**: `vitest.config.ts`

**Key Features**:
- ✅ JSdom environment for React components
- ✅ Coverage reporting (v8 provider)
- ✅ Path aliases (@/, @/domain, @/application, etc.)
- ✅ Global test utilities
- ✅ 80% coverage thresholds

### Playwright Configuration

**File**: `playwright.config.ts`

**Key Features**:
- ✅ Multi-browser testing (Chromium, Firefox, WebKit)
- ✅ Mobile viewports (Pixel 5, iPhone 12)
- ✅ Tablet viewports (iPad Pro)
- ✅ Automatic retries in CI
- ✅ Video/screenshot on failure
- ✅ Trace collection

## 🚀 Test Commands

```bash
# Run all tests
npm test

# Run unit tests (Domain + Application)
npm run test:unit

# Run integration tests (Infrastructure)
npm run test:integration

# Run tests in watch mode (TDD)
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run E2E tests (Playwright)
npm run test:e2e

# Run E2E with UI (debugging)
npm run test:e2e:ui

# Run E2E in headed mode
npm run test:e2e:headed

# Debug specific E2E test
npm run test:e2e:debug

# Install Playwright browsers
npm run playwright:install
```

## 🗄️ Test Database Setup

### Local Development

1. **Create test database**:
```bash
createdb sixty_test
```

2. **Set environment variable**:
```bash
export TEST_DATABASE_URL="postgresql://user:password@localhost:5432/sixty_test"
```

3. **Run migrations**:
```bash
DATABASE_URL=$TEST_DATABASE_URL npx prisma migrate deploy
```

4. **Seed test data** (optional):
```bash
DATABASE_URL=$TEST_DATABASE_URL npx prisma db seed
```

### CI/CD Setup

Use Docker container for test database:

```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: sixty_test
      POSTGRES_USER: test
      POSTGRES_PASSWORD: test
    ports:
      - 5432:5432
```

## 🔐 Clerk Authentication Testing

### Test Mode Configuration

1. **Enable test mode** in Clerk Dashboard
2. **Create test users** via Dashboard or API
3. **Use test credentials** in E2E tests

### Mock Authentication (Unit/Integration)

Clerk is automatically mocked in `tests/setup.ts`:

```typescript
vi.mock('@clerk/nextjs', () => ({
  auth: vi.fn(() => ({ userId: 'test-user-id' })),
  currentUser: vi.fn(() => Promise.resolve({ /* ... */ }))
}));
```

### Real Authentication (E2E)

E2E tests use real Clerk authentication with test accounts:

```typescript
test.beforeEach(async ({ page }) => {
  await page.goto('/sign-in');
  await page.fill('input[name="identifier"]', 'test@example.com');
  await page.fill('input[name="password"]', 'TestPassword123!');
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');
});
```

## 📈 Coverage Goals

| Layer | Target | Rationale |
|-------|--------|-----------|
| Domain | >90% | Pure logic, easy to test thoroughly |
| Application | >85% | Business logic orchestration |
| Infrastructure | >80% | Database interactions |
| Presentation | >75% | Focus on critical user flows |
| **Overall** | **>80%** | Balanced coverage across layers |

## ✅ Quality Gates

### Pre-commit
- ✅ Run unit tests
- ✅ Lint code
- ✅ Format code

### Pre-push
- ✅ Run all unit tests
- ✅ Run integration tests

### Pull Request
- ✅ All tests pass
- ✅ Coverage maintained or improved
- ✅ No new linting errors
- ✅ E2E tests pass for affected features

### Deployment
- ✅ Full test suite passes
- ✅ E2E tests pass in staging
- ✅ Performance benchmarks met

## 🐛 Debugging Tests

### Vitest Debugging

```bash
# Run specific test file
npm test -- path/to/test.test.ts

# Run tests matching pattern
npm test -- --grep "Post creation"

# Run in UI mode for debugging
npm run test:ui

# Run with coverage
npm run test:coverage
```

### Playwright Debugging

```bash
# Debug mode (step through tests)
npm run test:e2e:debug

# Run with browser visible
npm run test:e2e:headed

# Run specific test file
npm run test:e2e -- tests/e2e/api/posts.spec.ts

# Run tests in UI mode
npm run test:e2e:ui
```

## 🔄 Continuous Integration

### GitHub Actions Example

```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: sixty_test
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit

      - name: Run integration tests
        run: npm run test:integration
        env:
          TEST_DATABASE_URL: postgresql://test:test@localhost:5432/sixty_test

      - name: Install Playwright
        run: npm run playwright:install

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          TEST_DATABASE_URL: postgresql://test:test@localhost:5432/sixty_test

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## 📚 Best Practices

### 1. Test Naming
```typescript
// ✅ Good: Descriptive, includes "should"
it('should create post and publish event when valid data provided', () => {});

// ❌ Bad: Vague, unclear intention
it('test post creation', () => {});
```

### 2. Arrange-Act-Assert Pattern
```typescript
it('should update post title', async () => {
  // Arrange
  const post = Post.create({ title: 'Original', body: 'Content' });

  // Act
  post.updateTitle('Updated');

  // Assert
  expect(post.title).toBe('Updated');
});
```

### 3. Test Independence
```typescript
// ✅ Good: Each test is independent
describe('Post', () => {
  it('test 1', () => {
    const post = Post.create({ /* ... */ });
    // test logic
  });

  it('test 2', () => {
    const post = Post.create({ /* ... */ });
    // test logic
  });
});

// ❌ Bad: Tests depend on shared state
let sharedPost;
beforeAll(() => {
  sharedPost = Post.create({ /* ... */ });
});
```

### 4. Meaningful Assertions
```typescript
// ✅ Good: Specific assertions
expect(result.title).toBe('Expected Title');
expect(result.publishedAt).toBeInstanceOf(Date);

// ❌ Bad: Vague assertions
expect(result).toBeTruthy();
expect(result).toBeDefined();
```

### 5. Error Testing
```typescript
// ✅ Good: Test error message
expect(() => Post.create({ title: '' }))
  .toThrow('Title cannot be empty');

// ❌ Bad: Just test that it throws
expect(() => Post.create({ title: '' })).toThrow();
```

## 🚨 Common Issues & Solutions

### Issue: Tests fail with database connection errors
**Solution**: Ensure TEST_DATABASE_URL is set and database is running

### Issue: Clerk authentication fails in tests
**Solution**: Check mocks in `tests/setup.ts` are properly configured

### Issue: E2E tests timeout
**Solution**: Increase timeout in `playwright.config.ts` or check dev server

### Issue: Flaky tests
**Solution**: Add proper wait conditions, avoid hardcoded delays, ensure test isolation

### Issue: Slow test execution
**Solution**: Run tests in parallel, optimize test database setup/teardown

## 📖 Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles)
- [Hexagonal Architecture Testing](https://herbertograca.com/2017/09/14/ports-adapters-architecture/)
- [Test Templates](./tests/TEMPLATES.md)
- [Detailed Test Documentation](./tests/README.md)

## 🎯 Next Steps

1. ✅ Set up test database
2. ✅ Install Playwright browsers: `npm run playwright:install`
3. ✅ Run initial test suite: `npm test`
4. ✅ Configure CI/CD pipeline
5. ✅ Create tests for existing features
6. ✅ Set up pre-commit hooks
7. ✅ Monitor coverage reports

---

**Last Updated**: 2025-11-04
**Maintained By**: QA Team
**Version**: 1.0.0
