import { ReactNode } from 'react';
import { Sidebar } from '@/components/dashboard-new/sidebar/sidebar';
import { TopBar } from '@/components/dashboard-new/layout/top-bar';

interface DashboardLayoutProps {
  children: ReactNode;
}

/**
 * Dashboard Layout
 *
 * Layout wrapper for the dashboard with sidebar navigation
 * Based on Community OS design system
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background)' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar
          title="Home"
          subtitle="Overview of your community performance"
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto" style={{ background: 'var(--background)' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
