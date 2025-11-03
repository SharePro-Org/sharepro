export interface BusinessAnalytics {
    activeCampaigns: number;
    activeUsers: number;
    campaignPerformance: number;
    newReferrals: number;
    newUsers: number;
    returningUsers: number;
    referralConversionRate: number;
    successfulReferrals: number;
    totalClicks: number;
    totalConversions: number;
    totalRevenue: number;
    totalRewardsPaid: number;
    totalSignups: number;
    totalViews: number;
    date: string;
}

export interface Campaign {
    id: string;
    name: string;
    isActive: boolean;
    totalReferrals: number;
    totalRewardsGiven: number;
    analyticsEvents: Array<{
        referrer: string;
    }>;
    referralRewards: Array<{
        referralRewardType: string;
        referralRewardAmount: number;
    }>;
}

export interface ChartData {
    series: Array<{
        name?: string;
        data: number[];
    }>;
    options: {
        chart: {
            height: number;
            type?: string;
            zoom?: {
                enabled: boolean;
            };
        };
        dataLabels?: {
            enabled: boolean;
        };
        stroke?: {
            curve: 'smooth' | 'straight';
        };
        title?: {
            text: string;
            align: 'left' | 'center' | 'right';
        };
        grid?: {
            row: {
                colors: string[];
                opacity: number;
            };
        };
        xaxis: {
            categories: string[];
            labels?: {
                style?: {
                    colors: string[];
                    fontSize: string;
                };
            };
        };
        colors?: string[];
        plotOptions?: {
            bar?: {
                columnWidth?: string;
                distributed?: boolean;
                borderRadius?: number;
                borderRadiusApplication?: string;
                horizontal?: boolean;
            };
        };
    };
}
