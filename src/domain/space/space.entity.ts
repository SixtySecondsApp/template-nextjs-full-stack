/**
 * Space Entity - Domain Layer
 *
 * Represents an organizational container for channels within a community.
 * Supports nested structure with max 2 levels (Space > Channels).
 *
 * Business Rules:
 * - Space must belong to a community
 * - Space name must be between 1-100 characters
 * - Description max 500 characters
 * - Supports 2-level nesting maximum (parent space → child channels)
 * - Soft delete support (archive/restore)
 */

import { SpaceCreatedEvent, SpaceUpdatedEvent, SpaceArchivedEvent } from './space.events';

export interface CreateSpaceInput {
  id: string;
  communityId: string;
  name: string;
  description: string;
  parentSpaceId?: string | null;
  icon?: string | null;
  color?: string | null;
  position?: number;
  createdBy: string;
}

export class Space {
  private constructor(
    private readonly id: string,
    private readonly communityId: string,
    private name: string,
    private description: string,
    private readonly parentSpaceId: string | null,
    private icon: string | null,
    private color: string | null,
    private position: number,
    private readonly createdBy: string,
    private readonly createdAt: Date,
    private updatedAt: Date,
    private deletedAt: Date | null = null
  ) {
    this.validateName(name);
    this.validateDescription(description);
    this.validatePosition(position);
  }

  /**
   * Factory method to create a new Space
   */
  public static create(input: CreateSpaceInput): Space {
    const now = new Date();
    const space = new Space(
      input.id,
      input.communityId,
      input.name,
      input.description,
      input.parentSpaceId ?? null,
      input.icon ?? null,
      input.color ?? null,
      input.position ?? 0,
      input.createdBy,
      now,
      now,
      null
    );

    // Emit domain event
    // EventBus.publish(new SpaceCreatedEvent(space.getId(), space.getCommunityId(), space.getName()));

    return space;
  }

  /**
   * Factory method to reconstitute from persistence
   */
  public static reconstitute(
    id: string,
    communityId: string,
    name: string,
    description: string,
    parentSpaceId: string | null,
    icon: string | null,
    color: string | null,
    position: number,
    createdBy: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null
  ): Space {
    return new Space(
      id,
      communityId,
      name,
      description,
      parentSpaceId,
      icon,
      color,
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
      throw new Error('Space name cannot be empty');
    }
    if (name.length > 100) {
      throw new Error('Space name cannot exceed 100 characters');
    }
  }

  private validateDescription(description: string): void {
    if (description.length > 500) {
      throw new Error('Space description cannot exceed 500 characters');
    }
  }

  private validatePosition(position: number): void {
    if (position < 0) {
      throw new Error('Space position cannot be negative');
    }
  }

  private ensureNotArchived(): void {
    if (this.deletedAt !== null) {
      throw new Error('Cannot modify archived space');
    }
  }

  // ========== Business Logic Methods ==========

  /**
   * Update space details
   */
  public updateDetails(name: string, description: string): void {
    this.ensureNotArchived();
    this.validateName(name);
    this.validateDescription(description);

    this.name = name;
    this.description = description;
    this.updatedAt = new Date();

    // EventBus.publish(new SpaceUpdatedEvent(this.id, this.communityId, this.name));
  }

  /**
   * Update space appearance (icon and color)
   */
  public updateAppearance(icon: string | null, color: string | null): void {
    this.ensureNotArchived();
    this.icon = icon;
    this.color = color;
    this.updatedAt = new Date();
  }

  /**
   * Update space position for ordering
   */
  public updatePosition(position: number): void {
    this.ensureNotArchived();
    this.validatePosition(position);
    this.position = position;
    this.updatedAt = new Date();
  }

  /**
   * Check if this space is a parent (root) space
   */
  public isParentSpace(): boolean {
    return this.parentSpaceId === null;
  }

  /**
   * Check if this space is a child space
   */
  public isChildSpace(): boolean {
    return this.parentSpaceId !== null;
  }

  /**
   * Archive (soft delete) the space
   */
  public archive(): void {
    if (this.deletedAt !== null) {
      throw new Error('Space is already archived');
    }

    this.deletedAt = new Date();
    this.updatedAt = new Date();

    // EventBus.publish(new SpaceArchivedEvent(this.id, this.communityId));
  }

  /**
   * Restore archived space
   */
  public restore(): void {
    if (this.deletedAt === null) {
      throw new Error('Space is not archived');
    }

    this.deletedAt = null;
    this.updatedAt = new Date();
  }

  /**
   * Check if space is archived
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

  public getName(): string {
    return this.name;
  }

  public getDescription(): string {
    return this.description;
  }

  public getParentSpaceId(): string | null {
    return this.parentSpaceId;
  }

  public getIcon(): string | null {
    return this.icon;
  }

  public getColor(): string | null {
    return this.color;
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
