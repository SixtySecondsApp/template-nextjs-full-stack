/**
 * Channel Domain Types
 *
 * Type definitions for Channel domain entity.
 */

/**
 * Channel Permission Levels
 * - PUBLIC: Accessible to anyone (even non-members)
 * - MEMBERS_ONLY: Requires community membership
 * - TIER_GATED: Requires specific payment tier
 */
export type ChannelPermission = 'PUBLIC' | 'MEMBERS_ONLY' | 'TIER_GATED';

export interface ChannelProps {
  id: string;
  communityId: string;
  spaceId: string | null;
  name: string;
  description: string;
  permission: ChannelPermission;
  requiredTierId: string | null;
  icon: string | null;
  position: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
