/**
 * Space Repository Port
 * Interface for Space persistence operations
 */

import { Space } from '@/domain/space/space.entity';

export interface ISpaceRepository {
  /**
   * Create a new space
   */
  create(space: Space): Promise<Space>;

  /**
   * Find space by ID
   */
  findById(id: string): Promise<Space | null>;

  /**
   * Find all spaces by community ID
   */
  findByCommunityId(communityId: string): Promise<Space[]>;

  /**
   * Find all root spaces (no parent) by community ID
   */
  findRootSpacesByCommunityId(communityId: string): Promise<Space[]>;

  /**
   * Find child spaces by parent space ID
   */
  findChildSpacesByParentId(parentSpaceId: string): Promise<Space[]>;

  /**
   * Update existing space
   */
  update(space: Space): Promise<Space>;

  /**
   * Delete space (soft delete)
   */
  delete(id: string): Promise<void>;
}
