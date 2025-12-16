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