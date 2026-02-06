import { gql } from '@apollo/client';

/**
 * v4 API Mutation - Direct payment method creation with encrypted card data
 * Returns: paymentMethodId immediately (no checkout URL)
 */
export const ADD_PAYMENT_METHOD_V4 = gql`
  mutation AddPaymentMethodV4($input: PaymentMethodInput!) {
    addPaymentMethodV4(input: $input) {
      success
      message
      paymentMethodId
      errors
    }
  }
`;

/**
 * v4 API Mutation - Add bank account payment method
 * Returns: paymentMethodId immediately
 */
export const ADD_BANK_ACCOUNT_PAYMENT_METHOD = gql`
  mutation AddBankAccountPaymentMethod($input: PaymentMethodInput!) {
    addBankAccountPaymentMethod(input: $input) {
      success
      message
      paymentMethodId
      errors
    }
  }
`;

/**
 * Charge a saved payment method
 */
export const CHARGE_PAYMENT_METHOD = gql`
  mutation ChargePaymentMethod($input: ChargePaymentInput!) {
    chargePaymentMethod(input: $input) {
      success
      message
      transactionId
      errors
    }
  }
`;

/**
 * Delete a payment method
 */
export const DELETE_PAYMENT_METHOD = gql`
  mutation DeletePaymentMethod($paymentMethodId: ID!) {
    deletePaymentMethod(paymentMethodId: $paymentMethodId) {
      success
      message
      errors
    }
  }
`;

/**
 * Verify a payment method
 */
export const VERIFY_PAYMENT_METHOD = gql`
  mutation VerifyPaymentMethod($paymentMethodId: ID!) {
    verifyPaymentMethod(paymentMethodId: $paymentMethodId) {
      success
      message
      errors
    }
  }
`;
