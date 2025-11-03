/**
 * Space Domain Types
 *
 * Type definitions for Space domain entity.
 */

export interface SpaceProps {
  id: string;
  communityId: string;
  name: string;
  description: string;
  parentSpaceId: string | null;
  icon: string | null;
  color: string | null;
  position: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
