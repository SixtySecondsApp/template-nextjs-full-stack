import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UserButton } from "@clerk/nextjs";

export default async function DashboardPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/sign-in");
  }

  // Get user from database
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
    include: {
      memberships: {
        where: { deletedAt: null },
        include: { community: true },
      },
    },
  });

  if (!dbUser) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <p className="text-red-800">
            User profile not found. Please refresh the page or contact support.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sixty Community</h1>
          <UserButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome, {dbUser.firstName || "there"}!
          </h2>
          <p className="text-gray-600">
            Here&apos;s what&apos;s happening in your communities.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600">Communities</div>
            <div className="text-3xl font-bold mt-2">
              {dbUser.memberships.length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600">Posts</div>
            <div className="text-3xl font-bold mt-2">0</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600">Enrolled Courses</div>
            <div className="text-3xl font-bold mt-2">0</div>
          </div>
        </div>

        {/* Communities Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Your Communities</h3>

          {dbUser.memberships.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                You haven&apos;t joined any communities yet.
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Browse Communities
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {dbUser.memberships.map(
                (membership: { id: string; community: { name: string }; role: string }) => (
                  <div
                    key={membership.id}
                    className="p-4 border border-gray-200 rounded hover:border-gray-300 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">
                          {membership.community.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Role: {membership.role}
                        </p>
                      </div>
                      <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded">
                        View
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* User Profile Section */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Profile Information</h3>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-semibold">Email:</span> {dbUser.email}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Name:</span>{" "}
              {dbUser.firstName} {dbUser.lastName}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Member Since:</span>{" "}
              {new Date(dbUser.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
