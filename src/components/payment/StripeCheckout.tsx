"use client";

import { useState, useEffect } from "react";
import {
  PaymentTierDto,
  CheckoutCalculationDto,
} from "@/application/dtos/payment.dto";
import { TierCard } from "./TierCard";

interface StripeCheckoutProps {
  tiers: PaymentTierDto[];
  userSubscription?: {
    paymentTierId: string;
    isActive: boolean;
  } | null;
}

export function StripeCheckout({
  tiers,
  userSubscription,
}: StripeCheckoutProps) {
  const [selectedTier, setSelectedTier] = useState<PaymentTierDto | null>(
    null
  );
  const [interval, setInterval] = useState<"MONTHLY" | "ANNUAL">("MONTHLY");
  const [couponCode, setCouponCode] = useState("");
  const [calculation, setCalculation] =
    useState<CheckoutCalculationDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate price when tier, interval, or coupon changes
  useEffect(() => {
    if (!selectedTier || selectedTier.isFree) {
      setCalculation(null);
      return;
    }

    const calculatePrice = async () => {
      setCalculating(true);
      setError(null);

      try {
        const response = await fetch("/api/checkout/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentTierId: selectedTier.id,
            interval,
            couponCode: couponCode.trim() || null,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to calculate price");
        }

        setCalculation(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Calculation failed");
        setCalculation(null);
      } finally {
        setCalculating(false);
      }
    };

    // Debounce coupon code input
    const timeoutId = setTimeout(calculatePrice, 500);
    return () => clearTimeout(timeoutId);
  }, [selectedTier, interval, couponCode]);

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const handleSubscribe = async () => {
    if (!selectedTier || !calculation) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentTierId: selectedTier.id,
          interval,
          couponCode: couponCode.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to create checkout session");
      }

      // Redirect to Stripe Checkout
      window.location.href = data.data.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setLoading(false);
    }
  };

  const annualSavings =
    selectedTier && !selectedTier.isFree
      ? selectedTier.priceMonthly * 12 - selectedTier.priceAnnual
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Start with a 7-day free trial. Cancel anytime.
        </p>
      </div>

      {/* Billing Interval Toggle */}
      {selectedTier && !selectedTier.isFree && (
        <div className="flex justify-center items-center gap-4 mb-8">
          <button
            onClick={() => setInterval("MONTHLY")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              interval === "MONTHLY"
                ? "bg-primary-color text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setInterval("ANNUAL")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              interval === "ANNUAL"
                ? "bg-primary-color text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            Annual
            {annualSavings > 0 && (
              <span className="ml-2 text-sm text-green-600 dark:text-green-400">
                Save {formatPrice(annualSavings)}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Tier Selection */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {tiers.map((tier) => (
          <TierCard
            key={tier.id}
            tier={tier}
            selected={selectedTier?.id === tier.id}
            onSelect={setSelectedTier}
            currentPlan={
              userSubscription?.paymentTierId === tier.id &&
              userSubscription.isActive
            }
            interval={interval}
          />
        ))}
      </div>

      {/* Checkout Section */}
      {selectedTier && !selectedTier.isFree && (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4">Checkout</h3>

          {/* Coupon Code Input */}
          <div className="mb-4">
            <label
              htmlFor="coupon"
              className="block text-sm font-medium mb-2"
            >
              Coupon Code (optional)
            </label>
            <input
              id="coupon"
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter code"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-color focus:border-transparent"
              disabled={calculating || loading}
            />
          </div>

          {/* Price Calculation */}
          {calculating ? (
            <div className="py-4 text-center text-gray-500">
              Calculating...
            </div>
          ) : calculation ? (
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(calculation.subtotal)}</span>
              </div>
              {calculation.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                  <span>Discount</span>
                  <span>-{formatPrice(calculation.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 dark:border-gray-700">
                <span>Total</span>
                <span>{formatPrice(calculation.total)}</span>
              </div>
              {calculation.hasTrialPeriod && (
                <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    {calculation.trialDays}-day free trial included
                  </span>
                </div>
              )}
            </div>
          ) : null}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Subscribe Button */}
          <button
            onClick={handleSubscribe}
            disabled={loading || calculating || !calculation}
            className="w-full bg-primary-color text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {loading ? "Redirecting to Stripe..." : "Subscribe Now"}
          </button>

          <p className="text-xs text-center text-gray-500 mt-3">
            Secure payment powered by Stripe
          </p>
        </div>
      )}
    </div>
  );
}
