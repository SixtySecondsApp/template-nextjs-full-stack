"use client";

import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  target?: string;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
}

export function MetricCard({
  title,
  value,
  change,
  target,
  icon,
  trend,
}: MetricCardProps) {
  const getTrendColor = () => {
    if (!trend) {
      if (change === undefined) return "";
      return change >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
    }

    switch (trend) {
      case "up":
        return "text-green-600 dark:text-green-400";
      case "down":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getTrendIcon = () => {
    if (change === undefined) return null;

    if (change >= 0) {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        {icon && (
          <div className="p-3 bg-primary-color/10 rounded-lg text-primary-color">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm">
        {change !== undefined && (
          <span className={`flex items-center gap-1 font-medium ${getTrendColor()}`}>
            {getTrendIcon()}
            {Math.abs(change)}%
          </span>
        )}
        {target && (
          <span className="text-gray-600 dark:text-gray-400">{target}</span>
        )}
      </div>
    </div>
  );
}
