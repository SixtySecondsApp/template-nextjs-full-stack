"use client";

import { Moon, Sun, Download, Plus } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';

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
  const [exportHovered, setExportHovered] = useState(false);
  const [newPostHovered, setNewPostHovered] = useState(false);
  const [themeToggleHovered, setThemeToggleHovered] = useState(false);

  return (
    <header className="px-6 py-4 flex items-center justify-between" style={{
      background: 'var(--surface-elevated)',
      borderBottom: '1px solid var(--border-default)'
    }}>
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{
          color: 'var(--text-primary)',
          fontSize: '24px',
          fontWeight: 700,
          marginBottom: '4px'
        }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm mt-1" style={{
            fontSize: '14px',
            color: 'var(--text-secondary)'
          }}>{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-all"
          style={{
            background: themeToggleHovered ? 'var(--surface-1)' : 'transparent',
            color: themeToggleHovered ? 'var(--text-primary)' : 'var(--text-secondary)'
          }}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          onMouseEnter={() => setThemeToggleHovered(true)}
          onMouseLeave={() => setThemeToggleHovered(false)}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Export Report */}
        <button
          className="px-4 py-2 rounded-lg font-semibold cursor-pointer transition-all flex items-center gap-2"
          style={{
            background: exportHovered ? 'var(--surface-elevated)' : 'var(--surface-1)',
            color: 'var(--text-primary)',
            border: `1px solid var(--border-default)`,
            fontSize: '14px'
          }}
          onMouseEnter={() => setExportHovered(true)}
          onMouseLeave={() => setExportHovered(false)}
        >
          <Download size={16} />
          Export Report
        </button>

        {/* New Post */}
        <button
          className="px-4 py-2 rounded-lg font-semibold cursor-pointer transition-all flex items-center gap-2"
          style={{
            background: 'var(--color-primary-500)',
            color: 'white',
            border: 'none',
            fontSize: '14px',
            transform: newPostHovered ? 'translateY(-1px)' : 'translateY(0)',
            boxShadow: newPostHovered ? 'var(--shadow-md)' : 'none'
          }}
          onMouseEnter={() => setNewPostHovered(true)}
          onMouseLeave={() => setNewPostHovered(false)}
        >
          <Plus size={16} />
          New Post
        </button>
      </div>
    </header>
  );
}
