"use client";

import { NavSection } from "@/components/providers/LayoutProvider";
import { SidebarNavItem } from "./SidebarNavItem";

interface SidebarNavProps {
  sections: NavSection[];
  onItemClick?: () => void;
}

export function SidebarNav({ sections, onItemClick }: SidebarNavProps) {
  return (
    <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
      {sections.map((section) => (
        <div key={section.id} className="space-y-1">
          {/* Section title */}
          <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {section.title}
          </h3>

          {/* Section items */}
          <div className="space-y-0.5">
            {section.items.map((item) => (
              <SidebarNavItem
                key={item.id}
                href={item.href}
                icon={item.icon}
                label={item.label}
                badge={item.badge}
                onClick={onItemClick}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
