export enum DiscountType {
  PERCENTAGE = "PERCENTAGE",
  FIXED_AMOUNT = "FIXED_AMOUNT",
}

export interface CreateCouponInput {
  id: string;
  communityId: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  expiresAt?: Date | null;
  maxUses?: number | null;
}

export interface CouponData {
  id: string;
  communityId: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  expiresAt: Date | null;
  maxUses: number | null;
  usedCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
