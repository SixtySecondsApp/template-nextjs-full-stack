"use client";

import Link from "next/link";
import { SubscriptionDto } from "@/application/dtos/payment.dto";
import { ReactNode } from "react";

interface ContentGateProps {
  requiredTierId: string;
  userSubscription: SubscriptionDto | null;
  children: ReactNode;
}

export function ContentGate({
  requiredTierId,
  userSubscription,
  children,
}: ContentGateProps) {
  // Check if user has access
  const hasAccess =
    userSubscription?.paymentTierId === requiredTierId &&
    userSubscription?.isActive;

  // Show content if user has access
  if (hasAccess) {
    return <>{children}</>;
  }

  // Show upgrade CTA if no access
  return (
    <div
      className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center"
      role="alert"
      aria-live="polite"
    >
      <div className="flex justify-center mb-4">
        <svg
          className="w-16 h-16 text-gray-400 dark:text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>

      <h3 className="text-2xl font-bold mb-2">Premium Content</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        This content is only available to premium members. Upgrade your plan to
        unlock access.
      </p>

      <div className="space-y-3">
        <Link href="/subscribe">
          <button className="bg-primary-color text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
            Upgrade to Premium
          </button>
        </Link>

        <p className="text-sm text-gray-500">
          Start with a 7-day free trial. Cancel anytime.
        </p>
      </div>
    </div>
  );
}
