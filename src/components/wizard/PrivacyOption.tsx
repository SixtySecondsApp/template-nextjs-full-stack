'use client';

import { LucideIcon } from 'lucide-react';
import { Check } from 'lucide-react';

interface PrivacyOptionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

export function PrivacyOption({
  icon: Icon,
  title,
  description,
  isSelected,
  onClick,
}: PrivacyOptionProps) {
  return (
    <div
      onClick={onClick}
      className="p-5 rounded-xl cursor-pointer transition-all flex items-start gap-4 relative"
      style={{
        border: isSelected ? '3px solid var(--primary-color)' : '2px solid var(--border)',
        background: isSelected ? 'rgba(99, 102, 241, 0.08)' : 'var(--surface-elevated)',
        boxShadow: isSelected ? '0 0 0 3px rgba(99, 102, 241, 0.2)' : 'none',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = 'var(--primary-color)';
          e.currentTarget.style.background = 'rgba(99, 102, 241, 0.04)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.background = 'var(--surface-elevated)';
        }
      }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{
          background: isSelected ? 'var(--primary-color)' : 'rgba(99, 102, 241, 0.1)',
          color: isSelected ? 'white' : 'var(--primary-color)',
        }}
      >
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <h4
          className="text-base font-semibold mb-1"
          style={{ color: isSelected ? 'var(--primary-color)' : 'var(--text-primary)' }}
        >
          {title}
        </h4>
        <p
          className="text-sm"
          style={{ color: 'var(--text-secondary)' }}
        >
          {description}
        </p>
      </div>
      {isSelected && (
        <div
          className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
          style={{
            background: 'var(--primary-color)',
            color: 'white',
          }}
        >
          <Check size={14} strokeWidth={3} />
        </div>
      )}
    </div>
  );
}
