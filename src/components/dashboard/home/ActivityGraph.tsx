'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getActivityTrends } from '@/lib/api/dashboard';
import { ActivityGraphSkeleton } from './ActivityGraphSkeleton';
import type { TimeFilter } from '@/application/dto/dashboard.dto';
import dynamic from 'next/dynamic';

// Dynamically import Chart.js components for code splitting
const Line = dynamic(
  () => import('react-chartjs-2').then((mod) => mod.Line),
  {
    loading: () => <ActivityGraphSkeleton />,
    ssr: false,
  }
);

// Register Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const TIME_FILTERS: TimeFilter[] = ['7d', '30d', '90d', '1y'];

export function ActivityGraph() {
  const [period, setPeriod] = useState<TimeFilter>('30d');

  const {
    data: trends,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['activity-trends', period],
    queryFn: () => getActivityTrends(period),
    staleTime: 60000, // 1 minute
  });

  const chartData = useMemo(() => {
    if (!trends) return null;

    return {
      labels: trends.dataPoints.map((point) => point.label),
      datasets: [
        {
          label: 'Activity',
          data: trends.dataPoints.map((point) => point.value),
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: 'rgb(99, 102, 241)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        },
      ],
    };
  }, [trends]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#9ca3af',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
        ticks: {
          color: '#9ca3af',
        },
      },
    },
  };

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6">
        <p className="text-sm text-destructive">
          Failed to load activity trends. Please try again later.
        </p>
      </div>
    );
  }

  if (isLoading || !chartData) {
    return <ActivityGraphSkeleton />;
  }

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Activity Trends
        </h3>
        <div className="flex gap-2">
          {TIME_FILTERS.map((filter) => (
            <Button
              key={filter}
              variant={period === filter ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod(filter)}
              className="min-w-[3rem]"
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>
      <div className="h-72">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
