"use client";

import { Moon, Sun, Download, Plus } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

interface TopBarProps {
  title: string;
  subtitle?: string;
}

/**
 * TopBar Component
 *
 * Top navigation bar with:
 * - Page title and subtitle
 * - Theme toggle
 * - Export report button
 * - New post button
 */
export function TopBar({ title, subtitle }: TopBarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-b bg-card px-6 py-4 flex items-center justify-between shadow-sm">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </Button>

        {/* Export Report */}
        <Button variant="outline" size="default">
          <Download size={16} className="mr-2" />
          Export Report
        </Button>

        {/* New Post */}
        <Button>
          <Plus size={16} className="mr-2" />
          New Post
        </Button>
      </div>
    </header>
  );
}
