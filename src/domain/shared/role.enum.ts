/**
 * Role enum defines the hierarchy of user permissions within a community.
 *
 * Hierarchy (highest to lowest):
 * OWNER > ADMIN > MODERATOR > MEMBER > GUEST
 */
export enum Role {
  /**
   * Full access to all community features.
   * Can transfer ownership, delete community, manage all settings.
   * Only one owner per community.
   */
  OWNER = "OWNER",

  /**
   * Can manage members, content, and most settings.
   * Cannot transfer ownership or delete community.
   */
  ADMIN = "ADMIN",

  /**
   * Can moderate content and manage member interactions.
   * Cannot access administrative settings.
   */
  MODERATOR = "MODERATOR",

  /**
   * Standard community member.
   * Can create posts, comments, and participate in discussions.
   */
  MEMBER = "MEMBER",

  /**
   * Read-only access to public community content.
   * Cannot create or interact with content.
   */
  GUEST = "GUEST",
}

/**
 * Helper function to validate if a role exists in the enum.
 */
export function isValidRole(role: string): role is Role {
  return Object.values(Role).includes(role as Role);
}

/**
 * Role hierarchy levels for comparison operations.
 */
export const ROLE_HIERARCHY: Record<Role, number> = {
  [Role.OWNER]: 5,
  [Role.ADMIN]: 4,
  [Role.MODERATOR]: 3,
  [Role.MEMBER]: 2,
  [Role.GUEST]: 1,
};

/**
 * Check if one role has higher or equal authority than another.
 */
export function hasEqualOrHigherRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}
