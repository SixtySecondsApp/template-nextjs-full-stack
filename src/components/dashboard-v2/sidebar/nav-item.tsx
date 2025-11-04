"use client";

import Link from 'next/link';
import { useState } from 'react';
import type { NavItem as NavItemType } from './sidebar';

interface NavItemProps {
  item: NavItemType;
  isActive: boolean;
}

/**
 * NavItem Component
 *
 * Individual navigation item with icon, label, and optional badge
 */
export function NavItem({ item, isActive }: NavItemProps) {
  const Icon = item.icon;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={item.href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px 12px',
        borderRadius: '6px',
        color: isActive ? 'white' : isHovered ? 'var(--text-primary)' : 'var(--text-secondary)',
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s',
        marginBottom: '2px',
        fontSize: '14px',
        background: isActive ? 'var(--primary-color)' : isHovered ? 'var(--surface-elevated)' : 'transparent',
        fontWeight: isActive ? 500 : 'normal'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon size={18} style={{ width: '18px', height: '18px', opacity: isActive ? 1 : 0.7, flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{item.label}</span>
      {item.badge && (
        <span style={{
          marginLeft: 'auto',
          background: 'var(--danger)',
          color: 'white',
          fontSize: '11px',
          padding: '2px 6px',
          borderRadius: '10px',
          fontWeight: '600'
        }}>
          {item.badge}
        </span>
      )}
    </Link>
  );
}
