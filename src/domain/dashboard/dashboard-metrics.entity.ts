/**
 * Dashboard Metrics Domain Entity
 *
 * Pure business logic for aggregated dashboard metrics.
 * NO framework dependencies, NO database concerns.
 *
 * Architecture: Domain Layer
 * Purpose: Encapsulate dashboard metrics business rules and invariants
 */

import { MetricChangeType } from '@/types/dashboard';

/**
 * Individual metric value with comparison data
 */
export class Metric {
  private constructor(
    private readonly id: string,
    private readonly label: string,
    private readonly icon: string,
    private readonly value: number,
    private readonly formattedValue: string,
    private readonly change: number,
    private readonly changeType: MetricChangeType,
    private readonly changeDescription: string,
    private readonly comparisonPeriod: string
  ) {
    // Validate invariants
    if (value < 0) {
      throw new Error('Metric value cannot be negative');
    }
    if (!id || !label || !icon || !formattedValue || !changeDescription || !comparisonPeriod) {
      throw new Error('All metric fields are required');
    }
  }

  static create(data: {
    id: string;
    label: string;
    icon: string;
    value: number;
    formattedValue: string;
    change: number;
    changeType: MetricChangeType;
    changeDescription: string;
    comparisonPeriod: string;
  }): Metric {
    return new Metric(
      data.id,
      data.label,
      data.icon,
      data.value,
      data.formattedValue,
      data.change,
      data.changeType,
      data.changeDescription,
      data.comparisonPeriod
    );
  }

  /**
   * Factory method to create metric from current and previous values
   */
  static fromComparison(data: {
    id: string;
    label: string;
    icon: string;
    currentValue: number;
    previousValue: number;
    comparisonPeriod: string;
    formatter?: (value: number) => string;
  }): Metric {
    const { currentValue, previousValue, formatter } = data;

    // Calculate change
    const change = currentValue - previousValue;
    const changePercentage = previousValue === 0
      ? (currentValue > 0 ? 100 : 0)
      : ((change / previousValue) * 100);

    // Determine change type
    let changeType: MetricChangeType;
    if (change > 0) {
      changeType = 'positive';
    } else if (change < 0) {
      changeType = 'negative';
    } else {
      changeType = 'neutral';
    }

    // Format values
    const formattedValue = formatter ? formatter(currentValue) : currentValue.toString();
    const changeDescription = `${change >= 0 ? '+' : ''}${changePercentage.toFixed(1)}% from previous period`;

    return new Metric(
      data.id,
      data.label,
      data.icon,
      currentValue,
      formattedValue,
      changePercentage,
      changeType,
      changeDescription,
      data.comparisonPeriod
    );
  }

  // Getters
  getId(): string { return this.id; }
  getLabel(): string { return this.label; }
  getIcon(): string { return this.icon; }
  getValue(): number { return this.value; }
  getFormattedValue(): string { return this.formattedValue; }
  getChange(): number { return this.change; }
  getChangeType(): MetricChangeType { return this.changeType; }
  getChangeDescription(): string { return this.changeDescription; }
  getComparisonPeriod(): string { return this.comparisonPeriod; }
}

/**
 * Dashboard Metrics aggregate entity
 */
export class DashboardMetrics {
  private constructor(
    private readonly members: Metric,
    private readonly posts: Metric,
    private readonly comments: Metric,
    private readonly monthlyRecurringRevenue: Metric,
    private readonly generatedAt: Date
  ) {}

  static create(data: {
    members: Metric;
    posts: Metric;
    comments: Metric;
    monthlyRecurringRevenue: Metric;
    generatedAt?: Date;
  }): DashboardMetrics {
    return new DashboardMetrics(
      data.members,
      data.posts,
      data.comments,
      data.monthlyRecurringRevenue,
      data.generatedAt || new Date()
    );
  }

  /**
   * Factory method to create metrics from raw counts
   */
  static fromCounts(data: {
    currentPeriod: {
      memberCount: number;
      postCount: number;
      commentCount: number;
      mrr: number;
    };
    previousPeriod: {
      memberCount: number;
      postCount: number;
      commentCount: number;
      mrr: number;
    };
    comparisonPeriod: string;
  }): DashboardMetrics {
    const { currentPeriod, previousPeriod, comparisonPeriod } = data;

    const members = Metric.fromComparison({
      id: 'members',
      label: 'Total Members',
      icon: 'Users',
      currentValue: currentPeriod.memberCount,
      previousValue: previousPeriod.memberCount,
      comparisonPeriod,
    });

    const posts = Metric.fromComparison({
      id: 'posts',
      label: 'Total Posts',
      icon: 'FileText',
      currentValue: currentPeriod.postCount,
      previousValue: previousPeriod.postCount,
      comparisonPeriod,
    });

    const comments = Metric.fromComparison({
      id: 'comments',
      label: 'Total Comments',
      icon: 'MessageSquare',
      currentValue: currentPeriod.commentCount,
      previousValue: previousPeriod.commentCount,
      comparisonPeriod,
    });

    const monthlyRecurringRevenue = Metric.fromComparison({
      id: 'mrr',
      label: 'Monthly Recurring Revenue',
      icon: 'DollarSign',
      currentValue: currentPeriod.mrr,
      previousValue: previousPeriod.mrr,
      comparisonPeriod,
      formatter: (value) => `$${(value / 100).toFixed(2)}`, // Convert cents to dollars
    });

    return DashboardMetrics.create({
      members,
      posts,
      comments,
      monthlyRecurringRevenue,
    });
  }

  // Getters
  getMembers(): Metric { return this.members; }
  getPosts(): Metric { return this.posts; }
  getComments(): Metric { return this.comments; }
  getMonthlyRecurringRevenue(): Metric { return this.monthlyRecurringRevenue; }
  getGeneratedAt(): Date { return this.generatedAt; }

  /**
   * Business rule: Check if metrics indicate healthy growth
   */
  hasHealthyGrowth(): boolean {
    return (
      this.members.getChangeType() === 'positive' ||
      this.posts.getChangeType() === 'positive'
    );
  }

  /**
   * Business rule: Check if metrics need attention
   */
  needsAttention(): boolean {
    const negativeMetrics = [
      this.members,
      this.posts,
      this.comments,
      this.monthlyRecurringRevenue,
    ].filter(metric => metric.getChangeType() === 'negative');

    return negativeMetrics.length >= 2;
  }
}
