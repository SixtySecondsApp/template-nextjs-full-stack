import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Home() {
  const user = await currentUser();

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex justify-between items-center p-4 bg-white border-b">
          <h1 className="text-2xl font-bold text-blue-600">Sixty Community</h1>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center min-h-screen gap-6">
          <div className="text-center">
            <h2 className="text-5xl font-bold mb-4">Welcome back!</h2>
            <p className="text-xl text-gray-700 mb-8">
              You're logged in to Sixty Community OS
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex justify-between items-center p-4 bg-white border-b">
        <h1 className="text-2xl font-bold text-blue-600">Sixty Community</h1>
        <div className="flex gap-2">
          <Link
            href="/sign-in"
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] gap-6 px-4">
        <div className="text-center max-w-2xl">
          <h2 className="text-5xl font-bold mb-4">
            Connect with Your Community
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Sixty Community OS is a modern platform for building engaged communities.
            Join today to discover, learn, and grow together.
          </p>

          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <Link
              href="/sign-up"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
            >
              Get Started Free
            </Link>
            <Link
              href="/sign-in"
              className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition text-lg font-semibold"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2">Community Forum</h3>
            <p className="text-gray-600">
              Engage in meaningful discussions with members of your community.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2">Online Courses</h3>
            <p className="text-gray-600">
              Access educational content created by community experts.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2">Monetization</h3>
            <p className="text-gray-600">
              Support creators with subscriptions and premium content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
