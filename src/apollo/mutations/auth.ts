import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
  mutation RegisterUserByCode($input: RegisterUserInput!) {
    registerUserByCode(input: $input) {
      success
      message
      user {
        id
        email
        firstName
        lastName
      }
    }
  }
`;

export const TRACK_CONVERSION = gql`
  mutation TrackConversion(
    $campaignId: ID!
    $referralCode: String
    $properties: JSONString
  ) {
    trackConversion(
      campaignId: $campaignId
      referralCode: $referralCode
      properties: $properties
    ) {
      success
      message
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      message
      token
      refreshToken
      success
      user {
        id
        email
        profile {
          userType
        }
        phone
        businessName
        business {
          onBoardingComplete
          id
        }
      }
    }
  }
`;

export const LOGIN_PHONE = gql`
  mutation LoginPhone($phone: String!, $password: String!) {
    loginPhone(phone: $phone, password: $password) {
      success
      token
      refreshToken
      message
      user {
        id
        businessName
        email
        profile {
          userType
        }
        phone
        business {
          onBoardingComplete
          id
        }
      }
    }
  }
`;

export const VERIFY_EMAIL = gql`
  mutation VerifyEmail($code: String!) {
    verifyEmail(code: $code) {
      message
      success
      user {
        email
        id
      }
    }
  }
`;

export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      message
      success
      user {
        id
        email
      }
    }
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      message
      success
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($newPassword: String!, $restToken: String!) {
    resetPassword(newPassword: $newPassword, restToken: $restToken) {
      message
      success
    }
  }
`;

export const ONBOARDING_BUSINESS = gql`
  mutation OnboardingBusiness($input: OnboardingInput!) {
    onboardingBusiness(input: $input) {
      message
      success
    }
  }
`;

// BUSINESS_TYPES = [
//   ('retail', 'Retail'),
//   ('wholesale', 'Wholesale'),
//   ('service', 'Service'),
// ]

// BUSINESS_CATEGORIES = [
//   ('food', 'Food'),
//   ('retail', 'Retail'),
//   ('technology', 'Technology'),
//   ('health', 'Health'),
// ]
