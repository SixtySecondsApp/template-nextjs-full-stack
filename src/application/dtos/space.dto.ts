/**
 * Space Data Transfer Objects
 * DTOs for Space entity (Application Layer → Presentation Layer)
 */

export interface SpaceDto {
  id: string;
  communityId: string;
  parentSpaceId: string | null;
  name: string;
  description: string;
  icon: string | null;
  color: string | null;
  position: number;
  createdBy: string;
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
  deletedAt: string | null; // ISO 8601 string
}

export interface CreateSpaceDto {
  communityId: string;
  name: string;
  description: string;
  parentSpaceId?: string;
  icon?: string;
  color?: string;
  position?: number;
}

export interface UpdateSpaceDto {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  position?: number;
}
