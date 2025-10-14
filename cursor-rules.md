# 📐 Cursor Rules – Next.js + Prisma + Hexagonal Architecture

These rules enforce the agreed architecture, design patterns, and best practices for this project.
Follow them strictly when generating or modifying code.

---

## 🔹 General Principles
- Always follow **Hexagonal / Clean Architecture**.
- Keep **separation of concerns**:
  - Domain = business logic
  - Application = orchestration + use cases
  - Infrastructure = DB, Prisma, adapters
  - Presentation (Next.js routes) = controllers
- Follow **SOLID principles** and **clean code** practices.
- Never mix **framework code (Next.js, Prisma)** inside the **domain**.

---

## 📂 Project Structure
```

/src
/app                # Next.js App Router (controllers: UI + API routes)
/domain             # Entities, Value Objects, Domain Events
/application
/use-cases        # Business use cases
/dto              # Input & Output DTOs
/mappers          # Domain ↔ DTO mappers
/ports              # Interfaces (repositories, event bus, etc.)
/infrastructure
/prisma           # Prisma client + repository implementations
/mappers          # DB ↔ Domain mappers
/events           # Event bus + event handlers
/queue, /email    # External adapters
/shared             # Errors, logger, config, utils

````

---

## 🧩 Domain Rules
- Entities must be **classes** encapsulating business invariants.
- No Prisma or DB logic here.
- Use **Value Objects** for reusable concepts (e.g., `Email`, `TaskStatus`).
- Define **Domain Events** for side effects (e.g., `TaskCreatedEvent`).

### Example: Entity
```ts
// /domain/task/task.entity.ts
export class Task {
  constructor(
    public readonly id: string,
    private _title: string,
    private _status: "OPEN" | "DONE",
    private _createdAt: Date,
    private _deletedAt?: Date | null
  ) {
    if (!_title) throw new Error("Task title cannot be empty");
  }

  get title() {
    return this._title;
  }

  rename(newTitle: string) {
    if (!newTitle) throw new Error("Title cannot be empty");
    this._title = newTitle;
  }

  markDeleted() {
    this._deletedAt = new Date();
  }

  restore() {
    this._deletedAt = null;
  }
}
````

---

## ⚙️ Application Layer Rules

* All business actions must be implemented as **Use Cases**.
* Use Cases must:

  * Be **classes** with an `execute(input: DTO)` method.
  * Accept **repositories and services via constructor injection** (not instantiated inside).
  * Never use Prisma directly.
* Input must be validated with **DTOs** (e.g., `zod`).
* Use Cases can publish **Domain Events**.

### Example: Use Case

```ts
// /application/use-cases/create-task.usecase.ts
import { ITaskRepository } from "@/ports/task.repository";
import { Task } from "@/domain/task/task.entity";

interface CreateTaskDTO {
  title: string;
  projectId: string;
}

export class CreateTaskUseCase {
  constructor(private readonly taskRepo: ITaskRepository) {}

  async execute(input: CreateTaskDTO): Promise<Task> {
    const task = new Task(
      crypto.randomUUID(),
      input.title,
      "OPEN",
      new Date()
    );

    await this.taskRepo.save(task);
    return task;
  }
}
```

---

## 🔌 Ports & Adapters Rules

* Define **interfaces (Ports)** in `/ports`.
* Implement them in `/infrastructure`.
* Repositories:

  * Must implement the defined interface.
  * Must map DB models ↔ Domain entities via **Mappers**.
* Event Bus:

  * Publish domain events from Use Cases.
  * Event handlers in `/infrastructure/events`.

### Example: Port

```ts
// /ports/task.repository.ts
import { Task } from "@/domain/task/task.entity";

export interface ITaskRepository {
  save(task: Task): Promise<void>;
  findById(id: string): Promise<Task | null>;
  findAll(): Promise<Task[]>;
  softDelete(id: string): Promise<void>;
  restore(id: string): Promise<void>;
}
```

### Example: Adapter

```ts
// /infrastructure/prisma/prisma-task.repository.ts
import { ITaskRepository } from "@/ports/task.repository";
import { prisma } from "./prisma.client";
import { TaskMapper } from "../mappers/task.mapper";
import { Task } from "@/domain/task/task.entity";

export class PrismaTaskRepository implements ITaskRepository {
  async save(task: Task): Promise<void> {
    await prisma.task.upsert({
      where: { id: task.id },
      update: TaskMapper.toPrisma(task),
      create: TaskMapper.toPrisma(task),
    });
  }

  async findById(id: string): Promise<Task | null> {
    const record = await prisma.task.findUnique({
      where: { id, deletedAt: null },
    });
    return record ? TaskMapper.toDomain(record) : null;
  }

  async findAll(): Promise<Task[]> {
    const records = await prisma.task.findMany({ where: { deletedAt: null } });
    return records.map(TaskMapper.toDomain);
  }

  async softDelete(id: string): Promise<void> {
    await prisma.task.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async restore(id: string): Promise<void> {
    await prisma.task.update({ where: { id }, data: { deletedAt: null } });
  }
}
```

---

## 🗑️ Soft Delete Rules

* All entities that support deletion must have a `deletedAt` field.
* Repositories must **exclude `deletedAt != null` records by default**.
* `softDelete(id)` sets `deletedAt`.
* `restore(id)` resets `deletedAt` to `null`.

---

## 🌐 API Routes Rules

* Next.js routes are **controllers only**:

  * Validate request input (`zod`).
  * Call a Use Case.
  * Return a DTO mapped to JSON.
* **No business logic in routes**.

### Example: API Route

```ts
// /app/api/tasks/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { CreateTaskUseCase } from "@/application/use-cases/create-task.usecase";
import { PrismaTaskRepository } from "@/infrastructure/prisma/prisma-task.repository";

const schema = z.object({
  title: z.string().min(1),
  projectId: z.string().uuid(),
});

export async function POST(req: Request) {
  const body = schema.parse(await req.json());

  const useCase = new CreateTaskUseCase(new PrismaTaskRepository());
  const task = await useCase.execute(body);

  return NextResponse.json({ id: task.id, title: task.title });
}
```

---

## 🧱 Patterns & Best Practices

* Use **Repository Pattern** for persistence.
* Use **Use Case Pattern** for business logic orchestration.
* Use **Domain Events** to decouple side-effects.
* Always map **Domain ↔ DTO ↔ DB** via **Mappers**.
* Follow **Dependency Injection**:

  * Application depends on interfaces, not implementations.

---

## ✅ Code Quality

* TypeScript strict mode (`noImplicitAny`, `strictNullChecks`).
* ESLint + Prettier for formatting.
* Use Husky + lint-staged for pre-commit checks.
* Keep controllers, use cases, and repositories **short and focused**.

---

## 🧪 Testing Rules

* Domain = pure unit tests (no DB).
* Use Cases = unit tests with fake repos.
* Repositories = integration tests with a test DB.
* API = E2E tests.

---

## 📌 Naming Conventions

* `*.entity.ts` → Domain entities
* `*.events.ts` → Domain events
* `*.usecase.ts` → Application use cases
* `*.repository.ts` → Repository interfaces
* `*.repository.prisma.ts` → Prisma repository adapters
* `*.mapper.ts` → Mappers (DB ↔ Domain, Domain ↔ DTO)

---

## 🚫 Forbidden

* ❌ Prisma inside Use Cases or Domain.
* ❌ Business logic inside Next.js routes.
* ❌ Direct DB queries without going through repositories.
* ❌ Instantiating dependencies inside Use Cases (must inject them).

---

## 📊 Flow Summary

**Route → UseCase → Repository → DB + Events**

1. Route validates input → calls Use Case.
2. Use Case orchestrates business logic.
3. Repository handles persistence via Prisma.
4. Events are published and handled asynchronously.

