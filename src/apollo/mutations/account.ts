
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
  query User($id: UUID!) {
    currentUser(id: $id) {
      dateJoined
      email
      phone
      userProfile {
        firstName
        lastName
        id
        language
      }
    }
  }
`;

export const GET_BUSINESS = gql`
  query Business($id: UUID!) {
    business(id: $id) {
      id
      name
      description
      tagline
      website
      logo
      email
      phone
      onBoardingComplete
      isKycVerified
      subscriptions {
        isTrial
        isActive
        endDate
        startDate
        plan {
          name
        }
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: UUID!
    $firstName: String
    $lastName: String
    $phone: String
  ) {
    updateUser(
      id: $id
      firstName: $firstName
      lastName: $lastName
      phone: $phone
    ) {
      success
      message
    }
  }
`;

export const UPDATE_BUSINESS = gql`
  mutation UpdateBusiness($businessId: UUID!, $input: UpdateOnboardingInput!) {
    updateBusiness(businessId: $businessId, input: $input) {
      business {
        id
        name
        description
        tagline
        website
        logo
      }
      success
      message
    }
  }
`;


export const GET_BUSINESS_SETTINGS = gql`
  query GetBusinessSettings($businessId: UUID!) {
    businessSettings(businessId: $businessId) {
      id
      allowPublicProfile
      allowDirectContact
      emailNotifications
      smsNotifications
      campaignDefaults {
        defaultRewardAmount
        defaultCurrency
      }
      integrations {
        webhookUrl
        apiKeys
      }
    }
  }
`;