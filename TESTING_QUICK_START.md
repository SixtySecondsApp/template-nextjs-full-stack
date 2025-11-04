# 🚀 Testing Quick Start Guide

Get up and running with the Sixty Community testing infrastructure in 5 minutes.

## Prerequisites

- ✅ Node.js 20+ installed
- ✅ PostgreSQL running locally
- ✅ Project dependencies installed (`npm install`)

## Step 1: Set Up Test Database

```bash
# Create test database
createdb sixty_test

# Set environment variable (add to .env.test)
echo "TEST_DATABASE_URL=postgresql://user:password@localhost:5432/sixty_test" >> .env.test

# Run migrations on test database
DATABASE_URL=postgresql://user:password@localhost:5432/sixty_test npx prisma migrate deploy
```

## Step 2: Install Playwright Browsers

```bash
npm run playwright:install
```

This downloads Chromium, Firefox, and WebKit browsers for E2E testing.

## Step 3: Run Your First Tests

### Unit Tests (Fastest)
```bash
npm run test:unit
```

### Integration Tests (Requires test database)
```bash
npm run test:integration
```

### E2E Tests (Slowest, most comprehensive)
```bash
npm run test:e2e
```

### All Tests
```bash
npm test
```

## Step 4: Try Test Watch Mode (TDD)

```bash
npm run test:watch
```

This watches for file changes and automatically re-runs affected tests.

## Step 5: Generate Coverage Report

```bash
npm run test:coverage
```

Open `coverage/index.html` in your browser to see detailed coverage.

## 📝 Writing Your First Test

### 1. Domain Entity Test (Unit Test)

Create `src/domain/post/__tests__/post.entity.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { Post } from '../post.entity';

describe('Post Entity', () => {
  it('should create post with valid data', () => {
    const post = Post.create({
      communityId: 'comm-123',
      authorId: 'user-123',
      title: 'Test Post',
      body: 'Test content',
    });

    expect(post.id).toBeDefined();
    expect(post.title).toBe('Test Post');
  });

  it('should throw error for empty title', () => {
    expect(() =>
      Post.create({
        communityId: 'comm-123',
        authorId: 'user-123',
        title: '',
        body: 'Content',
      })
    ).toThrow('Title cannot be empty');
  });
});
```

Run it:
```bash
npm run test:unit -- src/domain/post
```

### 2. Use Case Test (With Fake Repository)

Create `src/application/use-cases/__tests__/create-post.usecase.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { CreatePostUseCase } from '../create-post.usecase';
import { FakePostRepository } from '@/tests/helpers/fake-repositories/fake-post.repository';

describe('CreatePostUseCase', () => {
  let fakePostRepo: FakePostRepository;
  let useCase: CreatePostUseCase;

  beforeEach(() => {
    fakePostRepo = new FakePostRepository();
    useCase = new CreatePostUseCase(fakePostRepo);
  });

  it('should create post and persist to repository', async () => {
    const result = await useCase.execute({
      communityId: 'comm-123',
      authorId: 'user-123',
      title: 'Test Post',
      body: 'Content',
    });

    expect(result).toHaveProperty('id');

    const posts = await fakePostRepo.findAll();
    expect(posts).toHaveLength(1);
  });
});
```

Run it:
```bash
npm run test:unit -- src/application/use-cases
```

### 3. Repository Integration Test

Create `src/infrastructure/prisma/__tests__/post.repository.prisma.test.ts`:

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PrismaClient } from '@/generated/prisma';
import { PostRepositoryPrisma } from '../post.repository.prisma';

const prisma = new PrismaClient({
  datasourceUrl: process.env.TEST_DATABASE_URL,
});

describe('PostRepositoryPrisma', () => {
  let repository: PostRepositoryPrisma;

  beforeEach(async () => {
    repository = new PostRepositoryPrisma();
    await prisma.post.deleteMany();
  });

  afterEach(async () => {
    await prisma.post.deleteMany();
  });

  it('should persist post to database', async () => {
    const post = {
      id: crypto.randomUUID(),
      communityId: 'comm-123',
      authorId: 'user-123',
      title: 'Test Post',
      body: 'Content',
      // ... other fields
    };

    await repository.create(post);

    const found = await repository.findById(post.id);
    expect(found).not.toBeNull();
    expect(found?.title).toBe('Test Post');
  });

  it('should exclude soft-deleted posts', async () => {
    const post = await repository.create({ /* ... */ });
    await repository.softDelete(post.id);

    const found = await repository.findById(post.id);
    expect(found).toBeNull();
  });
});
```

Run it:
```bash
npm run test:integration
```

### 4. E2E API Test

Create `tests/e2e/api/posts.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Post API', () => {
  test('should create new post', async ({ request }) => {
    const response = await request.post('/api/posts', {
      data: {
        title: 'Test Post',
        body: '<p>Content</p>',
        communityId: 'test-community',
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data).toHaveProperty('id');
  });

  test('should return 400 for invalid data', async ({ request }) => {
    const response = await request.post('/api/posts', {
      data: {
        title: '', // Empty title
        body: '<p>Content</p>',
        communityId: 'test-community',
      },
    });

    expect(response.status()).toBe(400);
  });
});
```

Run it:
```bash
npm run test:e2e -- tests/e2e/api/posts.spec.ts
```

## 🎯 Test Commands Cheat Sheet

```bash
# Development workflow
npm run test:watch              # TDD mode (auto-rerun on changes)
npm run test:unit               # Fast unit tests only
npm run test:integration        # Integration tests with DB
npm run test:e2e               # Full E2E tests

# Debugging
npm run test:ui                 # Vitest UI mode
npm run test:e2e:ui            # Playwright UI mode
npm run test:e2e:debug         # Step-by-step debugging
npm run test:e2e:headed        # See browser during tests

# Coverage & reporting
npm run test:coverage          # Generate coverage report
npm test -- --reporter=verbose # Detailed test output

# Specific tests
npm test -- path/to/test.test.ts        # Run specific file
npm test -- --grep "Post creation"      # Run matching tests
npm run test:e2e -- --project=chromium  # Run E2E in one browser
```

## 📂 Where to Put Tests

Follow this structure:

```
✅ Domain tests:        src/domain/[feature]/__tests__/[entity].entity.test.ts
✅ Use Case tests:      src/application/use-cases/__tests__/[usecase].usecase.test.ts
✅ Repository tests:    src/infrastructure/prisma/__tests__/[entity].repository.prisma.test.ts
✅ E2E API tests:       tests/e2e/api/[feature].spec.ts
✅ E2E UI tests:        tests/e2e/ui/[flow].spec.ts
✅ Fake repositories:   tests/helpers/fake-repositories/fake-[entity].repository.ts
```

## 🎨 Using Test Templates

We provide ready-to-use templates for all test types:

```bash
# Copy domain test template
cp tests/TEMPLATES.md src/domain/my-feature/__tests__/my-entity.entity.test.ts

# Copy use case test template
cp tests/TEMPLATES.md src/application/use-cases/__tests__/my-usecase.test.ts

# Copy E2E test template
cp tests/TEMPLATES.md tests/e2e/api/my-feature.spec.ts
```

Then replace placeholders:
- `[EntityName]` → Your entity name
- `[UseCaseName]` → Your use case name
- `[feature]` → Your feature name

See `tests/TEMPLATES.md` for complete templates.

## 🐛 Common Issues

### Issue: "Cannot find module '@/domain/...'"
**Solution**: Check that path aliases in `vitest.config.ts` match your `tsconfig.json`

### Issue: "Database connection failed"
**Solution**: Ensure TEST_DATABASE_URL is set and PostgreSQL is running

### Issue: "Playwright browser not installed"
**Solution**: Run `npm run playwright:install`

### Issue: Tests are slow
**Solution**:
- Use `npm run test:unit` for faster feedback
- Run `npm run test:watch` to only test changed files
- Optimize test database setup/teardown

### Issue: Flaky E2E tests
**Solution**:
- Use proper wait conditions (`waitForLoadState`, `waitForSelector`)
- Avoid hardcoded `setTimeout`
- Ensure test data is properly cleaned between tests

## 🎓 Next Steps

1. ✅ Read full [Testing Strategy](./TESTING_STRATEGY.md)
2. ✅ Review [Test Templates](./tests/TEMPLATES.md)
3. ✅ Check [Test Documentation](./tests/README.md)
4. ✅ Set up pre-commit hooks
5. ✅ Configure CI/CD pipeline
6. ✅ Write tests for your feature

## 💡 Tips for Success

1. **Start with Domain Tests**: Easiest to write, fastest to run
2. **Use TDD**: Write test first, then implementation
3. **Keep Tests Simple**: One assertion focus per test
4. **Name Tests Well**: "should [expected behavior] when [condition]"
5. **Use Fake Repos**: Faster than real DB for Use Case tests
6. **Run Tests Often**: Catch issues early
7. **Maintain Coverage**: Don't let it drop below 80%

## 📞 Getting Help

- **Documentation**: See `tests/README.md`
- **Templates**: See `tests/TEMPLATES.md`
- **Strategy**: See `TESTING_STRATEGY.md`
- **Examples**: See `tests/unit/`, `tests/integration/`, `tests/e2e/`

---

**Happy Testing! 🚀**
