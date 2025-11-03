"use client";

import Link from "next/link";
import { PaymentTierDto } from "@/application/dtos/payment.dto";

interface PlanComparisonProps {
  tiers: PaymentTierDto[];
  currentPlanId?: string;
}

export function PlanComparison({ tiers, currentPlanId }: PlanComparisonProps) {
  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  // Sort tiers: Free first, then by price
  const sortedTiers = [...tiers].sort((a, b) => {
    if (a.isFree) return -1;
    if (b.isFree) return 1;
    return a.priceMonthly - b.priceMonthly;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Compare Plans</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose the plan that's right for you
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200 dark:border-gray-700">
              <th className="text-left p-4 font-semibold">Feature</th>
              {sortedTiers.map((tier) => (
                <th
                  key={tier.id}
                  className="p-4 text-center min-w-[200px] relative"
                >
                  <div className="space-y-2">
                    <div>
                      {tier.isPopular && (
                        <span className="inline-block px-2 py-1 bg-primary-color text-white text-xs font-semibold rounded-full mb-2">
                          Popular
                        </span>
                      )}
                      <h3 className="text-xl font-bold">{tier.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {tier.description}
                      </p>
                    </div>
                    <div className="py-2">
                      <span className="text-3xl font-bold">
                        {tier.isFree ? "Free" : formatPrice(tier.priceMonthly)}
                      </span>
                      {!tier.isFree && (
                        <span className="text-gray-600 dark:text-gray-400">
                          /month
                        </span>
                      )}
                    </div>
                    {currentPlanId === tier.id ? (
                      <span className="inline-block px-4 py-2 bg-green-500 text-white rounded-lg font-semibold">
                        Current Plan
                      </span>
                    ) : (
                      <Link href="/subscribe">
                        <button className="w-full px-4 py-2 bg-primary-color text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
                          {tier.isFree ? "Get Started" : "Upgrade"}
                        </button>
                      </Link>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Collect all unique features */}
            {Array.from(
              new Set(sortedTiers.flatMap((tier) => tier.features))
            ).map((feature, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <td className="p-4 font-medium">{feature}</td>
                {sortedTiers.map((tier) => (
                  <td key={tier.id} className="p-4 text-center">
                    {tier.features.includes(feature) ? (
                      <svg
                        className="w-6 h-6 text-green-500 mx-auto"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-6 h-6 text-gray-300 dark:text-gray-600 mx-auto"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
