import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/dashboard/quick-actions
 *
 * Returns quick action items for the dashboard
 */
export async function GET(request: NextRequest) {
  try {
    // Mock data - replace with actual database queries
    // Icons now use Lucide icon names instead of emojis
    const quickActions = [
      {
        id: '1',
        icon: 'FileText',
        label: 'Create Post',
        description: 'Share content with your community',
        actionUrl: '/dashboard/content/new',
        requiresPermission: null,
      },
      {
        id: '2',
        icon: 'UserPlus',
        label: 'Invite Members',
        description: 'Grow your community',
        actionUrl: '/dashboard/members/invite',
        requiresPermission: null,
      },
      {
        id: '3',
        icon: 'Palette',
        label: 'Customize',
        description: 'Personalize your space',
        actionUrl: '/dashboard/customize',
        requiresPermission: null,
      },
      {
        id: '4',
        icon: 'BookOpen',
        label: 'Add Course',
        description: 'Create educational content',
        actionUrl: '/dashboard/courses/new',
        requiresPermission: null,
      },
      {
        id: '5',
        icon: 'Calendar',
        label: 'Schedule Event',
        description: 'Plan community activities',
        actionUrl: '/dashboard/events/new',
        requiresPermission: null,
      },
      {
        id: '6',
        icon: 'DollarSign',
        label: 'View Revenue',
        description: 'Check your earnings',
        actionUrl: '/dashboard/transactions',
        requiresPermission: null,
      },
    ];

    return NextResponse.json({
      success: true,
      data: quickActions,
    });
  } catch (error) {
    console.error('Quick Actions API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
