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
        referralCode
        referralLink
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
        referralCode
        referralLink
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
        referralCode
        referralLink
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
        referralCode
        referralLink
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

export const ACTIVATE_CAMPAIGN = gql`
  mutation ActivateCampaign($id: UUID!, $isActive: Boolean!) {
    activateCampaign(id: $id, isActive: $isActive) {
      message
      success
    }
  }
`;
export const PAUSE_CAMPAIGN = gql`
  mutation PauseCampaign($id: UUID!, $pause: Boolean!) {
    pauseCampaign(id: $id, pause: $pause) {
      message
      success
    }
  }
`;

export const END_CAMPAIGN = gql`
  mutation EndCampaign($id: UUID!) {
    endCampaign(id: $id) {
      message
      success
    }
  }
`;

export const JOIN_CAMPAIGN = gql`
  mutation JoinCampaign($campaignId: UUID!, $userId: UUID!) {
    joinCampaign(campaignId: $campaignId, userId: $userId) {
      referralCode
      referralLink
      message
      success
    }
  }
`;

export const CLAIM_REWARD = gql`
  mutation ClaimReward($rewardId: UUID!, $userId: UUID!) {
    claimReward(rewardId: $rewardId, userId: $userId) {
      message
      errors
      success
    }
  }
`;

export const APPROVE_OR_REJECT_PROOF = gql`
  mutation ApproveOrRejectProofMutation($action: String!, $rewardId: UUID!) {
    approveOrRejectProof(action: $action, rewardId: $rewardId) {
      success
      message
      errors
    }
  }
`