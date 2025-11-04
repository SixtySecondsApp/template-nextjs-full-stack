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
    <div className="mb-6">
      <div className="text-xs font-semibold uppercase tracking-wide px-3 mb-2" style={{
        color: 'var(--text-tertiary)',
        fontSize: '11px',
        letterSpacing: '0.5px'
      }}>
        {title}
      </div>
      <div className="space-y-0.5">
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
