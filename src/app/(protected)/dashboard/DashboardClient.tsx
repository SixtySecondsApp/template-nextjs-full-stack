'use client';

import { useState } from 'react';
import { Plus, Users } from 'lucide-react';
import Link from 'next/link';
import { CommunityWizardModal } from '@/components/wizard/CommunityWizardModal';

interface Membership {
  id: string;
  community: {
    name: string;
    slug?: string;
  };
  role: string;
}

interface DashboardClientProps {
  memberships: Membership[];
}

export function DashboardClient({ memberships }: DashboardClientProps) {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  return (
    <>
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => setIsWizardOpen(true)}
          className="p-6 rounded-xl border transition-all text-left w-full"
          style={{
            background: 'linear-gradient(135deg, var(--primary-color), #8b5cf6)',
            borderColor: 'transparent',
            boxShadow: 'var(--shadow-md)',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
        >
          <div className="flex items-center gap-4 text-white">
            <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
              <Plus size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">Create New Community</h3>
              <p className="text-white/80 text-sm">Start building your community today</p>
            </div>
          </div>
        </button>

        <Link
          href="/community-example"
          className="p-6 rounded-xl border transition-all hover:shadow-md"
          style={{
            background: 'var(--surface-elevated)',
            borderColor: 'var(--border)',
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
              style={{ background: 'var(--primary-color)' }}
            >
              <Users size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                View Example Community
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                See what a community looks like
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Your Communities Section */}
      <div
        className="p-8 rounded-xl border"
        style={{
          background: 'var(--surface-elevated)',
          borderColor: 'var(--border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Your Communities
          </h3>
          <button
            onClick={() => setIsWizardOpen(true)}
            className="px-4 py-2 rounded-lg font-semibold transition-all"
            style={{
              background: 'var(--primary-color)',
              color: 'white',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Plus size={16} className="inline mr-2" />
            New Community
          </button>
        </div>

        {memberships.length === 0 ? (
          <div className="text-center py-12">
            <div
              className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'rgba(99, 102, 241, 0.1)' }}
            >
              <Users size={32} style={{ color: 'var(--primary-color)' }} />
            </div>
            <h4 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              No communities yet
            </h4>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
              Create your first community or join existing ones to get started.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setIsWizardOpen(true)}
                className="px-6 py-3 rounded-lg font-semibold transition-all"
                style={{
                  background: 'var(--primary-color)',
                  color: 'white',
                }}
              >
                Create Community
              </button>
              <Link
                href="/communities/browse"
                className="px-6 py-3 rounded-lg font-semibold border transition-all"
                style={{
                  background: 'transparent',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                }}
              >
                Browse Communities
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {memberships.map((membership) => (
              <Link
                key={membership.id}
                href={`/communities/${membership.community.slug || membership.id}`}
                className="p-6 border rounded-xl transition-all hover:shadow-md"
                style={{
                  background: 'var(--surface)',
                  borderColor: 'var(--border)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl"
                      style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
                    >
                      {membership.community.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                        {membership.community.name}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{
                            background:
                              membership.role === 'OWNER' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                            color: membership.role === 'OWNER' ? 'var(--warning)' : 'var(--primary-color)',
                          }}
                        >
                          {membership.role}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="px-4 py-2 rounded-lg font-medium transition-all"
                    style={{
                      background: 'rgba(99, 102, 241, 0.1)',
                      color: 'var(--primary-color)',
                    }}
                  >
                    View →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Community Creation Wizard Modal */}
      <CommunityWizardModal isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />
    </>
  );
}
