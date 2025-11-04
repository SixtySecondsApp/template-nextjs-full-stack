/**
 * Dashboard Metrics DTO Mapper
 *
 * Maps between DashboardMetrics domain entity and DashboardMetricsDTO.
 * Maintains strict boundary between domain and presentation layers.
 *
 * Architecture: Application Layer
 * Purpose: Boundary translation (Domain ↔ DTO)
 */

import { DashboardMetrics, Metric } from '@/domain/dashboard/dashboard-metrics.entity';
import { DashboardMetricsDTO, MetricDTO } from '@/application/dto/dashboard.dto';

/**
 * Dashboard Metrics DTO Mapper
 */
export class DashboardMetricsDtoMapper {
  /**
   * Convert domain entity to DTO
   */
  static toDto(entity: DashboardMetrics): DashboardMetricsDTO {
    return {
      members: this.metricToDto(entity.getMembers()),
      posts: this.metricToDto(entity.getPosts()),
      comments: this.metricToDto(entity.getComments()),
      monthlyRecurringRevenue: this.metricToDto(entity.getMonthlyRecurringRevenue()),
      lastUpdated: entity.getGeneratedAt().toISOString(),
    };
  }

  /**
   * Convert individual metric to DTO
   */
  private static metricToDto(metric: Metric): MetricDTO {
    return {
      id: metric.getId(),
      label: metric.getLabel(),
      icon: metric.getIcon(),
      value: metric.getValue(),
      formattedValue: metric.getFormattedValue(),
      change: metric.getChange(),
      changeType: metric.getChangeType(),
      changeDescription: metric.getChangeDescription(),
      comparisonPeriod: metric.getComparisonPeriod(),
    };
  }

  /**
   * Convert DTO to domain entity
   * (Not typically needed for metrics, but included for completeness)
   */
  static toDomain(dto: DashboardMetricsDTO): DashboardMetrics {
    return DashboardMetrics.create({
      members: this.dtoToMetric(dto.members),
      posts: this.dtoToMetric(dto.posts),
      comments: this.dtoToMetric(dto.comments),
      monthlyRecurringRevenue: this.dtoToMetric(dto.monthlyRecurringRevenue),
      generatedAt: new Date(dto.lastUpdated),
    });
  }

  /**
   * Convert individual metric DTO to domain entity
   */
  private static dtoToMetric(dto: MetricDTO): Metric {
    return Metric.create({
      id: dto.id,
      label: dto.label,
      icon: dto.icon,
      value: dto.value,
      formattedValue: dto.formattedValue,
      change: dto.change,
      changeType: dto.changeType,
      changeDescription: dto.changeDescription,
      comparisonPeriod: dto.comparisonPeriod,
    });
  }
}
