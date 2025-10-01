"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "@apollo/client/react";
import { GET_BUSINESS_ANALYTICS, GET_CAMPAIGN_ANALYTICS_SUMMARY } from "@/apollo/queries/analytics";
import { useAtom } from "jotai";
import { userAtom } from "@/store/User";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="h-[350px] bg-gray-100 animate-pulse rounded"></div>
  ),
});

const analytics = () => {
  const [active, setActive] = useState("referral");
  const [isClient, setIsClient] = useState(false);
  const [businessId, setBusinessId] = useState<string>("");
  const [user] = useAtom(userAtom);

  useEffect(() => {
    if (user?.businessId) {
      setBusinessId(user.businessId);
    }
  }, [user]);

  // Default chart options
  const defaultOptions = {
    chart: {
      height: 350,
      type: "area" as const,
    },
    colors: ["#5977D9", "#A16AD4"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth" as const,
    },
    xaxis: {
      type: "datetime" as const,
    },
    tooltip: {
      x: {
        format: "dd/MM/yy",
      },
    },
  };

  const [chartData, setChartData] = useState<any>({
    series: [
      {
        name: "series1",
        data: [0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: "series2",
        data: [0, 0, 0, 0, 0, 0, 0],
      },
    ],
    options: defaultOptions,
  });

  const [channelData, setChannelData] = useState({
    series: [
      {
        name: "Clicks",
        data: [0, 0, 0, 0, 0],
      },
      {
        name: "Conversions",
        data: [0, 0, 0, 0, 0],
      },
    ],
    options: {
      chart: {
        type: "bar" as const,
        height: 350,
      },
      colors: ["#5977D9", "#A16AD4"],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 5,
          borderRadiusApplication: "end" as const,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: ["WhatsApp", "SMS", "Instagram", "Facebook", "Twitter"],
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return val;
          },
        },
      },
    },
  });

  type BusinessAnalyticsQueryResult = {
    businessAnalyticsByBusiness?: {
      totalViews?: number;
      totalClicks?: number;
      totalConversions?: number;
      totalRevenue?: number;
    };
  };

  type CampaignAnalyticsSummaryResult = {
    campaignAnalyticsByCampaign?: Array<{
      clickThroughRate: string;
      clicks: number;
      conversionRate: string;
      conversions: number;
      costPerConversion: string;
      createdAt: string;
      deletedAt: string | null;
      desktopPercentage: string;
      directClicks: number;
      emailClicks: number;
      facebookClicks: number;
      id: string;
      instagramClicks: number;
      mobilePercentage: string;
      revenue: string;
      shares: number;
      smsClicks: number;
      tabletPercentage: string;
      topCities: string;
      topCountries: string;
      topStates: string;
      twitterClicks: number;
      updatedAt: string;
      whatsappClicks: number;
      __typename: string;
    }>;
  };

  const { data, loading, error } = useQuery<BusinessAnalyticsQueryResult>(GET_BUSINESS_ANALYTICS, {
    variables: { businessId },
    skip: !businessId,
  });

  const { data: analyticsSummaryData, loading: analyticsLoading } = useQuery<CampaignAnalyticsSummaryResult>(GET_CAMPAIGN_ANALYTICS_SUMMARY, {
    variables: { businessId, campaignType: active },
    skip: !businessId,
  });

  const analyticsData = data?.businessAnalyticsByBusiness || {};

  // Update chart data when analyticsSummaryData changes
  useEffect(() => {
    if (analyticsSummaryData?.campaignAnalyticsByCampaign && analyticsSummaryData.campaignAnalyticsByCampaign.length > 0) {
      const campaignData = analyticsSummaryData.campaignAnalyticsByCampaign;

      // Sort by date to ensure chronological order
      const sortedData = [...campaignData].sort((a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      // Format dates for x-axis
      const categories = sortedData.map(item => {
        const date = new Date(item.createdAt);
        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      });

      // Prepare series data based on active tab
      let seriesData: { name: string; data: number[]; }[] = [];

      if (active === "referral") {
        seriesData = [
          {
            name: "Clicks",
            data: sortedData.map(item => item.clicks || 0),
          },
          {
            name: "Conversions",
            data: sortedData.map(item => item.conversions || 0),
          },
        ];
      } else if (active === "loyalty") {
        seriesData = [
          {
            name: "Shares",
            data: sortedData.map(item => item.shares || 0),
          },
          {
            name: "Conversions",
            data: sortedData.map(item => item.conversions || 0),
          },
        ];
      } else if (active === "combo") {
        seriesData = [
          {
            name: "Clicks",
            data: sortedData.map(item => item.clicks || 0),
          },
          {
            name: "Revenue",
            data: sortedData.map(item => parseFloat(item.revenue) || 0),
          },
        ];
      }

      setChartData({
        series: seriesData,
        options: {
          ...defaultOptions,
          xaxis: {
            ...defaultOptions.xaxis,
            categories,
          },
        },
      });

      // Update channel data using the latest data point
      const latestData = sortedData[sortedData.length - 1];
      if (latestData) {
        setChannelData({
          series: [
            {
              name: "Clicks",
              data: [
                latestData.whatsappClicks || 0,
                latestData.smsClicks || 0,
                latestData.instagramClicks || 0,
                latestData.facebookClicks || 0,
                latestData.twitterClicks || 0,
              ],
            },
            {
              name: "Conversions",
              data: [
                latestData.whatsappClicks ? Math.round(latestData.whatsappClicks * parseFloat(latestData.conversionRate || "0") / 100) : 0,
                latestData.smsClicks ? Math.round(latestData.smsClicks * parseFloat(latestData.conversionRate || "0") / 100) : 0,
                latestData.instagramClicks ? Math.round(latestData.instagramClicks * parseFloat(latestData.conversionRate || "0") / 100) : 0,
                latestData.facebookClicks ? Math.round(latestData.facebookClicks * parseFloat(latestData.conversionRate || "0") / 100) : 0,
                latestData.twitterClicks ? Math.round(latestData.twitterClicks * parseFloat(latestData.conversionRate || "0") / 100) : 0,
              ],
            },
          ],
          options: {
            ...channelData.options,
            xaxis: {
              ...channelData.options.xaxis,
              categories: ["WhatsApp", "SMS", "Instagram", "Facebook", "Twitter"],
            },
          },
        });
      }
    }
  }, [analyticsSummaryData, active]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <DashboardLayout>
      <>
        <p className="text-lg font-semibold capitalize mb-3">Analytics</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Card 1: Total Views */}
          <div className="flex flex-col bg-[#fff] rounded-md p-4 items-start min-h-[100px] justify-center">
            <div className="flex w-full flex-col">
              <div className="flex justify-between">
                <p className="my-auto font-medium">Total Views</p>
                <div className="rounded-full ml-auto bg-[#A16AD4]/20 w-[30px] h-[30px] flex items-center justify-center">
                  <Users size={16} fill="#A16AD4" className="text-[#A16AD4]" />
                </div>
              </div>
              <div className="text-xl my-3 font-bold">
                {analyticsData.totalViews ?? "-"}
              </div>
            </div>
          </div>

          {/* Card 2: Total Clicks */}
          <div className="flex flex-col bg-[#fff] rounded-md p-4 items-start min-h-[100px] justify-center">
            <div className="flex w-full flex-col">
              <div className="flex justify-between">
                <p className="my-auto font-medium">Total Clicks</p>
                <div className="rounded-full ml-auto bg-[#233E97]/20 w-[30px] h-[30px] flex items-center justify-center">
                  <Users size={16} fill="#233E97" className="text-[#233E97]" />
                </div>
              </div>
              <div className="text-xl my-3 font-bold">
                {analyticsData.totalClicks ?? "-"}
              </div>
            </div>
          </div>

          {/* Card 3: Total Conversions */}
          <div className="flex flex-col bg-[#fff] rounded-md p-4 items-start min-h-[100px] justify-center">
            <div className="flex w-full flex-col">
              <div className="flex justify-between">
                <p className="my-auto font-medium">Total Conversions</p>
                <div className="rounded-full ml-auto bg-[#233E97]/20 w-[30px] h-[30px] flex items-center justify-center">
                  <Users size={16} fill="#233E97" className="text-[#233E97]" />
                </div>
              </div>
              <div className="text-xl my-3 font-bold">
                {analyticsData.totalConversions ?? "-"}
              </div>
            </div>
          </div>

          {/* Card 4: Total Revenue */}
          <div className="flex flex-col bg-[#fff] rounded-md p-4 items-start min-h-[100px] justify-center">
            <div className="flex w-full flex-col">
              <div className="flex justify-between">
                <p className="my-auto font-medium">Total Revenue</p>
                <div className="rounded-full ml-auto bg-[#233E97]/20 w-[30px] h-[30px] flex items-center justify-center">
                  <Users size={16} fill="#233E97" className="text-[#233E97]" />
                </div>
              </div>
              <div className="text-xl my-3 font-bold">
                {analyticsData.totalRevenue ?? "-"}
              </div>
            </div>
          </div>
        </div>

        <div className="flex p-4 text-sm gap-6 text-[#030229B2]">
          <button
            onClick={() => setActive("referral")}
            className={`p-3 ${active === "referral" &&
              "!text-secondary border-b border-b-secondary"
              }`}
          >
            Referral
          </button>
          <button
            onClick={() => setActive("loyalty")}
            className={`p-3 ${active === "loyalty" &&
              "!text-secondary border-b border-b-secondary"
              }`}
          >
            Loyalty
          </button>
          <button
            onClick={() => setActive("combo")}
            className={`p-3 ${active === "combo" &&
              "!text-secondary border-b border-b-secondary"
              }`}
          >
            Combo
          </button>
        </div>

        <section>
          {active === "referral" && (
            <>
              <section className="bg-white p-4 rounded-md border border-[#E2E8F0]">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">Referral Campaign Performance</p>
                    <p className="text-sm text-[#030229B2]">
                      Track how well your referral campaigns are performing,
                      from shares to conversions.
                    </p>
                  </div>
                </div>
                <div className="border border-[#E2E8F0] rounded-md p-4">
                  <p className="text-sm">Engagement Over Time</p>
                  <div id="chart">
                    {isClient && (
                      <ReactApexChart
                        options={chartData.options}
                        series={chartData.series}
                        type="area"
                        height={350}
                        width={"100%"}
                      />
                    )}
                  </div>
                </div>
                <div className="border border-[#E2E8F0] rounded-md p-4 mt-4">
                  <p className="text-sm">Channel Performance</p>
                  <div id="channel-chart">
                    {isClient && (
                      <ReactApexChart
                        options={channelData.options}
                        series={channelData.series}
                        type="bar"
                        height={350}
                        width={"100%"}
                      />
                    )}
                  </div>
                </div>
              </section>
            </>
          )}
          {active === "loyalty" && (
            <>
              <section className="bg-white p-4 rounded-md border border-[#E2E8F0]">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">Loyalty Campaign Performance</p>
                    <p className="text-sm text-[#030229B2]">
                      Measure how well your loyalty system is engaging
                      customers.
                    </p>
                  </div>
                </div>
                <div className="border border-[#E2E8F0] rounded-md p-4">
                  <p className="text-sm">Loyalty Engagement Over Time</p>
                  <div id="chart">
                    {isClient && (
                      <ReactApexChart
                        options={chartData.options}
                        series={chartData.series}
                        type="area"
                        height={350}
                        width={"100%"}
                      />
                    )}
                  </div>
                </div>
                <div className="border border-[#E2E8F0] rounded-md p-4 mt-4">
                  <p className="text-sm">Channel Performance</p>
                  <div id="channel-chart">
                    {isClient && (
                      <ReactApexChart
                        options={channelData.options}
                        series={channelData.series}
                        type="bar"
                        height={350}
                        width={"100%"}
                      />
                    )}
                  </div>
                </div>
              </section>
            </>
          )}
          {active === "combo" && (
            <>
              <section className="bg-white p-4 rounded-md border border-[#E2E8F0]">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">Combo Campaign Performance</p>
                    <p className="text-sm text-[#030229B2]">
                      Measure how well your combo system is engaging customers.
                    </p>
                  </div>
                </div>
                <div className="border border-[#E2E8F0] rounded-md p-4">
                  <p className="text-sm">Engagement Over Time</p>
                  <div id="chart">
                    {isClient && (
                      <ReactApexChart
                        options={chartData.options}
                        series={chartData.series}
                        type="area"
                        height={350}
                        width={"100%"}
                      />
                    )}
                  </div>
                </div>
                <div className="border border-[#E2E8F0] rounded-md p-4 mt-4">
                  <p className="text-sm">Channel Performance</p>
                  <div id="channel-chart">
                    {isClient && (
                      <ReactApexChart
                        options={channelData.options}
                        series={channelData.series}
                        type="bar"
                        height={350}
                        width={"100%"}
                      />
                    )}
                  </div>
                </div>
              </section>
            </>
          )}
        </section>
      </>
    </DashboardLayout>
  );
};

export default analytics;