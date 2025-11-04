import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UserButton } from "@clerk/nextjs";
import { Users, Settings, TrendingUp, Calendar } from "lucide-react";
import Link from "next/link";
import { DashboardClient } from "./DashboardClient";

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

        {/* Client-side interactive components */}
        <DashboardClient memberships={dbUser.memberships} />

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

      </main>
    </div>
  );
}
