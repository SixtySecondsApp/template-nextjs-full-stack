"use client";

import type { ReactNode } from "react";

interface SettingRowProps {
  label: string;
  description?: string;
  children: ReactNode;
  icon?: ReactNode;
}

export function SettingRow({ label, description, children, icon }: SettingRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {icon && (
            <div style={{ color: "var(--primary-color)" }}>{icon}</div>
          )}
          <label
            className="font-medium text-sm"
            style={{ color: "var(--text-primary)" }}
          >
            {label}
          </label>
        </div>
        {description && (
          <p
            className="text-xs leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {description}
          </p>
        )}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}
