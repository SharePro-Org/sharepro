export interface ModulePermissionForm {
    module: string;
    operationType: string;
    action: string;
    resource: string;
    name: string;
    description: string;
    requiresOwnership: boolean;
    requiresBusinessMembership: boolean;
}

export interface UserRoleForm {
    name: string;
    displayName: string;
    description: string;
    hierarchyLevel: number;
    permissionIds: string[];
    isActive: boolean;
}

export interface ModulePermission {
    id: string;
    module: string;
    operationType: string;
    action: string;
    resource: string;
    name: string;
    description: string;
    isActive: boolean;
    requiresOwnership: boolean;
    requiresBusinessMembership: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UserRole {
    id: string;
    name: string;
    displayName: string;
    description: string;
    isSystemRole: boolean;
    hierarchyLevel: number;
    isActive: boolean;
    permissions: {
        id: string;
        module: string;
        name: string;
    }[];
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: string;
    email: string;
    userProfile: {
        firstName: string;
        lastName: string;
    };
    isActive: boolean;
    isStaff: boolean;
    dateJoined: string;
}

export interface UserPermissions {
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
    roles: {
        id: string;
        name: string;
        displayName: string;
        description: string;
        hierarchyLevel: number;
    }[];
    deniedPermissions: {
        id: string;
        module: string;
        name: string;
        action: string;
        resource: string;
    }[];
}
