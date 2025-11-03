"use client";

import { PaymentTierDto } from "@/application/dtos/payment.dto";

interface TierCardProps {
  tier: PaymentTierDto;
  selected: boolean;
  onSelect: (tier: PaymentTierDto) => void;
  currentPlan?: boolean;
  interval: "MONTHLY" | "ANNUAL";
}

export function TierCard({
  tier,
  selected,
  onSelect,
  currentPlan = false,
  interval,
}: TierCardProps) {
  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const price =
    interval === "MONTHLY" ? tier.priceMonthly : tier.priceAnnual;
  const priceDisplay = tier.isFree ? "Free" : formatPrice(price);
  const pricePeriod = tier.isFree
    ? ""
    : interval === "MONTHLY"
      ? "/month"
      : "/year";

  return (
    <div
      onClick={() => !currentPlan && onSelect(tier)}
      className={`relative p-6 rounded-lg border-2 transition-all cursor-pointer ${
        selected
          ? "border-primary-color bg-primary-color/5"
          : currentPlan
            ? "border-green-500 bg-green-50 dark:bg-green-900/10"
            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
      } ${currentPlan ? "cursor-default" : ""}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !currentPlan) {
          e.preventDefault();
          onSelect(tier);
        }
      }}
      aria-pressed={selected}
      aria-label={`Select ${tier.name} plan`}
    >
      {/* Badges */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {tier.description}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {tier.isPopular && !currentPlan && (
            <span className="px-3 py-1 bg-primary-color text-white text-xs font-semibold rounded-full">
              Most Popular
            </span>
          )}
          {currentPlan && (
            <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
              Current Plan
            </span>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold">{priceDisplay}</span>
          {!tier.isFree && (
            <span className="text-gray-600 dark:text-gray-400">
              {pricePeriod}
            </span>
          )}
        </div>
        {!tier.isFree && interval === "ANNUAL" && (
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            Save{" "}
            {formatPrice(tier.priceMonthly * 12 - tier.priceAnnual)}/year with
            annual billing
          </p>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-3">
        {tier.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      {/* Selection Indicator */}
      {selected && !currentPlan && (
        <div className="absolute top-4 right-4">
          <div className="w-6 h-6 bg-primary-color rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
