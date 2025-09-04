"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "@apollo/client";
import { GET_BUSINESS_ANALYTICS } from "@/apollo/queries/analytics";
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
  const [state, setState] = useState({
    series: [
      {
        name: "series1",
        data: [31, 40, 28, 51, 42, 109, 100],
      },
      {
        name: "series2",
        data: [11, 32, 45, 32, 34, 52, 41],
      },
    ],
    options: {
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
        categories: [
          "2024-01-01T00:00:00.000Z",
          "2024-02-01T00:00:00.000Z",
          "2024-03-01T00:00:00.000Z",
          "2024-04-01T00:00:00.000Z",
          "2024-05-01T00:00:00.000Z",
          "2024-06-01T00:00:00.000Z",
          "2024-07-01T00:00:00.000Z",
        ],
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
    },
  });

  const [channel, setChannel] = React.useState({
    series: [
      {
        name: "Shares",
        data: [44, 55, 57, 56, 61],
      },
      {
        name: "Clicks",
        data: [76, 85, 101, 98, 87],
      },
      {
        name: "Conversions",
        data: [35, 41, 36, 26, 45],
      },
    ],
    options: {
      chart: {
        type: "bar" as const,
        height: 350,
      },
      colors: ["#5977D9", "#539EF0", "#A16AD4"],
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

  // TODO: Replace with actual businessId from context/store
  const { data, loading, error } = useQuery(GET_BUSINESS_ANALYTICS, {
    variables: { businessId },
    skip: !businessId,
  });

  // Default fallback values
  const analyticsData = data?.businessAnalyticsByBusiness || {};

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
              <div className="flex justify-between w-full mt-2">
                <div className="text-xs text-gray-500">
                  Referral links viewed.
                </div>
                {/* Example: growth rate, replace with actual data if available */}
                <div className={`text-xs text-green-600 mt-1 font-bold`}>
                  10% ↑
                </div>
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
              <div className="flex justify-between w-full mt-2">
                <div className="text-xs text-gray-500">
                  Clicks on referral links.
                </div>
                <div className="text-xs text-green-600 mt-1 font-bold">
                  10% ↑
                </div>
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
              <div className="flex justify-between w-full mt-2">
                <div className="text-xs text-gray-500">
                  Referral purchases made
                </div>
                <div className="text-xs text-green-600 mt-1 font-bold">
                  5% ↑
                </div>
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
              <div className="flex justify-between w-full mt-2">
                <div className="text-xs text-gray-500">Revenue generated</div>
                <div className="text-xs text-green-600 mt-1 font-bold">
                  5% ↑
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex p-4 text-sm gap-6 text-[#030229B2]">
          {/* <button
            onClick={() => setActive("general")}
            className={`p-3 ${
              active === "general" &&
              "!text-secondary border-b border-b-secondary"
            }`}
          >
            General
          </button> */}
          <button
            onClick={() => setActive("referral")}
            className={`p-3 ${
              active === "referral" &&
              "!text-secondary border-b border-b-secondary"
            }`}
          >
            Referral
          </button>
          <button
            onClick={() => setActive("loyalty")}
            className={`p-3 ${
              active === "loyalty" &&
              "!text-secondary border-b border-b-secondary"
            }`}
          >
            Loyalty
          </button>
          <button
            onClick={() => setActive("combo")}
            className={`p-3 ${
              active === "combo" &&
              "!text-secondary border-b border-b-secondary"
            }`}
          >
            Combo
          </button>
        </div>

        <section>
          {active === "general" && (
            <>
              <section className="bg-white p-4 rounded-md mb-4 border border-[#E2E8F0]">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">Top Referrers</p>
                    <p className="text-sm text-[#030229B2]">
                      Identify your most impactful advocates.
                    </p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full mt-4 text-sm">
                    <thead>
                      <tr className="bg-[#D1DAF4] text-black">
                        <th className="px-4 py-3 font-medium text-left">
                          Rank
                        </th>
                        <th className="px-4 py-3 font-medium text-left">
                          Referrer
                        </th>
                        <th className="px-4 py-3 font-medium text-left">
                          Referrals
                        </th>
                        <th className="px-4 py-3 font-medium text-left">
                          Conversions
                        </th>
                        <th className="px-4 py-3 font-medium text-left">
                          Rewards
                        </th>
                        <th className="px-4 py-3 font-medium text-left">
                          Badge
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-4 black font-normal py-3">1</td>
                        <td className="px-4 black font-normal py-3">
                          John Doe
                        </td>
                        <td className="px-4 black font-normal py-3">10</td>
                        <td className="px-4 black font-normal py-3">18</td>
                        <td className="px-4 black font-normal py-3">#1000</td>
                        <td className="px-4 black font-normal py-3">Gold</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
              <section className="bg-white p-4 rounded-md mb-4 border border-[#E2E8F0]">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">Channel Performance</p>
                    <p className="text-sm text-[#030229B2]">
                      See which channels are driving the most results
                    </p>
                  </div>
                </div>
                {isClient && (
                  <div id="chart">
                    <ReactApexChart
                      options={channel.options}
                      series={channel.series}
                      type="bar"
                      height={350}
                    />
                  </div>
                )}
              </section>
            </>
          )}
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
                <div className="grid grid-cols-4 gap-4 my-4">
                  <div className="bg-[#ECF3FF] p-4 rounded-md">
                    <p className="text-sm">Total Referrals Sent</p>
                    <p className="text-lg">1,000</p>
                  </div>
                  <div className="bg-[#ECF3FF] p-4 rounded-md">
                    <p className="text-sm">Referral Conversion</p>
                    <p className="text-lg">1,000</p>
                  </div>
                  <div className="bg-[#ECF3FF] p-4 rounded-md">
                    <p className="text-sm">Conversion Rate</p>
                    <p className="text-lg">1,000</p>
                  </div>
                  <div className="bg-[#ECF3FF] p-4 rounded-md">
                    <p className="text-sm">Referral Reward Redemptions</p>
                    <p className="text-lg">1,000</p>
                  </div>
                </div>
                <div className="border border-[#E2E8F0] rounded-md p-4 ">
                  <p className="text-sm">Engagement Over Time</p>
                  <div id="chart">
                    {isClient && (
                      <ReactApexChart
                        options={state.options}
                        series={state.series}
                        type="area"
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
                <div className="grid grid-cols-3 gap-4 my-4">
                  <div className="bg-[#ECF3FF] p-4 rounded-md">
                    <p className="text-sm">Total Rewards Redeemed</p>
                    <p className="text-lg">1,000</p>
                  </div>
                  <div className="bg-[#ECF3FF] p-4 rounded-md">
                    <p className="text-sm">Active Members</p>
                    <p className="text-lg">1,000</p>
                  </div>
                  <div className="bg-[#ECF3FF] p-4 rounded-md">
                    <p className="text-sm">Points Earned</p>
                    <p className="text-lg">1,000</p>
                  </div>
                </div>
                <div className="border border-[#E2E8F0] rounded-md p-4 ">
                  <p className="text-sm">Loyalty Engagement Over Time</p>
                  <div id="chart">
                    {isClient && (
                      <ReactApexChart
                        options={state.options}
                        series={state.series}
                        type="area"
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
                <div className="grid grid-cols-6 gap-4 my-4">
                  <div className="bg-[#ECF3FF] p-4 rounded-md">
                    <p className="text-sm">Total Participants</p>
                    <p className="text-lg">1,000</p>
                  </div>
                  <div className="bg-[#ECF3FF] p-4 rounded-md">
                    <p className="text-sm">Dual Conversions</p>
                    <p className="text-lg">1,000</p>
                  </div>
                  <div className="bg-[#ECF3FF] p-4 rounded-md">
                    <p className="text-sm">Combo Reward Redemptions</p>
                    <p className="text-lg">1,000</p>
                  </div>
                  <div className="bg-[#ECF3FF] p-4 rounded-md">
                    <p className="text-sm">Points Earned</p>
                    <p className="text-lg">1,000</p>
                  </div>
                  <div className="bg-[#ECF3FF] p-4 rounded-md">
                    <p className="text-sm">Referrals Sent</p>
                    <p className="text-lg">1,000</p>
                  </div>
                  <div className="bg-[#ECF3FF] p-4 rounded-md">
                    <p className="text-sm">Overall Conversion Rate</p>
                    <p className="text-lg">1,000</p>
                  </div>
                </div>
                <div className="border border-[#E2E8F0] rounded-md p-4 ">
                  <p className="text-sm">Engagement Over Time</p>
                  <div id="chart">
                    {isClient && (
                      <ReactApexChart
                        options={state.options}
                        series={state.series}
                        type="area"
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
