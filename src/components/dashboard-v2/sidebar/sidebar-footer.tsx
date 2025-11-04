"use client";

import { useState } from 'react';

/**
 * SidebarFooter Component
 *
 * Footer section of the sidebar with:
 * - Plan badge
 * - Storage usage indicator
 * - Upgrade button
 */
export function SidebarFooter() {
  const storageUsed = 12; // GB
  const storageTotal = 50; // GB
  const storagePercentage = (storageUsed / storageTotal) * 100;
  const [isUpgradeHovered, setIsUpgradeHovered] = useState(false);

  return (
    <div className="p-4" style={{
      marginTop: 'auto',
      borderTop: '1px solid var(--border-default)'
    }}>
      {/* Plan Badge */}
      <div className="text-white p-3 rounded-lg mb-3 flex items-center justify-between text-sm font-semibold" style={{
        background: 'linear-gradient(135deg, var(--color-primary-500), #8b5cf6)'
      }}>
        <span>Growth Plan</span>
        <span>✨</span>
      </div>

      {/* Storage Usage */}
      <div className="mb-3">
        <div className="text-xs flex justify-between mb-2" style={{
          color: 'var(--text-secondary)',
          fontSize: '12px'
        }}>
          <span>Storage</span>
          <span>{storageUsed} GB / {storageTotal} GB</span>
        </div>
        <div className="rounded-full overflow-hidden" style={{
          height: '6px',
          background: 'var(--border-default)'
        }}>
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${storagePercentage}%`,
              background: 'var(--color-success-light)'
            }}
          />
        </div>
      </div>

      {/* Upgrade Button */}
      <button
        className="w-full p-2 rounded-lg font-semibold cursor-pointer transition-all"
        style={{
          background: isUpgradeHovered ? 'var(--color-primary-500)' : 'var(--surface-elevated)',
          border: `1px solid ${isUpgradeHovered ? 'var(--color-primary-500)' : 'var(--border-default)'}`,
          color: isUpgradeHovered ? 'white' : 'var(--text-primary)',
          fontSize: '13px'
        }}
        onMouseEnter={() => setIsUpgradeHovered(true)}
        onMouseLeave={() => setIsUpgradeHovered(false)}
      >
        Upgrade Plan
      </button>
    </div>
  );
}
