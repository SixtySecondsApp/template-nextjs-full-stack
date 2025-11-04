import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { PartyPopper } from 'lucide-react';
import { ProgressOverviewCard } from '@/components/onboarding/ProgressOverviewCard';
import { TaskChecklist } from '@/components/onboarding/TaskChecklist';
import { ResourceCard } from '@/components/onboarding/ResourceCard';
import { ActionButton } from '@/components/onboarding/ActionButton';
import { GettingStartedClient } from './GettingStartedClient';

export default async function GettingStartedPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Hero Header */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        {/* Decorative background element */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{
            background: 'white',
            transform: 'translate(30%, -30%)',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="mb-6 flex justify-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255, 255, 255, 0.2)' }}
            >
              <PartyPopper size={40} />
            </div>
          </div>

          <h1 className="text-5xl font-bold mb-4">
            Welcome to Your Community!
          </h1>
          <p className="text-xl opacity-90">
            Let's get you started with some essential steps
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Progress Overview and Checklist */}
        <GettingStartedClient />

        {/* Helpful Resources */}
        <div className="mb-12">
          <h2
            className="text-3xl font-bold mb-8"
            style={{ color: 'var(--text-primary)' }}
          >
            Helpful Resources
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResourceCard
              iconName="BookOpen"
              title="Quick Start Guide"
              description="Learn the basics of managing your community in 5 minutes"
              href="/help/quick-start"
            />

            <ResourceCard
              iconName="Video"
              title="Video Tutorials"
              description="Watch step-by-step videos on key features and best practices"
              href="/help/videos"
            />

            <ResourceCard
              iconName="Lightbulb"
              title="Best Practices"
              description="Discover tips from successful community builders"
              href="/help/best-practices"
            />

            <ResourceCard
              iconName="LifeBuoy"
              title="Get Support"
              description="Have questions? Our support team is here to help"
              href="/support"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
          <ActionButton href="/dashboard" variant="primary">
            Go to Dashboard →
          </ActionButton>

          <ActionButton href="/dashboard" variant="secondary">
            Skip Tour
          </ActionButton>
        </div>
      </main>
    </div>
  );
}
