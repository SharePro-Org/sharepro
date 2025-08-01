"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_CAMPAIGN_ANALYTICS_BY_CAMPAIGN } from "@/apollo/queries/campaigns";
import { ArrowLeft, ArrowRight, RefreshCwIcon } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Dropdown, Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import ReactApexChart from "react-apexcharts";
import CampaignsTable from "@/components/dashboard/CampaignsTable";
import Link from "next/link";
import { Filter } from "@/components/Filter";

const singleCampaign = () => {
  const params = useParams();
  const campaignId = params.id;
  type CampaignAnalyticsType = {
    campaign?: {
      name?: string;
      campaignType?: string;
      status?: string;
      activeParticipants?: number;
      activeReferrals?: number;
      totalRewardsGiven?: number;
      totalReferrals?: number;
    };
    date?: string;
    conversionRate?: number;
  };

  const [campaignAnalytics, setCampaignAnalytics] =
    useState<CampaignAnalyticsType | null>(null);

  // Fetch campaign analytics
  const {
    data: analyticsData,
    loading: analyticsLoading,
    error: analyticsError,
    refetch,
  } = useQuery(GET_CAMPAIGN_ANALYTICS_BY_CAMPAIGN, {
    variables: { campaignId },
    skip: !campaignId,
    onCompleted: (data) => {
      // console.log("Analytics Data:", data.campaignAnalyticsByCampaign[0]);
      setCampaignAnalytics(data.campaignAnalyticsByCampaign[0]);
      // console.log("Campaign Analytics:", campaignAnalytics);
    },
  });
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [channels, setChannels] = useState({
    series: [
      {
        data: [21, 22, 10, 28],
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
        categories: ["WhatsApp", "Facebook", "X", "Instagram"],
        labels: {
          style: {
            colors: ["#030229"],
            fontSize: "12px",
          },
        },
      },
    },
  });

  const [state, setState] = useState({
    series: [
      {
        name: "Desktops",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
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
          "Aug",
          "Sep",
        ],
      },
    },
  });

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
          <div className="bg-[#D1DAF4] rounded-md flex justify-between">
            <div className="flex gap-4 justify-between">
              <div className="border-r m-3 pr-3 border-r-[#CCCCCC]">
                <h2 className="text-xs mb-2">Campaign Name</h2>
                <p className="text-sm">
                  {campaignAnalytics?.campaign?.name || "-"}
                </p>
              </div>
              <div className="border-r m-3 pr-3 border-r-[#CCCCCC]">
                <h2 className="text-xs mb-2">Campaign Type</h2>
                <p className="text-sm">
                  {campaignAnalytics?.campaign?.campaignType || "-"}
                </p>
              </div>
              <div className="border-r m-3 pr-3 border-r-[#CCCCCC]">
                <h2 className="text-xs mb-2">Duration</h2>
                <p className="text-sm">
                  {/* You can format date range here if available */}
                  {campaignAnalytics?.date || "-"}
                </p>
              </div>
              <div className="m-3">
                <h2 className="text-xs mb-2">Status</h2>
                <p className="text-sm">
                  {campaignAnalytics?.campaign?.status || "-"}
                </p>
              </div>
            </div>
            <div className="w-44 flex justify-between">
              <button className="p-3 my-auto text-sm bg-primary text-white rounded-md">
                View Payouts
              </button>
              <Dropdown
                menu={{
                  items: [
                    { key: "pause", label: "Pause Campaign" },
                    { key: "edit", label: "Edit Campaign" },
                    { key: "end", label: "End Campaign" },
                    { key: "settings", label: "Campaign Settings" },
                    { key: "payouts", label: "Vew Payouts" },
                    { key: "download", label: "Download Report" },
                  ],
                }}
                trigger={["click"]}
              >
                <Button type="text" className="my-auto">
                  <MoreOutlined />
                </Button>
              </Dropdown>
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
              {campaignAnalytics?.campaign?.activeParticipants ?? "-"}
            </h2>
          </div>
          <div className="bg-white p-3 rounded-md text-center">
            <p className="text-sm">New Signups</p>
            <h2 className="font-bold mt-3 text-xl">
              {campaignAnalytics?.campaign?.activeReferrals ?? "-"}
            </h2>
          </div>
          <div className="bg-white p-3 rounded-md text-center">
            <p className="text-sm">Conversion Rate</p>
            <h2 className="font-bold mt-3 text-xl">
              {campaignAnalytics?.conversionRate ?? "-"}
            </h2>
          </div>
          <div className="bg-white p-3 rounded-md text-center">
            <p className="text-sm">Rewards Redeemed</p>
            <h2 className="font-bold mt-3 text-xl">
              {campaignAnalytics?.campaign?.totalRewardsGiven ?? "-"}
            </h2>
          </div>
          <div className="bg-white p-3 rounded-md text-center">
            <p className="text-sm">Points Shared</p>
            <h2 className="font-bold mt-3 text-xl">
              {campaignAnalytics?.campaign
                ?.totalReferrals ?? "-"}
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
              Loyalty Program:
            </div>
            <ul className="check-list text-sm">
              <li>Customers earn points for every transaction spent</li>
            </ul>
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
          <div className="bg-white p-3 rounded-md">
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
          <div className="bg-white p-3 rounded-md">
            <p>Top Participants</p>
            <div className="overflow-x-auto">
              <table className="w-full mt-4 text-sm">
                <thead>
                  <tr className="bg-[#D1DAF4] text-black">
                    <th className="px-4 py-3 font-medium text-left">User</th>
                    <th className="px-4 py-3 font-medium text-left">Type</th>
                    <th className="px-4 py-3 font-medium text-left">Points</th>
                    <th className="px-4 py-3 font-medium text-left">Date</th>
                    <th className="px-4 py-3 font-medium text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                    <tr
                      key={item}
                      className="border-b border-[#E2E8F0] py-6 last:border-0"
                    >
                      <td className="py-3 px-4">John Doe</td>
                      <td className="py-3 px-4">Loyalty</td>
                      <td className="py-3 px-4">10</td>
                      <td className="py-3 px-4">2023-10-01</td>
                      <td className="text-green-500 py-3 px-4">Active</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        <section className="bg-white p-3 rounded-md mt-4">
          <div className="lg:flex justify-between">
            <p className="text-black font-medium my-auto text-base">
              Recent Payouts
            </p>
            <div className="flex gap-4">
              {/* <RangePicker /> */}
              <Filter />
              <Link
                href={`/business/campaigns/${campaignId}/payouts`}
                className="my-auto cursor-pointer"
              >
                <button className="flex my-auto gap-2 text-sm text-primary cursor-pointer">
                  <span className="my-auto">View All </span>
                  <ArrowRight size={15} className="my-auto" />
                </button>
              </Link>
            </div>
          </div>
          <CampaignsTable type="payout" num={4} />
        </section>
      </>
    </DashboardLayout>
  );
};

export default singleCampaign;
