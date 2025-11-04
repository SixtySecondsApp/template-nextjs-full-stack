'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { MetricChangeType } from '@/application/dto/dashboard.dto';
import { MetricCardSkeleton } from './MetricCardSkeleton';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: MetricChangeType;
  icon: React.ReactNode;
  loading?: boolean;
}

export function MetricCard({
  title,
  value,
  change,
  changeType,
  icon,
  loading = false,
}: MetricCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (loading) {
    return <MetricCardSkeleton />;
  }

  const changeColor =
    changeType === 'positive'
      ? 'var(--success)'
      : changeType === 'negative'
      ? 'var(--danger)'
      : 'var(--text-tertiary)';

  const ChangeIcon =
    changeType === 'positive'
      ? TrendingUp
      : changeType === 'negative'
      ? TrendingDown
      : Minus;

  return (
    <div
      style={{
        background: 'var(--surface-elevated)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '20px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: isHovered ? 'var(--shadow-md)' : 'none',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            background: 'rgba(99, 102, 241, 0.1)'
          }}
        >
          {icon}
        </div>
        <div style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          fontWeight: '500'
        }}>
          {title}
        </div>
      </div>
      <div style={{
        fontSize: '32px',
        fontWeight: '700',
        marginBottom: '8px'
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        color: changeColor
      }}>
        <ChangeIcon style={{ width: '16px', height: '16px' }} />
        <span>{change}</span>
      </div>
    </div>
  );
}
