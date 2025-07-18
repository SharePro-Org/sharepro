import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      message
      token
      success
      user {
        id
        email
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
      message
      user {
        id
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