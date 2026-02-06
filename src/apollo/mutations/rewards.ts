import { gql } from "@apollo/client";

export const PROCESS_WITHDRAWAL_REQUEST = gql`
  mutation ProcessWithdrawalRequest(
    $withdrawalId: UUID!
    $action: String!
    $rejectionReason: String
    $transactionReference: String
  ) {
    processWithdrawalRequest(
      withdrawalId: $withdrawalId
      action: $action
      rejectionReason: $rejectionReason
      transactionReference: $transactionReference
    ) {
      success
      message
      errors
      withdrawalRequest {
        id
        status
        processedAt
        rejectionReason
        transactionReference
      }
    }
  }
`;
