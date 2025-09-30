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
  query GetCampaignAnalytics($campaignId: UUID!) {
    campaignAnalytics(id: $campaignId) {
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


