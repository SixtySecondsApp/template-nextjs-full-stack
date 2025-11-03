"use client";

import Link from "next/link";
import { useState } from "react";

interface UpgradeBannerProps {
  compact?: boolean;
  benefits?: string[];
}

export function UpgradeBanner({
  compact = false,
  benefits = [
    "Access all premium courses",
    "Ad-free experience",
    "Priority support",
    "Exclusive content",
  ],
}: UpgradeBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-primary-color to-blue-600 text-white rounded-lg p-4 shadow-md relative">
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-2 right-2 text-white/80 hover:text-white"
          aria-label="Dismiss banner"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <div className="flex items-center justify-between pr-8">
          <div>
            <h3 className="font-bold mb-1">Upgrade to Premium</h3>
            <p className="text-sm text-white/90">
              Unlock all features with a 7-day free trial
            </p>
          </div>
          <Link href="/subscribe">
            <button className="bg-white text-primary-color px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap">
              Try Free
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary-color to-blue-600 text-white rounded-lg p-6 shadow-lg relative">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 text-white/80 hover:text-white"
        aria-label="Dismiss banner"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <div className="pr-8">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <h3 className="text-2xl font-bold">Unlock Premium Features</h3>
        </div>

        <p className="text-white/90 mb-4">
          Get full access to everything with a 7-day free trial
        </p>

        <ul className="space-y-2 mb-6">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-center gap-2">
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        <Link href="/subscribe">
          <button className="w-full bg-white text-primary-color px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
            Start Free Trial
          </button>
        </Link>

        <p className="text-xs text-center text-white/80 mt-3">
          No credit card required. Cancel anytime.
        </p>
      </div>
    </div>
  );
}
