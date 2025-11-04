# Testing Strategy - Sixty Community Platform

## Overview

This testing strategy follows **Hexagonal Architecture** principles with layer-specific testing methodologies:

- **Domain Layer**: Pure unit tests (no external dependencies)
- **Application Layer**: Use Case tests with fake repositories
- **Infrastructure Layer**: Integration tests with test database
- **Presentation Layer**: E2E API tests with Playwright

## Test Directory Structure

```
/tests
├── setup.ts                          # Global test setup and mocks
├── helpers/                          # Shared test utilities
│   ├── fake-repositories/            # In-memory repository implementations
│   ├── test-data-builders/           # Test data factory functions
│   └── assertions/                   # Custom test assertions
├── unit/                             # Unit tests (Domain + Application)
│   ├── domain/                       # Domain entity tests
│   │   ├── user/
│   │   ├── post/
│   │   ├── comment/
│   │   └── community/
│   └── application/                  # Use Case tests with fakes
│       ├── use-cases/
│       └── dtos/
├── integration/                      # Integration tests (Infrastructure)
│   ├── repositories/                 # Prisma repository tests
│   └── mappers/                      # Mapper tests
└── e2e/                              # End-to-End tests (Playwright)
    ├── api/                          # API route tests
    │   ├── auth.spec.ts
    │   ├── posts.spec.ts
    │   ├── comments.spec.ts
    │   └── communities.spec.ts
    ├── ui/                           # UI flow tests
    │   ├── authentication.spec.ts
    │   ├── post-creation.spec.ts
    │   └── community-navigation.spec.ts
    └── fixtures/                     # Test data and helpers
        └── test-data.ts
```

## Layer-Specific Testing

### Layer 1: Domain Layer (Unit Tests)

**Purpose**: Test pure business logic with zero external dependencies

**Framework**: Vitest
**Coverage Target**: >90%
**Test Isolation**: No mocks needed - pure functions and classes

**Location**: `tests/unit/domain/` or `src/domain/**/__tests__/`

**Example**: Entity validation, business rules, domain events

```typescript
// Domain entity test
describe('Post Entity', () => {
  it('should enforce title length constraints', () => {
    expect(() => Post.create({
      title: '', // Empty title
      body: 'Content'
    })).toThrow('Title cannot be empty');
  });
});
```

### Layer 2: Application Layer (Use Case Tests)

**Purpose**: Test business logic orchestration with fake dependencies

**Framework**: Vitest with Fake Repositories
**Coverage Target**: >85%
**Test Isolation**: Use in-memory fake repositories

**Location**: `tests/unit/application/` or `src/application/**/__tests__/`

**Example**: Use Cases with repository interactions

```typescript
// Use Case test with fake repository
describe('CreatePostUseCase', () => {
  let fakePostRepo: FakePostRepository;
  let useCase: CreatePostUseCase;

  beforeEach(() => {
    fakePostRepo = new FakePostRepository();
    useCase = new CreatePostUseCase(fakePostRepo);
  });

  it('should create post and return DTO', async () => {
    const result = await useCase.execute({
      title: 'Test Post',
      body: 'Content',
      communityId: 'comm-123',
      authorId: 'user-123'
    });

    expect(result.title).toBe('Test Post');
    expect(fakePostRepo.posts).toHaveLength(1);
  });
});
```

### Layer 3: Infrastructure Layer (Integration Tests)

**Purpose**: Test repository implementations with real Prisma + test database

**Framework**: Vitest with Test Database
**Coverage Target**: >80%
**Test Isolation**: Test database with setup/teardown

**Location**: `tests/integration/` or `src/infrastructure/**/__tests__/`

**Example**: Prisma repository tests

```typescript
// Repository integration test
describe('PostRepositoryPrisma (Integration)', () => {
  beforeEach(async () => {
    await prisma.post.deleteMany();
  });

  it('should persist post to database', async () => {
    const post = Post.create({...});
    await repository.create(post);

    const found = await repository.findById(post.id);
    expect(found).not.toBeNull();
    expect(found?.title).toBe(post.title);
  });

  it('should exclude soft-deleted posts', async () => {
    const post = await createTestPost();
    await repository.softDelete(post.id);

    const found = await repository.findById(post.id);
    expect(found).toBeNull();
  });
});
```

### Layer 4: Presentation Layer (E2E Tests)

**Purpose**: Test complete request/response flow through API routes

**Framework**: Playwright
**Coverage Target**: >75% for critical flows
**Test Isolation**: Test database + Clerk test mode

**Location**: `tests/e2e/`

**Example**: API E2E tests

```typescript
// API E2E test
test.describe('Post API', () => {
  test('POST /api/posts - should create post', async ({ request }) => {
    const response = await request.post('/api/posts', {
      data: {
        title: 'Test Post',
        body: 'Content',
        communityId: 'comm-123'
      }
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);

    const json = await response.json();
    expect(json.data).toHaveProperty('id');
  });
});
```

## Test Commands

```bash
# Run all tests
npm test

# Run unit tests only (Domain + Application)
npm run test:unit

# Run integration tests (Infrastructure)
npm run test:integration

# Run E2E tests (Playwright)
npm run test:e2e

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run specific test file
npm test -- path/to/test.test.ts

# Run tests matching pattern
npm test -- --grep "Post"
```

## Test Database Setup

### Local Development

1. Create test database:
```bash
createdb sixty_test
```

2. Set test database URL:
```bash
export TEST_DATABASE_URL="postgresql://user:password@localhost:5432/sixty_test"
```

3. Run migrations on test database:
```bash
DATABASE_URL=$TEST_DATABASE_URL npx prisma migrate deploy
```

### CI/CD

Use Docker container for test database:
```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: sixty_test
      POSTGRES_USER: test
      POSTGRES_PASSWORD: test
```

## Clerk Authentication Testing

### Test Mode Setup

1. Enable test mode in Clerk Dashboard
2. Create test users via Clerk API or Dashboard
3. Use test credentials in E2E tests

### Mock Authentication (Unit/Integration)

Clerk is mocked in `tests/setup.ts` for unit and integration tests:

```typescript
vi.mock('@clerk/nextjs', () => ({
  auth: vi.fn(() => ({ userId: 'test-user-id' })),
  currentUser: vi.fn(() => Promise.resolve({ id: 'test-user-id' }))
}));
```

### Real Authentication (E2E)

E2E tests use real Clerk authentication with test accounts.

## Best Practices

### 1. Test Organization
- Group tests by architectural layer
- Use descriptive test names following Given-When-Then
- Keep tests focused on single responsibility

### 2. Test Data
- Use test data builders for complex objects
- Reset test database between tests
- Avoid test interdependencies

### 3. Assertions
- Use specific assertions (not just truthy checks)
- Assert on multiple relevant properties
- Include error message context

### 4. Test Isolation
- Each test should be independent
- Clean up resources after tests
- Don't rely on test execution order

### 5. Performance
- Keep unit tests fast (<100ms)
- Use test database for integration tests
- Run E2E tests in parallel when possible

### 6. Coverage Goals
- Domain: >90% (pure business logic)
- Application: >85% (use cases)
- Infrastructure: >80% (repositories)
- Presentation: >75% (critical flows)

## Quality Gates

All tests must pass before:
- Merging to main branch
- Deploying to staging/production
- Creating pull requests

### Pre-commit Checks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:unit",
      "pre-push": "npm run test"
    }
  }
}
```

## Troubleshooting

### Common Issues

**Issue**: Tests fail with database connection errors
**Solution**: Ensure TEST_DATABASE_URL is set and database is running

**Issue**: Clerk authentication fails in tests
**Solution**: Check that mocks are properly configured in setup.ts

**Issue**: E2E tests timeout
**Solution**: Increase timeout in playwright.config.ts or check dev server

**Issue**: Flaky tests
**Solution**: Add proper wait conditions, avoid hardcoded delays

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [Hexagonal Architecture Testing Guide](https://herbertograca.com/2017/09/14/ports-adapters-architecture/)

## Maintenance

- Review and update tests when requirements change
- Refactor tests alongside production code
- Monitor test execution time and optimize slow tests
- Update test database schema when migrations run
