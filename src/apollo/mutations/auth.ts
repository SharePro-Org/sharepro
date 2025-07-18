import { gql } from '@apollo/client';

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
        phone
        businessName
        business {
          onBoardingComplete
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
        phone
        business {
          onBoardingComplete
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
  mutation ResetPassword($newPassword: String!, $token: String!) {
    resetPassword(newPassword: $newPassword, token: $token) {
      message
      success
    }
  }
`;

export const ONBOARDING_BUSINESS = gql`
  mutation OnboardingBusiness($input: OnboardingBusinessInput!) {
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