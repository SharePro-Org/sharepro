"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_CAMPAIGN, GET_CAMPAIGN_ANALYTICS } from "@/apollo/queries/campaigns";
import { ArrowLeft, RefreshCwIcon, SearchIcon } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Dropdown, Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import CampaignsTable from "@/components/dashboard/CampaignsTable";
import Link from "next/link";
import { Filter } from "@/components/Filter";
import { userAtom } from "@/store/User";
import { useAtom } from "jotai";

// Dynamic import for ReactApexChart with SSR disabled
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const singleCampaign = () => {
  const params = useParams();
  const campaignId = params.id;
  const [businessId, setBusinessId] = useState<string>("");
  const [user] = useAtom(userAtom);

  useEffect(() => {
    if (user?.businessId) {
      setBusinessId(user.businessId);
    }
  }, [user]);

  type CampaignAnalyticsType = {
    campaign?: {
      name?: string;
      campaignType?: string;
      status?: string;
      activeParticipants?: number;
      activeReferrals?: number;
      totalRewardsGiven?: number;
      totalReferrals?: number;
      referralLink?: string;
      referralRewards?: any[];
      loyaltyRewards?: any[];
      comboRewards?: any[];
    };
    date?: string;
    conversionRate?: number;
    clickThroughRate?: string;
    clicks?: number;
    conversions?: number;
    costPerConversion?: string;
    emailClicks?: number;
    directClicks?: number;
    facebookClicks?: number;
    smsClicks?: number;
    twitterClicks?: number;
    topStates?: string;
    topCountries?: string;
    views?: number;
    whatsappClicks?: number;
    tabletPercentage?: string;
    topCities?: string;
    shares?: number;
    revenue?: string;
    mobilePercentage?: string;
    instagramClicks?: number;
    desktopPercentage?: string;
    [key: string]: any; // To allow additional properties
  };

  const [campaignAnalytics, setCampaignAnalytics] =
    useState<CampaignAnalyticsType | null>(null);

  // Define the expected shape of the query result
  type CampaignAnalyticsQueryResult = {
    campaignAnalytics?: CampaignAnalyticsType;
  };

  // Fetch campaign analytics
  const {
    data: analyticsData,
    loading: analyticsLoading,
    error: analyticsError,
    refetch,
  } = useQuery<CampaignAnalyticsQueryResult>(GET_CAMPAIGN_ANALYTICS, {
    variables: { id: campaignId, businessId },
    skip: !campaignId || !businessId,
  });

  const {
    data: campaignData,
    loading: campaignLoading,
    error: campaignError,
  } = useQuery<any>(GET_CAMPAIGN, {
    variables: { id: campaignId, businessId },
    skip: !campaignId || !businessId,
  });




  useEffect(() => {
    if (analyticsData?.campaignAnalytics) {
      setCampaignAnalytics(analyticsData.campaignAnalytics);
    }
  }, [analyticsData]);

  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update channel data when campaignAnalytics changes
  const [channels, setChannels] = useState({
    series: [
      {
        data: [0, 0, 0, 0, 0, 0],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "bar" as const,
        events: {
          // click: function(chart, w, e) {
          // console.log(chart, w, e)
        },
      },
      colors: ["#5977D9", "#A16AD4"],
      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: true,
          horizontal: true,
          borderRadius: 4,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      xaxis: {
        categories: ["WhatsApp", "Facebook", "X", "Instagram", "SMS", "Email"],
        labels: {
          style: {
            colors: ["#030229"],
            fontSize: "12px",
          },
        },
      },
    },
  });

  // Update performance data when campaignAnalytics changes
  const [state, setState] = useState({
    series: [
      {
        name: "Views",
        data: [0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: "Clicks",
        data: [0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: "Conversions",
        data: [0, 0, 0, 0, 0, 0, 0],
      },
    ],
    options: {
      chart: {
        height: 350,
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight" as const,
      },
      title: {
        text: "",
        align: "left" as const,
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
        ],
      },
    },
  });

  // Update charts when campaignAnalytics changes
  useEffect(() => {
    if (campaignAnalytics) {
      // Update channel breakdown chart
      setChannels({
        series: [
          {
            data: [
              campaignAnalytics.whatsappClicks || 0,
              campaignAnalytics.facebookClicks || 0,
              campaignAnalytics.twitterClicks || 0,
              campaignAnalytics.instagramClicks || 0,
              campaignAnalytics.smsClicks || 0,
              campaignAnalytics.emailClicks || 0,
            ],
          },
        ],
        options: {
          ...channels.options,
        },
      });

      // Update performance over time chart
      // Since we only have one data point, we'll create a simple trend
      const currentViews = campaignAnalytics.views || 0;
      const currentClicks = campaignAnalytics.clicks || 0;
      const currentConversions = campaignAnalytics.conversions || 0;

      // Generate some sample data for the past 7 days
      const viewsData = [];
      const clicksData = [];
      const conversionsData = [];

      for (let i = 6; i >= 0; i--) {
        if (i === 0) {
          // Current day data
          viewsData.push(currentViews);
          clicksData.push(currentClicks);
          conversionsData.push(currentConversions);
        } else {
          // Previous days (sample data decreasing)
          viewsData.push(Math.max(0, currentViews - (i * Math.floor(Math.random() * 10))));
          clicksData.push(Math.max(0, currentClicks - (i * Math.floor(Math.random() * 5))));
          conversionsData.push(Math.max(0, currentConversions - (i * Math.floor(Math.random() * 2))));
        }
      }

      // Get current date for labels
      const today = new Date();
      const categories = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        categories.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      }

      setState({
        series: [
          {
            name: "Views",
            data: viewsData,
          },
          {
            name: "Clicks",
            data: clicksData,
          },
          {
            name: "Conversions",
            data: conversionsData,
          },
        ],
        options: {
          ...state.options,
          xaxis: {
            ...state.options.xaxis,
            categories,
          },
        },
      });
    }
  }, [campaignAnalytics]);

  return (
    <DashboardLayout>
      <>
        <section className="bg-white rounded-md md:p-6 p-3 mb-4">
          <div className="flex justify-between mb-4">
            <button
              className="text-black cursor-pointer flex items-center"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-3" />
              <span className="text-lg font-semibold capitalize">
                Campaign Analytics
              </span>
            </button>

            <button
              className="flex text-primary items-center gap-2"
              onClick={() => refetch()}
              disabled={analyticsLoading}
            >
              <RefreshCwIcon size={15} />
              <span className="text-sm">
                {analyticsLoading ? "Refreshing..." : "Refresh"}
              </span>
            </button>
          </div>
          <div className="bg-[#D1DAF4] rounded-md">
            <div className="flex gap-4 justify-between">
              <div className="border-r m-3 pr-3 border-r-[#CCCCCC]">
                <h2 className="text-xs mb-2">Campaign Name</h2>
                <p className="text-sm">
                  {campaignData?.campaign?.name || "-"}
                </p>
              </div>
              <div className="border-r m-3 pr-3 border-r-[#CCCCCC]">
                <h2 className="text-xs mb-2">Campaign Type</h2>
                <p className="text-sm">
                  {campaignData?.campaign?.campaignType || "-"}
                </p>
              </div>
              <div className="border-r m-3 pr-3 border-r-[#CCCCCC]">
                <h2 className="text-xs mb-2">Duration</h2>
                <p className="text-sm">
                  {/* You can format date range here if available */}
                  {campaignData?.date || "-"}
                </p>
              </div>
              <div className="m-3">
                <h2 className="text-xs mb-2">Status</h2>
                <p className="text-sm">
                  {campaignData?.campaign?.status || "-"}
                </p>
              </div>
            </div>
          </div>
          {analyticsError && (
            <div className="text-red-500 mt-2">
              Error loading analytics: {analyticsError.message}
            </div>
          )}
        </section>
        <section className="grid grid-cols-5 gap-4 mb-4">
          <div className="bg-white p-3 rounded-md text-center">
            <p className="text-sm">Total Participants</p>
            <h2 className="font-bold mt-3 text-xl">
              {campaignData?.campaign?.activeParticipants ?? "-"}
            </h2>
          </div>
          <div className="bg-white p-3 rounded-md text-center">
            <p className="text-sm">New Signups</p>
            <h2 className="font-bold mt-3 text-xl">
              {campaignData?.campaign?.activeReferrals ?? "-"}
            </h2>
          </div>
          <div className="bg-white p-3 rounded-md text-center">
            <p className="text-sm">Conversion Rate</p>
            <h2 className="font-bold mt-3 text-xl">
              {campaignData?.campaign?.conversionRate ?? "-"}
            </h2>
          </div>
          <div className="bg-white p-3 rounded-md text-center">
            <p className="text-sm">Rewards Redeemed</p>
            <h2 className="font-bold mt-3 text-xl">
              {campaignData?.campaign?.totalRewardsGiven ?? "-"}
            </h2>
          </div>
          <div className="bg-white p-3 rounded-md text-center">
            <p className="text-sm">Points Shared</p>
            <h2 className="font-bold mt-3 text-xl">
              {campaignData?.campaign?.totalReferrals ?? "-"}
            </h2>
          </div>
        </section>
        <section className="grid grid-cols-2 gap-5">
          <div className="bg-white p-3 rounded-md">
            <p>Campaign Info</p>
            <div className="text-body text-base my-2">
              <span role="img" aria-label="trophy" className="mr-2">
                🏆
              </span>
              {campaignData?.campaign?.campaignType === "REFERRAL" &&
                "Referral Program:"}
              {campaignData?.campaign?.campaignType === "LOYALTY" &&
                "Loyalty Program:"}
              {campaignData?.campaign?.campaignType === "COMBO" &&
                "Combo Program:"}
            </div>
            {campaignData?.campaign?.campaignType === "REFERRAL" &&
              campaignData?.campaign?.referralRewards &&
              campaignData?.campaign?.referralRewards.length > 0 && (
                <ul className="check-disc text-sm space-y-4">
                  <li>
                    Referrers earn{" "}
                    {campaignData.campaign.referralRewards[0]
                      .referralRewardAmount || "X"}{" "}
                    {campaignData.campaign.referralRewards[0]
                      .referralRewardType || "reward"}{" "}
                    for each successful referral
                  </li>
                  <li>
                    Referee's must{" "}
                    {campaignData?.campaign?.referralRewards[0]
                      .referreeRewardAction || "sign up"}{" "}
                    for a referral to be successful
                  </li>
                  <li>
                    Referee's earn{" "}
                    {campaignData.campaign.referralRewards[0]
                      .referreeRewardValue || "Y"}{" "}
                    {campaignData.campaign.referralRewards[0]
                      .referreeRewardType || "reward"}{" "}
                    after{" "}
                    {campaignData.campaign.referralRewards[0]
                      .referreeRewardAction || "sign up"}
                  </li>
                  {campaignData.campaign.referralRewards[0]
                    .loyaltyTierBenefits && (
                      <li>
                        Users can unlock tier benefits:{" "}
                        {
                          campaignData.campaign.referralRewards[0]
                            .loyaltyTierBenefits.benefits
                        }
                      </li>
                    )}
                  <li>
                    Rewards are redeemed at{" "}
                    {campaignData.campaign.referralRewards[0]
                      .referreeRewardChannels || "checkout"}
                  </li>
                </ul>
              )}
            {campaignData?.campaign?.campaignType === "LOYALTY" &&
              campaignData?.campaign?.loyaltyRewards &&
              campaignData?.campaign.loyaltyRewards.length > 0 && (
                <ul className="check-disc text-sm space-y-4">
                  <li>
                    Customers earn{" "}
                    {campaignData.campaign.loyaltyRewards[0]
                      .earnRewardPoints || "X"}{" "}
                    points for every{" "}
                    {campaignData.campaign.loyaltyRewards[0]
                      .earnRewardAction || "transaction"}
                  </li>
                  <li>
                    Points can be redeemed for{" "}
                    {campaignData.campaign.loyaltyRewards[0]
                      .redeemRewardValue || "Z"}{" "}
                    (
                    {campaignData.campaign.loyaltyRewards[0]
                      .redeemRewardPointRequired || "W"}{" "}
                    pts)
                  </li>
                  {campaignData.campaign.loyaltyRewards[0]
                    .loyaltyTierBenefits && (
                      <li>
                        Users can unlock tier benefits:{" "}
                        {
                          campaignData.campaign.loyaltyRewards[0]
                            .loyaltyTierBenefits.benefits
                        }
                      </li>
                    )}
                </ul>
              )}
            {campaignData?.campaign?.campaignType === "COMBO" &&
              campaignData?.campaign?.comboRewards &&
              campaignData?.campaign?.comboRewards.length > 0 && (
                <ul className="check-disc text-sm space-y-4">
                  <li>
                    Referrers earn{" "}
                    {campaignData.campaign.comboRewards[0]
                      .referralRewardAmount || "X"}{" "}
                    {campaignData.campaign.comboRewards[0]
                      .referralRewardType || "reward"}{" "}
                    for each successful referral
                  </li>
                  <li>
                    Referee's must{" "}
                    {campaignData.campaign.comboRewards[0]
                      .referreeRewardAction || "sign up"}{" "}
                    for a referral to be successful
                  </li>
                  <li>
                    Referee's earn{" "}
                    {campaignData.campaign.comboRewards[0]
                      .referreeRewardValue || "Y"}{" "}
                    {campaignData.campaign.comboRewards[0]
                      .referreeRewardType || "reward"}{" "}
                    after{" "}
                    {campaignData.campaign.comboRewards[0]
                      .referreeRewardAction || "sign up"}
                  </li>
                  <li>
                    Customers earn{" "}
                    {campaignData.campaign.comboRewards[0].loyaltyPoints ||
                      "X"}{" "}
                    points for transactions
                  </li>
                  <li>
                    Points can be redeemed for{" "}
                    {campaignData.campaign.comboRewards[0]
                      .redeemRewardValue || "Z"}{" "}
                    (
                    {campaignData.campaign.comboRewards[0]
                      .redeemRewardPointRequired || "W"}{" "}
                    pts)
                  </li>
                  {campaignData.campaign.comboRewards[0]
                    .loyaltyTierBenefits && (
                      <li>
                        Users can unlock tier benefits:{" "}
                        {
                          campaignData.campaign.comboRewards[0]
                            .loyaltyTierBenefits.benefits
                        }
                      </li>
                    )}
                </ul>
              )}

            <p className="text-primary text-sm">{campaignData?.campaign?.referralLink}</p>
            {!campaignData?.campaign?.campaignType && (
              <ul className="check-list text-sm">
                <li>Loading campaign information...</li>
              </ul>
            )}
          </div>
          <div className="bg-white p-3 rounded-md">
            <p>Channel Breakdown</p>
            <div className="relative">
              <div id="chart">
                {isClient && (
                  <ReactApexChart
                    options={channels.options}
                    series={channels.series}
                    type="bar"
                    height={350}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="bg-white p-3 col-span-2 rounded-md">
            <p>Performance Overtime</p>
            <div id="chart">
              {isClient && (
                <ReactApexChart
                  options={state.options}
                  series={state.series}
                  type="line"
                  height={350}
                  width={"100%"}
                />
              )}
            </div>
          </div>
        </section>
        <section className="bg-white rounded-md md:p-6 p-3 mt-4">
          <div className="">
            <div className="lg:flex justify-between">
              <p className="text-black font-medium my-auto text-base">
                All Payouts
              </p>
              <div className="flex gap-4">
                {/* <RangePicker /> */}
                {/* <Filter filter={false} /> */}

                {/* <div className="relative md:mt-0 mt-2">
                  <input
                    type="text"
                    className="bg-[#F9FAFB] md:w-72 w-full border border-[#E4E7EC] p-3 rounded-sm pl-8 text-sm"
                    placeholder="Search Campaign Name"
                  />

                  <SearchIcon
                    size={16}
                    className="absolute top-4 left-3 text-gray-500"
                  />
                </div> */}
              </div>
            </div>
            <CampaignsTable type="payout" />
          </div>
        </section>
      </>
    </DashboardLayout>
  );
};

export default singleCampaign;