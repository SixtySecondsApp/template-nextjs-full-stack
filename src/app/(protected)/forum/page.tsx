'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Plus, Filter, TrendingUp, Clock, CheckCircle, Star } from 'lucide-react';
import { PostCard } from '@/components/forum/PostCard';

// Mock data - replace with actual API calls
const mockPosts = [
  {
    id: '1',
    title: 'How to implement authentication in Next.js 15?',
    content: '<p>I\'m building a new application with Next.js 15 and I\'m trying to implement authentication. What would you recommend?</p>',
    authorName: 'John Doe',
    likeCount: 42,
    helpfulCount: 15,
    commentCount: 8,
    viewCount: 234,
    isPinned: true,
    isSolved: true,
    createdAt: new Date('2024-03-10T10:30:00'),
    communityName: 'Web Development'
  },
  {
    id: '2',
    title: 'Best practices for state management in React 19',
    content: '<p>With React 19 introducing new features, what are the current best practices for state management in large applications?</p>',
    authorName: 'Jane Smith',
    likeCount: 28,
    helpfulCount: 12,
    commentCount: 15,
    viewCount: 456,
    isPinned: false,
    isSolved: false,
    createdAt: new Date('2024-03-09T14:20:00'),
    communityName: 'React'
  },
  {
    id: '3',
    title: 'TypeScript strict mode causing issues',
    content: '<p>I enabled TypeScript strict mode and now I\'m getting hundreds of errors. How should I approach fixing these?</p>',
    authorName: 'Bob Wilson',
    likeCount: 18,
    helpfulCount: 7,
    commentCount: 12,
    viewCount: 189,
    isPinned: false,
    isSolved: true,
    createdAt: new Date('2024-03-08T09:15:00'),
    communityName: 'TypeScript'
  },
  {
    id: '4',
    title: 'Optimizing performance for large data tables',
    content: '<p>I have a table with 10k+ rows and it\'s becoming sluggish. What are the best optimization techniques?</p>',
    authorName: 'Alice Johnson',
    likeCount: 35,
    helpfulCount: 20,
    commentCount: 23,
    viewCount: 678,
    isPinned: false,
    isSolved: false,
    createdAt: new Date('2024-03-07T16:45:00'),
    communityName: 'Performance'
  },
  {
    id: '5',
    title: 'Setting up CI/CD with GitHub Actions',
    content: '<p>Looking for recommendations on setting up a robust CI/CD pipeline using GitHub Actions for a Next.js project.</p>',
    authorName: 'Charlie Brown',
    likeCount: 22,
    helpfulCount: 10,
    commentCount: 9,
    viewCount: 234,
    isPinned: false,
    isSolved: false,
    createdAt: new Date('2024-03-06T11:30:00'),
    communityName: 'DevOps'
  }
];

type FilterType = 'all' | 'new' | 'top' | 'solved' | 'trending';
type SortType = 'recent' | 'popular' | 'helpful';

export default function ForumPage() {
  const [posts, setPosts] = useState(mockPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('recent');
  const [isLoading] = useState(false);

  // Filter and sort posts
  useEffect(() => {
    let filtered = [...mockPosts];

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    switch (activeFilter) {
      case 'new':
        filtered = filtered.filter(
          (post) => new Date(post.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000
        );
        break;
      case 'top':
        filtered = filtered.filter((post) => post.likeCount > 20);
        break;
      case 'solved':
        filtered = filtered.filter((post) => post.isSolved);
        break;
      case 'trending':
        filtered = filtered.filter((post) => post.viewCount > 300);
        break;
    }

    // Apply sorting
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.likeCount - a.likeCount);
        break;
      case 'helpful':
        filtered.sort((a, b) => b.helpfulCount - a.helpfulCount);
        break;
      case 'recent':
      default:
        filtered.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    setPosts(filtered);
  }, [searchQuery, activeFilter, sortBy]);

  const filters = [
    { id: 'all' as FilterType, label: 'All Posts', icon: Filter },
    { id: 'new' as FilterType, label: 'New', icon: Clock },
    { id: 'top' as FilterType, label: 'Top', icon: Star },
    { id: 'solved' as FilterType, label: 'Solved', icon: CheckCircle },
    { id: 'trending' as FilterType, label: 'Trending', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">Community Forum</h1>
              <p className="text-text-secondary">
                Ask questions, share knowledge, and connect with the community
              </p>
            </div>
            <Link
              href="/forum/new"
              className="flex items-center gap-2 px-6 py-3 bg-primary-color text-white rounded-lg hover:bg-primary-hover transition-colors font-medium shadow-md"
            >
              <Plus size={20} />
              New Post
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-tertiary" size={20} />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-border-color rounded-lg bg-surface-elevated text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-color focus:border-transparent"
            />
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          {/* Filter Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {filters.map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeFilter === filter.id
                      ? 'bg-primary-color text-white'
                      : 'bg-surface-elevated text-text-secondary hover:bg-surface border border-border-color'
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-sm font-medium">{filter.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-tertiary">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className="px-3 py-2 border border-border-color rounded-lg bg-surface-elevated text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary-color"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>

        {/* Posts List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="bg-surface-elevated rounded-lg border border-border-color p-6 animate-pulse"
              >
                <div className="h-6 bg-surface rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-surface rounded w-full mb-2"></div>
                <div className="h-4 bg-surface rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={48} className="text-text-tertiary opacity-50" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">No posts found</h3>
            <p className="text-text-secondary mb-6">
              {searchQuery
                ? 'Try adjusting your search or filters'
                : 'Be the first to start a discussion!'}
            </p>
            <Link
              href="/forum/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-color text-white rounded-lg hover:bg-primary-hover transition-colors font-medium"
            >
              <Plus size={20} />
              Create New Post
            </Link>
          </div>
        )}

        {/* Pagination */}
        {posts.length > 0 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button className="px-4 py-2 border border-border-color rounded-lg text-text-secondary hover:bg-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <button className="px-4 py-2 bg-primary-color text-white rounded-lg">1</button>
            <button className="px-4 py-2 border border-border-color rounded-lg text-text-secondary hover:bg-surface transition-colors">
              2
            </button>
            <button className="px-4 py-2 border border-border-color rounded-lg text-text-secondary hover:bg-surface transition-colors">
              3
            </button>
            <button className="px-4 py-2 border border-border-color rounded-lg text-text-secondary hover:bg-surface transition-colors">
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
