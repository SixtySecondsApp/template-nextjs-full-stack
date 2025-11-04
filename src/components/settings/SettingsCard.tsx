"use client";

import type { ReactNode } from "react";

interface SettingsCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function SettingsCard({ title, description, children }: SettingsCardProps) {
  return (
    <div
      className="rounded-xl border p-6 mb-6"
      style={{
        background: "var(--surface-elevated)",
        borderColor: "var(--border)",
      }}
    >
      <div className="mb-4">
        <h3
          className="text-lg font-semibold mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h3>
        {description && (
          <p
            className="text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            {description}
          </p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
