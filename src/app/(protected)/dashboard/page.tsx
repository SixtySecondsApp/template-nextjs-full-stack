import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UserButton } from "@clerk/nextjs";
import { Plus, Users, Settings, TrendingUp, Calendar } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/sign-in");
  }

  // Get or create user from database
  let dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
    include: {
      memberships: {
        where: { deletedAt: null },
        include: { community: true },
      },
    },
  });

  // If user doesn't exist in database, create it from Clerk data
  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        imageUrl: clerkUser.imageUrl,
      },
      include: {
        memberships: {
          where: { deletedAt: null },
          include: { community: true },
        },
      },
    });
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Header */}
      <header
        className="border-b"
        style={{
          background: 'var(--surface-elevated)',
          borderColor: 'var(--border)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
              style={{ background: 'linear-gradient(135deg, var(--primary-color), #8b5cf6)' }}
            >
              CO
            </div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Community OS
            </h1>
          </div>
          <UserButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Welcome back, {dbUser.firstName || "there"}!
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Manage your communities and stay connected with your members.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            href="/communities/new"
            className="p-6 rounded-xl border transition-all"
            style={{
              background: 'linear-gradient(135deg, var(--primary-color), #8b5cf6)',
              borderColor: 'transparent',
              boxShadow: 'var(--shadow-md)'
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
          </Link>

          <Link
            href="/community-example"
            className="p-6 rounded-xl border transition-all hover:shadow-md"
            style={{
              background: 'var(--surface-elevated)',
              borderColor: 'var(--border)'
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div
            className="p-6 rounded-xl border"
            style={{
              background: 'var(--surface-elevated)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)' }}
              >
                <Users size={20} />
              </div>
              <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Communities
              </div>
            </div>
            <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {dbUser.memberships.length}
            </div>
          </div>

          <div
            className="p-6 rounded-xl border"
            style={{
              background: 'var(--surface-elevated)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}
              >
                <TrendingUp size={20} />
              </div>
              <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Total Members
              </div>
            </div>
            <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              0
            </div>
          </div>

          <div
            className="p-6 rounded-xl border"
            style={{
              background: 'var(--surface-elevated)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}
              >
                <Calendar size={20} />
              </div>
              <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Active Events
              </div>
            </div>
            <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              0
            </div>
          </div>

          <div
            className="p-6 rounded-xl border"
            style={{
              background: 'var(--surface-elevated)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)' }}
              >
                <Settings size={20} />
              </div>
              <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Settings
              </div>
            </div>
            <Link
              href="/settings"
              className="text-sm font-semibold hover:underline"
              style={{ color: 'var(--primary-color)' }}
            >
              Manage →
            </Link>
          </div>
        </div>

        {/* Your Communities Section */}
        <div
          className="p-8 rounded-xl border"
          style={{
            background: 'var(--surface-elevated)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Your Communities
            </h3>
            <Link
              href="/communities/new"
              className="px-4 py-2 rounded-lg font-semibold transition-all"
              style={{
                background: 'var(--primary-color)',
                color: 'white'
              }}
            >
              <Plus size={16} className="inline mr-2" />
              New Community
            </Link>
          </div>

          {dbUser.memberships.length === 0 ? (
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
                <Link
                  href="/communities/new"
                  className="px-6 py-3 rounded-lg font-semibold transition-all"
                  style={{
                    background: 'var(--primary-color)',
                    color: 'white'
                  }}
                >
                  Create Community
                </Link>
                <Link
                  href="/communities/browse"
                  className="px-6 py-3 rounded-lg font-semibold border transition-all"
                  style={{
                    background: 'transparent',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)'
                  }}
                >
                  Browse Communities
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {dbUser.memberships.map(
                (membership: { id: string; community: { name: string; slug?: string }; role: string }) => (
                  <Link
                    key={membership.id}
                    href={`/communities/${membership.community.slug || membership.id}`}
                    className="p-6 border rounded-xl transition-all hover:shadow-md"
                    style={{
                      background: 'var(--surface)',
                      borderColor: 'var(--border)'
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
                                background: membership.role === 'OWNER'
                                  ? 'rgba(245, 158, 11, 0.1)'
                                  : 'rgba(99, 102, 241, 0.1)',
                                color: membership.role === 'OWNER'
                                  ? 'var(--warning)'
                                  : 'var(--primary-color)'
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
                          color: 'var(--primary-color)'
                        }}
                      >
                        View →
                      </div>
                    </div>
                  </Link>
                )
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
