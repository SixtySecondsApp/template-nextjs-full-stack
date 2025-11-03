import { Role, isValidRole } from "../shared/role.enum";

/**
 * User entity represents a user within a community context.
 * Follows hexagonal architecture with pure domain logic - NO framework dependencies.
 *
 * Business Rules:
 * - Email must be valid format
 * - Name length: 1-100 characters when provided
 * - Role must be valid Role enum value
 * - User must belong to exactly one community
 * - Archived users cannot be modified (except restoration)
 */
export class User {
  private constructor(
    private readonly id: string,
    private email: string,
    private name: string | null,
    private role: Role,
    private readonly communityId: string,
    private avatarUrl: string | null,
    private readonly createdAt: Date,
    private updatedAt: Date,
    private deletedAt: Date | null = null
  ) {
    this.validateEmail(email);
    if (name !== null) {
      this.validateName(name);
    }
    this.validateRole(role);
  }

  /**
   * Factory method to create a new User entity.
   */
  static create(props: {
    id: string;
    email: string;
    name?: string | null;
    role: Role;
    communityId: string;
    avatarUrl?: string | null;
  }): User {
    return new User(
      props.id,
      props.email,
      props.name ?? null,
      props.role,
      props.communityId,
      props.avatarUrl ?? null,
      new Date(),
      new Date(),
      null
    );
  }

  /**
   * Factory method to reconstitute a User entity from persistence.
   */
  static reconstitute(props: {
    id: string;
    email: string;
    name: string | null;
    role: Role;
    communityId: string;
    avatarUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }): User {
    return new User(
      props.id,
      props.email,
      props.name,
      props.role,
      props.communityId,
      props.avatarUrl,
      props.createdAt,
      props.updatedAt,
      props.deletedAt
    );
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getEmail(): string {
    return this.email;
  }

  getName(): string | null {
    return this.name;
  }

  getRole(): Role {
    return this.role;
  }

  getCommunityId(): string {
    return this.communityId;
  }

  getAvatarUrl(): string | null {
    return this.avatarUrl;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getDeletedAt(): Date | null {
    return this.deletedAt;
  }

  isArchived(): boolean {
    return this.deletedAt !== null;
  }

  // Business logic methods

  /**
   * Update user profile information.
   * @throws Error if user is archived
   */
  updateProfile(props: {
    name?: string | null;
    email?: string;
    avatarUrl?: string | null;
  }): void {
    this.ensureNotArchived();

    if (props.email !== undefined) {
      this.validateEmail(props.email);
      this.email = props.email;
    }

    if (props.name !== undefined) {
      if (props.name !== null) {
        this.validateName(props.name);
      }
      this.name = props.name;
    }

    if (props.avatarUrl !== undefined) {
      if (props.avatarUrl !== null) {
        this.validateAvatarUrl(props.avatarUrl);
      }
      this.avatarUrl = props.avatarUrl;
    }

    this.updatedAt = new Date();
  }

  /**
   * Change user role within the community.
   * @throws Error if user is archived or role is invalid
   */
  changeRole(newRole: Role): void {
    this.ensureNotArchived();
    this.validateRole(newRole);

    if (this.role === newRole) {
      throw new Error("New role must be different from current role");
    }

    this.role = newRole;
    this.updatedAt = new Date();
  }

  /**
   * Archive (soft delete) the user.
   * @throws Error if user is already archived
   */
  archive(): void {
    if (this.isArchived()) {
      throw new Error("User is already archived");
    }

    this.deletedAt = new Date();
  }

  /**
   * Restore user from archived state.
   * @throws Error if user is not archived
   */
  restore(): void {
    if (!this.isArchived()) {
      throw new Error("User is not archived");
    }

    this.deletedAt = null;
    this.updatedAt = new Date();
  }

  /**
   * Check if user has permission level equal to or higher than specified role.
   */
  hasRoleOrHigher(requiredRole: Role): boolean {
    const roleHierarchy: Record<Role, number> = {
      [Role.OWNER]: 5,
      [Role.ADMIN]: 4,
      [Role.MODERATOR]: 3,
      [Role.MEMBER]: 2,
      [Role.GUEST]: 1,
    };

    return roleHierarchy[this.role] >= roleHierarchy[requiredRole];
  }

  /**
   * Check if user is an owner.
   */
  isOwner(): boolean {
    return this.role === Role.OWNER;
  }

  /**
   * Check if user is an admin or higher.
   */
  isAdminOrHigher(): boolean {
    return this.hasRoleOrHigher(Role.ADMIN);
  }

  /**
   * Check if user is a moderator or higher.
   */
  isModeratorOrHigher(): boolean {
    return this.hasRoleOrHigher(Role.MODERATOR);
  }

  // Private validation methods

  private validateEmail(email: string): void {
    if (!email || email.trim().length === 0) {
      throw new Error("Email is required");
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    if (email.length > 255) {
      throw new Error("Email must not exceed 255 characters");
    }
  }

  private validateName(name: string): void {
    if (name.trim().length === 0) {
      throw new Error("Name cannot be empty when provided");
    }

    if (name.length < 1 || name.length > 100) {
      throw new Error("Name must be between 1 and 100 characters");
    }
  }

  private validateRole(role: Role): void {
    if (!isValidRole(role)) {
      throw new Error(`Invalid role: ${role}`);
    }
  }

  private validateAvatarUrl(url: string): void {
    try {
      new URL(url);
    } catch {
      throw new Error("Invalid avatar URL format");
    }
  }

  private ensureNotArchived(): void {
    if (this.isArchived()) {
      throw new Error("Cannot modify archived user");
    }
  }
}
