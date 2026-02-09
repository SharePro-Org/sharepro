import { gql } from "@apollo/client";

export const GET_CAMPAIGN_REFERRALS = gql`
  query CampaignReferrals($campaignId: UUID!) {
    campaignReferrals(campaignId: $campaignId) {
      id
      referralCode
      status
      createdAt
      clickedAt
      registeredAt
      convertedAt
      purchaseAmount
      commissionAmount
      commissionPercentage
      referrer {
        id
        firstName
        lastName
        email
        phone
      }
      referee {
        id
        firstName
        lastName
        email
        phone
      }
      refereeEmail
      refereeName
      refereePhone
      rewards {
        id
        status
        proofSubmittedAt
        proofDescription
        proofFiles {
          id
          file
          fileUrl
          originalFilename
          fileType
          fileSize
          createdAt
        }
      }
    }
  }
`;
