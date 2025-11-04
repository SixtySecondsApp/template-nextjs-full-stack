"use client";

import { Home, BarChart3, Users, MessageSquare, BookOpen, DollarSign, Ticket, CreditCard, Palette, Settings, Lightbulb, HelpCircle, Building2 } from 'lucide-react';
import { NavSection } from './nav-section';
import { SidebarFooter } from './sidebar-footer';

export interface NavItem {
  id: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  href: string;
  badge?: number;
}

const mainNavItems: NavItem[] = [
  { id: 'home', icon: Home, label: 'Home', href: '/dashboard-v2' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics', href: '/dashboard-v2/analytics' },
  { id: 'communities', icon: Building2, label: 'Communities', href: '/dashboard-v2/communities' },
  { id: 'members', icon: Users, label: 'Members', href: '/dashboard-v2/members' },
  { id: 'content', icon: MessageSquare, label: 'Content', href: '/dashboard-v2/content' },
  { id: 'courses', icon: BookOpen, label: 'Courses', href: '/dashboard-v2/courses' },
];

const monetizationNavItems: NavItem[] = [
  { id: 'pricing', icon: DollarSign, label: 'Plans & Pricing', href: '/dashboard-v2/pricing' },
  { id: 'coupons', icon: Ticket, label: 'Coupons', href: '/dashboard-v2/coupons' },
  { id: 'transactions', icon: CreditCard, label: 'Transactions', href: '/dashboard-v2/transactions' },
];

const settingsNavItems: NavItem[] = [
  { id: 'customize', icon: Palette, label: 'Customize', href: '/dashboard-v2/customize' },
  { id: 'settings', icon: Settings, label: 'Settings', href: '/dashboard-v2/settings' },
  { id: 'ai', icon: Lightbulb, label: 'AI Assistant', href: '/dashboard-v2/ai', badge: 2 },
  { id: 'help', icon: HelpCircle, label: 'Help & Support', href: '/dashboard-v2/help' },
];

/**
 * Sidebar Component
 *
 * Main navigation sidebar for the dashboard with:
 * - Community switcher
 * - Navigation sections (Main, Monetization, Settings)
 * - Storage usage and upgrade prompt
 */
export function Sidebar() {
  return (
    <aside className="w-60 border-r bg-muted/10 flex flex-col overflow-y-auto">
      {/* Sidebar Header */}
      <div className="p-5 border-b">
        <div className="flex items-center gap-3 p-3 bg-card border rounded-lg cursor-pointer hover:bg-muted/50 transition-all">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            CO
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold">Community OS</div>
            <div className="text-xs text-muted-foreground">View live →</div>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto p-4">
        <NavSection title="Main" items={mainNavItems} />
        <NavSection title="Monetization" items={monetizationNavItems} />
        <NavSection title="Settings" items={settingsNavItems} />
      </div>

      {/* Sidebar Footer */}
      <SidebarFooter />
    </aside>
  );
}
