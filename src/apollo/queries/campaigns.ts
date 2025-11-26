import { gql } from "@apollo/client";

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

export const GET_CAMPAIGN_ANALYTICS = gql`
  query GetCampaignAnalytics($id: UUID!, $businessId: UUID!) {
    campaignAnalytics(id: $id, businessId: $businessId) {
      clickThroughRate
      clicks
      conversionRate
      conversions
      costPerConversion
      emailClicks
      directClicks
      facebookClicks
      smsClicks
      twitterClicks
      topStates
      topCountries
      views
      whatsappClicks
      tabletPercentage
      topCities
      shares
      revenue
      mobilePercentage
      instagramClicks
      desktopPercentage
      date
      campaign {
        activeParticipants
        activeReferrals
        campaignType
        name
        referralLink
        status
        totalReferrals
        totalRewardsGiven
        totalViews
        shareLinks
        analyticsEvents {
          referrer
        }
        referralRewards {
          referreeValidityPeriod
          referreeRewardValue
          referreeRewardType
          referreeRewardChannels
          referreeRewardAction
          referralRewardType
          referralRewardLimitType
          referralRewardLimit
          referralRewardAmount
          referralRewardAction
          loyaltyTierBenefits
          loyaltyPoints
          loyaltyName
        }
        loyaltyRewards {
          redeemValidityPeriod
          redeemRewardValue
          redeemRewardPointRequired
          redeemRewardChannels
          redeemRewardAction
          loyaltyTierBenefits
          loyaltyPoints
          loyaltyName
          earnRewardPoints
          earnRewardAmount
          earnRewardAction
        }
        comboRewards {
          loyaltyName
          loyaltyPoints
          loyaltyTierBenefits
          redeemRewardAction
          redeemRewardChannels
          redeemRewardPointRequired
          redeemRewardValue
          redeemValidityPeriod
          referralName
          referralPoints
          referralRewardAction
          referralRewardAmount
          referralRewardLimit
          referralRewardLimitType
          referralRewardType
          referralTierBenefits
          referreeRewardAction
          referreeRewardChannels
          referreeRewardType
          referreeRewardValue
          referreeValidityPeriod
        }
      }
    }
  }
`;

export const GET_PAYOUT = gql`
  query CampaignRewards($campaignId: UUID!) {
    campaignRewards(campaignId: $campaignId) {
      amount
      currency
      createdAt
      updatedAt
      status
      rewardType
      processedAt
      points
      metadata
      isExpired
      isDeleted
      id
      expiresAt
      description
      deletedAt
      user {
        lastName
        firstName
        email
      }
      campaign {
        name
      }
    }
  }
`;

export const GET_CAMPAIGN = gql`
  query Campaign($id: UUID!, $businessId: UUID!) {
    campaign(id: $id, businessId: $businessId){
      activeParticipants
    activeReferrals
    campaignType
    conversionRate
    createdAt
    deletedAt
    description
    endDate
    id
    isActive
    isDeleted
    isScheduled
    maxParticipants
    name
    referralCode
    referralLink
    shareLinks
    status
    totalReferrals
    totalRewardsGiven
    totalViews
    updatedAt
    websiteLink
      referralRewards {
          referreeValidityPeriod
          referreeRewardValue
          referreeRewardType
          referreeRewardChannels
          referreeRewardAction
          referralRewardType
          referralRewardLimitType
          referralRewardLimit
          referralRewardAmount
          referralRewardAction
          loyaltyTierBenefits
          loyaltyPoints
          loyaltyName
        }
        loyaltyRewards {
          redeemValidityPeriod
          redeemRewardValue
          redeemRewardPointRequired
          redeemRewardChannels
          redeemRewardAction
          loyaltyTierBenefits
          loyaltyPoints
          loyaltyName
          earnRewardPoints
          earnRewardAmount
          earnRewardAction
        }
        comboRewards {
          loyaltyName
          loyaltyPoints
          loyaltyTierBenefits
          redeemRewardAction
          redeemRewardChannels
          redeemRewardPointRequired
          redeemRewardValue
          redeemValidityPeriod
          referralName
          referralPoints
          referralRewardAction
          referralRewardAmount
          referralRewardLimit
          referralRewardLimitType
          referralRewardType
          referralTierBenefits
          referreeRewardAction
          referreeRewardChannels
          referreeRewardType
          referreeRewardValue
          referreeValidityPeriod
        }
    }
  }
`
export const GET_SINGLE_PAYOUT = gql`
  query Reward($id: UUID!) {
  reward(id: $id) {
    amount
    createdAt
    currency
    deletedAt
    description
    status
    rewardType
    reviewNotes
    requiresProof
    proofFile
    proofDescription
    processedAt
    points
    metadata
    isExpired
    isDeleted
    id
    campaign {
      campaignType
      name
    }
    user {
      firstName
      lastName
      email
      phone
      bankAccounts{
        bankName
        accountName
        accountNumber
      }
    }
  }
}
`


