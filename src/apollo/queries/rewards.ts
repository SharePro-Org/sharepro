import { gql } from "@apollo/client";

export const GET_WITHDRAWAL_REQUESTS_BY_BUSINESS = gql`
  query GetWithdrawalRequestsByBusiness($businessId: UUID!) {
    withdrawalRequestsByBusiness(businessId: $businessId) {
      id
      amount
      currency
      method
      status
      paymentDetails
      rejectionReason
      transactionReference
      createdAt
      processedAt
      processedBy {
        id
        email
        firstName
        lastName
      }
      user {
        id
        email
        firstName
        lastName
        phone
      }
    }
  }
`;

export const GET_USER_WITHDRAWAL_REQUESTS = gql`
  query GetUserWithdrawalRequests {
    userWithdrawalRequests {
      id
      amount
      currency
      method
      status
      paymentDetails
      rejectionReason
      transactionReference
      createdAt
      processedAt
    }
  }
`;

export const GET_ALL_WITHDRAWAL_REQUESTS = gql`
  query GetAllWithdrawalRequests {
    allWithdrawalRequests {
      id
      amount
      currency
      method
      status
      paymentDetails
      rejectionReason
      transactionReference
      createdAt
      processedAt
      processedBy {
        id
        email
        firstName
        lastName
      }
      user {
        id
        email
        firstName
        lastName
        phone
      }
      business {
        id
        name
      }
    }
  }
`;
