
import { gql } from "@apollo/client";

export const GET_BUSINESS_ANALYTICS = gql`
	query GetBusinessAnalytics($businessId: UUID!) {
		businessAnalyticsByBusiness(businessId: $businessId) {
			totalViews
			totalClicks
			totalConversions
			totalRevenue
			referralConversionRate
			date
		}
	}
`;


