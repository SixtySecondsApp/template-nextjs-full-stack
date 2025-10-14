# 📚 Next.js + Prisma Template – Architecture, Structure & Best Practice Guide

> This repository is a reference template. All future projects should be started from a fork of this base. This guide unifies architecture, conventions, and the development workflow.

## 1) Objectives and Principles

- **Strict separation of concerns**, following **Hexagonal/Clean Architecture**.
- **Quality and maintainability**: typed code (TypeScript), testable, scalable.
- **DX & performance**: clear conventions, thin controllers, data access via ports/adapters.

## 2) Quick Start

1. Prerequisites: Node.js 18+ and npm.
2. Installation:
   ```bash
   npm install
   ```
3. Environment variables:
   - Create `.env.local` (not versioned) and set `DATABASE_URL`.
   ```
   DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
   ```
4. Prisma migrations (run manually):
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## 3) Hexagonal Architecture

Layer | Role | Key Rules
---|---|---
**Domain** | Entities, Value Objects, Domain Events | No framework/DB imports. Business invariants only.
**Application** | Use Cases (orchestrators) | Depends on interfaces (ports), publishes events.
**Infrastructure** | Adapters (Prisma, event bus, mappers) | Implements ports, no business logic.
**Presentation (Next.js App Router)** | Routes/API = thin controllers | Validate, call Use Case, return DTO.

Dependency constraints: `Presentation → Application → Domain`, and `Infrastructure` injected into `Application` via interfaces.

### Standard flow

```
Route (API) → Use Case → Repository (port) → Prisma Adapter → DB
                       ↘ publishes Event → Handlers (side-effects)
```

### Recommended structure

```
/src
  /app                 # Next.js App Router (UI + API = controllers)
  /domain              # Entities, Value Objects, Domain Events
  /application
    /use-cases         # Use Cases (orchestration services)
    /dto               # Input/Output DTOs
    /mappers           # Domain ↔ DTO mappers
  /ports               # Interfaces (repos, event bus, etc.)
  /infrastructure
    /prisma            # Prisma client + repository implementations
    /mappers           # DB ↔ Domain mappers
    /events            # Event bus + handlers
  /shared              # Errors, logger, config, utils
```

## 4) Essential Rules

- **No business logic** in Next.js routes or Prisma repositories.
- **Dependency injection**: Use Cases receive `repositories`, `eventBus` via constructor.
- **Mappers everywhere**: Domain ↔ DTO (application), Domain ↔ Persistence (infra). No Prisma type ever exposed outside infra.
- **Soft delete everywhere**: use a `deletedAt` field; reads default to filtering `deletedAt: null`; dedicated `archive(id)`/`restore(id)` methods; `delete(id)` = permanent removal.
- **Errors/validation**: input validated via `zod`; Use Cases define error enums; controllers map to HTTP (400/404/500) without leaking sensitive info.

## 5) API Controllers (Next.js Route Handlers)

- Validate input (zod), instantiate the Use Case with its adapters, return a JSON DTO.
- Map application errors to HTTP: 400 (validation/missing id), 404 (not found), 500 (default).

Minimal example:
```ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { CreateXUseCase } from "@/application/use-cases/xs/create-x.usecase";
import { XRepositoryPrisma } from "@/infrastructure/prisma/x.repository.prisma";
import { eventBus } from "@/infrastructure/events/simple-event-bus";

const schema = z.object({ name: z.string().min(1) });

export async function POST(request: NextRequest) {
  const data = schema.parse(await request.json());
  const useCase = new CreateXUseCase(new XRepositoryPrisma(), eventBus.publish.bind(eventBus));
  const dto = await useCase.execute(data);
  return NextResponse.json({ success: true, data: dto });
}
```

## 6) Prisma Repositories & Soft Delete

- Implement the interfaces defined in `src/ports`.
- Use infrastructure mappers: `toDomain(raw)`/`toPersistence(entity)`.
- Default to filtering `deletedAt: null` on reads. Provide dedicated `archive(id)`/`restore(id)` methods, and `delete(id)` for permanent removal.

## 7) Domain Events & Event Bus

- Use Cases publish immutable events (classes `*.events.ts`).
- Handlers (`src/infrastructure/events`) take care of side effects (logs, emails, analytics) without any business logic.

## 8) Naming Conventions

- `*.entity.ts` (entities), `*.events.ts` (events), `*.usecase.ts` (use cases),
  `*.repository.ts` (interfaces), `*.repository.prisma.ts` (Prisma adapters), `*.mapper.ts` (mappers).

## 9) Tests

- Domain: pure unit tests (no DB).
- Use Cases: unit tests with fake repositories.
- Repositories: integration tests (test DB).
- API: E2E.

## 10) Team Workflow

- Branches: `main` for production; development on `feat/...` and `fix/...`.
- Pull requests mandatory to `main` with self-review beforehand.
- Secrets in `.env.local` and on the hosting platform.

## 11) Useful Scripts

- `npm run dev` – Next.js dev server
- `npm run build` – production build
- `npm run start` – production start
- `npm run lint` – ESLint

Prisma (manual):
- `npx prisma migrate dev` – create/apply a migration (local/dev)
- `npx prisma generate` – regenerate Prisma client
- `npx prisma studio` – local data UI
- `npx prisma db push` – push schema (no migration, avoid in production)

## 12) Adding a New Feature (Checklist)

1. Domain: create the entity `X` and `XCreated/Updated/Archived.events.ts`.
2. Ports: add `IXRepository` in `src/ports`.
3. Infra: `XPrismaMapper` and `XRepositoryPrisma` (default to soft delete).
4. Application: DTOs + mappers, Use Cases (create/list/get/update/archive) + error enums, event publication.
5. API: routes `GET/POST /api/xs` and `GET/PATCH/DELETE /api/xs/[id]` with zod + error mapping.
6. (If needed) Prisma: update `prisma/schema.prisma` and create a migration.
7. Simple event handlers (log/notify) in `src/infrastructure/events`.

Tip: Follow the "Feature Generator" guide (`.cursor/rules/70-feature-generator.mdc`) for step-by-step scaffolding.

## 13) Notes on Server Components / Server Actions

To preserve separation of concerns in this template:
- **No business logic** or direct Prisma access in Server Components or Server Actions.
- Always prefer: Route Handler (thin controller) → Use Case → Repository (port) → Prisma Adapter.

## 14) Security & Quality

- TypeScript strict, ESLint enabled, controllers short, focused Use Cases.
- Never expose sensitive DB error details to the client.
- Log business events centrally.

---

This guide is the single source of truth for architecture, structure, and best practices for all projects derived from this template.