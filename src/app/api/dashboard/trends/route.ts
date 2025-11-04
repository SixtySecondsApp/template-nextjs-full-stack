import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const querySchema = z.object({
  period: z.enum(['7d', '30d', '90d', '1y']).default('30d'),
});

/**
 * GET /api/dashboard/trends
 *
 * Returns activity trend data for the graph
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { period } = querySchema.parse({
      period: searchParams.get('period') || '30d',
    });

    // Mock data - replace with actual database queries
    // Helper to format date labels
    const formatLabel = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const dataPoints = [
      { date: '2024-10-05', value: 45, label: formatLabel('2024-10-05') },
      { date: '2024-10-08', value: 60, label: formatLabel('2024-10-08') },
      { date: '2024-10-11', value: 35, label: formatLabel('2024-10-11') },
      { date: '2024-10-14', value: 70, label: formatLabel('2024-10-14') },
      { date: '2024-10-17', value: 55, label: formatLabel('2024-10-17') },
      { date: '2024-10-20', value: 80, label: formatLabel('2024-10-20') },
      { date: '2024-10-23', value: 65, label: formatLabel('2024-10-23') },
      { date: '2024-10-26', value: 50, label: formatLabel('2024-10-26') },
      { date: '2024-10-29', value: 75, label: formatLabel('2024-10-29') },
      { date: '2024-11-01', value: 85, label: formatLabel('2024-11-01') },
      { date: '2024-11-02', value: 70, label: formatLabel('2024-11-02') },
      { date: '2024-11-03', value: 60, label: formatLabel('2024-11-03') },
    ];

    // Calculate statistics
    const values = dataPoints.map((p) => p.value);
    const totalValue = values.reduce((sum, val) => sum + val, 0);
    const averageValue = totalValue / values.length;
    const peakValue = Math.max(...values);
    const peakPoint = dataPoints.find((p) => p.value === peakValue)!;

    const trends = {
      timeFilter: period,
      dataPoints,
      totalValue,
      averageValue: Math.round(averageValue * 10) / 10, // Round to 1 decimal
      peakValue,
      peakDate: peakPoint.date,
    };

    return NextResponse.json({
      success: true,
      data: trends,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid parameters', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Trends API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
