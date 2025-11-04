"use client";

import { Home, BarChart3, Users, MessageSquare, BookOpen, DollarSign, Ticket, CreditCard, Palette, Settings, Lightbulb, HelpCircle, Building2 } from 'lucide-react';
import { NavSection } from './nav-section';
import { SidebarFooter } from './sidebar-footer';
import { CommunityDropdown } from './CommunityDropdown';

export interface NavItem {
  id: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  href: string;
  badge?: number;
}

// Mock data - In a real app, this would come from the database/API
const mockCommunities = [
  { id: '1', name: 'Community OS', slug: 'community-os' },
  { id: '2', name: 'Tech Innovators', slug: 'tech-innovators' },
  { id: '3', name: 'Design Guild', slug: 'design-guild' },
];

const mainNavItems: NavItem[] = [
  { id: 'home', icon: Home, label: 'Home', href: '/dashboard' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
  { id: 'communities', icon: Building2, label: 'Communities', href: '/dashboard/communities' },
  { id: 'members', icon: Users, label: 'Members', href: '/dashboard/members' },
  { id: 'content', icon: MessageSquare, label: 'Content', href: '/dashboard/content' },
  { id: 'courses', icon: BookOpen, label: 'Courses', href: '/dashboard/courses' },
];

const monetizationNavItems: NavItem[] = [
  { id: 'pricing', icon: DollarSign, label: 'Plans & Pricing', href: '/dashboard/pricing' },
  { id: 'coupons', icon: Ticket, label: 'Coupons', href: '/dashboard/coupons' },
  { id: 'transactions', icon: CreditCard, label: 'Transactions', href: '/dashboard/transactions' },
];

const settingsNavItems: NavItem[] = [
  { id: 'customize', icon: Palette, label: 'Customize', href: '/dashboard/customize' },
  { id: 'settings', icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  { id: 'ai', icon: Lightbulb, label: 'AI Assistant', href: '/dashboard/ai', badge: 2 },
  { id: 'help', icon: HelpCircle, label: 'Help & Support', href: '/dashboard/help' },
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
    <aside style={{
      width: '280px',
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto'
    }}>
      {/* Sidebar Header */}
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
        <CommunityDropdown
          currentCommunity={mockCommunities[0]}
          communities={mockCommunities}
        />
      </div>

      {/* Navigation Sections */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        <NavSection title="Main" items={mainNavItems} />
        <NavSection title="Monetization" items={monetizationNavItems} />
        <NavSection title="Settings" items={settingsNavItems} />
      </div>

      {/* Sidebar Footer */}
      <SidebarFooter />
    </aside>
  );
}
