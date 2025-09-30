
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


