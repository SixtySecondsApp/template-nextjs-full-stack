/**
 * Channel Data Transfer Objects
 * DTOs for Channel entity (Application Layer → Presentation Layer)
 */

export type ChannelPermissionDto = 'PUBLIC' | 'MEMBERS_ONLY' | 'TIER_GATED';

export interface ChannelDto {
  id: string;
  communityId: string;
  spaceId: string | null;
  name: string;
  description: string;
  permission: ChannelPermissionDto;
  requiredTierId: string | null;
  icon: string | null;
  position: number;
  createdBy: string;
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
  deletedAt: string | null; // ISO 8601 string
}

export interface CreateChannelDto {
  communityId: string;
  spaceId?: string;
  name: string;
  description: string;
  permission: ChannelPermissionDto;
  requiredTierId?: string;
  icon?: string;
  position?: number;
}

export interface UpdateChannelDto {
  name?: string;
  description?: string;
  permission?: ChannelPermissionDto;
  requiredTierId?: string;
  icon?: string;
  position?: number;
}
