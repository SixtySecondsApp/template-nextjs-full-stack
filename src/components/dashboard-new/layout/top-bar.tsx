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
    <header style={{
      background: 'var(--surface-elevated)',
      borderBottom: '1px solid var(--border)',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          marginBottom: '4px'
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{
            fontSize: '14px',
            color: 'var(--text-secondary)'
          }}>{subtitle}</p>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {/* Theme Toggle */}
        <button
          style={{
            width: '36px',
            height: '36px',
            border: 'none',
            background: themeToggleHovered ? 'var(--surface)' : 'transparent',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: themeToggleHovered ? 'var(--text-primary)' : 'var(--text-secondary)',
            transition: 'all 0.2s'
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
          style={{
            padding: '10px 16px',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: exportHovered ? 'var(--surface-elevated)' : 'var(--surface)',
            color: 'var(--text-primary)'
          }}
          onMouseEnter={() => setExportHovered(true)}
          onMouseLeave={() => setExportHovered(false)}
        >
          <Download size={16} />
          Export Report
        </button>

        {/* New Post */}
        <button
          style={{
            padding: '10px 16px',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--primary-color)',
            color: 'white',
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
