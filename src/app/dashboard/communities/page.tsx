import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Metadata } from 'next';
import { CommunitiesClient } from './CommunitiesClient';

export const metadata: Metadata = {
  title: 'Communities | Dashboard',
  description: 'Manage your communities and stay connected with your members',
};

export default async function CommunitiesPage() {
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
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
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
        <CommunitiesClient
          memberships={dbUser.memberships}
          userName={dbUser.firstName || "there"}
        />
      </div>
    </div>
  );
}
