/**
 * Payment Tier DTO Mapper
 * Handles conversion between PaymentTier domain entities and DTOs
 * Maintains strict boundary between domain and application layers
 */

// TODO: Import actual PaymentTier entity once created
// import { PaymentTier } from "@/domain/payment-tier/payment-tier.entity";
type PaymentTier = any; // Placeholder

import {
  PaymentTierDto,
  CreatePaymentTierDto,
  UpdatePaymentTierDto,
} from "@/application/dtos/payment-tier.dto";

/**
 * Payment Tier DTO Mapper
 */
export class PaymentTierDtoMapper {
  /**
   * Convert PaymentTier domain entity to DTO
   * @param tier Domain entity
   * @returns PaymentTierDto
   */
  static toDto(tier: any): PaymentTierDto {
    return {
      id: tier.getId(),
      communityId: tier.getCommunityId(),
      name: tier.getName(),
      description: tier.getDescription(),
      priceMonthly: tier.getPriceMonthly(),
      priceAnnual: tier.getPriceAnnual(),
      features: tier.getFeatures(),
      isActive: tier.getIsActive(),
      isFree: tier.getIsFree(),
      stripePriceMonthlyId: tier.getStripePriceMonthlyId(),
      stripePriceAnnualId: tier.getStripePriceAnnualId(),
      stripeProductId: tier.getStripeProductId(),
      createdAt: tier.getCreatedAt().toISOString(),
      updatedAt: tier.getUpdatedAt().toISOString(),
    };
  }

  /**
   * Convert CreatePaymentTierDto to domain entity creation props
   * @param dto CreatePaymentTierDto
   * @param id Generated ID
   * @returns Props for PaymentTier.create()
   */
  static fromCreateDto(
    dto: CreatePaymentTierDto,
    id: string
  ): Record<string, any> {
    return {
      id,
      communityId: dto.communityId,
      name: dto.name,
      description: dto.description,
      priceMonthly: dto.priceMonthly,
      priceAnnual: dto.priceAnnual,
      features: dto.features,
      isActive: true,
      isFree: dto.priceMonthly === 0 && dto.priceAnnual === 0,
    };
  }

  /**
   * Convert multiple domain entities to DTOs
   * @param tiers Array of domain entities
   * @returns Array of DTOs
   */
  static toDtoArray(tiers: any[]): PaymentTierDto[] {
    return tiers.map((tier) => this.toDto(tier));
  }
}
