
import { gql } from "@apollo/client";

export const GET_BUSINESS_ANALYTICS = gql`
	query GetBusinessAnalytics($businessId: UUID!) {
		businessAnalyticsByBusiness(businessId: $businessId) {
			activeCampaigns
			activeUsers
			campaignPerformance
			newReferrals
			newUsers
			returningUsers
			referralConversionRate
			successfulReferrals
			totalClicks
			totalConversions
			totalRevenue
			totalRewardsPaid
			totalSignups
			totalViews
			date
		}
	}
`;

export const GET_CAMPAIGN_ANALYTICS_SUMMARY = gql`
	query GetCampaignAnalyticsByCampaign($businessId: UUID!, $campaignType: String!) {
		campaignAnalyticsByCampaign(businessId: $businessId, campaignType: $campaignType) {
			clickThroughRate
			clicks
			conversionRate
			conversions
			costPerConversion
			createdAt
			deletedAt
			desktopPercentage
			directClicks
			emailClicks
			facebookClicks
			id
			instagramClicks
			mobilePercentage
			revenue
			shares
			smsClicks
			tabletPercentage
			topCities
			topCountries
			topStates
			twitterClicks
			updatedAt
			whatsappClicks
		}
	}
`;

