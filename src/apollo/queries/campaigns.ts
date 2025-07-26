import { gql } from "@apollo/client";
// Query to get all campaigns
// Query to get campaigns for a specific business
export const GET_BUSINESS_CAMPAIGNS = gql`
  query GetBusinessCampaigns($businessId: UUID!) {
    businessCampaigns(businessId: $businessId) {
      campaignType
      id
      createdAt
      updatedAt
      business {
        id
      }
      name
      description
      isActive
      isScheduled
      status
      startDate

      endDate
      totalReferrals
      conversionRate
      totalRewardsGiven
      activeParticipants
      loyaltyRewards {
        earnRewardAmount
        earnRewardAction
        earnRewardPoints
        loyaltyName
        loyaltyPoints
        loyaltyTierBenefits
      }
      comboRewards {
        redeemRewardAction
        redeemRewardChannels
        loyaltyName
        loyaltyPoints
        loyaltyTierBenefits
      }
      referralRewards {
        referralRewardAction
        referralRewardAmount
        referralRewardLimit
        loyaltyName
      }
    }
  }
`;
