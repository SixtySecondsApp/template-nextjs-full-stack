import { ReactNode } from 'react';
import { Sidebar } from '@/components/dashboard-v2/sidebar/sidebar';
import { TopBar } from '@/components/dashboard-v2/layout/top-bar';

interface DashboardV2LayoutProps {
  children: ReactNode;
}

/**
 * Dashboard V2 Layout
 *
 * Layout wrapper for the new dashboard with sidebar navigation
 * Based on Community OS design system
 */
export default function DashboardV2Layout({ children }: DashboardV2LayoutProps) {
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
