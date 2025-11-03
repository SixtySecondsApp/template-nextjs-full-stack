/**
 * Channel Repository Port
 * Interface for Channel persistence operations
 */

import { Channel } from '@/domain/channel/channel.entity';

export interface IChannelRepository {
  /**
   * Create a new channel
   */
  create(channel: Channel): Promise<Channel>;

  /**
   * Find channel by ID
   */
  findById(id: string): Promise<Channel | null>;

  /**
   * Find all channels by community ID
   */
  findByCommunityId(communityId: string): Promise<Channel[]>;

  /**
   * Find all channels by space ID
   */
  findBySpaceId(spaceId: string): Promise<Channel[]>;

  /**
   * Find all standalone channels (not in any space) by community ID
   */
  findStandaloneChannelsByCommunityId(communityId: string): Promise<Channel[]>;

  /**
   * Update existing channel
   */
  update(channel: Channel): Promise<Channel>;

  /**
   * Delete channel (soft delete)
   */
  delete(id: string): Promise<void>;
}
