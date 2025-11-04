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
    <aside style={{
      width: '240px',
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto'
    }}>
      {/* Sidebar Header */}
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px',
          background: 'var(--surface-elevated)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'var(--surface-elevated)'}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, var(--primary-color), #8b5cf6)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '700',
            fontSize: '16px'
          }}>
            CO
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>Community OS</div>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>View live →</div>
          </div>
        </div>
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
