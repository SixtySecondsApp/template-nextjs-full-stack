-- AlterTable
ALTER TABLE "payment_tiers" DROP COLUMN "interval",
DROP COLUMN "price",
DROP COLUMN "stripeProductId",
DROP COLUMN "stripePriceId",
ADD COLUMN     "priceAnnual" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "priceMonthly" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "description" SET NOT NULL;

-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_tierId_fkey";

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "cancelAt",
DROP COLUMN "canceledAt",
DROP COLUMN "tierId",
ADD COLUMN     "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "communityId" TEXT NOT NULL,
ADD COLUMN     "interval" TEXT NOT NULL,
ADD COLUMN     "paymentTierId" TEXT NOT NULL,
ADD COLUMN     "trialEndsAt" TIMESTAMP(3),
ALTER COLUMN "status" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "payments";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "SubscriptionStatus";

-- CreateTable
CREATE TABLE "coupons" (
    "id" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discountType" TEXT NOT NULL,
    "discountValue" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "maxUses" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "payment_tiers_deletedAt_idx" ON "payment_tiers"("deletedAt");

-- CreateIndex
CREATE INDEX "subscriptions_communityId_idx" ON "subscriptions"("communityId");

-- CreateIndex
CREATE INDEX "subscriptions_deletedAt_idx" ON "subscriptions"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_userId_communityId_key" ON "subscriptions"("userId", "communityId");

-- CreateIndex
CREATE INDEX "coupons_communityId_idx" ON "coupons"("communityId");

-- CreateIndex
CREATE INDEX "coupons_code_idx" ON "coupons"("code");

-- CreateIndex
CREATE INDEX "coupons_isActive_idx" ON "coupons"("isActive");

-- CreateIndex
CREATE INDEX "coupons_expiresAt_idx" ON "coupons"("expiresAt");

-- CreateIndex
CREATE INDEX "coupons_deletedAt_idx" ON "coupons"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "coupons_communityId_code_key" ON "coupons"("communityId", "code");

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "communities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_paymentTierId_fkey" FOREIGN KEY ("paymentTierId") REFERENCES "payment_tiers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "communities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
