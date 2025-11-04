# Sixty Community Dashboard Documentation

Complete documentation for the Sixty Community admin dashboard (Phases 6.2, 6.3, and 6.4).

## 📚 Documentation Index

### Phase Summaries

Detailed summaries of each development phase:

- **[Phase 6.2: Layout & Navigation](./phases/phase-6.2-summary.md)** ⚠️ Planned
  - Dashboard sidebar with responsive navigation
  - Top bar with actions
  - Mobile off-canvas sidebar
  - 11 components planned

- **[Phase 6.3: Home Tab & Metrics](./phases/phase-6.3-summary.md)** ✅ Completed
  - Metrics cards with trend indicators
  - Activity graph with Chart.js
  - Recent activity feed
  - Pending tasks and quick actions
  - Welcome banner with setup checklist
  - 13 components + 2 API routes implemented

- **[Phase 6.4: Members, Content & Analytics](./phases/phase-6.4-summary.md)** ⚠️ Partially Implemented
  - Members management table
  - Content moderation list
  - Analytics dashboards
  - 2 API routes implemented, UI components planned

### Technical Documentation

#### Architecture & Design
- **[Dashboard Architecture](./architecture/dashboard-architecture.md)**
  - Hexagonal Architecture overview
  - Layer responsibilities and rules
  - Data flow diagrams
  - State management patterns
  - Testing strategy by layer

#### API Documentation
- **[Dashboard API Routes](./api/dashboard.md)**
  - Authentication and caching strategy
  - GET /api/dashboard/metrics
  - GET /api/dashboard/activity
  - GET /api/members
  - GET /api/content/posts
  - Error handling and response formats
  - Usage examples with cURL and TypeScript

#### Component Documentation
- **[Dashboard Components](../src/components/dashboard/README.md)**
  - Complete component catalog (35+ components)
  - Component hierarchy and structure
  - Props and usage examples
  - Styling guidelines
  - Accessibility features
  - Testing patterns

### Development Guides

#### Getting Started
- **[Development Guide](./development/dashboard-guide.md)**
  - Project setup and installation
  - Adding new dashboard tabs
  - Component patterns (server vs client)
  - API development workflow
  - Styling with Tailwind CSS
  - Database operations with Prisma
  - Performance best practices

#### Quality Assurance
- **[Testing Guide](./testing/dashboard-tests.md)**
  - Testing pyramid and strategy
  - Unit testing (Jest + Testing Library)
  - Integration testing (Prisma repositories)
  - E2E testing (Playwright)
  - Accessibility testing
  - Test coverage goals (80% unit, 70% integration)

#### Deployment
- **[Deployment Guide](./deployment/dashboard-deployment.md)**
  - Vercel deployment setup
  - Railway PostgreSQL configuration
  - Environment variables
  - Database migrations in production
  - Performance optimizations
  - Monitoring and observability
  - Rollback strategies

#### Troubleshooting
- **[Troubleshooting Guide](./troubleshooting/dashboard-issues.md)**
  - Authentication issues
  - Data loading problems
  - UI/UX issues (dark mode, responsive, charts)
  - Performance issues
  - Build and deployment failures
  - Database connection problems
  - Debug checklist

## 🗂️ Documentation Structure

```
docs/
├── README.md                           # This file
├── CHANGELOG.md                        # Version history
│
├── phases/                             # Phase summaries
│   ├── phase-6.2-summary.md           # Layout & Navigation (planned)
│   ├── phase-6.3-summary.md           # Home Tab & Metrics (complete)
│   └── phase-6.4-summary.md           # Members & Content (partial)
│
├── architecture/                       # Architecture documentation
│   └── dashboard-architecture.md      # Hexagonal Architecture
│
├── api/                                # API documentation
│   └── dashboard.md                   # All dashboard API routes
│
├── development/                        # Development guides
│   └── dashboard-guide.md             # Development workflow
│
├── testing/                            # Testing guides
│   └── dashboard-tests.md             # Testing strategy
│
├── deployment/                         # Deployment guides
│   └── dashboard-deployment.md        # Production deployment
│
└── troubleshooting/                    # Troubleshooting
    └── dashboard-issues.md            # Common issues & solutions
```

## 🚀 Quick Start

### For Developers

1. **Understand the Architecture**
   - Read [Dashboard Architecture](./architecture/dashboard-architecture.md)
   - Review [Phase 6.3 Summary](./phases/phase-6.3-summary.md) for implemented features

2. **Set Up Development Environment**
   - Follow [Development Guide](./development/dashboard-guide.md)
   - Install dependencies: `npm install`
   - Run dev server: `npm run dev`

3. **Explore Components**
   - Review [Component Documentation](../src/components/dashboard/README.md)
   - Check [API Documentation](./api/dashboard.md) for data contracts

4. **Write Tests**
   - Follow [Testing Guide](./testing/dashboard-tests.md)
   - Run tests: `npm test`

### For DevOps

1. **Deployment Setup**
   - Follow [Deployment Guide](./deployment/dashboard-deployment.md)
   - Configure environment variables
   - Set up Vercel + Railway

2. **Monitoring**
   - Configure error tracking (Sentry)
   - Set up analytics (Vercel Analytics)
   - Enable health checks

3. **Troubleshooting**
   - Refer to [Troubleshooting Guide](./troubleshooting/dashboard-issues.md)
   - Check build logs and function logs

## 📊 Implementation Status

| Phase | Components | API Routes | Status |
|-------|-----------|------------|--------|
| Phase 6.2 | 0/11 | 0/0 | ⚠️ Planned |
| Phase 6.3 | 13/13 | 2/2 | ✅ Complete |
| Phase 6.4 | 0/10 | 2/2 | ⚠️ Partial |
| **Total** | **13/34** | **4/6** | **38% Complete** |

### Completed Features ✅

**Phase 6.3 (Home Tab)**:
- Metrics cards with trend visualization
- Activity graph with time filters
- Recent activity feed
- Pending tasks with urgency indicators
- Quick actions grid
- Welcome banner with setup checklist
- Recommended resources
- API routes for metrics and activity

**Phase 6.4 (Partial)**:
- Members API with pagination and filters
- Content API with pagination and filters

### Planned Features ⚠️

**Phase 6.2 (Layout)**:
- Dashboard sidebar (11 components)
- Top bar navigation
- Mobile responsive navigation

**Phase 6.4 (Completion)**:
- MembersTable UI component
- ContentList UI component
- AnalyticsOverview dashboard
- Bulk actions and export

## 🎯 Architecture Highlights

### Hexagonal Architecture Layers

```
┌─────────────────────────────────────┐
│       Presentation Layer            │  ← Next.js API Routes + React Components
│  (API Routes, React Components)     │     Thin controllers, validation only
└──────────────┬──────────────────────┘
               │ Uses DTOs only
┌──────────────▼──────────────────────┐
│       Application Layer             │  ← Use Cases, DTOs, Mappers
│    (Use Cases, DTOs, Mappers)       │     Business logic orchestration
└──────────────┬──────────────────────┘
               │ Depends on Ports
┌──────────────▼──────────────────────┐
│      Infrastructure Layer           │  ← Prisma Repositories
│  (Repositories, Prisma, External)   │     Database access, external services
└──────────────┬──────────────────────┘
               │ Implements Ports
┌──────────────▼──────────────────────┐
│         Domain Layer                │  ← Pure Business Logic
│     (Entities, Value Objects)       │     Zero dependencies, pure TypeScript
└─────────────────────────────────────┘
```

### Key Principles

- **Dependency Inversion**: Inner layers never depend on outer layers
- **DTO Boundary**: API routes return DTOs, never domain entities
- **Thin Controllers**: API routes validate and delegate to use cases
- **Repository Pattern**: Database access abstracted behind interfaces
- **Soft Delete**: All queries filter `deletedAt: null`

## 🔗 External Resources

### Frameworks & Tools
- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Clerk Authentication](https://clerk.com/docs)

### Architecture Patterns
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)

### Testing
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/docs/)
- [Playwright Documentation](https://playwright.dev/docs/intro)

## 📝 Contributing

When adding documentation:

1. **Follow Markdown Standards**
   - Use GitHub-flavored Markdown
   - Include table of contents for long documents
   - Use code blocks with language hints

2. **Include Examples**
   - Provide working code examples
   - Show both correct and incorrect patterns
   - Add comments explaining key concepts

3. **Add Diagrams**
   - Use Mermaid for architecture diagrams
   - Keep diagrams simple and focused
   - Include diagram source in code blocks

4. **Cross-Reference**
   - Link to related documentation
   - Reference specific sections
   - Keep navigation easy

5. **Update Index**
   - Add new docs to this README
   - Update phase summaries as needed
   - Keep implementation status current

## 📅 Last Updated

- **Phase 6.2 Documentation**: 2025-11-04 (Planned)
- **Phase 6.3 Documentation**: 2025-11-04 (Complete)
- **Phase 6.4 Documentation**: 2025-11-04 (Partial)
- **Architecture Documentation**: 2025-11-04
- **API Documentation**: 2025-11-04
- **Development Guide**: 2025-11-04
- **Testing Guide**: 2025-11-04
- **Deployment Guide**: 2025-11-04
- **Troubleshooting Guide**: 2025-11-04
- **CHANGELOG**: 2025-11-04

## 🤝 Support

For questions or issues:

1. Check [Troubleshooting Guide](./troubleshooting/dashboard-issues.md)
2. Review relevant phase summary documentation
3. Search [GitHub Issues](https://github.com/your-repo/issues)
4. Contact the development team

---

**Documentation Version**: 1.0.0
**Project Version**: 0.3.0 (Phase 6.4 Partial)
**Maintained By**: Sixty Community Development Team
