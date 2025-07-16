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