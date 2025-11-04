"use client";

import { usePathname } from 'next/navigation';
import { NavItem } from './nav-item';
import type { NavItem as NavItemType } from './sidebar';

interface NavSectionProps {
  title: string;
  items: NavItemType[];
}

/**
 * NavSection Component
 *
 * Renders a navigation section with a title and list of nav items
 */
export function NavSection({ title, items }: NavSectionProps) {
  const pathname = usePathname();

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{
        fontSize: '11px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        color: 'var(--text-tertiary)',
        padding: '0 12px 8px'
      }}>
        {title}
      </div>
      <div>
        {items.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            isActive={pathname === item.href}
          />
        ))}
      </div>
    </div>
  );
}
