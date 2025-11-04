'use client';

import Link from 'next/link';
import React from 'react';

interface ActionButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function ActionButton({ href, children, variant = 'primary' }: ActionButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Link
      href={href}
      className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all ${
        isPrimary ? '' : 'text-sm'
      }`}
      style={{
        background: isPrimary ? 'var(--primary-color)' : 'transparent',
        color: isPrimary ? 'white' : 'var(--text-secondary)',
      }}
      onMouseEnter={(e) => {
        if (isPrimary) {
          e.currentTarget.style.background = 'var(--primary-hover)';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        } else {
          e.currentTarget.style.textDecoration = 'underline';
        }
      }}
      onMouseLeave={(e) => {
        if (isPrimary) {
          e.currentTarget.style.background = 'var(--primary-color)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        } else {
          e.currentTarget.style.textDecoration = 'none';
        }
      }}
    >
      {children}
    </Link>
  );
}
