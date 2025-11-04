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

  const activeStyle = {
    background: 'var(--color-primary-500)',
    color: 'white',
    fontWeight: 500
  };

  const hoverStyle = {
    background: 'var(--surface-elevated)',
    color: 'var(--text-primary)'
  };

  const defaultStyle = {
    color: 'var(--text-secondary)'
  };

  const currentStyle = isActive ? activeStyle : isHovered ? hoverStyle : defaultStyle;

  return (
    <Link
      href={item.href}
      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm mb-0.5"
      style={{
        ...currentStyle,
        transition: 'all 0.2s'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon size={18} className="shrink-0" style={{ opacity: isActive ? 1 : 0.7 }} />
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full font-semibold" style={{
          background: 'var(--color-error-light)',
          color: 'white',
          fontSize: '11px',
          padding: '2px 6px'
        }}>
          {item.badge}
        </span>
      )}
    </Link>
  );
}
