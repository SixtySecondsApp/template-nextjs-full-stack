'use client';

import React from 'react';
import * as Icons from 'lucide-react';

interface ResourceCardProps {
  iconName: string;
  title: string;
  description: string;
  href?: string;
  onClick?: () => void;
}

export function ResourceCard({
  iconName,
  title,
  description,
  href,
  onClick,
}: ResourceCardProps) {
  // Dynamically get the icon component from lucide-react
  const Icon = (Icons as any)[iconName] || Icons.HelpCircle;
  const Component = href ? 'a' : 'button';
  const extraProps = href
    ? { href, target: '_blank', rel: 'noopener noreferrer' }
    : { onClick, type: 'button' as const };

  return (
    <Component
      {...extraProps}
      className="p-6 rounded-xl border transition-all duration-200 text-left block w-full"
      style={{
        background: 'var(--surface-elevated)',
        borderColor: 'var(--border)',
        boxShadow: 'var(--shadow-sm)',
        cursor: 'pointer',
        textDecoration: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        e.currentTarget.style.borderColor = 'var(--primary-color)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      <div className="flex flex-col gap-4">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{
            background: 'rgba(99, 102, 241, 0.1)',
            color: 'var(--primary-color)',
          }}
        >
          <Icon size={24} />
        </div>

        <div>
          <h4
            className="text-lg font-semibold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            {title}
          </h4>
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            {description}
          </p>
        </div>
      </div>
    </Component>
  );
}
