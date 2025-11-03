/**
 * Channel Domain Events
 *
 * Events emitted by the Channel aggregate for event-driven architecture.
 */

export class ChannelCreatedEvent {
  public readonly eventName = 'channel.created';
  public readonly occurredAt: Date;

  constructor(
    public readonly channelId: string,
    public readonly communityId: string,
    public readonly channelName: string
  ) {
    this.occurredAt = new Date();
  }
}

export class ChannelUpdatedEvent {
  public readonly eventName = 'channel.updated';
  public readonly occurredAt: Date;

  constructor(
    public readonly channelId: string,
    public readonly communityId: string,
    public readonly channelName: string
  ) {
    this.occurredAt = new Date();
  }
}

export class ChannelArchivedEvent {
  public readonly eventName = 'channel.archived';
  public readonly occurredAt: Date;

  constructor(
    public readonly channelId: string,
    public readonly communityId: string
  ) {
    this.occurredAt = new Date();
  }
}
