/**
 * Check Access Use Case
 * Verifies if user has access to gated content based on subscription
 */

import {
  ISubscriptionRepository,
  IPaymentTierRepository,
  ICourseRepository,
  IPostRepository,
} from "@/ports/repositories";
import { AccessError } from "@/application/errors/payment.errors";

/**
 * Access Check Result
 */
export interface AccessCheckResult {
  hasAccess: boolean;
  reason?: string;
  requiredTier?: string;
}

/**
 * Check Access Use Case
 * Determines if user can access a resource based on subscription tier
 */
export class CheckAccessUseCase {
  constructor(
    private readonly subscriptionRepository: ISubscriptionRepository,
    private readonly paymentTierRepository: IPaymentTierRepository,
    private readonly courseRepository: ICourseRepository,
    private readonly postRepository: IPostRepository
  ) {}

  /**
   * Check if user can access a course
   */
  async checkCourseAccess(
    userId: string,
    courseId: string,
    communityId: string
  ): Promise<AccessCheckResult> {
    try {
      // Get course
      const course = await this.courseRepository.findById(courseId);
      if (!course) {
        throw new Error(AccessError.RESOURCE_NOT_FOUND);
      }

      // Get required payment tier for course
      const requiredTierId = course.getPaymentTierId
        ? course.getPaymentTierId()
        : null;

      // If no tier required, allow access
      if (!requiredTierId) {
        return { hasAccess: true };
      }

      // Get required tier details
      const requiredTier =
        await this.paymentTierRepository.findById(requiredTierId);
      if (!requiredTier) {
        throw new Error(AccessError.RESOURCE_NOT_FOUND);
      }

      // If free tier, allow access
      if (requiredTier.getIsFree()) {
        return { hasAccess: true };
      }

      // Check user's subscription
      const subscription =
        await this.subscriptionRepository.findByUserAndCommunity(
          userId,
          communityId
        );

      if (!subscription) {
        return {
          hasAccess: false,
          reason: "No active subscription",
          requiredTier: requiredTier.getName(),
        };
      }

      // Check if subscription is active
      const status = subscription.getStatus();
      const isActive = status === "ACTIVE" || status === "TRIALING";

      if (!isActive) {
        return {
          hasAccess: false,
          reason: "Subscription expired or cancelled",
          requiredTier: requiredTier.getName(),
        };
      }

      // Check if subscription tier matches or exceeds required tier
      const userTierId = subscription.getPaymentTierId();
      if (userTierId === requiredTierId) {
        return { hasAccess: true };
      }

      // In V1: Only 2 tiers (free + paid), so if user has paid tier, they have access
      // In future versions: Implement tier hierarchy comparison
      return {
        hasAccess: false,
        reason: "Insufficient subscription tier",
        requiredTier: requiredTier.getName(),
      };
    } catch (error) {
      if (error instanceof Error) {
        if (
          Object.values(AccessError).includes(error.message as AccessError)
        ) {
          throw error;
        }
      }

      throw new Error(AccessError.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Check if user can access a post
   */
  async checkPostAccess(
    userId: string,
    postId: string,
    communityId: string
  ): Promise<AccessCheckResult> {
    try {
      // Get post
      const post = await this.postRepository.findById(postId);
      if (!post) {
        throw new Error(AccessError.RESOURCE_NOT_FOUND);
      }

      // Get required payment tier for post
      const requiredTierId = post.getPaymentTierId
        ? post.getPaymentTierId()
        : null;

      // If no tier required, allow access
      if (!requiredTierId) {
        return { hasAccess: true };
      }

      // Get required tier details
      const requiredTier =
        await this.paymentTierRepository.findById(requiredTierId);
      if (!requiredTier) {
        throw new Error(AccessError.RESOURCE_NOT_FOUND);
      }

      // If free tier, allow access
      if (requiredTier.getIsFree()) {
        return { hasAccess: true };
      }

      // Check user's subscription (same logic as course access)
      const subscription =
        await this.subscriptionRepository.findByUserAndCommunity(
          userId,
          communityId
        );

      if (!subscription) {
        return {
          hasAccess: false,
          reason: "No active subscription",
          requiredTier: requiredTier.getName(),
        };
      }

      const status = subscription.getStatus();
      const isActive = status === "ACTIVE" || status === "TRIALING";

      if (!isActive) {
        return {
          hasAccess: false,
          reason: "Subscription expired or cancelled",
          requiredTier: requiredTier.getName(),
        };
      }

      const userTierId = subscription.getPaymentTierId();
      if (userTierId === requiredTierId) {
        return { hasAccess: true };
      }

      return {
        hasAccess: false,
        reason: "Insufficient subscription tier",
        requiredTier: requiredTier.getName(),
      };
    } catch (error) {
      if (error instanceof Error) {
        if (
          Object.values(AccessError).includes(error.message as AccessError)
        ) {
          throw error;
        }
      }

      throw new Error(AccessError.INTERNAL_SERVER_ERROR);
    }
  }
}
