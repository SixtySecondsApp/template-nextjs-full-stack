import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(5),
});

/**
 * GET /api/dashboard/activity
 *
 * Returns recent activity feed items for the dashboard
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { limit } = querySchema.parse({
      limit: searchParams.get('limit'),
    });

    // Mock data - replace with actual database queries
    const now = new Date();
    const allActivities = [
      {
        id: '1',
        type: 'member_joined' as const,
        icon: '👥',
        text: 'Sarah Chen joined as paid member',
        description: null,
        timestamp: new Date(now.getTime() - 2 * 60 * 1000).toISOString(), // 2 min ago
        relativeTime: '2 min ago',
        badge: null,
        metadata: {},
      },
      {
        id: '2',
        type: 'post_created' as const,
        icon: '📝',
        text: 'Alex posted "New feature ideas" in General',
        description: null,
        timestamp: new Date(now.getTime() - 15 * 60 * 1000).toISOString(), // 15 min ago
        relativeTime: '15 min ago',
        badge: null,
        metadata: {},
      },
      {
        id: '3',
        type: 'comment_added' as const,
        icon: '💬',
        text: 'Maria commented on "Getting Started"',
        description: null,
        timestamp: new Date(now.getTime() - 60 * 60 * 1000).toISOString(), // 1 hour ago
        relativeTime: '1 hour ago',
        badge: null,
        metadata: {},
      },
      {
        id: '4',
        type: 'milestone' as const,
        icon: '⭐',
        text: 'Community reached 1,000 members!',
        description: null,
        timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
        relativeTime: '3 hours ago',
        badge: 'Milestone',
        metadata: {},
      },
      {
        id: '5',
        type: 'payment_received' as const,
        icon: '💰',
        text: 'Payment of $49 received from Tom',
        description: null,
        timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        relativeTime: '5 hours ago',
        badge: null,
        metadata: {},
      },
    ];

    const activities = allActivities.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: activities,
      count: activities.length,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid parameters', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Activity API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
