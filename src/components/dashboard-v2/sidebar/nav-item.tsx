"use client";

import Link from 'next/link';
import { cn } from '@/lib/utils';
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

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all mb-0.5",
        isActive
          ? "bg-primary text-primary-foreground font-medium"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon size={18} className={cn("shrink-0", isActive ? "opacity-100" : "opacity-70")} />
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full font-semibold">
          {item.badge}
        </span>
      )}
    </Link>
  );
}
