import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/dashboard/resources
 *
 * Returns recommended resources for the dashboard
 */
export async function GET(request: NextRequest) {
  try {
    // Mock data - replace with actual database queries
    const resources = [
      {
        id: '1',
        type: 'guide' as const,
        icon: '📖',
        title: 'How to boost engagement in your community',
        description: 'Learn proven strategies to increase member participation',
        metadata: '5 min read • Guide',
        url: '/resources/boost-engagement',
        estimatedMinutes: 5,
        isExternal: false,
      },
      {
        id: '2',
        type: 'webinar' as const,
        icon: '🎥',
        title: 'Webinar: Monetization strategies',
        description: 'Join us for a live session on community monetization',
        metadata: 'Tomorrow at 2pm EST • Live Event',
        url: '/events/monetization-webinar',
        estimatedMinutes: 60,
        isExternal: false,
      },
      {
        id: '3',
        type: 'case_study' as const,
        icon: '💡',
        title: 'Case study: From 0 to 1k members in 60 days',
        description: 'Real success story of rapid community growth',
        metadata: '12 min read • Success Story',
        url: '/resources/case-study-1k-members',
        estimatedMinutes: 12,
        isExternal: false,
      },
    ];

    return NextResponse.json({
      success: true,
      data: resources,
    });
  } catch (error) {
    console.error('Resources API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
