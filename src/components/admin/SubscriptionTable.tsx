"use client";

import { useState } from "react";
import { RecentSubscriptionDto } from "@/application/dtos/payment.dto";

interface SubscriptionTableProps {
  subscriptions: RecentSubscriptionDto[];
}

type StatusFilter = "ALL" | "ACTIVE" | "CANCELLED" | "PAST_DUE" | "TRIALING";

export function SubscriptionTable({
  subscriptions,
}: SubscriptionTableProps) {
  const [filter, setFilter] = useState<StatusFilter>("ALL");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
        className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status as keyof typeof styles] || styles.ACTIVE}`}
      >
        {status}
      </span>
    );
  };

  const filteredSubscriptions =
    filter === "ALL"
      ? subscriptions
      : subscriptions.filter((sub) => sub.status === filter);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Recent Subscriptions</h3>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          {(
            ["ALL", "ACTIVE", "TRIALING", "CANCELLED", "PAST_DUE"] as const
          ).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                filter === status
                  ? "bg-primary-color text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {filteredSubscriptions.length === 0 ? (
        <div className="text-center py-8">
          <svg
            className="w-12 h-12 text-gray-400 mx-auto mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="text-gray-600 dark:text-gray-400">
            No {filter.toLowerCase()} subscriptions found
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left p-3 font-semibold">User</th>
                <th className="text-left p-3 font-semibold">Plan</th>
                <th className="text-left p-3 font-semibold">Status</th>
                <th className="text-left p-3 font-semibold">Start Date</th>
                <th className="text-right p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscriptions.map((subscription) => (
                <tr
                  key={subscription.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="p-3">
                    <div>
                      <p className="font-medium">{subscription.userName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {subscription.userEmail}
                      </p>
                    </div>
                  </td>
                  <td className="p-3 font-medium">{subscription.planName}</td>
                  <td className="p-3">
                    {getStatusBadge(subscription.status)}
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-400">
                    {formatDate(subscription.startDate)}
                  </td>
                  <td className="p-3 text-right">
                    <button className="text-primary-color hover:underline text-sm font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
