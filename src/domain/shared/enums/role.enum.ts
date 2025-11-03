/**
 * Role Enum
 * Defines user roles within the system
 * Ordered by privilege level (highest to lowest)
 */
export enum Role {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  MEMBER = 'MEMBER',
  GUEST = 'GUEST'
}

/**
 * Role hierarchy helpers
 */
export class RoleHelper {
  /**
   * Get all roles
   */
  public static getAllRoles(): Role[] {
    return Object.values(Role);
  }

  /**
   * Check if role has minimum privilege level
   * @param role Role to check
   * @param minimumRole Minimum required role
   * @returns True if role meets or exceeds minimum
   */
  public static hasPrivilege(role: Role, minimumRole: Role): boolean {
    const hierarchy = [Role.GUEST, Role.MEMBER, Role.MODERATOR, Role.ADMIN, Role.OWNER];
    const roleIndex = hierarchy.indexOf(role);
    const minimumIndex = hierarchy.indexOf(minimumRole);
    return roleIndex >= minimumIndex;
  }

  /**
   * Check if role is administrative
   * @param role Role to check
   * @returns True if role is admin or owner
   */
  public static isAdministrative(role: Role): boolean {
    return role === Role.ADMIN || role === Role.OWNER;
  }

  /**
   * Check if role is moderative
   * @param role Role to check
   * @returns True if role is moderator or above
   */
  public static isModeratorOrAbove(role: Role): boolean {
    return [Role.MODERATOR, Role.ADMIN, Role.OWNER].includes(role);
  }
}
