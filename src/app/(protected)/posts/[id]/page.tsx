import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Heart, MessageSquare, Eye, ChevronRight, Pin, CheckCircle, ThumbsUp } from 'lucide-react';
import { Comment } from '@/components/forum/Comment';
import { RichTextEditor } from '@/components/editor/RichTextEditor';
import { formatRelativeTime, formatNumber } from '@/lib/utils/formatters';

// This would normally come from your API/database
async function getPost(id: string) {
  // TODO: Replace with actual API call
  // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`);
  // if (!response.ok) return null;
  // return response.json();

  // Mock data for now
  return {
    id,
    title: 'How to implement authentication in Next.js 15?',
    content: `
      <p>I'm building a new application with Next.js 15 and I'm trying to implement authentication. I've looked at several options including:</p>
      <ul>
        <li>NextAuth.js</li>
        <li>Clerk</li>
        <li>Auth0</li>
        <li>Custom JWT implementation</li>
      </ul>
      <p>What would you recommend for a modern full-stack application? I need:</p>
      <ol>
        <li>Social login (Google, GitHub)</li>
        <li>Email/password authentication</li>
        <li>Protected routes</li>
        <li>Session management</li>
      </ol>
      <p>Any advice or examples would be greatly appreciated!</p>
    `,
    authorId: 'user-1',
    authorName: 'John Doe',
    authorAvatar: undefined,
    communityId: 'community-1',
    communityName: 'Web Development',
    likeCount: 42,
    helpfulCount: 15,
    commentCount: 8,
    viewCount: 234,
    isPinned: false,
    isSolved: true,
    createdAt: new Date('2024-03-10T10:30:00'),
    updatedAt: new Date('2024-03-10T14:20:00'),
    comments: [
      {
        id: 'comment-1',
        content: '<p>I highly recommend using <strong>Clerk</strong> for Next.js 15. It has excellent App Router support and provides pre-built components that work great with Server Components.</p>',
        authorId: 'user-2',
        authorName: 'Jane Smith',
        authorAvatar: undefined,
        likeCount: 12,
        helpfulCount: 8,
        createdAt: new Date('2024-03-10T11:00:00'),
        isAuthor: false,
        replies: [
          {
            id: 'comment-2',
            content: '<p>Thanks for the suggestion! Have you used it in production?</p>',
            authorId: 'user-1',
            authorName: 'John Doe',
            authorAvatar: undefined,
            likeCount: 2,
            helpfulCount: 0,
            createdAt: new Date('2024-03-10T11:15:00'),
            isAuthor: true,
            replies: []
          },
          {
            id: 'comment-3',
            content: '<p>Yes! We use it for several projects. The free tier is generous and it scales well.</p>',
            authorId: 'user-2',
            authorName: 'Jane Smith',
            authorAvatar: undefined,
            likeCount: 5,
            helpfulCount: 3,
            createdAt: new Date('2024-03-10T11:30:00'),
            isAuthor: false,
            replies: []
          }
        ]
      },
      {
        id: 'comment-4',
        content: '<p>Another option is NextAuth v5 (Auth.js). It has built-in support for App Router and edge runtime.</p>',
        authorId: 'user-3',
        authorName: 'Bob Wilson',
        authorAvatar: undefined,
        likeCount: 8,
        helpfulCount: 4,
        createdAt: new Date('2024-03-10T12:00:00'),
        isAuthor: false,
        replies: []
      }
    ]
  };
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-text-tertiary mb-6">
          <Link href="/forum" className="hover:text-primary-color transition-colors">
            Forum
          </Link>
          <ChevronRight size={16} />
          {post.communityName && (
            <>
              <Link
                href={`/communities/${post.communityId}`}
                className="hover:text-primary-color transition-colors"
              >
                {post.communityName}
              </Link>
              <ChevronRight size={16} />
            </>
          )}
          <span className="text-text-secondary">Post</span>
        </nav>

        {/* Post Header */}
        <div className="bg-surface-elevated rounded-lg border border-border-color overflow-hidden mb-6">
          <div className="p-6">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-3">
              {post.isPinned && (
                <span className="flex items-center gap-1 px-2 py-1 bg-warning/10 text-warning rounded text-xs font-medium">
                  <Pin size={12} />
                  Pinned
                </span>
              )}
              {post.isSolved && (
                <span className="flex items-center gap-1 px-2 py-1 bg-success/10 text-success rounded text-xs font-medium">
                  <CheckCircle size={12} />
                  Solved
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-text-primary mb-4">{post.title}</h1>

            {/* Author and Meta */}
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6 pb-6 border-b border-border-color">
              <div className="flex items-center gap-3">
                {post.authorAvatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary-color/10 flex items-center justify-center text-primary-color font-medium">
                    {post.authorName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-text-primary">{post.authorName}</div>
                  <div className="text-sm text-text-tertiary">
                    Posted {formatRelativeTime(post.createdAt)}
                    {post.updatedAt && post.updatedAt !== post.createdAt && (
                      <> • Updated {formatRelativeTime(post.updatedAt)}</>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-text-tertiary">
                <div className="flex items-center gap-1.5">
                  <Eye size={16} />
                  <span>{formatNumber(post.viewCount)} views</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageSquare size={16} />
                  <span>{formatNumber(post.commentCount)} comments</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div
              className="prose prose-lg dark:prose-invert max-w-none mb-6"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Actions */}
            <div className="flex items-center gap-4 pt-6 border-t border-border-color">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-surface transition-colors text-text-secondary hover:text-danger">
                <Heart size={18} />
                <span>{formatNumber(post.likeCount)} Likes</span>
              </button>

              <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-surface transition-colors text-text-secondary hover:text-success">
                <ThumbsUp size={18} />
                <span>{formatNumber(post.helpfulCount)} Helpful</span>
              </button>

              {/* Admin Actions */}
              {/* TODO: Only show for moderators/admins */}
              {false && (
                <>
                  <button className="ml-auto px-4 py-2 border border-border-color rounded-lg hover:bg-surface transition-colors text-sm">
                    {post.isPinned ? 'Unpin' : 'Pin Post'}
                  </button>
                  <button className="px-4 py-2 border border-border-color rounded-lg hover:bg-surface transition-colors text-sm">
                    {post.isSolved ? 'Mark Unsolved' : 'Mark Solved'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-surface-elevated rounded-lg border border-border-color p-6">
          <h2 className="text-xl font-bold text-text-primary mb-6">
            Comments ({post.commentCount})
          </h2>

          {/* Comment Composer */}
          <div className="mb-8">
            <CommentComposerClient postId={post.id} />
          </div>

          {/* Comment List */}
          {post.comments && post.comments.length > 0 ? (
            <div className="space-y-4">
              {post.comments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  maxDepth={2}
                  onReply={async (parentId, content) => {
                    // TODO: Implement API call
                    console.log('Reply to', parentId, content);
                  }}
                  onEdit={async (commentId, content) => {
                    // TODO: Implement API call
                    console.log('Edit', commentId, content);
                  }}
                  onDelete={async (commentId) => {
                    // TODO: Implement API call
                    console.log('Delete', commentId);
                  }}
                  onLike={async (commentId) => {
                    // TODO: Implement API call
                    console.log('Like', commentId);
                  }}
                  onMarkHelpful={async (commentId) => {
                    // TODO: Implement API call
                    console.log('Mark helpful', commentId);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-text-tertiary">
              <MessageSquare size={48} className="mx-auto mb-3 opacity-50" />
              <p>No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Client component for comment composer
'use client';

import { useState } from 'react';

function CommentComposerClient({ postId }: { postId: string }) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content || content === '<p></p>') return;

    setIsSubmitting(true);
    try {
      // TODO: Implement API call
      // await fetch(`/api/posts/${postId}/comments`, {
      //   method: 'POST',
      //   body: JSON.stringify({ content })
      // });
      console.log('Submit comment for post:', postId, content);
      setContent('');
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <RichTextEditor
        onChange={setContent}
        placeholder="Write a comment..."
        minHeight="150px"
      />
      <div className="flex justify-end mt-3">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !content || content === '<p></p>'}
          className="px-6 py-2 bg-primary-color text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </div>
  );
}
