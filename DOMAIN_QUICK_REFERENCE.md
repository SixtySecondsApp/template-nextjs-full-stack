# Domain Layer - Quick Reference Guide

## File Locations

```
src/domain/
├── shared/
│   ├── value-objects/
│   │   └── email.vo.ts               Email value object
│   └── enums/
│       ├── role.enum.ts              Role enum with helpers
│       └── ../role.enum.ts           Original Role enum
├── user/
│   ├── user.entity.ts                User aggregate root
│   └── user.events.ts                5 user domain events
└── community/
    ├── community.entity.ts           Community aggregate root
    └── community.events.ts           5 community domain events
```

---

## Email Value Object

### Import
```typescript
import { Email } from '@/domain/shared/value-objects/email.vo';
```

### Create
```typescript
const email = Email.create('user@example.com');
// Automatically: lowercase, trim, validate
```

### Methods
```typescript
email.getValue()           // Returns: string
email.equals(other)        // Returns: boolean
email.toString()           // Returns: string
```

### Validation
- RFC 5322 simplified pattern: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Max 255 characters
- Throws Error on invalid format

---

## Role Enum

### Import Options
```typescript
// Option 1: New enum with helpers
import { Role, RoleHelper } from '@/domain/shared/enums/role.enum';

// Option 2: Original with helpers (backward compatible)
import {
  Role,
  isValidRole,
  ROLE_HIERARCHY,
  hasEqualOrHigherRole
} from '@/domain/shared/role.enum';
```

### Values
```typescript
Role.OWNER       // Level 5 - Full access
Role.ADMIN       // Level 4 - Administrative access
Role.MODERATOR   // Level 3 - Moderation access
Role.MEMBER      // Level 2 - Standard member
Role.GUEST       // Level 1 - Read-only access
```

### RoleHelper Methods
```typescript
RoleHelper.hasPrivilege(Role.ADMIN, Role.MEMBER)
  // Returns: true (ADMIN >= MEMBER)

RoleHelper.isAdministrative(Role.ADMIN)
  // Returns: true

RoleHelper.isModeratorOrAbove(Role.MODERATOR)
  // Returns: true

RoleHelper.getAllRoles()
  // Returns: [OWNER, ADMIN, MODERATOR, MEMBER, GUEST]
```

### Original Helper Functions
```typescript
isValidRole('OWNER')                    // Returns: boolean
hasEqualOrHigherRole(Role.OWNER, Role.MEMBER)  // Returns: true
ROLE_HIERARCHY[Role.OWNER]              // Returns: 5
```

---

## User Entity

### Import
```typescript
import { User } from '@/domain/user/user.entity';
import { Email } from '@/domain/shared/value-objects/email.vo';
import { Role } from '@/domain/shared/enums/role.enum';
```

### Create New User
```typescript
const user = User.create({
  id: crypto.randomUUID(),
  email: Email.create('john@example.com'),
  firstName: 'John',
  lastName: 'Doe',
  role: Role.MEMBER  // Optional, defaults to MEMBER
});
```

### Reconstitute from Database
```typescript
const user = User.reconstitute({
  id: 'uuid',
  email: Email.create('john@example.com'),
  firstName: 'John',
  lastName: 'Doe',
  role: Role.MEMBER,
  avatar: null,
  bio: null,
  emailVerified: false,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
  deletedAt: null
});
```

### Update Profile
```typescript
user.updateProfile({
  firstName: 'Jonathan',
  lastName: 'Doe',
  avatar: 'https://example.com/avatar.jpg',
  bio: 'Software developer'
});
```

### Update Email
```typescript
const newEmail = Email.create('newemail@example.com');
user.updateEmail(newEmail);
// Note: Automatically resets emailVerified to false
```

### Verify Email
```typescript
user.verifyEmail();
```

### Change Role
```typescript
user.changeRole(Role.ADMIN);
// Throws if: already archived, same role, invalid role
```

### Archive/Restore
```typescript
user.archive();   // Soft delete (sets deletedAt)
user.restore();   // Restore from archive (clears deletedAt)
user.isArchived(); // Check status
```

### Get Information
```typescript
user.getId()                    // string
user.getEmail()                 // Email (value object)
user.getEmailValue()            // string
user.getFirstName()             // string
user.getLastName()              // string
user.getFullName()              // string: "John Doe"
user.getAvatar()                // string | null
user.getBio()                   // string | null
user.getRole()                  // Role enum
user.getIsEmailVerified()       // boolean
user.getCreatedAt()             // Date
user.getUpdatedAt()             // Date
user.getDeletedAt()             // Date | null
```

### Validation Rules
| Field | Rule |
|-------|------|
| id | Required |
| email | Valid format (Email VO) |
| firstName | 1-50 characters |
| lastName | 1-50 characters |
| avatar | Valid URL or null |
| bio | Max 500 characters or null |
| role | Valid Role enum |

---

## Community Entity

### Import
```typescript
import { Community } from '@/domain/community/community.entity';
import { Role } from '@/domain/shared/enums/role.enum';
```

### Create New Community
```typescript
const community = Community.create({
  id: crypto.randomUUID(),
  name: 'My Tech Community',
  logoUrl: 'https://example.com/logo.png',    // Optional
  primaryColor: '#0066CC',                      // Optional (default: #0066CC)
  ownerId: 'owner-uuid'
});
```

### Reconstitute from Database
```typescript
const community = Community.reconstitute({
  id: 'uuid',
  name: 'My Tech Community',
  logoUrl: 'https://example.com/logo.png',
  primaryColor: '#0066CC',
  ownerId: 'owner-uuid',
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
  deletedAt: null
});
```

### Update Branding
```typescript
community.updateBranding({
  name: 'Updated Community Name',
  logoUrl: 'https://example.com/new-logo.png',
  primaryColor: '#FF6B35'
});
```

### Transfer Ownership
```typescript
community.transferOwnership('new-owner-uuid');
// Throws if: already archived, same owner, invalid owner ID
```

### Archive/Restore
```typescript
community.archive();   // Soft delete
community.restore();   // Restore from archive
community.isArchived(); // Check status
```

### Get Information
```typescript
community.getId()              // string
community.getName()            // string
community.getLogoUrl()         // string | null
community.getPrimaryColor()    // string
community.getOwnerId()         // string
community.getCreatedAt()       // Date
community.getUpdatedAt()       // Date
community.getDeletedAt()       // Date | null
```

### Validation Rules
| Field | Rule |
|-------|------|
| id | Required |
| name | 3-100 chars, alphanumeric + hyphens/underscores |
| logoUrl | Valid HTTPS URL or null |
| primaryColor | Valid hex (#RGB or #RRGGBB) |
| ownerId | Non-empty string |

---

## Domain Events

### Import User Events
```typescript
import {
  UserCreatedEvent,
  UserUpdatedEvent,
  UserArchivedEvent,
  UserRestoredEvent,
  UserRoleChangedEvent
} from '@/domain/user/user.events';
```

### Import Community Events
```typescript
import {
  CommunityCreatedEvent,
  CommunityUpdatedEvent,
  CommunityArchivedEvent,
  CommunityRestoredEvent,
  CommunityOwnershipTransferredEvent
} from '@/domain/community/community.events';
```

### Create Events (in application layer)
```typescript
// User events
new UserCreatedEvent(
  userId: string,
  email: string,
  firstName: string,
  lastName: string,
  role: Role,
  emailVerified: boolean,
  occurredAt?: Date
)

new UserRoleChangedEvent(
  userId: string,
  previousRole: Role,
  newRole: Role,
  changedBy: string,
  occurredAt?: Date
)

// Community events
new CommunityCreatedEvent(
  communityId: string,
  name: string,
  logoUrl: string | null,
  primaryColor: string,
  ownerId: string,
  occurredAt?: Date
)

new CommunityOwnershipTransferredEvent(
  communityId: string,
  previousOwnerId: string,
  newOwnerId: string,
  occurredAt?: Date
)
```

### Event Properties
All events have:
- `readonly` properties (immutable)
- `occurredAt: Date` (timestamp)
- Constructor with parameters

---

## Common Patterns

### Validation Error Handling
```typescript
try {
  const email = Email.create('invalid-email');
} catch (error) {
  console.error(error.message);
  // "Invalid email format: invalid-email"
}

try {
  user.changeRole(Role.OWNER);
} catch (error) {
  console.error(error.message);
  // "New role must be different from current role"
}
```

### Working with Email
```typescript
// Create email
const email1 = Email.create('user@example.com');

// Compare emails
const email2 = Email.create('USER@EXAMPLE.COM'); // Normalized
email1.equals(email2); // true

// Get string value for storage
const emailStr = email1.getValue();
```

### Role Hierarchy
```typescript
// Check if user can access admin features
if (RoleHelper.isAdministrative(user.getRole())) {
  // User is ADMIN or OWNER
}

// Check if user can moderate
if (RoleHelper.isModeratorOrAbove(user.getRole())) {
  // User is MODERATOR, ADMIN, or OWNER
}

// Check specific privilege level
const canModerate = RoleHelper.hasPrivilege(
  user.getRole(),
  Role.MODERATOR
);
```

### Soft Delete Pattern
```typescript
// Check if entity is soft deleted
if (user.isArchived()) {
  console.log('User is archived');
}

// Archive (soft delete)
user.archive();

// Restore from archive
if (user.isArchived()) {
  user.restore();
}

// Repositories will filter:
// SELECT * FROM users WHERE deleted_at IS NULL
```

---

## Usage Example: Use Case

```typescript
import { CreateUserUseCase } from '@/application/use-cases/users/create-user.usecase';
import { User } from '@/domain/user/user.entity';
import { Email } from '@/domain/shared/value-objects/email.vo';
import { Role } from '@/domain/shared/enums/role.enum';

// In application layer use case
class CreateUserUseCase {
  execute(input: {
    email: string;
    firstName: string;
    lastName: string;
    role?: Role;
  }) {
    // Validate and create email
    const email = Email.create(input.email);

    // Create domain entity
    const user = User.create({
      id: crypto.randomUUID(),
      email,
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role ?? Role.MEMBER
    });

    // Save to repository (will be implemented in infrastructure)
    await this.userRepository.save(user);

    // Publish domain event (will be handled in infrastructure)
    this.eventBus.publish(
      new UserCreatedEvent(
        user.getId(),
        user.getEmailValue(),
        user.getFirstName(),
        user.getLastName(),
        user.getRole(),
        user.getIsEmailVerified()
      )
    );

    return user;
  }
}
```

---

## Key Design Principles

### 1. Immutability
- Email value object cannot be modified after creation
- Domain events have readonly properties
- Private fields in entities prevent direct modification

### 2. Encapsulation
- Private fields accessible only through getters
- Business logic protected within entities
- Methods enforce invariants

### 3. Separation of Concerns
- Domain logic separate from infrastructure
- No database code in entities
- No framework code in entities

### 4. Factory Pattern
- `create()` for new entities
- `reconstitute()` for loading from persistence
- Clear intent in code

### 5. Self-Documenting
- Method names describe actions (updateProfile, verifyEmail)
- Event names describe state changes (UserCreatedEvent)
- No magic numbers or strings

### 6. Type Safety
- Email value object prevents string mix-ups
- Role enum prevents invalid values
- TypeScript strict mode enabled

---

## Common Mistakes to Avoid

❌ **Don't**: Create User directly
```typescript
const user = new User(...); // Compiler error - private constructor
```

✅ **Do**: Use factory methods
```typescript
const user = User.create({...});
```

---

❌ **Don't**: Pass email as string
```typescript
const user = User.create({
  email: 'user@example.com'  // Type error
});
```

✅ **Do**: Use Email value object
```typescript
const user = User.create({
  email: Email.create('user@example.com')
});
```

---

❌ **Don't**: Modify user properties directly
```typescript
user.firstName = 'John'; // Compiler error - private field
```

✅ **Do**: Use business methods
```typescript
user.updateProfile({ firstName: 'John' });
```

---

❌ **Don't**: Use string for role
```typescript
user.changeRole('ADMIN'); // Type error
```

✅ **Do**: Use Role enum
```typescript
user.changeRole(Role.ADMIN);
```

---

## Versioning

| Version | Date | Notes |
|---------|------|-------|
| 1.0 | 2025-11-03 | Initial domain layer implementation |

---

**Last Updated**: 2025-11-03
**Status**: Complete and production-ready ✅
