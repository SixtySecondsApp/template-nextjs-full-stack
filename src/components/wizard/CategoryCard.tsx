'use client';

import { LucideIcon } from 'lucide-react';
import { Check } from 'lucide-react';

interface CategoryCardProps {
  icon: LucideIcon;
  name: string;
  isSelected: boolean;
  onClick: () => void;
}

export function CategoryCard({ icon: Icon, name, isSelected, onClick }: CategoryCardProps) {
  return (
    <div
      onClick={onClick}
      className="p-6 rounded-xl text-center cursor-pointer transition-all relative"
      style={{
        border: isSelected ? '3px solid var(--primary-color)' : '2px solid var(--border)',
        background: isSelected ? 'rgba(99, 102, 241, 0.08)' : 'var(--surface-elevated)',
        transform: 'translateY(0)',
        boxShadow: isSelected ? '0 0 0 3px rgba(99, 102, 241, 0.2)' : 'none',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = 'var(--primary-color)';
          e.currentTarget.style.background = 'rgba(99, 102, 241, 0.04)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.background = 'var(--surface-elevated)';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      {isSelected && (
        <div
          className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
          style={{
            background: 'var(--primary-color)',
            color: 'white',
          }}
        >
          <Check size={14} strokeWidth={3} />
        </div>
      )}
      <div
        className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center"
        style={{
          background: isSelected ? 'var(--primary-color)' : 'rgba(99, 102, 241, 0.1)',
          color: isSelected ? 'white' : 'var(--primary-color)',
        }}
      >
        <Icon size={24} />
      </div>
      <div
        className="text-sm font-semibold"
        style={{ color: isSelected ? 'var(--primary-color)' : 'var(--text-primary)' }}
      >
        {name}
      </div>
    </div>
  );
}
