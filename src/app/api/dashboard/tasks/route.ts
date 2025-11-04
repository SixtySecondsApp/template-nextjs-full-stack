import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/dashboard/tasks
 *
 * Returns pending tasks for the dashboard
 */
export async function GET(request: NextRequest) {
  try {
    // Mock data - replace with actual database queries
    const now = new Date();
    const tasks = [
      {
        id: '1',
        text: '2 flagged posts awaiting review',
        description: 'Posts have been flagged by community members for review',
        urgency: 'high' as const,
        status: 'pending' as const,
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        dueAt: null,
        actionUrl: '/dashboard-v2/content?filter=flagged',
        actionLabel: 'Review Posts',
        count: 2,
      },
      {
        id: '2',
        text: '5 member applications pending approval',
        description: 'New members waiting for manual approval',
        urgency: 'medium' as const,
        status: 'pending' as const,
        createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        dueAt: null,
        actionUrl: '/dashboard-v2/members?filter=pending',
        actionLabel: 'Review Applications',
        count: 5,
      },
      {
        id: '3',
        text: 'Trial ending in 3 days (add payment method)',
        description: 'Your trial period will end soon',
        urgency: 'urgent' as const,
        status: 'pending' as const,
        createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
        dueAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        actionUrl: '/dashboard-v2/billing',
        actionLabel: 'Add Payment Method',
        count: null,
      },
    ];

    return NextResponse.json({
      success: true,
      data: tasks,
      count: tasks.length,
    });
  } catch (error) {
    console.error('Tasks API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
