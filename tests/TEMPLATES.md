# Test Templates

Quick-start templates for creating new tests following Hexagonal Architecture principles.

## Domain Layer Test Template

```typescript
/**
 * Domain Layer Test: [EntityName] Entity
 *
 * Purpose: Test pure business logic with zero external dependencies
 * Framework: Vitest
 * Coverage Target: >90%
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { [EntityName] } from '@/domain/[feature]/[entity-name].entity';

describe('[EntityName] Entity (Domain Layer)', () => {
  describe('create', () => {
    it('should create entity with valid data', () => {
      const entity = [EntityName].create({
        // ... valid data
      });

      expect(entity.id).toBeDefined();
      // ... more assertions
    });

    it('should throw error for invalid data', () => {
      expect(() =>
        [EntityName].create({
          // ... invalid data
        })
      ).toThrow('Expected error message');
    });
  });

  describe('[businessMethod]', () => {
    let entity: [EntityName];

    beforeEach(() => {
      entity = [EntityName].create({
        // ... test data
      });
    });

    it('should [expected behavior]', () => {
      entity.[businessMethod]();

      expect(entity.[property]).toBe(expectedValue);
    });

    it('should throw error when [invalid condition]', () => {
      expect(() => entity.[businessMethod]()).toThrow('Error message');
    });
  });
});
```

## Application Layer Test Template (Use Case)

```typescript
/**
 * Application Layer Test: [UseCaseName]
 *
 * Purpose: Test business logic orchestration with fake dependencies
 * Framework: Vitest with Fake Repositories
 * Coverage Target: >85%
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { [UseCaseName] } from '@/application/use-cases/[use-case-name].usecase';
import { Fake[Entity]Repository } from '@/tests/helpers/fake-repositories/fake-[entity].repository';

describe('[UseCaseName] (Application Layer)', () => {
  let fakeRepository: Fake[Entity]Repository;
  let publishedEvents: any[];
  let useCase: [UseCaseName];

  beforeEach(() => {
    fakeRepository = new Fake[Entity]Repository();
    publishedEvents = [];
    const eventPublisher = (event: any) => publishedEvents.push(event);
    useCase = new [UseCaseName](fakeRepository, eventPublisher);
  });

  describe('successful execution', () => {
    it('should execute use case and return result', async () => {
      const input = {
        // ... input data
      };

      const result = await useCase.execute(input);

      expect(result).toHaveProperty('id');
      expect(result.[property]).toBe(expectedValue);
    });

    it('should persist to repository', async () => {
      const input = { /* ... */ };

      await useCase.execute(input);

      const stored = await fakeRepository.findAll();
      expect(stored).toHaveLength(1);
    });

    it('should publish domain event', async () => {
      const input = { /* ... */ };

      await useCase.execute(input);

      expect(publishedEvents).toHaveLength(1);
      expect(publishedEvents[0].type).toBe('[EVENT_TYPE]');
    });
  });

  describe('validation errors', () => {
    it('should throw error for invalid input', async () => {
      const input = {
        // ... invalid data
      };

      await expect(useCase.execute(input)).rejects.toThrow('Error message');
    });

    it('should not persist when validation fails', async () => {
      const input = { /* invalid */ };

      try {
        await useCase.execute(input);
      } catch {
        // Expected
      }

      const stored = await fakeRepository.findAll();
      expect(stored).toHaveLength(0);
    });
  });
});
```

## Infrastructure Layer Test Template (Repository)

```typescript
/**
 * Infrastructure Layer Test: [Entity]RepositoryPrisma
 *
 * Purpose: Test repository implementation with real Prisma + test database
 * Framework: Vitest with Test Database
 * Coverage Target: >80%
 */

import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@/generated/prisma';
import { [Entity]RepositoryPrisma } from '@/infrastructure/prisma/[entity].repository.prisma';

const prisma = new PrismaClient({
  datasourceUrl: process.env.TEST_DATABASE_URL,
});

describe('[Entity]RepositoryPrisma (Integration)', () => {
  let repository: [Entity]RepositoryPrisma;

  beforeAll(async () => {
    // Create test data dependencies
  });

  beforeEach(async () => {
    repository = new [Entity]RepositoryPrisma();
    await prisma.[entity].deleteMany();
  });

  afterEach(async () => {
    await prisma.[entity].deleteMany();
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.$disconnect();
  });

  describe('create', () => {
    it('should persist entity to database', async () => {
      const entity = {
        // ... entity data
      };

      const result = await repository.create(entity);

      expect(result.id).toBe(entity.id);

      // Verify in database
      const dbEntity = await prisma.[entity].findUnique({
        where: { id: entity.id },
      });
      expect(dbEntity).not.toBeNull();
    });
  });

  describe('findById', () => {
    it('should return entity if exists and not deleted', async () => {
      const entity = await prisma.[entity].create({
        data: { /* ... */ },
      });

      const result = await repository.findById(entity.id);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(entity.id);
    });

    it('should return null for soft-deleted entity', async () => {
      const entity = await prisma.[entity].create({
        data: {
          // ...
          deletedAt: new Date(),
        },
      });

      const result = await repository.findById(entity.id);

      expect(result).toBeNull();
    });
  });

  describe('softDelete', () => {
    it('should set deletedAt timestamp', async () => {
      const entity = await prisma.[entity].create({
        data: { /* ... */ },
      });

      await repository.softDelete(entity.id);

      const dbEntity = await prisma.[entity].findUnique({
        where: { id: entity.id },
      });
      expect(dbEntity?.deletedAt).toBeInstanceOf(Date);
    });
  });
});
```

## E2E API Test Template (Playwright)

```typescript
/**
 * Presentation Layer Test: [Feature] API E2E Tests
 *
 * Purpose: Test complete request/response flow through API routes
 * Framework: Playwright
 * Coverage Target: >75% for critical flows
 */

import { test, expect } from '@playwright/test';

test.describe('[Feature] API (E2E)', () => {
  test.beforeEach(async ({ request }) => {
    // Clean test database
    await request.post('/api/test/reset-[feature]');
  });

  test.describe('POST /api/[feature]', () => {
    test('should create new [entity]', async ({ request }) => {
      const response = await request.post('/api/[feature]', {
        data: {
          // ... request data
        },
      });

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(201);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data).toHaveProperty('id');
    });

    test('should return 400 for invalid data', async ({ request }) => {
      const response = await request.post('/api/[feature]', {
        data: {
          // ... invalid data
        },
      });

      expect(response.status()).toBe(400);

      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.errors).toBeDefined();
    });

    test('should return 401 for unauthenticated request', async ({ request }) => {
      const response = await request.post('/api/[feature]', {
        data: { /* ... */ },
        headers: {
          // No authorization
        },
      });

      expect(response.status()).toBe(401);
    });
  });

  test.describe('GET /api/[feature]', () => {
    test('should return list of [entities]', async ({ request }) => {
      // Setup: Create test data
      await request.post('/api/[feature]', {
        data: { /* ... */ },
      });

      const response = await request.get('/api/[feature]');

      expect(response.ok()).toBeTruthy();

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data.[entities]).toBeInstanceOf(Array);
    });

    test('should support filtering', async ({ request }) => {
      // Create test data
      await request.post('/api/[feature]', {
        data: { /* ... filter1 */ },
      });
      await request.post('/api/[feature]', {
        data: { /* ... filter2 */ },
      });

      const response = await request.get('/api/[feature]?filter=value');

      const json = await response.json();
      expect(json.data.[entities]).toHaveLength(expectedLength);
    });
  });

  test.describe('GET /api/[feature]/:id', () => {
    test('should return single [entity]', async ({ request }) => {
      // Create entity
      const createResponse = await request.post('/api/[feature]', {
        data: { /* ... */ },
      });
      const { data: entity } = await createResponse.json();

      const response = await request.get(`/api/[feature]/${entity.id}`);

      expect(response.ok()).toBeTruthy();

      const json = await response.json();
      expect(json.data.id).toBe(entity.id);
    });

    test('should return 404 for non-existent [entity]', async ({ request }) => {
      const response = await request.get('/api/[feature]/non-existent-id');

      expect(response.status()).toBe(404);
    });
  });

  test.describe('PATCH /api/[feature]/:id', () => {
    test('should update [entity]', async ({ request }) => {
      // Create entity
      const createResponse = await request.post('/api/[feature]', {
        data: { /* original data */ },
      });
      const { data: entity } = await createResponse.json();

      const response = await request.patch(`/api/[feature]/${entity.id}`, {
        data: { /* updated data */ },
      });

      expect(response.ok()).toBeTruthy();

      const json = await response.json();
      expect(json.data.[property]).toBe(updatedValue);
    });

    test('should return 403 for unauthorized user', async ({ request }) => {
      // Test authorization logic
    });
  });

  test.describe('DELETE /api/[feature]/:id', () => {
    test('should soft delete [entity]', async ({ request }) => {
      // Create entity
      const createResponse = await request.post('/api/[feature]', {
        data: { /* ... */ },
      });
      const { data: entity } = await createResponse.json();

      const response = await request.delete(`/api/[feature]/${entity.id}`);

      expect(response.status()).toBe(204);

      // Verify not in list
      const listResponse = await request.get('/api/[feature]');
      const { data } = await listResponse.json();
      expect(data.[entities].find((e: any) => e.id === entity.id)).toBeUndefined();
    });
  });
});
```

## Fake Repository Template

```typescript
/**
 * Fake [Entity] Repository for Testing
 *
 * In-memory implementation for Application layer testing
 */

interface [Entity] {
  id: string;
  // ... entity properties
  deletedAt: Date | null;
}

interface I[Entity]Repository {
  create(entity: [Entity]): Promise<[Entity]>;
  findById(id: string): Promise<[Entity] | null>;
  findAll(filters?: any): Promise<[Entity][]>;
  update(entity: [Entity]): Promise<[Entity]>;
  softDelete(id: string): Promise<void>;
  restore(id: string): Promise<void>;
}

export class Fake[Entity]Repository implements I[Entity]Repository {
  private entities: [Entity][] = [];

  async create(entity: [Entity]): Promise<[Entity]> {
    this.entities.push({ ...entity });
    return entity;
  }

  async findById(id: string): Promise<[Entity] | null> {
    const entity = this.entities.find(
      (e) => e.id === id && e.deletedAt === null
    );
    return entity ? { ...entity } : null;
  }

  async findAll(filters?: any): Promise<[Entity][]> {
    let results = this.entities.filter((e) => e.deletedAt === null);

    // Apply filters
    if (filters?.[property]) {
      results = results.filter((e) => e.[property] === filters.[property]);
    }

    return results.map((e) => ({ ...e }));
  }

  async update(entity: [Entity]): Promise<[Entity]> {
    const index = this.entities.findIndex((e) => e.id === entity.id);
    if (index === -1) {
      throw new Error(`[Entity] with id ${entity.id} not found`);
    }

    this.entities[index] = { ...entity };
    return this.entities[index];
  }

  async softDelete(id: string): Promise<void> {
    const entity = this.entities.find((e) => e.id === id);
    if (!entity) {
      throw new Error(`[Entity] with id ${id} not found`);
    }

    entity.deletedAt = new Date();
  }

  async restore(id: string): Promise<void> {
    const entity = this.entities.find((e) => e.id === id);
    if (!entity) {
      throw new Error(`[Entity] with id ${id} not found`);
    }

    entity.deletedAt = null;
  }

  // Test helper methods
  reset(): void {
    this.entities = [];
  }

  getAllIncludingDeleted(): [Entity][] {
    return this.entities.map((e) => ({ ...e }));
  }

  getCount(): number {
    return this.entities.filter((e) => e.deletedAt === null).length;
  }
}
```

## Usage Examples

### Creating a New Domain Test

```bash
# Copy template
cp tests/TEMPLATES.md tests/unit/domain/my-feature/my-entity.entity.test.ts

# Replace placeholders
# [EntityName] → MyEntity
# [feature] → my-feature
# [entity-name] → my-entity
```

### Creating a New Use Case Test

```bash
# 1. Create fake repository
cp tests/helpers/fake-repositories/template.ts \
   tests/helpers/fake-repositories/fake-my-entity.repository.ts

# 2. Create use case test
cp tests/TEMPLATES.md \
   tests/unit/application/use-cases/my-usecase.test.ts
```

### Creating E2E Test

```bash
cp tests/TEMPLATES.md tests/e2e/api/my-feature.spec.ts
```

## Tips for Writing Good Tests

1. **Arrange-Act-Assert**: Structure tests clearly
2. **One Assertion Focus**: Each test should verify one behavior
3. **Descriptive Names**: Use "should [expected behavior] when [condition]"
4. **Independent Tests**: No test should depend on another
5. **Clean Test Data**: Reset state between tests
6. **Edge Cases**: Test boundaries, empty values, max limits
7. **Error Cases**: Test validation and error handling
8. **Real Scenarios**: Base tests on actual user workflows
