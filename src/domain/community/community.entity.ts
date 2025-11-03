/**
 * Community entity represents a community workspace.
 * Follows hexagonal architecture with pure domain logic - NO framework dependencies.
 *
 * Business Rules:
 * - Name: 3-100 characters, alphanumeric with hyphen/underscore only
 * - Logo URL: Valid URL format (optional)
 * - Primary color: Valid hex color code (defaults to #0066CC)
 * - Community must have exactly one owner
 * - Archived communities cannot be modified (except restoration)
 */
export class Community {
  private static readonly DEFAULT_PRIMARY_COLOR = "#0066CC";

  private constructor(
    private readonly id: string,
    private name: string,
    private logoUrl: string | null,
    private primaryColor: string,
    private ownerId: string,
    private readonly createdAt: Date,
    private updatedAt: Date,
    private deletedAt: Date | null = null
  ) {
    this.validateName(name);
    if (logoUrl !== null) {
      this.validateLogoUrl(logoUrl);
    }
    this.validatePrimaryColor(primaryColor);
  }

  /**
   * Factory method to create a new Community entity.
   */
  static create(props: {
    id: string;
    name: string;
    logoUrl?: string | null;
    primaryColor?: string;
    ownerId: string;
  }): Community {
    return new Community(
      props.id,
      props.name,
      props.logoUrl ?? null,
      props.primaryColor ?? Community.DEFAULT_PRIMARY_COLOR,
      props.ownerId,
      new Date(),
      new Date(),
      null
    );
  }

  /**
   * Factory method to reconstitute a Community entity from persistence.
   */
  static reconstitute(props: {
    id: string;
    name: string;
    logoUrl: string | null;
    primaryColor: string;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }): Community {
    return new Community(
      props.id,
      props.name,
      props.logoUrl,
      props.primaryColor,
      props.ownerId,
      props.createdAt,
      props.updatedAt,
      props.deletedAt
    );
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getLogoUrl(): string | null {
    return this.logoUrl;
  }

  getPrimaryColor(): string {
    return this.primaryColor;
  }

  getOwnerId(): string {
    return this.ownerId;
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
   * Update community branding information.
   * @throws Error if community is archived
   */
  updateBranding(props: {
    name?: string;
    logoUrl?: string | null;
    primaryColor?: string;
  }): void {
    this.ensureNotArchived();

    if (props.name !== undefined) {
      this.validateName(props.name);
      this.name = props.name;
    }

    if (props.logoUrl !== undefined) {
      if (props.logoUrl !== null) {
        this.validateLogoUrl(props.logoUrl);
      }
      this.logoUrl = props.logoUrl;
    }

    if (props.primaryColor !== undefined) {
      this.validatePrimaryColor(props.primaryColor);
      this.primaryColor = props.primaryColor;
    }

    this.updatedAt = new Date();
  }

  /**
   * Transfer ownership to a new owner.
   * @throws Error if community is archived or new owner ID is invalid
   */
  transferOwnership(newOwnerId: string): void {
    this.ensureNotArchived();

    if (!newOwnerId || newOwnerId.trim().length === 0) {
      throw new Error("New owner ID is required");
    }

    if (this.ownerId === newOwnerId) {
      throw new Error("New owner must be different from current owner");
    }

    this.ownerId = newOwnerId;
    this.updatedAt = new Date();
  }

  /**
   * Archive (soft delete) the community.
   * @throws Error if community is already archived
   */
  archive(): void {
    if (this.isArchived()) {
      throw new Error("Community is already archived");
    }

    this.deletedAt = new Date();
  }

  /**
   * Restore community from archived state.
   * @throws Error if community is not archived
   */
  restore(): void {
    if (!this.isArchived()) {
      throw new Error("Community is not archived");
    }

    this.deletedAt = null;
    this.updatedAt = new Date();
  }

  // Private validation methods

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error("Community name is required");
    }

    if (name.length < 3) {
      throw new Error("Community name must be at least 3 characters");
    }

    if (name.length > 100) {
      throw new Error("Community name must not exceed 100 characters");
    }

    // Allow alphanumeric characters, hyphens, underscores, and spaces
    const nameRegex = /^[a-zA-Z0-9\s_-]+$/;
    if (!nameRegex.test(name)) {
      throw new Error(
        "Community name can only contain letters, numbers, spaces, hyphens, and underscores"
      );
    }
  }

  private validateLogoUrl(url: string): void {
    try {
      const parsedUrl = new URL(url);

      // Ensure it's HTTP or HTTPS protocol
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Logo URL must use HTTP or HTTPS protocol");
      }
    } catch {
      throw new Error("Invalid logo URL format");
    }
  }

  private validatePrimaryColor(color: string): void {
    if (!color || color.trim().length === 0) {
      throw new Error("Primary color is required");
    }

    // Validate hex color format (#RGB or #RRGGBB)
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexColorRegex.test(color)) {
      throw new Error(
        "Primary color must be a valid hex color code (e.g., #0066CC or #06C)"
      );
    }
  }

  private ensureNotArchived(): void {
    if (this.isArchived()) {
      throw new Error("Cannot modify archived community");
    }
  }
}
