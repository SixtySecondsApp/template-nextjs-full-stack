# Claude Code Rules – Next.js + Prisma + Hexagonal Architecture Template

> **This is a reference template.** All future projects should fork from this base. This file serves as an orchestrator and entry point to the detailed architectural rules.

## 📋 Project Context

**Template Identity**: Next.js Full-Stack Template with Hexagonal/Clean Architecture
**Status**: Reference template for all future projects
**Architecture**: Strict hexagonal/clean architecture with layered separation

### Technology Stack
- **Frontend**: Next.js 15.4.6 (App Router + Turbopack), React 19.1.0
- **Backend**: Next.js API Routes (controllers), Prisma 6.13.0
- **Database**: PostgreSQL
- **Language**: TypeScript 5 (strict mode)
- **State Management**: TanStack Query 5.85.0
- **Styling**: Tailwind CSS 4
- **Testing**: Vitest (unit), Playwright (E2E), Testing Library (React)

## 🏗️ Architecture Overview

This template enforces **Hexagonal Architecture (Clean Architecture)** with strict layer separation:

```
┌─────────────────────────────────────────────────────────────┐
│  Presentation Layer (Next.js App Router)                    │
│  • API Routes (thin controllers)                            │
│  • Validation (zod)                                         │
│  • HTTP response mapping                                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Application Layer                                           │
│  • Use Cases (orchestration)                                │
│  • DTOs (input/output)                                      │
│  • Mappers (Domain ↔ DTO)                                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Domain Layer                                                │
│  • Entities (business logic)                                │
│  • Value Objects                                            │
│  • Domain Events                                            │
└─────────────────────────────────────────────────────────────┘
                       ▲
                       │
┌──────────────────────┴──────────────────────────────────────┐
│  Infrastructure Layer (Adapters)                            │
│  • Prisma Repositories (implements ports)                   │
│  • Mappers (Domain ↔ Persistence)                           │
│  • Event Bus & Handlers                                     │
│  • External adapters (email, queue, etc.)                   │
└─────────────────────────────────────────────────────────────┘
```

**Dependency Flow**: `Presentation → Application → Domain ← Infrastructure (injected via ports)`

**📖 Detailed Rules**: See [.cursor/rules/00-architecture.mdc](.cursor/rules/00-architecture.mdc)

---

## 📂 Project Structure

```
/src
  /app                 # Next.js App Router (UI + API = controllers)
  /domain              # Entities, Value Objects, Domain Events
  /application
    /use-cases         # Business use cases (orchestration)
    /dto               # Input/Output DTOs
    /mappers           # Domain ↔ DTO mappers
  /ports               # Interfaces (repositories, event bus, etc.)
  /infrastructure
    /prisma            # Prisma client + repository implementations
    /mappers           # DB ↔ Domain mappers
    /events            # Event bus + event handlers
  /shared              # Errors, logger, config, utils
```

---

## 🎯 Rule Index – Context-Based Navigation

### When Working on API Routes
**📖 See**: [.cursor/rules/10-api-controllers.mdc](.cursor/rules/10-api-controllers.mdc)

- Thin controllers only (no business logic)
- Zod validation for all inputs
- Instantiate use cases with adapters
- Map errors to HTTP status codes (400/404/500)

**Example**: `src/app/api/clients/route.ts`, `src/app/api/clients/[id]/route.ts`

---

### When Working on Prisma Repositories
**📖 See**: [.cursor/rules/20-prisma-repositories.mdc](.cursor/rules/20-prisma-repositories.mdc)

- Implement interfaces from `src/ports`
- Use Persistence ↔ Domain mappers
- **Soft delete everywhere**: filter `deletedAt: null` by default
- `archive(id)` sets `deletedAt`, `restore(id)` clears it
- `delete(id)` = permanent removal only

**Example**: `src/infrastructure/prisma/client.repository.prisma.ts`

---

### When Working on Mappers
**📖 See**: [.cursor/rules/30-mappers.mdc](.cursor/rules/30-mappers.mdc)

- **Application Mappers**: Domain ↔ DTO (`*.mapper.ts` in `/application/mappers`)
- **Infrastructure Mappers**: Domain ↔ Persistence (`*.mapper.ts` in `/infrastructure/mappers`)
- **Never** expose Prisma types outside infrastructure
- Static classes with `toDto()`, `toDomain()`, `toPersistence()` methods

**Examples**:
- `src/application/mappers/client-dto.mapper.ts`
- `src/infrastructure/mappers/client-prisma.mapper.ts`

---

### When Working on Domain Events
**📖 See**: [.cursor/rules/40-events.mdc](.cursor/rules/40-events.mdc)

- Events are immutable classes (`*.events.ts`) in Domain
- Use Cases publish events via injected event bus
- Handlers in `src/infrastructure/events` (side effects only, no business logic)
- Subscribe handlers at application startup

**Examples**:
- `src/domain/client/client.events.ts`
- `src/infrastructure/events/client-created.handler.ts`

---

### When Working on the Clients Feature (Reference Example)
**📖 See**: [.cursor/rules/50-feature-clients.mdc](.cursor/rules/50-feature-clients.mdc)

- Complete feature example showing all layers
- Use Cases: Create, List, Get, Update, Archive
- Domain events: Created, Updated, Archived
- Reference pattern for new features

---

### When Handling Errors & Validation
**📖 See**: [.cursor/rules/60-errors-validation.mdc](.cursor/rules/60-errors-validation.mdc)

- Validate all inputs with `zod` (explicit schemas per route)
- Use Cases define error enums (e.g., `CreateClientUseCaseError`)
- Controllers map errors to HTTP codes:
  - `400` → validation errors, missing required fields
  - `404` → not found errors
  - `500` → internal errors (never expose DB details)

---

### When Scaffolding New Features
**📖 See**: [.cursor/rules/70-feature-generator.mdc](.cursor/rules/70-feature-generator.mdc)

**Complete step-by-step guide** for creating a new feature from scratch:
1. Domain (entity + events)
2. Ports (repository interface)
3. Infrastructure (Prisma mapper + repository)
4. Application (DTOs + mappers + use cases)
5. Presentation (API routes with validation)
6. Prisma schema update + migration
7. Event handlers

**Use this when**: Creating any new domain entity/aggregate

---

## ⚡ Core Principles (Quick Reference)

### ✅ Always Do
- **Strict layer separation** (Domain → Application → Infrastructure → Presentation)
- **Dependency injection** (Use Cases receive dependencies via constructor)
- **Mappers everywhere** (Domain ↔ DTO ↔ Persistence)
- **Soft delete by default** (`deletedAt` field on all entities)
- **Event-driven side effects** (publish domain events, handle in infrastructure)
- **UK English** in code, comments, and error messages

### ❌ Never Do
- ❌ Prisma or framework imports in Domain layer
- ❌ Business logic in API routes or repositories
- ❌ Direct Prisma queries without repositories
- ❌ Instantiate dependencies inside Use Cases
- ❌ Expose Prisma types outside Infrastructure
- ❌ Expose sensitive DB error details to clients

---

## 🔄 Standard Flow

```
API Route (controller)
  ↓ [validate input with zod]
Use Case (orchestration)
  ↓ [business logic + domain operations]
Repository (port/interface)
  ↓ [implemented by Prisma adapter]
Database (PostgreSQL)

  → Domain Events published
  → Event Handlers (side effects)
```

---

## 📝 Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Entities | `*.entity.ts` | `client.entity.ts` |
| Events | `*.events.ts` | `client.events.ts` |
| Use Cases | `*.usecase.ts` | `create-client.usecase.ts` |
| Repository Interfaces | `*.repository.ts` | In `src/ports/repositories.ts` |
| Prisma Repositories | `*.repository.prisma.ts` | `client.repository.prisma.ts` |
| Application Mappers | `*-dto.mapper.ts` | `client-dto.mapper.ts` |
| Infrastructure Mappers | `*-prisma.mapper.ts` | `client-prisma.mapper.ts` |

---

## 🧪 Testing Strategy

| Layer | Test Type | Tools | Scope |
|-------|-----------|-------|-------|
| Domain | Unit | Vitest | Pure logic, no DB |
| Use Cases | Unit | Vitest + Fakes | Fake repositories |
| Repositories | Integration | Vitest + Test DB | Real Prisma |
| API Routes | E2E | Playwright | Full HTTP flow |

---

## 🚀 Quick Start Workflow

### For Development
```bash
npm install
# Create .env.local with DATABASE_URL
npx prisma migrate dev
npm run dev
```

### For New Features
1. Read [.cursor/rules/70-feature-generator.mdc](.cursor/rules/70-feature-generator.mdc)
2. Use **Clients** feature as reference pattern
3. Follow scaffolding checklist step-by-step
4. Validate against architecture rules

---

## 📚 Additional References

- **Full Architecture Guide**: [README.md](README.md)
- **General Cursor Rules**: [cursor-rules.md](cursor-rules.md)
- **Detailed Rules**: [.cursor/rules/](.cursor/rules/)

---

## 🎓 For Claude Code

**When generating or modifying code:**

1. **Always check** the relevant `.cursor/rules/*.mdc` file first
2. **Use the Clients feature** as reference implementation
3. **Follow the layer separation** strictly
4. **Apply mappers** at every boundary
5. **Validate** against the forbidden practices list

**Quick Decision Tree:**
- Creating a new feature? → Rule 70
- Working on API routes? → Rule 10
- Implementing repositories? → Rule 20
- Building mappers? → Rule 30
- Publishing events? → Rule 40
- Handling errors? → Rule 60
- Need architecture overview? → Rule 00

---

**Last Updated**: 2025-10-14
**Template Version**: 0.1.0
