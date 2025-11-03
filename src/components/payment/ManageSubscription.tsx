"use client";

import { useState } from "react";
import { SubscriptionDto } from "@/application/dtos/payment.dto";

interface ManageSubscriptionProps {
  subscription: SubscriptionDto;
  onUpdate: () => void;
}

export function ManageSubscription({
  subscription,
  onUpdate,
}: ManageSubscriptionProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const handleCustomerPortal = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/subscriptions/${subscription.id}/portal`
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to open customer portal");
      }

      // Redirect to Stripe Customer Portal
      window.location.href = data.data.url;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to open customer portal"
      );
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (
      !confirm(
        "Are you sure you want to cancel your subscription? You'll retain access until the end of your billing period."
      )
    ) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/subscriptions/${subscription.id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to cancel subscription");
      }

      onUpdate();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to cancel subscription"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      ACTIVE:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      TRIALING:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      CANCELLED:
        "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
      PAST_DUE:
        "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    };

    return (
      <span
        className={`px-3 py-1 text-sm font-semibold rounded-full ${styles[status as keyof typeof styles] || styles.ACTIVE}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-2xl font-bold mb-6">Manage Subscription</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Subscription Details */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="font-semibold text-lg">
                {subscription.paymentTier?.name || "Current Plan"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {subscription.paymentTier?.description}
              </p>
            </div>
            {getStatusBadge(subscription.status)}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Billing Interval
              </p>
              <p className="font-semibold">
                {subscription.interval === "MONTHLY" ? "Monthly" : "Annual"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Next Billing Date
              </p>
              <p className="font-semibold">
                {formatDate(subscription.currentPeriodEnd)}
              </p>
            </div>

            {subscription.trialEnd && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Trial Ends
                </p>
                <p className="font-semibold">
                  {formatDate(subscription.trialEnd)}
                </p>
              </div>
            )}

            {subscription.cancelAtPeriodEnd && (
              <div className="md:col-span-2">
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-yellow-800 dark:text-yellow-400 text-sm">
                    Your subscription will be cancelled on{" "}
                    {formatDate(subscription.currentPeriodEnd)}. You'll retain
                    access until then.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleCustomerPortal}
            disabled={loading}
            className="w-full bg-primary-color text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {loading ? "Loading..." : "Update Payment Method"}
          </button>

          {subscription.status === "ACTIVE" &&
            !subscription.cancelAtPeriodEnd && (
              <button
                onClick={handleCancelSubscription}
                disabled={loading}
                className="w-full border border-red-500 text-red-500 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel Subscription
              </button>
            )}

          <p className="text-xs text-center text-gray-500">
            Changes to your subscription will be managed through Stripe's secure
            customer portal.
          </p>
        </div>
      </div>
    </div>
  );
}
