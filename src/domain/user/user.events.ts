import { Role } from "../shared/role.enum";

/**
 * Domain event emitted when a new user is created.
 */
export class UserCreatedEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly name: string | null,
    public readonly role: Role,
    public readonly communityId: string,
    public readonly occurredAt: Date = new Date()
  ) {}
}

/**
 * Domain event emitted when a user is updated.
 */
export class UserUpdatedEvent {
  constructor(
    public readonly userId: string,
    public readonly changes: {
      name?: string | null;
      email?: string;
      role?: Role;
      avatarUrl?: string | null;
    },
    public readonly occurredAt: Date = new Date()
  ) {}
}

/**
 * Domain event emitted when a user is archived (soft deleted).
 */
export class UserArchivedEvent {
  constructor(
    public readonly userId: string,
    public readonly occurredAt: Date = new Date()
  ) {}
}

/**
 * Domain event emitted when a user is restored from archived state.
 */
export class UserRestoredEvent {
  constructor(
    public readonly userId: string,
    public readonly occurredAt: Date = new Date()
  ) {}
}

/**
 * Domain event emitted when a user's role is changed.
 * This is a specialized event that provides more context than UserUpdatedEvent.
 */
export class UserRoleChangedEvent {
  constructor(
    public readonly userId: string,
    public readonly previousRole: Role,
    public readonly newRole: Role,
    public readonly changedBy: string,
    public readonly occurredAt: Date = new Date()
  ) {}
}
