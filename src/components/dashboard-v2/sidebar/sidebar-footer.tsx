"use client";

import { Button } from '@/components/ui/button';

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

  return (
    <div className="p-4 border-t">
      {/* Plan Badge */}
      <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-3 rounded-lg mb-3 flex items-center justify-between text-sm font-semibold">
        <span>Growth Plan</span>
        <span>✨</span>
      </div>

      {/* Storage Usage */}
      <div className="mb-3">
        <div className="text-xs text-muted-foreground flex justify-between mb-2">
          <span>Storage</span>
          <span>{storageUsed} GB / {storageTotal} GB</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all"
            style={{ width: `${storagePercentage}%` }}
          />
        </div>
      </div>

      {/* Upgrade Button */}
      <Button
        variant="outline"
        className="w-full hover:bg-primary hover:text-primary-foreground"
      >
        Upgrade Plan
      </Button>
    </div>
  );
}
