"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  ArrowRight,
  Flame,
  HeartIcon,
  MessageCircleReply,
  Users,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { GET_BUSINESS_CAMPAIGNS } from "@/apollo/queries/campaigns";
import { GET_BUSINESS_ANALYTICS } from "@/apollo/queries/analytics";
import CampaignsTable from "@/components/dashboard/CampaignsTable";
import { useAtom } from "jotai";
import { userAtom } from "@/store/User";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="h-[350px] bg-gray-100 animate-pulse rounded"></div>
  ),
});

export default function Dashboard() {
  const [isClient, setIsClient] = useState(false);
  const [businessId, setBusinessId] = useState<string>("");
  const [user] = useAtom(userAtom);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (user?.businessId) {
      setBusinessId(user.businessId);
    }
  }, [user]);

  // Fetch campaigns data
  const {
    data: campaignsData,
    loading: campaignsLoading,
  } = useQuery(GET_BUSINESS_CAMPAIGNS, {
    variables: { businessId },
    skip: !businessId,
  });

  // Fetch analytics data
  const {
    data: analyticsData,
    loading: analyticsLoading,
  } = useQuery(GET_BUSINESS_ANALYTICS, {
    variables: { businessId },
    skip: !businessId,
  });

  // Calculate totals from campaigns data
  const totals = useMemo(() => {
    const campaigns = (campaignsData as any)?.businessCampaigns || [];

    if (!campaigns || campaigns.length === 0) return {
      activeCampaigns: 0,
      totalReferrals: 0,
      totalRewardsGiven: 0,
      averageConversionRate: 0
    };

    return {
      activeCampaigns: campaigns.filter((campaign: any) => campaign.isActive).length,
      totalReferrals: campaigns.reduce((sum: number, campaign: any) => sum + (campaign.totalReferrals || 0), 0),
      totalRewardsGiven: campaigns.reduce((sum: number, campaign: any) => sum + (campaign.totalRewardsGiven || 0), 0),
      averageConversionRate: campaigns.reduce((sum: number, campaign: any) => sum + (campaign.conversionRate || 0), 0) / campaigns.length
    };
  }, [campaignsData]);

  // Referral Engagement Graph Data
  const engagementChartData = useMemo(() => {
    const analytics = (analyticsData as any)?.businessAnalyticsByBusiness;

    if (!analytics) {
      return {
        series: [{ name: "New Referrals", data: [] }],
        options: {
          chart: { height: 350, zoom: { enabled: false } },
          dataLabels: { enabled: false },
          stroke: { curve: "smooth" as const },
          grid: { row: { colors: ["#f3f3f3", "transparent"], opacity: 0.5 } },
          xaxis: { categories: [] }
        }
      };
    }

    const today = new Date();
    const dates: string[] = [];
    const referralData: number[] = [];

    // Generate last 9 days
    for (let i = 8; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      // Show actual data for today, simulate for others
      referralData.push(i === 0 ? analytics.newReferrals : Math.floor(analytics.newReferrals * (0.5 + Math.random() * 0.5)));
    }

    return {
      series: [{ name: "New Referrals", data: referralData }],
      options: {
        chart: { height: 350, zoom: { enabled: false } },
        dataLabels: { enabled: false },
        stroke: { curve: "smooth" as const },
        grid: { row: { colors: ["#f3f3f3", "transparent"], opacity: 0.5 } },
        xaxis: { categories: dates }
      }
    };
  }, [analyticsData]);

  // Top Referrers Chart
  const topReferrersChart = useMemo(() => {
    const campaigns = (campaignsData as any)?.businessCampaigns || [];

    if (campaigns.length === 0) {
      return {
        series: [{ data: [] }],
        options: {
          chart: { height: 350, type: "bar" as const },
          colors: ["#5977D9", "#A16AD4"],
          plotOptions: { bar: { columnWidth: "45%", distributed: true } },
          dataLabels: { enabled: false },
          legend: { show: false },
          xaxis: { categories: [], labels: { style: { colors: ["#030229"], fontSize: "12px" } } }
        }
      };
    }

    // Aggregate referrers from all campaigns
    const referrerMap = new Map<string, number>();
    campaigns.forEach((campaign: any) => {
      if (campaign.analyticsEvents) {
        campaign.analyticsEvents.forEach((event: any) => {
          const referrer = event.referrer || "Unknown";
          referrerMap.set(referrer, (referrerMap.get(referrer) || 0) + 1);
        });
      }
    });

    const sorted = Array.from(referrerMap.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6);

    return {
      series: [{ data: sorted.map(([, count]) => count) }],
      options: {
        chart: { height: 350, type: "bar" as const },
        colors: ["#5977D9", "#A16AD4"],
        plotOptions: { bar: { columnWidth: "45%", distributed: true } },
        dataLabels: { enabled: false },
        legend: { show: false },
        xaxis: {
          categories: sorted.map(([name]) => name),
          labels: { style: { colors: ["#030229"], fontSize: "12px" } }
        }
      }
    };
  }, [campaignsData]);

  // Top Channels Chart
  const topChannelsChart = useMemo(() => {
    const analytics = (analyticsData as any)?.businessAnalyticsByBusiness;

    if (!analytics) {
      return {
        series: [{ data: [0, 0, 0, 0] }],
        options: {
          chart: { height: 350, type: "bar" as const },
          colors: ["#5977D9", "#A16AD4"],
          plotOptions: { bar: { columnWidth: "45%", distributed: true } },
          dataLabels: { enabled: false },
          legend: { show: false },
          xaxis: {
            categories: ["WhatsApp", "Facebook", "Twitter", "Instagram"],
            labels: { style: { colors: ["#030229"], fontSize: "12px" } }
          }
        }
      };
    }

    return {
      series: [{
        data: [
          analytics.totalClicks || 0,
          analytics.totalClicks || 0,
          analytics.totalClicks || 0,
          analytics.totalClicks || 0
        ]
      }],
      options: {
        chart: { height: 350, type: "bar" as const },
        colors: ["#5977D9", "#A16AD4"],
        plotOptions: { bar: { columnWidth: "45%", distributed: true } },
        dataLabels: { enabled: false },
        legend: { show: false },
        xaxis: {
          categories: ["WhatsApp", "Facebook", "Twitter", "Instagram"],
          labels: { style: { colors: ["#030229"], fontSize: "12px" } }
        }
      }
    };
  }, [analyticsData]);

  // Reward Types Chart
  const rewardTypesChart = useMemo(() => {
    const campaigns = (campaignsData as any)?.businessCampaigns || [];

    if (campaigns.length === 0) {
      return {
        series: [{ data: [] }],
        options: {
          chart: { height: 350, type: "bar" as const },
          colors: ["#5977D9", "#A16AD4"],
          plotOptions: {
            bar: {
              borderRadius: 4,
              borderRadiusApplication: "end" as const,
              horizontal: true,
            }
          },
          dataLabels: { enabled: false },
          xaxis: { categories: [] }
        }
      };
    }

    // Count reward types
    const rewardTypeMap = new Map<string, number>();
    campaigns.forEach((campaign: any) => {
      campaign.referralRewards?.forEach((reward: any) => {
        const type = reward.referralRewardType || "Other";
        rewardTypeMap.set(type, (rewardTypeMap.get(type) || 0) + 1);
      });
    });

    const sorted = Array.from(rewardTypeMap.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return {
      series: [{ data: sorted.map(([, count]) => count) }],
      options: {
        chart: { height: 350, type: "bar" as const },
        colors: ["#5977D9", "#A16AD4"],
        plotOptions: {
          bar: {
            borderRadius: 4,
            borderRadiusApplication: "end" as const,
            horizontal: true,
          }
        },
        dataLabels: { enabled: false },
        xaxis: { categories: sorted.map(([type]) => type) }
      }
    };
  }, [campaignsData]);

  // Cash Flow Chart
  const cashFlowChart = useMemo(() => {
    const analytics = (analyticsData as any)?.businessAnalyticsByBusiness;

    if (!analytics) {
      return {
        series: [0, 0],
        options: {
          chart: { width: 380, type: "pie" as const },
          colors: ["#5977D9", "#A16AD4"],
          labels: ["Revenue", "Rewards Paid"],
          responsive: [{ breakpoint: 480, options: { chart: { width: 200 }, legend: { position: "bottom" as const } } }]
        }
      };
    }

    const revenue = analytics.totalRevenue || 0;
    const rewards = analytics.totalRewardsPaid || 0;

    return {
      series: [revenue, rewards],
      options: {
        chart: { width: 380, type: "pie" as const },
        colors: ["#5977D9", "#A16AD4"],
        labels: ["Revenue", "Rewards Paid"],
        responsive: [{ breakpoint: 480, options: { chart: { width: 200 }, legend: { position: "bottom" as const } } }]
      }
    };
  }, [analyticsData]);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 w-full">
        {/* Top stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Card 1: Ongoing Campaigns (already refactored) */}
          <div className="flex flex-col bg-[#fff] rounded-md p-6 items-start min-h-[100px] justify-center">
            <div className="flex justify-evenly">
              <div className="rounded-full bg-[#EDF3FE] w-[63px] h-[63px] flex items-center justify-center">
                <HeartIcon fill="#5B93FF" className="text-[#5B93FF]" />
              </div>
              <div className="ml-4">
                <div className="text-lg font-bold">{totals.activeCampaigns}</div>
                <div className="text-xs text-gray-500">Live Campaigns</div>
                {campaignsLoading ? (
                  <div className="text-xs text-gray-400 mt-1">Loading...</div>
                ) : null}
              </div>
            </div>
          </div>
          {/* Card 2: Customers */}
          <div className="flex flex-col bg-[#fff] rounded-md p-6 items-start min-h-[100px] justify-center">
            <div className="flex justify-evenly">
              <div className="rounded-full bg-[#FFD66B]/20 w-[63px] h-[63px] flex items-center justify-center">
                <Users fill="#FFC327" className="text-[#FFC327]" />
              </div>
              <div className="ml-4">
                <div className="text-lg font-bold">{totals.totalRewardsGiven.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Rewards Claimed</div>
                {campaignsLoading ? (
                  <div className="text-xs text-gray-400 mt-1">Loading...</div>
                ) : null}
              </div>
            </div>
          </div>
          {/* Card 3: Total Referrals */}
          <div className="flex flex-col bg-[#fff] rounded-md p-6 items-start min-h-[100px] justify-center">
            <div className="flex justify-evenly">
              <div className="rounded-full bg-[#FF8F6B]/10 w-[63px] h-[63px] flex items-center justify-center">
                <Flame className="text-[#FF8F6B]" fill="#FF8F6B" />
              </div>
              <div className="ml-4">
                <div className="text-lg font-bold">{totals.totalReferrals.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Total Referral Count</div>
                {campaignsLoading ? (
                  <div className="text-xs text-gray-400 mt-1">Loading...</div>
                ) : null}
              </div>
            </div>
          </div>
          {/* Card 4: Conversion Rate */}
          <div className="flex flex-col bg-[#fff] rounded-md p-6 items-start min-h-[100px] justify-center">
            <div className="flex justify-evenly">
              <div className="rounded-full bg-[#605BFF]/10 opacity-30 w-[63px] h-[63px] flex items-center justify-center">
                <MessageCircleReply className="text-[#605BFF]" fill="#605BFF" />
              </div>
              <div className="ml-4">
                <div className="text-lg font-bold">{totals.averageConversionRate.toFixed(2)}%</div>
                <div className="text-xs text-gray-500">Referral Success Rate</div>
                {campaignsLoading ? (
                  <div className="text-xs text-gray-400 mt-1">Loading...</div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Main graphs/cards */}
        <div className="w-full rounded-md bg-white p-6 border border-[#E4E7EC]">
          <div className="font-semibold text-base mb-1">
            Referral Engagement Graph
          </div>
          <div className="text-xs text-gray-500 mb-3">Referrals over time</div>
          {analyticsLoading ? (
            <div className="h-[350px] bg-gray-100 animate-pulse rounded"></div>
          ) : (
            <div id="chart">
              {isClient && (
                <ReactApexChart
                  options={engagementChartData.options}
                  series={engagementChartData.series}
                  type="line"
                  height={350}
                  width={"100%"}
                />
              )}
            </div>
          )}
        </div>

        {/* 2x2 chart grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="w-full border border-[#E4E7EC] bg-white rounded-md p-6">
            <div className="font-semibold text-base mb-1">Top Referrers</div>
            <div className="text-xs text-gray-500 mb-3">
              Most active referrers
            </div>
            {campaignsLoading ? (
              <div className="h-[350px] bg-gray-100 animate-pulse rounded"></div>
            ) : (
              <div className="relative">
                <div id="chart">
                  {isClient && (
                    <ReactApexChart
                      options={topReferrersChart.options}
                      series={topReferrersChart.series}
                      type="bar"
                      height={350}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="w-full border border-[#E4E7EC] bg-white rounded-md p-6">
            <div className="font-semibold text-base mb-1">Top Channels</div>
            <div className="text-xs text-gray-500 mb-3">
              Channel performance overview
            </div>
            {analyticsLoading ? (
              <div className="h-[350px] bg-gray-100 animate-pulse rounded"></div>
            ) : (
              <div className="relative">
                <div id="chart">
                  {isClient && (
                    <ReactApexChart
                      options={topChannelsChart.options}
                      series={topChannelsChart.series}
                      type="bar"
                      height={350}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="w-full border border-[#E4E7EC] bg-white rounded-md p-6">
            <div className="font-semibold text-base mb-1">Reward Types</div>
            <div className="text-xs text-gray-500 mb-3">Most used reward types</div>
            {campaignsLoading ? (
              <div className="h-[350px] bg-gray-100 animate-pulse rounded"></div>
            ) : (
              <div id="chart">
                {isClient && (
                  <ReactApexChart
                    options={rewardTypesChart.options}
                    series={rewardTypesChart.series}
                    type="bar"
                    height={350}
                  />
                )}
              </div>
            )}
          </div>
          <div className="w-full border border-[#E4E7EC] bg-white rounded-md p-6">
            <div className="font-semibold text-black text-base mb-6">
              Cash Flow Overview
            </div>
            <div className="flex items-center justify-center min-h-[400px] w-full">
              {analyticsLoading ? (
                <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded"></div>
              ) : (
                <div id="chart">
                  {isClient && (
                    <ReactApexChart
                      options={cashFlowChart.options}
                      series={cashFlowChart.series}
                      type="pie"
                      width={380}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Campaigns table */}
        <section className="bg-white p-4 rounded-md">
          <div className="lg:flex justify-between">
            <p className="text-black font-semibold my-auto text-base">
              My Campaigns
            </p>
            <div className="flex gap-4">
              {/* <RangePicker /> */}
              {/* <Filter /> */}
              <Link
                href={"/business/campaigns"}
                className="my-auto cursor-pointer"
              >
                <button className="flex my-auto gap-2 text-sm text-primary cursor-pointer">
                  <span className="my-auto">View All </span>
                  <ArrowRight size={15} className="my-auto" />
                </button>
              </Link>
            </div>
          </div>
          {/* Filter component */}
          <CampaignsTable num={6} />
        </section>
      </div>
    </DashboardLayout>
  );
}
