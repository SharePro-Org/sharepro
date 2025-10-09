import { gql } from "@apollo/client";

export const USER_DASHBOARD_SUMMARY = gql`
  query UserDashboardSummary($userId: UUID!) {
    userDashboardSummary(userId: $userId) {
      pendingActions
      recentRewardChange
      totalCampaignsJoined
      totalReferrals
      totalRewardsEarned
      recentRewardPercentage
      walletBalance
    }
  }
`;

export const USER_JOINED_CAMPAIGNS = gql`
  query UserJoinedCampaigns($userId: UUID!) {
    userJoinedCampaigns(userId: $userId) {
      campaignId
      campaignName
      campaignType
      dateJoined
      referralCode
      rewardInfo
      status
      totalReferrals
      totalRewards
    }
  }
`;

export const USER_REWARD_HISTORY = gql`
  query UserRewardHistory($userId: UUID!) {
    userRewardHistory(userId: $userId) {
      amount
      campaignName
      createdAt
      currency
      description
      isClaimable
      processedAt
      rewardId
      rewardType
      status
    }
  }
`;

export const AVAILABLE_CAMPAIGNS = gql`
  query AvailableCampaigns($userId: UUID!) {
    availableCampaigns(userId: $userId) {
      campaignId
      campaignName
      campaignType
      endDate
      isJoinable
      participantsCount
      rewardInfo
      maxParticipants
      description
      websiteLink
    }
  }
`;

export const USER_REWARDS = gql`
  query UserRewards($userId: UUID!) {
    userRewards(userId: $userId) {
      amount
      createdAt
      currency
      deletedAt
      description
      expiresAt
      id
      status
      rewardType
      isExpired
      campaign {
        campaignType
        name
        status
      }
    }
  }
`;
