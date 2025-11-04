/**
 * Application Ports Index
 * Exports all repository interfaces for dependency injection.
 */

export type {
  IPostRepository,
  PostFilter,
} from "./post-repository.interface";
export type { ICommentRepository } from "./comment-repository.interface";
export type { IPostAttachmentRepository } from "./post-attachment-repository.interface";
export type {
  IDashboardRepository,
  PeriodStats,
} from "./dashboard-repository.interface";
