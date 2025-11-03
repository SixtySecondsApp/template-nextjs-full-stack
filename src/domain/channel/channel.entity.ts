/**
 * Channel Entity - Domain Layer
 *
 * Represents a discussion channel within a space or community.
 * Supports three permission levels: PUBLIC, MEMBERS_ONLY, TIER_GATED.
 *
 * Business Rules:
 * - Channel must belong to either a space or directly to a community
 * - Channel name must be between 1-100 characters
 * - Description max 500 characters
 * - Permission levels control access (public, members-only, tier-gated)
 * - Tier-gated channels require specific payment tier
 * - Soft delete support (archive/restore)
 */

import { ChannelCreatedEvent, ChannelUpdatedEvent, ChannelArchivedEvent } from './channel.events';
import { ChannelPermission } from './channel.types';

export interface CreateChannelInput {
  id: string;
  communityId: string;
  spaceId?: string | null;
  name: string;
  description: string;
  permission: ChannelPermission;
  requiredTierId?: string | null;
  icon?: string | null;
  position?: number;
  createdBy: string;
}

export class Channel {
  private constructor(
    private readonly id: string,
    private readonly communityId: string,
    private readonly spaceId: string | null,
    private name: string,
    private description: string,
    private permission: ChannelPermission,
    private requiredTierId: string | null,
    private icon: string | null,
    private position: number,
    private readonly createdBy: string,
    private readonly createdAt: Date,
    private updatedAt: Date,
    private deletedAt: Date | null = null
  ) {
    this.validateName(name);
    this.validateDescription(description);
    this.validatePermission(permission, requiredTierId);
    this.validatePosition(position);
  }

  /**
   * Factory method to create a new Channel
   */
  public static create(input: CreateChannelInput): Channel {
    const now = new Date();
    const channel = new Channel(
      input.id,
      input.communityId,
      input.spaceId ?? null,
      input.name,
      input.description,
      input.permission,
      input.requiredTierId ?? null,
      input.icon ?? null,
      input.position ?? 0,
      input.createdBy,
      now,
      now,
      null
    );

    // Emit domain event
    // EventBus.publish(new ChannelCreatedEvent(channel.getId(), channel.getCommunityId(), channel.getName()));

    return channel;
  }

  /**
   * Factory method to reconstitute from persistence
   */
  public static reconstitute(
    id: string,
    communityId: string,
    spaceId: string | null,
    name: string,
    description: string,
    permission: ChannelPermission,
    requiredTierId: string | null,
    icon: string | null,
    position: number,
    createdBy: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null
  ): Channel {
    return new Channel(
      id,
      communityId,
      spaceId,
      name,
      description,
      permission,
      requiredTierId,
      icon,
      position,
      createdBy,
      createdAt,
      updatedAt,
      deletedAt
    );
  }

  // ========== Validation Methods ==========

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Channel name cannot be empty');
    }
    if (name.length > 100) {
      throw new Error('Channel name cannot exceed 100 characters');
    }
  }

  private validateDescription(description: string): void {
    if (description.length > 500) {
      throw new Error('Channel description cannot exceed 500 characters');
    }
  }

  private validatePermission(permission: ChannelPermission, requiredTierId: string | null): void {
    const validPermissions: ChannelPermission[] = ['PUBLIC', 'MEMBERS_ONLY', 'TIER_GATED'];
    if (!validPermissions.includes(permission)) {
      throw new Error('Invalid channel permission');
    }

    // Tier-gated channels must have a required tier
    if (permission === 'TIER_GATED' && !requiredTierId) {
      throw new Error('Tier-gated channels must specify a required tier');
    }

    // Non-tier-gated channels should not have a required tier
    if (permission !== 'TIER_GATED' && requiredTierId) {
      throw new Error('Only tier-gated channels can have a required tier');
    }
  }

  private validatePosition(position: number): void {
    if (position < 0) {
      throw new Error('Channel position cannot be negative');
    }
  }

  private ensureNotArchived(): void {
    if (this.deletedAt !== null) {
      throw new Error('Cannot modify archived channel');
    }
  }

  // ========== Business Logic Methods ==========

  /**
   * Update channel details
   */
  public updateDetails(name: string, description: string): void {
    this.ensureNotArchived();
    this.validateName(name);
    this.validateDescription(description);

    this.name = name;
    this.description = description;
    this.updatedAt = new Date();

    // EventBus.publish(new ChannelUpdatedEvent(this.id, this.communityId, this.name));
  }

  /**
   * Update channel permission level
   */
  public updatePermission(permission: ChannelPermission, requiredTierId: string | null): void {
    this.ensureNotArchived();
    this.validatePermission(permission, requiredTierId);

    this.permission = permission;
    this.requiredTierId = requiredTierId;
    this.updatedAt = new Date();
  }

  /**
   * Update channel appearance (icon)
   */
  public updateIcon(icon: string | null): void {
    this.ensureNotArchived();
    this.icon = icon;
    this.updatedAt = new Date();
  }

  /**
   * Update channel position for ordering
   */
  public updatePosition(position: number): void {
    this.ensureNotArchived();
    this.validatePosition(position);
    this.position = position;
    this.updatedAt = new Date();
  }

  /**
   * Check if channel is public (accessible to all)
   */
  public isPublic(): boolean {
    return this.permission === 'PUBLIC';
  }

  /**
   * Check if channel is members-only
   */
  public isMembersOnly(): boolean {
    return this.permission === 'MEMBERS_ONLY';
  }

  /**
   * Check if channel is tier-gated (requires payment tier)
   */
  public isTierGated(): boolean {
    return this.permission === 'TIER_GATED';
  }

  /**
   * Check if user has access based on their tier
   * @param userTierId - The user's current payment tier ID (or null if free)
   */
  public hasAccess(userTierId: string | null): boolean {
    if (this.isPublic()) {
      return true;
    }

    if (this.isMembersOnly()) {
      // Members-only requires at least being a member (logged in)
      return true;
    }

    if (this.isTierGated()) {
      // Tier-gated requires matching tier
      return userTierId === this.requiredTierId;
    }

    return false;
  }

  /**
   * Check if channel belongs to a space
   */
  public belongsToSpace(): boolean {
    return this.spaceId !== null;
  }

  /**
   * Check if channel is standalone (not in a space)
   */
  public isStandalone(): boolean {
    return this.spaceId === null;
  }

  /**
   * Archive (soft delete) the channel
   */
  public archive(): void {
    if (this.deletedAt !== null) {
      throw new Error('Channel is already archived');
    }

    this.deletedAt = new Date();
    this.updatedAt = new Date();

    // EventBus.publish(new ChannelArchivedEvent(this.id, this.communityId));
  }

  /**
   * Restore archived channel
   */
  public restore(): void {
    if (this.deletedAt === null) {
      throw new Error('Channel is not archived');
    }

    this.deletedAt = null;
    this.updatedAt = new Date();
  }

  /**
   * Check if channel is archived
   */
  public isArchived(): boolean {
    return this.deletedAt !== null;
  }

  // ========== Getters ==========

  public getId(): string {
    return this.id;
  }

  public getCommunityId(): string {
    return this.communityId;
  }

  public getSpaceId(): string | null {
    return this.spaceId;
  }

  public getName(): string {
    return this.name;
  }

  public getDescription(): string {
    return this.description;
  }

  public getPermission(): ChannelPermission {
    return this.permission;
  }

  public getRequiredTierId(): string | null {
    return this.requiredTierId;
  }

  public getIcon(): string | null {
    return this.icon;
  }

  public getPosition(): number {
    return this.position;
  }

  public getCreatedBy(): string {
    return this.createdBy;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public getDeletedAt(): Date | null {
    return this.deletedAt;
  }
}
