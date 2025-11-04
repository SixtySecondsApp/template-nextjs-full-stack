import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const querySchema = z.object({
  period: z.enum(['7d', '30d', '90d', '1y']).default('30d'),
});

/**
 * GET /api/dashboard/metrics
 *
 * Returns KPI metrics for the dashboard
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { period } = querySchema.parse({
      period: searchParams.get('period') || '30d',
    });

    // Mock data - replace with actual database queries
    // Helper function to calculate change type
    const getChangeType = (change: number) => {
      if (change > 0) return 'positive';
      if (change < 0) return 'negative';
      return 'neutral';
    };

    // Helper function to format change description
    const getChangeDescription = (change: number, period: string) => {
      const sign = change >= 0 ? '+' : '';
      return `${sign}${change.toFixed(1)}% vs previous ${period}`;
    };

    const metrics = {
      members: {
        id: 'members',
        label: 'Members',
        icon: '👥',
        value: 1247,
        formattedValue: '1,247',
        change: 12,
        changeType: getChangeType(12),
        changeDescription: getChangeDescription(12, period),
        comparisonPeriod: period,
      },
      posts: {
        id: 'posts',
        label: 'Posts',
        icon: '📝',
        value: 342,
        formattedValue: '342',
        change: 8,
        changeType: getChangeType(8),
        changeDescription: getChangeDescription(8, period),
        comparisonPeriod: period,
      },
      comments: {
        id: 'comments',
        label: 'Comments',
        icon: '💬',
        value: 1856,
        formattedValue: '1,856',
        change: 23,
        changeType: getChangeType(23),
        changeDescription: getChangeDescription(23, period),
        comparisonPeriod: period,
      },
      monthlyRecurringRevenue: {
        id: 'mrr',
        label: 'MRR',
        icon: '💰',
        value: 4890,
        formattedValue: '$4,890',
        change: 7.5,
        changeType: getChangeType(7.5),
        changeDescription: getChangeDescription(7.5, period),
        comparisonPeriod: period,
      },
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid parameters', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Metrics API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
