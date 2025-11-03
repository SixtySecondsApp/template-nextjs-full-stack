/**
 * SubscriptionRepositoryPrisma
 * Prisma implementation of subscription repository
 * Infrastructure layer - handles database operations with soft delete
 */

import { Subscription } from '@/domain/payment/subscription.entity';
import { SubscriptionPrismaMapper } from '@/infrastructure/mappers/subscription-prisma.mapper';
import { prisma } from '@/lib/prisma';

/**
 * Repository interface (inline until ports file is updated)
 */
export interface ISubscriptionRepository {
  create(subscription: Subscription): Promise<Subscription>;
  update(subscription: Subscription): Promise<Subscription>;
  archive(id: string): Promise<void>;
  restore(id: string): Promise<void>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Subscription | null>;
  findByUserId(userId: string): Promise<Subscription[]>;
  findByUserAndCommunity(
    userId: string,
    communityId: string
  ): Promise<Subscription | null>;
  findByStripeSubscriptionId(
    stripeSubscriptionId: string
  ): Promise<Subscription | null>;
  findByStripeCustomerId(stripeCustomerId: string): Promise<Subscription[]>;
  findByCommunityId(communityId: string): Promise<Subscription[]>;
  findAll(): Promise<Subscription[]>;
}

export class SubscriptionRepositoryPrisma implements ISubscriptionRepository {
  /**
   * Create a new subscription
   */
  async create(subscription: Subscription): Promise<Subscription> {
    const persistenceData = SubscriptionPrismaMapper.toPersistence(subscription);

    const created = await prisma.subscription.create({
      data: persistenceData,
    });

    return SubscriptionPrismaMapper.toDomain(created);
  }

  /**
   * Update an existing subscription
   */
  async update(subscription: Subscription): Promise<Subscription> {
    const persistenceData = SubscriptionPrismaMapper.toPersistence(subscription);

    const updated = await prisma.subscription.update({
      where: { id: subscription.getId() },
      data: persistenceData,
    });

    return SubscriptionPrismaMapper.toDomain(updated);
  }

  /**
   * Archive (soft delete) a subscription
   */
  async archive(id: string): Promise<void> {
    await prisma.subscription.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * Restore an archived subscription
   */
  async restore(id: string): Promise<void> {
    await prisma.subscription.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  /**
   * Permanently delete a subscription (use sparingly)
   */
  async delete(id: string): Promise<void> {
    await prisma.subscription.delete({
      where: { id },
    });
  }

  /**
   * Find subscription by ID (excludes archived by default)
   */
  async findById(id: string): Promise<Subscription | null> {
    const result = await prisma.subscription.findFirst({
      where: {
        id,
        deletedAt: null, // Soft delete filter
      },
    });

    return result ? SubscriptionPrismaMapper.toDomain(result) : null;
  }

  /**
   * Find all subscriptions for a user (excludes archived by default)
   */
  async findByUserId(userId: string): Promise<Subscription[]> {
    const results = await prisma.subscription.findMany({
      where: {
        userId,
        deletedAt: null, // Soft delete filter
      },
    });

    return results.map(SubscriptionPrismaMapper.toDomain);
  }

  /**
   * Find user's subscription for a specific community (excludes archived by default)
   * Critical for webhook processing - enforces one subscription per user per community
   */
  async findByUserAndCommunity(
    userId: string,
    communityId: string
  ): Promise<Subscription | null> {
    const result = await prisma.subscription.findFirst({
      where: {
        userId,
        communityId,
        deletedAt: null, // Soft delete filter
      },
    });

    return result ? SubscriptionPrismaMapper.toDomain(result) : null;
  }

  /**
   * Find subscription by Stripe subscription ID (excludes archived by default)
   * Critical for webhook processing - Stripe sends subscription ID in events
   */
  async findByStripeSubscriptionId(
    stripeSubscriptionId: string
  ): Promise<Subscription | null> {
    const result = await prisma.subscription.findFirst({
      where: {
        stripeSubscriptionId,
        deletedAt: null, // Soft delete filter
      },
    });

    return result ? SubscriptionPrismaMapper.toDomain(result) : null;
  }

  /**
   * Find all subscriptions for a Stripe customer (excludes archived by default)
   */
  async findByStripeCustomerId(
    stripeCustomerId: string
  ): Promise<Subscription[]> {
    const results = await prisma.subscription.findMany({
      where: {
        stripeCustomerId,
        deletedAt: null, // Soft delete filter
      },
    });

    return results.map(SubscriptionPrismaMapper.toDomain);
  }

  /**
   * Find all subscriptions for a community (excludes archived by default)
   */
  async findByCommunityId(communityId: string): Promise<Subscription[]> {
    const results = await prisma.subscription.findMany({
      where: {
        communityId,
        deletedAt: null, // Soft delete filter
      },
    });

    return results.map(SubscriptionPrismaMapper.toDomain);
  }

  /**
   * Find all subscriptions (excludes archived by default)
   */
  async findAll(): Promise<Subscription[]> {
    const results = await prisma.subscription.findMany({
      where: {
        deletedAt: null, // Soft delete filter
      },
    });

    return results.map(SubscriptionPrismaMapper.toDomain);
  }
}
