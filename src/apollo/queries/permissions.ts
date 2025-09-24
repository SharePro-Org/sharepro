import { gql } from '@apollo/client';

export const GET_MODULE_PERMISSIONS = gql`
  query GetModulePermissions {
    modulePermissions {
      id
      module
      operationType
      action
      resource
      name
      description
      isActive
      requiresOwnership
      requiresBusinessMembership
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER_ROLES = gql`
  query GetUserRoles {
    userRoles {
      id
      name
      displayName
      description
      isSystemRole
      hierarchyLevel
      isActive
      permissions {
        id
        module
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    allUsers {
          id
          email
          userProfile {
            firstName
            lastName
          }
          isActive
          isStaff
          dateJoined
    }
  }
`;

export const GET_USER_PERMISSIONS = gql`
  query GetUserPermissions($userId: ID!) {
    userPermissions(userId: $userId) {
      user {
        id
        email
        firstName
        lastName
      }
      roles {
        id
        name
        displayName
        description
        hierarchyLevel
      }
      deniedPermissions {
        id
        module
        name
        action
        resource
      }
    }
  }
`;