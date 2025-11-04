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
import { Modal } from '@/components/ui/Modal';

type Category = 'education' | 'business' | 'creative' | 'fitness' | 'technology' | 'lifestyle' | 'gaming' | 'other';
type Privacy = 'PUBLIC' | 'PRIVATE' | 'SECRET';

interface WizardState {
  name: string;
  description: string;
  slug: string;
  category: Category | null;
  privacy: Privacy | null;
}

interface CommunityWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export function CommunityWizardModal({ isOpen, onClose }: CommunityWizardModalProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [wizardState, setWizardState] = useState<WizardState>({
    name: '',
    description: '',
    slug: '',
    category: null,
    privacy: null,
  });

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleNameChange = (name: string) => {
    const slug = generateSlug(name);
    setWizardState({ ...wizardState, name, slug });
  };

  const canProceed = (step: number): boolean => {
    switch (step) {
      case 1:
        return wizardState.name.trim().length >= 3 && wizardState.description.trim().length >= 10;
      case 2:
        return wizardState.category !== null;
      case 3:
        return wizardState.privacy !== null;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const getCharCount = (text: string, min: number) => {
    const count = text.trim().length;
    const remaining = min - count;
    return { count, remaining, isValid: count >= min };
  };

  const handleNext = () => {
    if (currentStep < 4 && canProceed(currentStep)) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 4) {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/communities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: wizardState.name,
          description: wizardState.description,
          slug: wizardState.slug,
          category: wizardState.category,
          privacy: wizardState.privacy,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create community');
      }

      const data = await response.json();

      // Close modal and redirect
      onClose();
      router.push(`/getting-started`);
      router.refresh();
    } catch (error) {
      console.error('Error creating community:', error);
      alert('Failed to create community. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset wizard state
    setCurrentStep(1);
    setWizardState({
      name: '',
      description: '',
      slug: '',
      category: null,
      privacy: null,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" showCloseButton={true}>
      <div>
        {/* Header */}
        <div
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '32px 40px',
            textAlign: 'center',
          }}
        >
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
            style={{
              background: 'white',
              transform: 'translate(30%, -30%)',
            }}
          />
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Create Your Community</h1>
            <p className="text-base opacity-95">Let's build something amazing together</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div
          className="px-6 py-4"
          style={{
            background: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <WizardProgress
            currentStep={currentStep}
            totalSteps={4}
            steps={['Basics', 'Category', 'Privacy', 'Review']}
          />
        </div>

        {/* Content */}
        <div className="p-6 min-h-[350px]">
          {/* Step 1: Basics */}
          {currentStep === 1 && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                Tell us about your community
              </h2>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold mb-2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Community Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={wizardState.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g., Design Enthusiasts Hub"
                    className="w-full px-4 py-3 rounded-lg border transition-all"
                    style={{
                      background: 'var(--surface-elevated)',
                      borderColor: getCharCount(wizardState.name, 3).isValid ? 'var(--success)' : 'var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Choose a name that reflects your community's purpose
                    </p>
                    <p
                      className="text-xs font-medium"
                      style={{
                        color: getCharCount(wizardState.name, 3).isValid ? 'var(--success)' : 'var(--text-tertiary)'
                      }}
                    >
                      {getCharCount(wizardState.name, 3).count}/3 min
                    </p>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-semibold mb-2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={wizardState.description}
                    onChange={(e) => setWizardState({ ...wizardState, description: e.target.value })}
                    placeholder="What's your community about?"
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border transition-all resize-none"
                    style={{
                      background: 'var(--surface-elevated)',
                      borderColor: getCharCount(wizardState.description, 10).isValid ? 'var(--success)' : 'var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Help people understand what makes your community special
                    </p>
                    <p
                      className="text-xs font-medium"
                      style={{
                        color: getCharCount(wizardState.description, 10).isValid ? 'var(--success)' : 'var(--text-tertiary)'
                      }}
                    >
                      {getCharCount(wizardState.description, 10).count}/10 min
                    </p>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="slug"
                    className="block text-sm font-semibold mb-2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Community URL <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>(optional)</span>
                  </label>
                  <input
                    id="slug"
                    type="text"
                    value={wizardState.slug}
                    onChange={(e) => setWizardState({ ...wizardState, slug: e.target.value })}
                    placeholder="your-community"
                    className="w-full px-4 py-3 rounded-lg border transition-all"
                    style={{
                      background: 'var(--surface-elevated)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  />
                  <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                    yourplatform.com/{wizardState.slug || 'your-community'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Category */}
          {currentStep === 2 && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                What type of community are you creating?
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {CATEGORIES.map((category) => (
                  <CategoryCard
                    key={category.id}
                    name={category.name}
                    icon={category.icon}
                    isSelected={wizardState.category === category.id}
                    onClick={() => setWizardState({ ...wizardState, category: category.id })}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Privacy */}
          {currentStep === 3 && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                Who can join your community?
              </h2>

              <div className="space-y-4">
                {PRIVACY_OPTIONS.map((option) => (
                  <PrivacyOption
                    key={option.value}
                    title={option.title}
                    description={option.description}
                    icon={option.icon}
                    isSelected={wizardState.privacy === option.value}
                    onClick={() => setWizardState({ ...wizardState, privacy: option.value })}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                Review your community
              </h2>

              <div
                className="rounded-xl p-6 mb-6"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                }}
              >
                <h3 className="text-lg font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                  Community Details
                </h3>

                <div className="space-y-4">
                  <div className="pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div className="text-xs font-semibold uppercase mb-1" style={{ color: 'var(--text-secondary)' }}>
                      Name
                    </div>
                    <div className="text-base" style={{ color: 'var(--text-primary)' }}>
                      {wizardState.name}
                    </div>
                  </div>

                  <div className="pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div className="text-xs font-semibold uppercase mb-1" style={{ color: 'var(--text-secondary)' }}>
                      Description
                    </div>
                    <div className="text-base" style={{ color: 'var(--text-primary)' }}>
                      {wizardState.description}
                    </div>
                  </div>

                  <div className="pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div className="text-xs font-semibold uppercase mb-1" style={{ color: 'var(--text-secondary)' }}>
                      Category
                    </div>
                    <div className="text-base" style={{ color: 'var(--text-primary)' }}>
                      {CATEGORIES.find((c) => c.id === wizardState.category)?.name}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold uppercase mb-1" style={{ color: 'var(--text-secondary)' }}>
                      Privacy
                    </div>
                    <div className="text-base" style={{ color: 'var(--text-primary)' }}>
                      {PRIVACY_OPTIONS.find((p) => p.value === wizardState.privacy)?.title}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="rounded-lg p-4 flex gap-3"
                style={{
                  background: 'rgba(99, 102, 241, 0.1)',
                  borderLeft: '4px solid var(--primary-color)',
                }}
              >
                <Info size={20} style={{ color: 'var(--primary-color)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                    Good to know
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    You can change these settings later in your community dashboard.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div
          className="flex justify-between items-center px-6 py-4"
          style={{
            background: 'var(--surface)',
            borderTop: '1px solid var(--border)',
          }}
        >
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
            }}
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed(currentStep) || isSubmitting}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
            style={{
              background: 'var(--primary-color)',
              color: 'white',
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

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </Modal>
  );
}
