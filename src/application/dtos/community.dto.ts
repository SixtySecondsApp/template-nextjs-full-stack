/**
 * Community Data Transfer Objects
 * Plain TypeScript interfaces for API communication
 * NO domain logic, NO Prisma types
 */

/**
 * Full Community DTO for API responses
 */
export interface CommunityDto {
  id: string;
  name: string;
  logoUrl: string | null;
  primaryColor: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create Community DTO for API requests
 */
export interface CreateCommunityDto {
  name: string;
  logoUrl?: string | null;
  primaryColor?: string;
  ownerId: string;
}

/**
 * Update Community DTO for API requests
 */
export interface UpdateCommunityDto {
  name?: string;
  logoUrl?: string | null;
  primaryColor?: string;
}

/**
 * Transfer Ownership DTO for API requests
 */
export interface TransferOwnershipDto {
  newOwnerId: string;
}
