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

export const UPDATE_CAMPAIGN = gql`
  mutation UpdateCampaign(
    $id: UUID!
    $name: String
    $description: String
    $isActive: Boolean
    $startDate: DateTime
    $endDate: DateTime
    $websiteLink: String
  ) {
    updateCampaign(
      id: $id
      name: $name
      description: $description
      isActive: $isActive
      startDate: $startDate
      endDate: $endDate
      websiteLink: $websiteLink
    ) {
      success
      message
      errors
      campaign {
        id
        name
        description
        startDate
        endDate
        websiteLink
        isActive
        campaignType
      }
    }
  }
`;

export const UPDATE_LOYALTY_REWARD = gql`
  mutation UpdateLoyaltyReward($rewardId: UUID!, $input: LoyaltyCampaignInput!) {
    updateLoyaltyReward(rewardId: $rewardId, input: $input) {
      success
      message
      errors
      campaign {
        id
        name
        loyaltyRewards {
          id
          earnRewardAction
          earnRewardAmount
          earnRewardPoints
          currency
          redeemRewardAction
          redeemRewardValue
          redeemRewardPointRequired
          redeemRewardChannels
          redeemValidityPeriod
          loyaltyPoints
          loyaltyName
          loyaltyTierBenefits
        }
      }
    }
  }
`;

export const UPDATE_REFERRAL_REWARD = gql`
  mutation UpdateReferralReward($rewardId: UUID!, $input: ReferralCampaignInput!) {
    updateReferralReward(rewardId: $rewardId, input: $input) {
      success
      message
      errors
      campaign {
        id
        name
        referralRewards {
          id
          referralRewardAction
          referralRewardAmount
          referralRewardLimit
          referralRewardType
          referralRewardLimitType
          referreeRewardAction
          referreeRewardValue
          referreeRewardType
          referreeRewardChannels
          referreeValidityPeriod
          loyaltyPoints
          loyaltyName
          loyaltyTierBenefits
        }
      }
    }
  }
`;

export const UPDATE_COMBO_REWARD = gql`
  mutation UpdateComboReward($rewardId: UUID!, $input: ComboCampaignInput!) {
    updateComboReward(rewardId: $rewardId, input: $input) {
      success
      message
      errors
      campaign {
        id
        name
        comboRewards {
          id
          earnRewardAction
          earnRewardAmount
          earnRewardPoints
          currency
          redeemRewardAction
          redeemRewardValue
          redeemRewardPointRequired
          redeemRewardChannels
          redeemValidityPeriod
          loyaltyPoints
          loyaltyName
          loyaltyTierBenefits
          referralRewardAction
          referralRewardAmount
          referralRewardLimit
          referralRewardType
          referralRewardLimitType
          referreeRewardAction
          referreeRewardValue
          referreeRewardType
          referreeRewardChannels
          referreeValidityPeriod
          referralPoints
          referralName
          referralTierBenefits
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

export const DELETE_CAMPAIGN = gql`
  mutation DeleteCampaign($id: UUID!) {
    deleteCampaign(id: $id) {
      message
      success
      errors
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
`;

export const SUBMIT_PROOF = gql`
  mutation SubmitProof($rewardId: UUID!, $files: [String]!, $fileNames: [String]!, $description: String) {
    submitProof(rewardId: $rewardId, files: $files, fileNames: $fileNames, description: $description) {
      success
      message
      errors
      reward {
        id
        proofFile
        proofSubmittedAt
        proofDescription
      }
    }
  }
`;

export const TRACK_REFERRAL_CLICK = gql`
  mutation TrackReferralClick($referralCode: String!, $userAgent: String, $referrerUrl: String) {
    trackReferralClick(referralCode: $referralCode, userAgent: $userAgent, referrerUrl: $referrerUrl) {
      success
      message
      campaignId
    }
  }
`;