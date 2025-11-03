# Phase 1: Foundation - Architecture Diagram

## Domain Layer Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                        DOMAIN LAYER                              │
│                  (Pure Business Logic)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    SHARED CONCEPTS                        │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                           │  │
│  │  VALUE OBJECTS:                  ENUMS:                  │  │
│  │  ┌─────────────────────┐         ┌──────────────────┐   │  │
│  │  │ Email               │         │ Role             │   │  │
│  │  ├─────────────────────┤         ├──────────────────┤   │  │
│  │  │ - value: string     │         │ OWNER (5)        │   │  │
│  │  │ - validate()        │         │ ADMIN (4)        │   │  │
│  │  │ - getValue()        │         │ MODERATOR (3)    │   │  │
│  │  │ - equals()          │         │ MEMBER (2)       │   │  │
│  │  │ - toString()        │         │ GUEST (1)        │   │  │
│  │  └─────────────────────┘         └──────────────────┘   │  │
│  │                                                           │  │
│  │  RoleHelper:                                              │  │
│  │  - hasPrivilege()                                         │  │
│  │  - isAdministrative()                                     │  │
│  │  - isModeratorOrAbove()                                   │  │
│  │  - getAllRoles()                                          │  │
│  │                                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────┐        ┌──────────────────────┐       │
│  │   USER AGGREGATE     │        │ COMMUNITY AGGREGATE  │       │
│  ├──────────────────────┤        ├──────────────────────┤       │
│  │ ENTITY:              │        │ ENTITY:              │       │
│  │ ┌─────────────────┐  │        │ ┌────────────────┐   │       │
│  │ │ User            │  │        │ │ Community      │   │       │
│  │ ├─────────────────┤  │        │ ├────────────────┤   │       │
│  │ │ - id            │  │        │ │ - id           │   │       │
│  │ │ - email: Email  │  │        │ │ - name         │   │       │
│  │ │ - firstName     │  │        │ │ - logoUrl      │   │       │
│  │ │ - lastName      │  │        │ │ - primaryColor │   │       │
│  │ │ - avatar        │  │        │ │ - ownerId      │   │       │
│  │ │ - bio           │  │        │ │ - createdAt    │   │       │
│  │ │ - role: Role    │  │        │ │ - updatedAt    │   │       │
│  │ │ - emailVerified │  │        │ │ - deletedAt    │   │       │
│  │ │ - createdAt     │  │        │ └────────────────┘   │       │
│  │ │ - updatedAt     │  │        │                      │       │
│  │ │ - deletedAt     │  │        │ METHODS:             │       │
│  │ └─────────────────┘  │        │ - create()           │       │
│  │                      │        │ - updateBranding()   │       │
│  │ METHODS:             │        │ - transferOwnership()│       │
│  │ - create()           │        │ - archive()          │       │
│  │ - updateProfile()    │        │ - restore()          │       │
│  │ - updateEmail()      │        │ - isArchived()       │       │
│  │ - verifyEmail()      │        │ - getters...         │       │
│  │ - changeRole()       │        │                      │       │
│  │ - archive()          │        │ VALIDATION:          │       │
│  │ - restore()          │        │ - name (3-100 chars) │       │
│  │ - getters...         │        │ - logoUrl (HTTP/S)   │       │
│  │                      │        │ - color (hex)        │       │
│  │ VALIDATION:          │        │ - ownerId (required) │       │
│  │ - email (Email VO)   │        └────────────────────┘        │
│  │ - firstName (1-50)   │                                       │
│  │ - lastName (1-50)    │        INVARIANTS:                   │
│  │ - bio (max 500)      │        ✓ Cannot modify archived      │
│  │ - role (Role enum)   │        ✓ Must have owner             │
│  │                      │        ✓ Valid branding              │
│  │ INVARIANTS:          │                                       │
│  │ ✓ Cannot modify      │                                       │
│  │   when archived      │                                       │
│  │ ✓ Valid email        │                                       │
│  │ ✓ Valid role         │                                       │
│  │                      │                                       │
│  └──────────────────────┘                                       │
│                                                                   │
│  DOMAIN EVENTS:                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ USER EVENTS:             COMMUNITY EVENTS:              │   │
│  │ - UserCreatedEvent       - CommunityCreatedEvent        │   │
│  │ - UserUpdatedEvent       - CommunityUpdatedEvent        │   │
│  │ - UserArchivedEvent      - CommunityArchivedEvent       │   │
│  │ - UserRestoredEvent      - CommunityRestoredEvent       │   │
│  │ - UserRoleChangedEvent   - CommunityOwnershipTransfer..│   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  All events are:                                                │
│  - Immutable (readonly properties)                             │
│  - Timestamped (occurredAt)                                    │
│  - Self-documenting (event names describe domain actions)      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Entity Relationships

```
┌──────────────────┐        ┌──────────────────┐
│   Community      │   1:M  │      User        │
├──────────────────┤◄──────►├──────────────────┤
│ id               │        │ id               │
│ name             │        │ email            │
│ ownerId ─────────┼────────┤ firstName        │
│ logoUrl          │        │ lastName         │
│ primaryColor     │        │ role             │
│ createdAt        │        │ createdAt        │
│ updatedAt        │        │ updatedAt        │
│ deletedAt        │        │ deletedAt        │
└──────────────────┘        └──────────────────┘
     (Aggregate)                 (Aggregate)
    * Manages own state         * Belongs to community
    * Owns users               * Can have roles
    * Transfer ownership       * Can be archived
```

---

## Soft Delete Pattern

```
User/Community Lifecycle:

┌─────────────┐
│  Created    │  deletedAt = null
│  Active     │  (Normal state)
└──────┬──────┘
       │ .archive()
       ▼
┌─────────────┐
│  Archived   │  deletedAt = new Date()
│  (Soft Del) │  (Hidden from queries)
└──────┬──────┘
       │ .restore()
       ▼
┌─────────────┐
│  Restored   │  deletedAt = null
│  Active     │  (Back to normal)
└─────────────┘

Repository Behavior:
- findById(id) → WHERE id = ? AND deletedAt IS NULL
- findAll() → WHERE deletedAt IS NULL
- archive(id) → UPDATE deletedAt = NOW()
- restore(id) → UPDATE deletedAt = NULL
- delete(id) → HARD DELETE (rare, use sparingly)
```

---

## Invariant Validation

### User Entity Invariants

```
User Creation:
1. ✓ Email must be valid format
2. ✓ First name must be 1-50 characters
3. ✓ Last name must be 1-50 characters
4. ✓ Role must be valid enum value

User Updates:
5. ✓ Cannot update if archived
6. ✓ All field validations apply on update
7. ✓ Email change resets verification

User State:
8. ✓ Can only be archived once
9. ✓ Can only be restored if archived
10. ✓ Role cannot be same as current
```

### Community Entity Invariants

```
Community Creation:
1. ✓ Name must be 3-100 alphanumeric (+hyphen/underscore)
2. ✓ Logo URL must be valid HTTP/HTTPS (if provided)
3. ✓ Primary color must be valid hex (#RGB or #RRGGBB)
4. ✓ Owner ID must be non-empty

Community Updates:
5. ✓ Cannot update if archived
6. ✓ All field validations apply on update

Community Ownership:
7. ✓ New owner must be different from current
8. ✓ Cannot transfer if archived

Community State:
9. ✓ Can only be archived once
10. ✓ Can only be restored if archived
```

---

## Value Object: Email

```
Email Value Object Design:

create('test@example.com')
    │
    ├─ toLowerCase()
    ├─ trim()
    ├─ validate()
    │   ├─ Check format: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    │   └─ Throw if invalid
    │
    └─► new Email(value)
            ├─ Immutable (readonly value)
            └─ Cannot be modified after creation

Usage:
    const email = Email.create('user@example.com')
    email.getValue() // Returns the string value
    email.equals(otherEmail) // Compare emails
    email.toString() // Convert to string
```

---

## Factory Methods Pattern

### User.create() - For New Users

```typescript
User.create({
  id: 'uuid',
  email: Email.create('user@example.com'),
  firstName: 'John',
  lastName: 'Doe',
  role: Role.MEMBER  // Optional, defaults to MEMBER
})

Returns: User instance
- createdAt = new Date()
- updatedAt = new Date()
- deletedAt = null
- avatar = null
- bio = null
- emailVerified = false
```

### User.reconstitute() - For Loading from DB

```typescript
User.reconstitute({
  id: 'uuid',
  email: 'user@example.com',  // String from DB
  firstName: 'John',
  lastName: 'Doe',
  role: Role.MEMBER,
  avatar: null,
  bio: null,
  emailVerified: false,
  createdAt: Date,
  updatedAt: Date,
  deletedAt: null
})

Returns: User instance with full state from persistence
Note: Only used by mappers in infrastructure layer
```

---

## Type Safety

```
Strict Type Coverage:
┌────────────────────────────────────┐
│ Email Value Object                 │
├────────────────────────────────────┤
│ create(email: string): Email       │
│ getValue(): string                 │
│ equals(other: Email): boolean      │
│ toString(): string                 │
│                                    │
│ • Immutable after creation         │
│ • Self-validating                  │
│ • No null values                   │
└────────────────────────────────────┘

Role Enum + Helpers:
┌────────────────────────────────────┐
│ enum Role { OWNER, ADMIN, ... }    │
├────────────────────────────────────┤
│ RoleHelper.hasPrivilege()          │
│ RoleHelper.isAdministrative()      │
│ RoleHelper.isModeratorOrAbove()    │
│                                    │
│ • Type-safe role comparison        │
│ • Hierarchy enforced               │
│ • No magic strings                 │
└────────────────────────────────────┘

User Entity:
┌────────────────────────────────────┐
│ Private fields with getters        │
├────────────────────────────────────┤
│ private email: Email               │
│ getEmail(): Email                  │
│                                    │
│ • Encapsulation                    │
│ • Cannot be modified externally    │
│ • Business logic protected         │
└────────────────────────────────────┘
```

---

## Ready for Next Phases

This Phase 1 foundation provides:

✅ **Type-Safe Domain Model**
- Email value object with validation
- Role enum with hierarchy helpers
- User and Community aggregates
- Proper encapsulation and immutability

✅ **Event-Driven Architecture**
- 5 user domain events
- 5 community domain events
- Ready for event publication in application layer

✅ **Soft Delete Support**
- deletedAt fields on all aggregates
- archive() and restore() methods
- isArchived() checks
- Repositories will filter deleted by default

✅ **Factory Pattern**
- create() for new entities
- reconstitute() for loading from DB
- Separation of concerns

**Next: Phase 2 - Application Layer (Use Cases)**
