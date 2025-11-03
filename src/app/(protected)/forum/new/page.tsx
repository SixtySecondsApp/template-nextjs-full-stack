'use client';

import { useRouter } from 'next/navigation';
import { PostComposer } from '@/components/forum/PostComposer';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

// Mock communities - replace with actual API call
const mockCommunities = [
  { id: 'community-1', name: 'Web Development' },
  { id: 'community-2', name: 'React' },
  { id: 'community-3', name: 'TypeScript' },
  { id: 'community-4', name: 'Performance' },
  { id: 'community-5', name: 'DevOps' }
];

export default function NewPostPage() {
  const router = useRouter();

  const handlePublish = async (data: { title: string; content: string; communityId: string }) => {
    // TODO: Implement API call
    // const response = await fetch('/api/posts', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
    // const post = await response.json();
    // await fetch(`/api/posts/${post.id}/publish`, { method: 'POST' });

    console.log('Publishing post:', data);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Redirect to forum after successful publish
    router.push('/forum');
  };

  const handleSaveDraft = async (data: { title: string; content: string; communityId: string }) => {
    // TODO: Implement API call
    // await fetch('/api/posts', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });

    console.log('Saving draft:', data);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const handleCancel = () => {
    router.push('/forum');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/forum"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-primary-color transition-colors mb-6"
        >
          <ChevronLeft size={20} />
          <span>Back to Forum</span>
        </Link>

        {/* Post Composer */}
        <PostComposer
          communities={mockCommunities}
          onPublish={handlePublish}
          onSaveDraft={handleSaveDraft}
          onCancel={handleCancel}
        />

        {/* Tips */}
        <div className="mt-8 bg-surface-elevated rounded-lg border border-border-color p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Writing Tips</h3>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li>• Use a clear, descriptive title that summarizes your question or topic</li>
            <li>• Provide enough context for others to understand your situation</li>
            <li>• Include relevant code snippets or examples when applicable</li>
            <li>• Format your post using the rich text editor for better readability</li>
            <li>• Be respectful and follow community guidelines</li>
            <li>• Mark your post as solved once you receive a helpful answer</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
