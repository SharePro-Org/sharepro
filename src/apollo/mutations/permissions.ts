import { gql } from '@apollo/client';

export const CREATE_MODULE_PERMISSION = gql`
  mutation CreateModulePermission($input: CreateModulePermissionInput!) {
    createModulePermission(input: $input) {
      success
      message
      modulePermission {
        id
        module
        operationType
        action
        resource
        name
        description
      }
    }
  }
`;

export const CREATE_USER_ROLE = gql`
  mutation CreateUserRole($input: CreateUserRoleInput!) {
    createUserRole(input: $input) {
      success
      message
      userRole {
        id
        name
        displayName
        description
        hierarchyLevel
      }
    }
  }
`;

export const UPDATE_MODULE_PERMISSION = gql`
  mutation UpdateModulePermission($input: UpdateModulePermissionInput!) {
    updateModulePermission(input: $input) {
      success
      message
      modulePermission {
        id
        displayName
        description
        isActive
      }
    }
  }
`;

export const ASSIGN_ROLE_TO_USER = gql`
  mutation AssignRoleToUser($userId: ID!, $roleId: ID!) {
    assignRole(userId: $userId, roleId: $roleId) {
      success
      message
      errors
    }
  }
`;

export const REMOVE_ROLE_FROM_USER = gql`
  mutation RemoveRoleFromUser($userId: ID!, $roleId: ID!) {
    removeRole(userId: $userId, roleId: $roleId) {
      success
      message
      errors
    }
  }
`;

export const GRANT_DIRECT_PERMISSION = gql`
  mutation GrantDirectPermission($userId: ID!, $permissionId: ID!) {
    grantPermission(userId: $userId, permissionId: $permissionId) {
      success
      message
      errors
    }
  }
`;

export const REVOKE_DIRECT_PERMISSION = gql`
  mutation RevokeDirectPermission($userId: ID!, $permissionId: ID!) {
    revokePermission(userId: $userId, permissionId: $permissionId) {
      success
      message
      errors
    }
  }
`;