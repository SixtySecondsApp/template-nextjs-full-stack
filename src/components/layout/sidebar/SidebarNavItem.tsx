"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

interface SidebarNavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  badge?: string | number;
  onClick?: () => void;
}

export function SidebarNavItem({
  href,
  icon: Icon,
  label,
  badge,
  onClick,
}: SidebarNavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        group flex items-center gap-3 px-3 py-2.5 rounded-lg
        transition-all duration-200 mb-0.5
        ${
          isActive
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
        }
      `}
      aria-current={isActive ? "page" : undefined}
    >
      {/* Icon */}
      <Icon
        className={`w-5 h-5 flex-shrink-0 ${
          isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"
        }`}
      />

      {/* Label */}
      <span className="flex-1 font-medium text-sm">{label}</span>

      {/* Badge */}
      {badge !== undefined && (
        <span
          className={`
            px-2 py-0.5 text-xs font-semibold rounded-full
            ${
              isActive
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }
          `}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}
