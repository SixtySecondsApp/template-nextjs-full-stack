'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Briefcase,
  Palette,
  Heart,
  Monitor,
  Sparkles,
  Gamepad2,
  MoreHorizontal,
  Globe,
  Lock,
  EyeOff,
  ChevronRight,
  ChevronLeft,
  Check,
  Info,
} from 'lucide-react';
import { WizardProgress, CategoryCard, PrivacyOption } from '@/components/wizard';

type Category = 'education' | 'business' | 'creative' | 'fitness' | 'technology' | 'lifestyle' | 'gaming' | 'other';
type Privacy = 'PUBLIC' | 'PRIVATE' | 'SECRET';

interface WizardState {
  name: string;
  description: string;
  slug: string;
  category: Category | null;
  privacy: Privacy | null;
}

const CATEGORIES = [
  { id: 'education' as Category, name: 'Education', icon: BookOpen },
  { id: 'business' as Category, name: 'Business', icon: Briefcase },
  { id: 'creative' as Category, name: 'Creative', icon: Palette },
  { id: 'fitness' as Category, name: 'Fitness', icon: Heart },
  { id: 'technology' as Category, name: 'Technology', icon: Monitor },
  { id: 'lifestyle' as Category, name: 'Lifestyle', icon: Sparkles },
  { id: 'gaming' as Category, name: 'Gaming', icon: Gamepad2 },
  { id: 'other' as Category, name: 'Other', icon: MoreHorizontal },
];

const PRIVACY_OPTIONS = [
  {
    value: 'PUBLIC' as Privacy,
    title: 'Public',
    description: 'Anyone can find and join your community',
    icon: Globe,
  },
  {
    value: 'PRIVATE' as Privacy,
    title: 'Private',
    description: 'People must request to join and be approved by you',
    icon: Lock,
  },
  {
    value: 'SECRET' as Privacy,
    title: 'Secret',
    description: 'Only people you invite can find and join your community',
    icon: EyeOff,
  },
];

const STEPS = ['Basics', 'Category', 'Privacy', 'Review'];

export function CommunityWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<WizardState>({
    name: '',
    description: '',
    slug: '',
    category: null,
    privacy: null,
  });

  // Auto-generate slug from name
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleNameChange = (name: string) => {
    const slug = formData.slug === generateSlug(formData.name) || !formData.slug
      ? generateSlug(name)
      : formData.slug;
    setFormData({ ...formData, name, slug });
  };

  const canProceedFromStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.name.trim().length > 0 && formData.description.trim().length > 0;
      case 2:
        return formData.category !== null;
      case 3:
        return formData.privacy !== null;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 4 && canProceedFromStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!canProceedFromStep(4)) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/communities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          slug: formData.slug || generateSlug(formData.name),
          category: formData.category,
          privacy: formData.privacy,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create community');
      }

      const data = await response.json();
      router.push(`/communities/${data.slug || data.id}`);
    } catch (error) {
      console.error('Failed to create community:', error);
      alert('Failed to create community. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-10">
      <div
        className="w-full max-w-4xl rounded-2xl overflow-hidden"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Header */}
        <div
          className="text-center px-10 py-12"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <h1 className="text-4xl font-bold mb-3">Create Your Community</h1>
          <p className="text-base opacity-95">Let&apos;s build something amazing together</p>
        </div>

        {/* Progress Bar */}
        <WizardProgress currentStep={currentStep} totalSteps={4} steps={STEPS} />

        {/* Content */}
        <div className="p-10 min-h-[400px]">
          {/* Step 1: Basics */}
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--foreground)' }}>
                Tell us about your community
              </h2>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold mb-2"
                    style={{ color: 'var(--foreground)' }}
                  >
                    Community Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g., Design Enthusiasts Hub"
                    className="w-full px-4 py-3 rounded-lg text-base transition-all"
                    style={{
                      border: '1px solid var(--border)',
                      background: 'var(--surface)',
                      color: 'var(--foreground)',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--primary)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px oklch(from var(--primary) l c h / 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  <p className="text-sm mt-1.5" style={{ color: 'var(--text-tertiary)' }}>
                    Choose a name that reflects your community&apos;s purpose
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-semibold mb-2"
                    style={{ color: 'var(--foreground)' }}
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="What's your community about?"
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg text-base resize-y transition-all"
                    style={{
                      border: '1px solid var(--border)',
                      background: 'var(--surface)',
                      color: 'var(--foreground)',
                      minHeight: '120px',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--primary)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px oklch(from var(--primary) l c h / 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  <p className="text-sm mt-1.5" style={{ color: 'var(--text-tertiary)' }}>
                    Help people understand what makes your community special
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="slug"
                    className="block text-sm font-semibold mb-2"
                    style={{ color: 'var(--foreground)' }}
                  >
                    Community URL{' '}
                    <span className="font-normal" style={{ color: 'var(--text-tertiary)' }}>
                      (optional)
                    </span>
                  </label>
                  <input
                    id="slug"
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="your-community"
                    className="w-full px-4 py-3 rounded-lg text-base transition-all"
                    style={{
                      border: '1px solid var(--border)',
                      background: 'var(--surface)',
                      color: 'var(--foreground)',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--primary)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px oklch(from var(--primary) l c h / 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  <p className="text-sm mt-1.5" style={{ color: 'var(--text-tertiary)' }}>
                    yourplatform.com/{formData.slug || 'your-community'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Category */}
          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--foreground)' }}>
                What type of community are you creating?
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {CATEGORIES.map((category) => (
                  <CategoryCard
                    key={category.id}
                    icon={category.icon}
                    name={category.name}
                    selected={formData.category === category.id}
                    onClick={() => setFormData({ ...formData, category: category.id })}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Privacy */}
          {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--foreground)' }}>
                Who can join your community?
              </h2>

              <div className="space-y-3">
                {PRIVACY_OPTIONS.map((option) => (
                  <PrivacyOption
                    key={option.value}
                    icon={option.icon}
                    title={option.title}
                    description={option.description}
                    selected={formData.privacy === option.value}
                    onClick={() => setFormData({ ...formData, privacy: option.value })}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--foreground)' }}>
                Review your community
              </h2>

              <div
                className="p-6 rounded-xl mb-6"
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                }}
              >
                <h3 className="text-base font-bold mb-5" style={{ color: 'var(--foreground)' }}>
                  Community Details
                </h3>

                <div className="space-y-4">
                  <div className="pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
                    <div
                      className="text-xs font-semibold uppercase tracking-wide mb-1"
                      style={{ color: 'var(--text-tertiary)', letterSpacing: '0.5px' }}
                    >
                      Name
                    </div>
                    <div className="text-base" style={{ color: 'var(--foreground)' }}>
                      {formData.name}
                    </div>
                  </div>

                  <div className="pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
                    <div
                      className="text-xs font-semibold uppercase tracking-wide mb-1"
                      style={{ color: 'var(--text-tertiary)', letterSpacing: '0.5px' }}
                    >
                      Description
                    </div>
                    <div className="text-base" style={{ color: 'var(--foreground)' }}>
                      {formData.description}
                    </div>
                  </div>

                  <div className="pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
                    <div
                      className="text-xs font-semibold uppercase tracking-wide mb-1"
                      style={{ color: 'var(--text-tertiary)', letterSpacing: '0.5px' }}
                    >
                      Category
                    </div>
                    <div className="text-base" style={{ color: 'var(--foreground)' }}>
                      {CATEGORIES.find((c) => c.id === formData.category)?.name}
                    </div>
                  </div>

                  <div>
                    <div
                      className="text-xs font-semibold uppercase tracking-wide mb-1"
                      style={{ color: 'var(--text-tertiary)', letterSpacing: '0.5px' }}
                    >
                      Privacy
                    </div>
                    <div className="text-base" style={{ color: 'var(--foreground)' }}>
                      {PRIVACY_OPTIONS.find((p) => p.value === formData.privacy)?.title}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="p-4 rounded-lg flex gap-3"
                style={{
                  background: 'oklch(from var(--primary) l c h / 0.1)',
                  borderLeft: '4px solid var(--primary)',
                }}
              >
                <div className="flex-shrink-0" style={{ color: 'var(--primary)' }}>
                  <Info size={20} />
                </div>
                <div>
                  <div className="font-semibold mb-1" style={{ color: 'var(--foreground)' }}>
                    Good to know
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    You can change these settings later in your community dashboard.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div
          className="flex justify-between px-10 py-6"
          style={{
            borderTop: '1px solid var(--border)',
            background: 'var(--surface-2)',
          }}
        >
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-6 py-3 rounded-lg text-base font-semibold transition-all flex items-center gap-2 disabled:opacity-0 disabled:pointer-events-none"
            style={{
              background: 'transparent',
              color: 'var(--text-tertiary)',
              border: '1px solid var(--border)',
            }}
            onMouseEnter={(e) => {
              if (currentStep > 1) {
                e.currentTarget.style.background = 'var(--surface)';
                e.currentTarget.style.color = 'var(--foreground)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-tertiary)';
            }}
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <div />

          <button
            onClick={currentStep === 4 ? handleSubmit : handleNext}
            disabled={!canProceedFromStep(currentStep) || isSubmitting}
            className="px-6 py-3 rounded-lg text-base font-semibold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'var(--primary)',
              color: '#ffffff',
            }}
            onMouseEnter={(e) => {
              if (canProceedFromStep(currentStep) && !isSubmitting) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {isSubmitting ? (
              'Creating...'
            ) : currentStep === 4 ? (
              <>
                Create Community
                <Check size={16} />
              </>
            ) : (
              <>
                Next
                <ChevronRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
