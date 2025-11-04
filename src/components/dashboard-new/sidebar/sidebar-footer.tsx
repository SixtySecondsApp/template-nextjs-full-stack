"use client";

import { useState } from 'react';
import { Sparkles } from 'lucide-react';

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
    <div style={{
      marginTop: 'auto',
      padding: '16px',
      borderTop: '1px solid var(--border)'
    }}>
      {/* Plan Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px',
        background: 'linear-gradient(135deg, var(--primary-color), #8b5cf6)',
        borderRadius: '8px',
        color: 'white',
        fontSize: '13px',
        fontWeight: '600',
        marginBottom: '12px'
      }}>
        <span>Growth Plan</span>
        <Sparkles size={16} />
      </div>

      {/* Storage Usage */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{
          fontSize: '12px',
          color: 'var(--text-secondary)',
          marginBottom: '6px',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>Storage</span>
          <span>{storageUsed} GB / {storageTotal} GB</span>
        </div>
        <div style={{
          height: '6px',
          background: 'var(--border)',
          borderRadius: '3px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            background: 'var(--success)',
            width: `${storagePercentage}%`,
            transition: 'width 0.3s'
          }} />
        </div>
      </div>

      {/* Upgrade Button */}
      <button
        style={{
          width: '100%',
          padding: '8px',
          background: isUpgradeHovered ? 'var(--primary-color)' : 'var(--surface-elevated)',
          border: `1px solid ${isUpgradeHovered ? 'var(--primary-color)' : 'var(--border)'}`,
          borderRadius: '6px',
          color: isUpgradeHovered ? 'white' : 'var(--text-primary)',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s',
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
