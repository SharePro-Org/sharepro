import { gql } from "@apollo/client";

export const LIST_INVITED_MEMBERS = gql`
  query ListInvitedMembers($businessId: UUID!) {
    businessMembers(businessId: $businessId) {
      memberEmail
      status
      role
      invitedAt
      inviterName
      inviterEmail
      joinedAt
    }
  }
`;

export const REGISTER_INVITED_MEMBER = gql`
  mutation RegisterInvitedMember($input: RegisterInviteMemberInput!) {
    registerInvitedMember(input: $input) {
      errors
      message
      success
    }
  }
`;

export const INVITE_MEMBER = gql`
  mutation InviteMember($input: InviteMemberInput!) {
    inviteMember(input: $input) {
      message
      success
      errors
    }
  }
`;


export const GET_USER = gql`
  query GetUser($id: UUID!) {
    user(id: $id) {
      businessName
      dateJoined
      email
      firstName
      business {
        addressLine1
        addressLine2
        email
        id
      }
    }
  }
`;