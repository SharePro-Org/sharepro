import { gql } from '@apollo/client';

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

/**
 * Orchestrator: Initiate adding a payment method via single-step charge
 * Handles customer creation + payment method creation + charge in one call
 */
export const INITIATE_ADD_PAYMENT_METHOD = gql`
  mutation InitiateAddPaymentMethod($input: OrchestratorCardInput!) {
    initiateAddPaymentMethod(input: $input) {
      success
      message
      chargeId
      nextActionType
      redirectUrl
      paymentInstruction
      paymentMethodId
      errors
    }
  }
`;

/**
 * Orchestrator: Authorize a pending charge (PIN, OTP, AVS)
 */
export const AUTHORIZE_CARD_CHARGE = gql`
  mutation AuthorizeCardCharge($input: AuthorizeChargeInput!) {
    authorizeCardCharge(input: $input) {
      success
      message
      chargeId
      nextActionType
      redirectUrl
      status
      paymentMethodId
      subscriptionId
      errors
    }
  }
`;

/**
 * Orchestrator: Initiate a subscription with inline card payment
 * Same flow as add payment method but charges plan price and creates subscription
 */
export const INITIATE_SUBSCRIPTION_WITH_CARD = gql`
  mutation InitiateSubscriptionWithCard($input: SubscriptionCardInput!) {
    initiateSubscriptionWithCard(input: $input) {
      success
      message
      chargeId
      nextActionType
      redirectUrl
      paymentInstruction
      paymentMethodId
      subscriptionId
      errors
    }
  }
`;
