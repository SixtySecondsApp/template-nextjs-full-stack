/**
 * Domain event emitted when a new community is created.
 */
export class CommunityCreatedEvent {
  constructor(
    public readonly communityId: string,
    public readonly name: string,
    public readonly logoUrl: string | null,
    public readonly primaryColor: string,
    public readonly ownerId: string,
    public readonly occurredAt: Date = new Date()
  ) {}
}

/**
 * Domain event emitted when a community is updated.
 */
export class CommunityUpdatedEvent {
  constructor(
    public readonly communityId: string,
    public readonly changes: {
      name?: string;
      logoUrl?: string | null;
      primaryColor?: string;
    },
    public readonly occurredAt: Date = new Date()
  ) {}
}

/**
 * Domain event emitted when a community is archived (soft deleted).
 */
export class CommunityArchivedEvent {
  constructor(
    public readonly communityId: string,
    public readonly occurredAt: Date = new Date()
  ) {}
}

/**
 * Domain event emitted when a community is restored from archived state.
 */
export class CommunityRestoredEvent {
  constructor(
    public readonly communityId: string,
    public readonly occurredAt: Date = new Date()
  ) {}
}

/**
 * Domain event emitted when community ownership is transferred.
 */
export class CommunityOwnershipTransferredEvent {
  constructor(
    public readonly communityId: string,
    public readonly previousOwnerId: string,
    public readonly newOwnerId: string,
    public readonly occurredAt: Date = new Date()
  ) {}
}
