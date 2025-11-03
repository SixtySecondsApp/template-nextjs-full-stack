export interface CreatePaymentTierInput {
  id: string;
  communityId: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceAnnual: number;
  features: string[];
}

export interface UpdatePaymentTierInput {
  name?: string;
  description?: string;
  priceMonthly?: number;
  priceAnnual?: number;
}

export interface PaymentTierData {
  id: string;
  communityId: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceAnnual: number;
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
