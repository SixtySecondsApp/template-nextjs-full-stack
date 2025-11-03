export { SubscriptionStatus, BillingInterval } from "./subscription-status.enum";

export interface CreateSubscriptionInput {
  id: string;
  userId: string;
  communityId: string;
  paymentTierId: string;
  interval: BillingInterval;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  stripeSubscriptionId?: string | null;
  stripeCustomerId?: string | null;
}

export interface SubscriptionData {
  id: string;
  userId: string;
  communityId: string;
  paymentTierId: string;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  status: SubscriptionStatus;
  interval: BillingInterval;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialEndsAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
