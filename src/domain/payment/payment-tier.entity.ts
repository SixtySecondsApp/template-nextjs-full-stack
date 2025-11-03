import {
  CreatePaymentTierInput,
  UpdatePaymentTierInput,
  PaymentTierData,
} from "./payment-tier.types";

/**
 * PaymentTier entity represents a pricing tier within a community.
 * Follows hexagonal architecture with pure domain logic - NO framework dependencies.
 *
 * Business Rules:
 * - Name: 3-50 characters
 * - Description: 10-500 characters
 * - Prices: >= 0 (in cents)
 * - Features: must be non-empty strings
 * - V1: Only 2 tiers per community (Free + 1 Paid) - enforced at use case level
 * - Free tier: both priceMonthly and priceAnnual are 0
 * - Cannot modify archived tiers
 */
export class PaymentTier {
  private constructor(
    private readonly id: string,
    private readonly communityId: string,
    private name: string,
    private description: string,
    private priceMonthly: number,
    private priceAnnual: number,
    private features: string[],
    private isActive: boolean,
    private readonly createdAt: Date,
    private updatedAt: Date,
    private deletedAt: Date | null = null
  ) {
    this.validateName(name);
    this.validateDescription(description);
    this.validatePrice(priceMonthly, "monthly");
    this.validatePrice(priceAnnual, "annual");
    this.validateFeatures(features);
  }

  /**
   * Factory method to create a new PaymentTier entity.
   * Tier starts as active by default.
   */
  static create(input: CreatePaymentTierInput): PaymentTier {
    return new PaymentTier(
      input.id,
      input.communityId,
      input.name,
      input.description,
      input.priceMonthly,
      input.priceAnnual,
      [...input.features], // Copy array to prevent external mutation
      true, // isActive
      new Date(),
      new Date(),
      null // deletedAt
    );
  }

  /**
   * Factory method to reconstitute a PaymentTier entity from persistence.
   */
  static reconstitute(data: PaymentTierData): PaymentTier {
    return new PaymentTier(
      data.id,
      data.communityId,
      data.name,
      data.description,
      data.priceMonthly,
      data.priceAnnual,
      [...data.features], // Copy array to prevent external mutation
      data.isActive,
      data.createdAt,
      data.updatedAt,
      data.deletedAt
    );
  }

  // Getters

  getId(): string {
    return this.id;
  }

  getCommunityId(): string {
    return this.communityId;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getPriceMonthly(): number {
    return this.priceMonthly;
  }

  getPriceAnnual(): number {
    return this.priceAnnual;
  }

  getFeatures(): string[] {
    return [...this.features]; // Return copy to prevent external mutation
  }

  getIsActive(): boolean {
    return this.isActive;
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
   * Update payment tier details.
   * @throws Error if tier is archived or validation fails
   */
  update(input: UpdatePaymentTierInput): void {
    this.ensureNotArchived();

    if (input.name !== undefined) {
      this.validateName(input.name);
      this.name = input.name;
    }

    if (input.description !== undefined) {
      this.validateDescription(input.description);
      this.description = input.description;
    }

    if (input.priceMonthly !== undefined) {
      this.validatePrice(input.priceMonthly, "monthly");
      this.priceMonthly = input.priceMonthly;
    }

    if (input.priceAnnual !== undefined) {
      this.validatePrice(input.priceAnnual, "annual");
      this.priceAnnual = input.priceAnnual;
    }

    this.updatedAt = new Date();
  }

  /**
   * Activate the tier, allowing users to subscribe to it.
   * @throws Error if tier is archived
   */
  activate(): void {
    this.ensureNotArchived();

    if (this.isActive) {
      throw new Error("Payment tier is already active");
    }

    this.isActive = true;
    this.updatedAt = new Date();
  }

  /**
   * Deactivate the tier, preventing new subscriptions.
   * @throws Error if tier is archived
   */
  deactivate(): void {
    this.ensureNotArchived();

    if (!this.isActive) {
      throw new Error("Payment tier is already inactive");
    }

    this.isActive = false;
    this.updatedAt = new Date();
  }

  /**
   * Add a feature to the tier.
   * @throws Error if tier is archived or feature is invalid/duplicate
   */
  addFeature(feature: string): void {
    this.ensureNotArchived();

    const trimmedFeature = feature.trim();
    if (trimmedFeature.length === 0) {
      throw new Error("Feature cannot be empty");
    }

    if (this.features.includes(trimmedFeature)) {
      throw new Error("Feature already exists in tier");
    }

    this.features.push(trimmedFeature);
    this.updatedAt = new Date();
  }

  /**
   * Remove a feature from the tier.
   * @throws Error if tier is archived or feature doesn't exist
   */
  removeFeature(feature: string): void {
    this.ensureNotArchived();

    const index = this.features.indexOf(feature);
    if (index === -1) {
      throw new Error("Feature not found in tier");
    }

    this.features.splice(index, 1);
    this.updatedAt = new Date();
  }

  /**
   * Check if this is a free tier (both prices are 0).
   */
  isFree(): boolean {
    return this.priceMonthly === 0 && this.priceAnnual === 0;
  }

  /**
   * Archive (soft delete) the payment tier.
   * @throws Error if tier is already archived or is active
   */
  archive(): void {
    if (this.isArchived()) {
      throw new Error("Payment tier is already archived");
    }

    if (this.isActive) {
      throw new Error("Cannot archive active tier. Deactivate first");
    }

    this.deletedAt = new Date();
  }

  /**
   * Restore tier from archived state.
   * @throws Error if tier is not archived
   */
  restore(): void {
    if (!this.isArchived()) {
      throw new Error("Payment tier is not archived");
    }

    this.deletedAt = null;
    this.updatedAt = new Date();
  }

  // Private validation methods

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error("Payment tier name is required");
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 3) {
      throw new Error("Payment tier name must be at least 3 characters");
    }

    if (trimmedName.length > 50) {
      throw new Error("Payment tier name must not exceed 50 characters");
    }
  }

  private validateDescription(description: string): void {
    if (!description || description.trim().length === 0) {
      throw new Error("Payment tier description is required");
    }

    const trimmedDescription = description.trim();

    if (trimmedDescription.length < 10) {
      throw new Error("Payment tier description must be at least 10 characters");
    }

    if (trimmedDescription.length > 500) {
      throw new Error("Payment tier description must not exceed 500 characters");
    }
  }

  private validatePrice(price: number, type: "monthly" | "annual"): void {
    if (price < 0) {
      throw new Error(`${type} price cannot be negative`);
    }

    if (!Number.isInteger(price)) {
      throw new Error(`${type} price must be an integer (cents)`);
    }
  }

  private validateFeatures(features: string[]): void {
    if (!Array.isArray(features)) {
      throw new Error("Features must be an array");
    }

    for (const feature of features) {
      if (typeof feature !== "string" || feature.trim().length === 0) {
        throw new Error("Each feature must be a non-empty string");
      }
    }
  }

  private ensureNotArchived(): void {
    if (this.isArchived()) {
      throw new Error("Cannot modify archived payment tier");
    }
  }
}
