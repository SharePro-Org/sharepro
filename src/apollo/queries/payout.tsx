import { gql } from "@apollo/client";

export const GET_BUSINESS_REWARDS = gql`
  query GetBusinessRewards($businessId: UUID!) {
    businessRewards(businessId: $businessId) {
      id
      user {
        id
        username
        email
      }
      campaign {
        id
        name
      }
      rewardType
      amount
      points
      currency
      status
      description
      processedAt
      proofFile
      proofDescription
      proofSubmittedAt
      requiresProof
      reviewNotes
      reviewedAt
      proofFiles {
        id
        fileUrl
        originalFilename
        fileSize
        fileType
      }
      expiresAt
      createdAt
      updatedAt
    }
  }
`;