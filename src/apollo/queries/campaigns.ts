import { gql } from '@apollo/client';
// Query to get all campaigns
// Query to get campaigns for a specific business
export const GET_BUSINESS_CAMPAIGNS = gql`
  query GetBusinessCampaigns($businessId: UUID!) {
    businessCampaigns(businessId: $businessId) {
      conversionRate
      description
      endDate
      id
      isActive
      name
      pointsPerReferral
      rewardAmount
      rewardCurrency
      rewardType
      startDate
      status
      totalConversions
      totalParticipants
      totalReferrals
      totalViews
      updatedAt
    }
  }
`;
