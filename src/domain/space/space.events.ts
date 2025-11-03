/**
 * Space Domain Events
 *
 * Events emitted by the Space aggregate for event-driven architecture.
 */

export class SpaceCreatedEvent {
  public readonly eventName = 'space.created';
  public readonly occurredAt: Date;

  constructor(
    public readonly spaceId: string,
    public readonly communityId: string,
    public readonly spaceName: string
  ) {
    this.occurredAt = new Date();
  }
}

export class SpaceUpdatedEvent {
  public readonly eventName = 'space.updated';
  public readonly occurredAt: Date;

  constructor(
    public readonly spaceId: string,
    public readonly communityId: string,
    public readonly spaceName: string
  ) {
    this.occurredAt = new Date();
  }
}

export class SpaceArchivedEvent {
  public readonly eventName = 'space.archived';
  public readonly occurredAt: Date;

  constructor(
    public readonly spaceId: string,
    public readonly communityId: string
  ) {
    this.occurredAt = new Date();
  }
}
