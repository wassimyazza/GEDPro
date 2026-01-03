// Role-based access control utilities
// Simple role definitions and access checking

// Role constants - matches backend roles
export const ROLES = {
    ADMIN_RH: 'adminRH',
    RH: 'rh',
    MANAGER: 'manager',
} as const;

// Type for role values
export type Role = typeof ROLES[keyof typeof ROLES];

// Check if a user has the required role
// Simple hierarchy: ADMIN_RH > RH > MANAGER
export function canAccess(requiredRole: Role, userRole: Role | null): boolean {
    if (!userRole) {
        return false;
    }

    // Admin RH can access everything
    if (userRole === ROLES.ADMIN_RH) {
        return true;
    }

    // RH can access RH and MANAGER features
    if (userRole === ROLES.RH) {
        return requiredRole === ROLES.RH || requiredRole === ROLES.MANAGER;
    }

    // Manager can only access MANAGER features
    if (userRole === ROLES.MANAGER) {
        return requiredRole === ROLES.MANAGER;
    }

    return false;
}

// Check if user is admin
export function isAdmin(userRole: Role | null): boolean {
    return userRole === ROLES.ADMIN_RH;
}

// Check if user is RH or Admin
export function isRHOrAdmin(userRole: Role | null): boolean {
    return userRole === ROLES.ADMIN_RH || userRole === ROLES.RH;
}
