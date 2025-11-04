/**
 * Dashboard Repository Prisma Implementation
 *
 * Implements IDashboardRepository using Prisma ORM for database operations.
 * Handles aggregation queries and data fetching for dashboard metrics.
 *
 * Architecture: Infrastructure Layer
 * Purpose: Data access implementation with Prisma
 */

import { IDashboardRepository } from '@/application/ports/dashboard-repository.interface';
import { DashboardMetrics } from '@/domain/dashboard/dashboard-metrics.entity';
import { ActivityItem, Member, ContentPost, PendingTask } from '@/types/dashboard';
import { prisma } from '@/lib/prisma';
import { formatDistanceToNow, format } from 'date-fns';

/**
 * Prisma implementation of dashboard repository
 */
export class DashboardRepositoryPrisma implements IDashboardRepository {
  /**
   * Get aggregated metrics for dashboard
   */
  async getMetrics(
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    previousPeriodStart: Date,
    previousPeriodEnd: Date,
    communityId: string
  ): Promise<DashboardMetrics> {
    // Fetch current period stats in parallel
    const [
      currentMemberCount,
      currentPostCount,
      currentCommentCount,
      currentSubscriptions,
    ] = await Promise.all([
      // Member count (users who joined in current period)
      prisma.communityMember.count({
        where: {
          communityId,
          joinedAt: {
            gte: currentPeriodStart,
            lte: currentPeriodEnd,
          },
          deletedAt: null,
        },
      }),

      // Post count
      prisma.post.count({
        where: {
          communityId,
          publishedAt: {
            gte: currentPeriodStart,
            lte: currentPeriodEnd,
          },
          deletedAt: null,
        },
      }),

      // Comment count
      prisma.comment.count({
        where: {
          post: {
            communityId,
          },
          createdAt: {
            gte: currentPeriodStart,
            lte: currentPeriodEnd,
          },
          deletedAt: null,
        },
      }),

      // Active subscriptions for MRR calculation
      prisma.subscription.findMany({
        where: {
          communityId,
          status: 'ACTIVE',
          deletedAt: null,
        },
        select: {
          paymentTier: {
            select: {
              priceMonthly: true,
            },
          },
        },
      }),
    ]);

    // Calculate current MRR (sum of all active subscription prices)
    const currentMrr = currentSubscriptions.reduce(
      (sum, sub) => sum + (sub.paymentTier?.priceMonthly || 0),
      0
    );

    // Fetch previous period stats in parallel
    const [
      previousMemberCount,
      previousPostCount,
      previousCommentCount,
      previousSubscriptions,
    ] = await Promise.all([
      prisma.communityMember.count({
        where: {
          communityId,
          joinedAt: {
            gte: previousPeriodStart,
            lte: previousPeriodEnd,
          },
          deletedAt: null,
        },
      }),

      prisma.post.count({
        where: {
          communityId,
          publishedAt: {
            gte: previousPeriodStart,
            lte: previousPeriodEnd,
          },
          deletedAt: null,
        },
      }),

      prisma.comment.count({
        where: {
          post: {
            communityId,
          },
          createdAt: {
            gte: previousPeriodStart,
            lte: previousPeriodEnd,
          },
          deletedAt: null,
        },
      }),

      prisma.subscription.findMany({
        where: {
          communityId,
          status: 'ACTIVE',
          currentPeriodStart: {
            gte: previousPeriodStart,
            lte: previousPeriodEnd,
          },
          deletedAt: null,
        },
        select: {
          paymentTier: {
            select: {
              priceMonthly: true,
            },
          },
        },
      }),
    ]);

    // Calculate previous MRR
    const previousMrr = previousSubscriptions.reduce(
      (sum, sub) => sum + (sub.paymentTier?.priceMonthly || 0),
      0
    );

    // Determine comparison period label
    const daysDiff = Math.round(
      (currentPeriodEnd.getTime() - currentPeriodStart.getTime()) / (1000 * 60 * 60 * 24)
    );
    const comparisonPeriod = `vs previous ${daysDiff} days`;

    // Create dashboard metrics entity
    return DashboardMetrics.fromCounts({
      currentPeriod: {
        memberCount: currentMemberCount,
        postCount: currentPostCount,
        commentCount: currentCommentCount,
        mrr: currentMrr,
      },
      previousPeriod: {
        memberCount: previousMemberCount,
        postCount: previousPostCount,
        commentCount: previousCommentCount,
        mrr: previousMrr,
      },
      comparisonPeriod,
    });
  }

  /**
   * Get recent activity items
   */
  async getRecentActivity(communityId: string, limit: number): Promise<ActivityItem[]> {
    // Fetch recent posts, comments, and member joins in parallel
    const [recentPosts, recentComments, recentMembers] = await Promise.all([
      prisma.post.findMany({
        where: {
          communityId,
          deletedAt: null,
          publishedAt: { not: null },
        },
        select: {
          id: true,
          title: true,
          publishedAt: true,
          author: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { publishedAt: 'desc' },
        take: limit,
      }),

      prisma.comment.findMany({
        where: {
          post: {
            communityId,
          },
          deletedAt: null,
        },
        select: {
          id: true,
          createdAt: true,
          author: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          post: {
            select: {
              title: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),

      prisma.communityMember.findMany({
        where: {
          communityId,
          deletedAt: null,
        },
        select: {
          id: true,
          joinedAt: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { joinedAt: 'desc' },
        take: limit,
      }),
    ]);

    // Combine and map to ActivityItem
    const activities: ActivityItem[] = [];

    recentPosts.forEach((post) => {
      activities.push({
        id: post.id,
        type: 'post_created',
        icon: 'FileText',
        text: `${post.author.firstName} ${post.author.lastName} created a post`,
        description: post.title,
        timestamp: post.publishedAt || new Date(),
        relativeTime: formatDistanceToNow(post.publishedAt || new Date(), { addSuffix: true }),
        badge: null,
        metadata: { postId: post.id },
      });
    });

    recentComments.forEach((comment) => {
      activities.push({
        id: comment.id,
        type: 'comment_added',
        icon: 'MessageSquare',
        text: `${comment.author.firstName} ${comment.author.lastName} commented on`,
        description: comment.post.title,
        timestamp: comment.createdAt,
        relativeTime: formatDistanceToNow(comment.createdAt, { addSuffix: true }),
        badge: null,
        metadata: { commentId: comment.id },
      });
    });

    recentMembers.forEach((member) => {
      activities.push({
        id: member.id,
        type: 'member_joined',
        icon: 'UserPlus',
        text: `${member.user.firstName} ${member.user.lastName} joined the community`,
        description: null,
        timestamp: member.joinedAt,
        relativeTime: formatDistanceToNow(member.joinedAt, { addSuffix: true }),
        badge: 'New',
        metadata: { memberId: member.id },
      });
    });

    // Sort by timestamp descending and return limited results
    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Get pending tasks (placeholder - implement based on business rules)
   */
  async getPendingTasks(communityId: string, limit: number): Promise<PendingTask[]> {
    // TODO: Implement based on business requirements
    // For now, return common tasks like flagged posts, pending approvals, etc.

    const flaggedPostsCount = await prisma.post.count({
      where: {
        communityId,
        deletedAt: null,
        // Add flagged field when available
      },
    });

    const tasks: PendingTask[] = [];

    if (flaggedPostsCount > 0) {
      tasks.push({
        id: 'flagged-posts',
        text: 'Review flagged posts',
        description: `${flaggedPostsCount} posts need review`,
        urgency: 'high',
        status: 'pending',
        createdAt: new Date(),
        dueAt: null,
        actionUrl: '/dashboard/content/flagged',
        actionLabel: 'Review Now',
        count: flaggedPostsCount,
      });
    }

    return tasks.slice(0, limit);
  }

  /**
   * Get members with pagination and filtering
   */
  async getMembers(
    communityId: string,
    params: {
      page: number;
      limit: number;
      plan?: string;
      sortBy?: 'name' | 'joinedAt' | 'lastActiveAt';
      sortOrder?: 'asc' | 'desc';
    }
  ): Promise<{
    members: Member[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page, limit, plan, sortBy = 'joinedAt', sortOrder = 'desc' } = params;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      communityId,
      deletedAt: null,
    };

    // Add plan filter if specified
    if (plan) {
      where.user = {
        subscriptions: {
          some: {
            communityId,
            status: 'ACTIVE',
            paymentTier: {
              name: plan,
            },
          },
        },
      };
    }

    // Fetch total count and members in parallel
    const [total, members] = await Promise.all([
      prisma.communityMember.count({ where }),
      prisma.communityMember.findMany({
        where,
        skip,
        take: limit,
        orderBy: sortBy === 'name'
          ? { user: { firstName: sortOrder } }
          : sortBy === 'lastActiveAt'
          ? { updatedAt: sortOrder }
          : { joinedAt: sortOrder },
        select: {
          id: true,
          joinedAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              imageUrl: true,
              subscriptions: {
                where: {
                  communityId,
                  status: 'ACTIVE',
                  deletedAt: null,
                },
                select: {
                  paymentTier: {
                    select: {
                      name: true,
                      priceMonthly: true,
                    },
                  },
                },
                take: 1,
              },
            },
          },
          _count: {
            select: {
              user: {
                select: {
                  posts: true,
                },
              },
            },
          },
        },
      }),
    ]);

    // Map to Member DTO
    const mappedMembers: Member[] = members.map((member) => {
      const name = `${member.user.firstName || ''} ${member.user.lastName || ''}`.trim();
      const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      const subscription = member.user.subscriptions[0];
      const planName = subscription?.paymentTier?.name || 'free';
      const planAmount = subscription?.paymentTier?.priceMonthly
        ? `$${(subscription.paymentTier.priceMonthly / 100).toFixed(2)}/mo`
        : null;

      // Check if active (posted or commented in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const isActive = member.updatedAt >= thirtyDaysAgo;

      return {
        id: member.user.id,
        name,
        email: member.user.email,
        avatar: member.user.imageUrl,
        initials,
        plan: planName as any,
        planAmount,
        joinedAt: member.joinedAt.toISOString(),
        joinedFormatted: format(member.joinedAt, 'MMM d, yyyy'),
        lastActiveAt: member.updatedAt.toISOString(),
        lastActiveFormatted: formatDistanceToNow(member.updatedAt, { addSuffix: true }),
        postsCount: 0, // TODO: Get actual count from _count
        isActive,
      };
    });

    return {
      members: mappedMembers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get content posts with filtering
   */
  async getContentPosts(
    communityId: string,
    params: {
      spaceId?: string;
      status?: 'published' | 'draft';
      limit?: number;
    }
  ): Promise<ContentPost[]> {
    const { spaceId, status, limit = 50 } = params;

    const where: any = {
      communityId,
      deletedAt: null,
    };

    // Add status filter
    if (status === 'published') {
      where.publishedAt = { not: null };
      where.isDraft = false;
    } else if (status === 'draft') {
      where.isDraft = true;
    }

    // Add space filter (when spaces are implemented)
    if (spaceId) {
      // TODO: Add space relation when schema is updated
    }

    const posts = await prisma.post.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        isPinned: true,
        viewCount: true,
        likeCount: true,
        commentCount: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      author: `${post.author.firstName} ${post.author.lastName}`,
      authorId: post.author.id,
      space: 'General', // TODO: Get from space relation
      spaceId: '', // TODO: Get from space relation
      createdAt: post.createdAt.toISOString(),
      createdFormatted: format(post.createdAt, 'MMM d, yyyy'),
      likes: post.likeCount,
      comments: post.commentCount,
      views: post.viewCount,
      isPinned: post.isPinned,
      isFlagged: false, // TODO: Add flagged field to schema
    }));
  }
}
