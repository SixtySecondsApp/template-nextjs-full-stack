"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Plus, ExternalLink } from 'lucide-react';

interface Community {
  id: string;
  name: string;
  slug: string;
  avatar?: string;
}

interface CommunityDropdownProps {
  currentCommunity: Community;
  communities?: Community[];
}

/**
 * CommunityDropdown Component
 *
 * Dropdown menu for switching between communities with:
 * - Current community display
 * - Community list with switching
 * - Link to community example
 * - Create new community option
 */
export function CommunityDropdown({ currentCommunity, communities = [] }: CommunityDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Current Community Button */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px',
          background: isHovered || isOpen ? 'var(--surface)' : 'var(--surface-elevated)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          transition: 'all 0.2s'
        }}
      >
        <div style={{
          width: '40px',
          height: '40px',
          background: 'linear-gradient(135deg, var(--primary-color), #8b5cf6)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: '700',
          fontSize: '16px'
        }}>
          {getInitials(currentCommunity.name)}
        </div>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>
            {currentCommunity.name}
          </div>
          <Link
            href="/community-example"
            style={{
              fontSize: '12px',
              color: 'var(--text-tertiary)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'none',
              width: 'fit-content'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            View live
            <ExternalLink style={{ width: '10px', height: '10px' }} />
          </Link>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <ChevronDown
            style={{
              width: '16px',
              height: '16px',
              color: 'var(--text-tertiary)',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s'
            }}
          />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          right: 0,
          background: 'var(--surface-elevated)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 50,
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          {/* Communities List */}
          {communities.length > 0 && (
            <div style={{ padding: '8px' }}>
              <div style={{
                fontSize: '11px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: 'var(--text-tertiary)',
                padding: '8px 12px 4px'
              }}>
                Your Communities
              </div>
              {communities.map((community) => (
                <DropdownItem
                  key={community.id}
                  community={community}
                  isActive={community.id === currentCommunity.id}
                  onClick={() => {
                    // In a real app, this would switch the dashboard context
                    window.location.href = `/dashboard?community=${community.slug}`;
                  }}
                />
              ))}
            </div>
          )}

          {/* Divider */}
          <div style={{
            height: '1px',
            background: 'var(--border)',
            margin: '8px 0'
          }} />

          {/* Actions */}
          <div style={{ padding: '8px' }}>
            <Link
              href="/community-example"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '6px',
                textDecoration: 'none',
                color: 'var(--text-primary)',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              onClick={() => setIsOpen(false)}
            >
              <ExternalLink style={{ width: '16px', height: '16px', color: 'var(--text-secondary)' }} />
              <span>View Example Community</span>
            </Link>

            <button
              onClick={() => {
                setIsOpen(false);
                // In a real app, this would open the community creation wizard
                window.location.href = '/dashboard/communities';
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '6px',
                border: 'none',
                background: 'transparent',
                color: 'var(--primary-color)',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <Plus style={{ width: '16px', height: '16px' }} />
              <span>Create New Community</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DropdownItem({
  community,
  isActive,
  onClick
}: {
  community: Community;
  isActive: boolean;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 12px',
        borderRadius: '6px',
        border: 'none',
        background: isActive ? 'rgba(99, 102, 241, 0.1)' : isHovered ? 'var(--surface)' : 'transparent',
        color: 'var(--text-primary)',
        cursor: 'pointer',
        transition: 'all 0.2s',
        textAlign: 'left'
      }}
    >
      <div style={{
        width: '32px',
        height: '32px',
        background: 'linear-gradient(135deg, var(--primary-color), #8b5cf6)',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: '600',
        fontSize: '13px',
        flexShrink: 0
      }}>
        {getInitials(community.name)}
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{
          fontWeight: isActive ? '600' : '500',
          fontSize: '14px',
          color: isActive ? 'var(--primary-color)' : 'var(--text-primary)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {community.name}
        </div>
      </div>
      {isActive && (
        <div style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: 'var(--primary-color)'
        }} />
      )}
    </button>
  );
}
