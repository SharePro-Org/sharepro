
import { gql } from "@apollo/client";

export const CAMPAIGNS = gql`
	query campaigns {
		campaigns {
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

export const BUSINESSES = gql`
  query businesses {
    businesses {
     name
    createdAt
    deletedAt
    businessType
    city
    country
    description
    email
    id
    isActive
    logo
    phone
    onBoardingComplete
    postalCode
    state
    website
    tagline
    referrals {
      refereeName
    }
    subscriptionStatus
    }
  }
`;


export const BUSINESS = gql`
  query business($id: UUID!) {
    business(id: $id) {
      subscriptionStatus
      businessType
      businessCategory
      name
      description
      id
      phone
      owner {
        business {
          name
        }
      }
      campaigns {
        name
        status
        startDate
        totalViews
        totalReferrals
        totalRewardsGiven
        maxParticipants
        isActive
        campaignType
        business {
          id
        }
      }
    }
  }
`;


export const BUSINESS_MEMBERS = gql`
  query businessMembers($businessId: UUID!) {
    businessMembers(businessId: $businessId) {
      invitedAt
      inviterEmail
      inviterName
      isActive
      joinedAt
      role
      user {
        userProfile {
          firstName
          bio
          createdAt
          lastName
          email
        }
      }
    }
  }
`;