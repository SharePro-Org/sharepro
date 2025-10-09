import { gql } from "@apollo/client";

export const GET_PLANS = gql`
  query GetPlans {
    plans(isActive: true) {
      id
      name
      description
      price
      billablePeriods
      maxCampaigns
      maxReferrals
      maxTeamMembers
      analyticsEnabled
      customBranding
      prioritySupport
      isPopular
    }
  }
`;

export const GET_BILLING_SUMMARY = gql`
  query GetBillingSummary {
    billingSummary {
      currentPlan {
        id
        name
        price
        billablePeriods
      }
      subscriptionStatus
      nextBillingDate
      amountDue
      paymentMethod {
        id
        displayName
        cardBrand
        cardLast4
      }
    }
  }
`;

export const GET_MY_SUBSCRIPTION = gql`
  query GetMySubscription {
    mySubscription {
      id
      plan {
        id
        name
        price
        billablePeriods
      }
      status
      currentPeriodStart
      currentPeriodEnd
      cancelAtPeriodEnd
    }
  }
`;

export const GET_PAYMENT_METHODS = gql`
  query GetPaymentMethods {
    myPaymentMethods {
      cardBrand
      cardExpMonth
      cardExpYear
      cardLast4
      createdAt
      isDefault
      type
      displayName
      deletedAt
      id
      isDeleted
      stripePaymentMethodId
      updatedAt
    }
  }
`;

export const GET_INVOICES = gql`
  query GetInvoices($limit: Int, $offset: Int) {
    myInvoices(limit: $limit, offset: $offset) {
      id
      status
      invoiceNumber
      amountDue
      amountPaid
      currency
      issueDate
      dueDate
      createdAt
      subscription{
        id
        plan {
          name
        }
      }
    }
  }
`;

export const DELETE_PAYMENT_METHOD = gql`
  mutation DeletePaymentMethod($paymentMethodId: ID!) {
    deletePaymentMethod(paymentMethodId: $paymentMethodId) {
      success
      message
    }
  }
`;