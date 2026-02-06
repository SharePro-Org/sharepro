import { gql } from "@apollo/client";


export const GET_WALLET_BALANCE = gql`
  query GetWalletBalance {
    businessWallet {
      id
      balance
      currency
      isVerified
      accountName
      accountNumber
      bankName
      autoRechargeThreshold
    }
  }
`;

export const WALLET_TRANSACTIONS = gql`
    query GetWalletTransactions {
      walletTransactions  {
      transactionType
      amount
      status
      reference
      createdAt
      }
    }
`;

export const GET_WALLET_STATS = gql`
  query GetWalletStats {
    walletTransactions {
      transactionType
      amount
      status
    }
  }
`;

export const BANK_LIST = gql`
  query bankList {
    bankList {
      name
      code
    }
  }
`;

export const RESOLVE_ACCOUNT_NAME = gql`
  query resolveAccountName($accountNumber: String!, $bankCode: String!) {
    resolveAccountName(accountNumber: $accountNumber, bankCode: $bankCode) {
      success
      message
      accountName
      accountNumber
      bankCode
    }
  }
`;