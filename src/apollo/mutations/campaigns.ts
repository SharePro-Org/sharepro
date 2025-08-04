import { gql } from "@apollo/client";
// Mutation to create a campaign
export const CREATE_CAMPAIGN = gql`
  mutation CreateCampaign($input: CampaignInput!) {
    createCampaign(input: $input) {
      success
      message
      errors
      campaign {
        name
        id
      }
    }
  }
`;

export const CREATE_LOYALTY_REWARD = gql`
  mutation CreateLoyaltyReward($input: RewardCampaignInput!) {
    createCampaignReward(input: $input) {
      success
      message
      errors
      campaign {
        id
        name
        shareLinks
        campaignType
        loyaltyRewards {
          id
          earnRewardAmount
          redeemRewardValue
          loyaltyName
        }
      }
    }
  }
`;

export const CREATE_REFERRAL_REWARD = gql`
  mutation CreateReferralReward($input: RewardCampaignInput!) {
    createCampaignReward(input: $input) {
      success
      message
      errors
      campaign {
        id
        name
        shareLinks
        campaignType
        referralRewards {
          id
          referralRewardAmount
          referreeRewardValue
          referralRewardLimit
        }
      }
    }
  }
`;

export const CREATE_COMBO_REWARD = gql`
  mutation CreateComboReward($input: RewardCampaignInput!) {
    createCampaignReward(input: $input) {
      success
      message
      errors
      campaign {
        id
        name
        shareLinks
        campaignType
        loyaltyRewards {
          id
          earnRewardAmount
          redeemRewardValue
          loyaltyName
        }
        referralRewards {
          id
          referralRewardAmount
          referreeRewardValue
          referralRewardLimit
        }
      }
    }
  }
`;
