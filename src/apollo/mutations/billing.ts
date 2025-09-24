import { gql } from "@apollo/client";

export const CREATE_SUBSCRIPTION = gql`
  mutation CreateSubscription($input: CreateSubscriptionInput!) {
    createSubscription(input: $input) {
      success
      message
      subscription {
        id
        status
      }
      clientSecret
      errors
    }
  }
`;

export const PROCESS_PAYMENT = gql`
  mutation ProcessPayment($input: ProcessPaymentInput!) {
    processPayment(input: $input) {
      success
      message
      payment {
        id
        status
        amount
      }
      clientSecret
      requiresAction
      errors
    }
  }
`;

export const UPDATE_SUBSCRIPTION = gql`
  mutation UpdateSubscription($input: UpdateSubscriptionInput!) {
    updateSubscription(input: $input) {
      success
      message
      subscription {
        id
        status
        cancelAtPeriodEnd
      }
      errors
    }
  }
`;

export const ADD_PAYMENT_METHOD = gql`
  mutation AddPaymentMethod($input: CreatePaymentMethodInput!) {
    addPaymentMethod(input: $input) {
      success
      message
      paymentMethod {
        id
        displayName
      }
      errors
    }
  }
`;