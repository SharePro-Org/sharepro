"use client";

import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Flame, HeartIcon, MessageCircleReply, Users } from "lucide-react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="h-[350px] bg-gray-100 animate-pulse rounded"></div>
  ),
});

export default function Dashboard() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  const [data, setData] = useState({
    series: [
      {
        data: [21, 22, 10, 28, 16, 21],
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
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      xaxis: {
        categories: [
          ["John", "Doe"],
          ["Joe", "Smith"],
          ["Jake", "Williams"],
          "Amber",
          ["Peter", "Brown"],
          ["Mary", "Evans"],
        ],
        labels: {
          style: {
            colors: ["#030229"],
            fontSize: "12px",
          },
        },
      },
    },
  });

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

  const [rewards, setRewards] = useState({
    series: [
      {
        data: [400, 430, 448, 470, 540],
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
          borderRadius: 4,
          borderRadiusApplication: "end" as const,
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: ["Airtime", "Cash", "Voucher", "Discounts", "Freebies"],
      },
    },
  });

  const [cash, setCash] = useState({
    series: [30, 70],
    options: {
      chart: {
        width: 380,
        type: "pie" as const,
      },
      colors: ["#5977D9", "#A16AD4"],
      labels: ["Team A", "Team B"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom" as const,
            },
          },
        },
      ],
    },
  });
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
                <div className="text-lg font-bold">4</div>
                <div className="text-xs text-gray-500">Ongoing Campaigns</div>
                <div className="text-xs text-green-600 mt-1 font-bold">
                  12% ↑
                </div>
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
                <div className="text-lg font-bold">12.5K</div>
                <div className="text-xs text-gray-500">Customers</div>
                <div className="text-xs text-red-600 mt-1 font-bold">12% ↑</div>
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
                <div className="text-lg font-bold">30K</div>
                <div className="text-xs text-gray-500">Total Referrals</div>
                <div className="text-xs text-green-600 mt-1 font-bold">
                  12% ↑
                </div>
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
                <div className="text-lg font-bold">32.03%</div>
                <div className="text-xs text-gray-500">Conversion Rate</div>
                <div className="text-xs text-red-600 mt-1 font-bold">12% ↑</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main graphs/cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-1 gap-8"> */}
        <div className="w-screen rounded-md bg-white p-6 max-w-full relative border border-[#E4E7EC]">
          <div className="font-semibold text-base mb-1">
            Referral Engagement Graph
          </div>
          <div className="text-xs text-gray-500 mb-3">Referrals over time</div>
          {/* Placeholder for chart */}
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
        {/* </div> */}

        {/* 2x2 chart grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="w-full border border-[#E4E7EC] bg-white rounded-md p-6">
            <div className="font-semibold text-base mb-1">Top Referrers</div>
            <div className="text-xs text-gray-500 mb-3">
              Users chart over time
            </div>
            {/* Placeholder */}
            <div className="relative">
              <div id="chart">
                {isClient && (
                  <ReactApexChart
                    options={data.options}
                    series={data.series}
                    type="bar"
                    height={350}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="w-full border border-[#E4E7EC] bg-white rounded-md p-6">
            <div className="font-semibold text-base mb-1">Top Channels</div>
            <div className="text-xs text-gray-500 mb-3">
              Channels with the most referrals over time
            </div>
            {/* Placeholder */}
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
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="w-full border border-[#E4E7EC] bg-white rounded-md p-6">
            <div className="font-semibold text-base mb-1">Reward Chart</div>
            <div className="text-xs text-gray-500 mb-3">Most used rewards</div>
            {/* Placeholder */}
            {isClient && (
              <div id="chart">
                <ReactApexChart
                  options={rewards.options}
                  series={rewards.series}
                  type="bar"
                  height={350}
                />
              </div>
            )}
          </div>
          <div className="w-full border border-[#E4E7EC] bg-white rounded-md p-6">
            <div className="font-semibold w-32 text-base mb-6">
              Cash Flow in Numbers
            </div>
            <div className="flex items-center justify-center min-h-[400px] w-full">
              {isClient && (
                <div id="chart">
                  <ReactApexChart
                    options={cash.options}
                    series={cash.series}
                    type="pie"
                    width={380}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Campaigns table */}
        <Card className="w-full">
          <div className="flex flex-col gap-4">
            {/* Table header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="font-semibold text-[16px]">My Campaigns</div>
              <div className="flex gap-2 items-center mt-2 md:mt-0">
                {/* Calendar filter (placeholder) */}
                <div className="flex items-center bg-[#F7F9FB] px-4 py-2 rounded-md border border-gray-200 text-sm font-medium">
                  <span className="mr-2">🗓</span>
                  05 Feb - 06 March
                </div>
                {/* Search (placeholder) */}
                <input
                  className="border border-gray-200 rounded-md px-3 py-2 w-48 text-sm bg-[#F7F9FB] focus:outline-none"
                  placeholder="Search campaign name"
                />
                {/* Filters (placeholder) */}
                <button className="border border-gray-200 rounded-md px-3 py-2 text-sm bg-[#F7F9FB]">
                  Filters
                </button>
                <a className="text-primary font-medium text-sm ml-2 cursor-pointer hover:underline">
                  View All &rarr;
                </a>
              </div>
            </div>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full mt-4 text-sm">
                <thead>
                  <tr className="bg-[#EFF1FA] text-[#233E97] font-semibold">
                    <th className="px-4 py-3 text-left">Campaign Name</th>
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-left">Referrals</th>
                    <th className="px-4 py-3 text-left">Conversions</th>
                    <th className="px-4 py-3 text-left">Rewards</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Example rows */}
                  {[
                    {
                      type: "Referral",
                      status: "Active",
                      statusColor: "bg-green-500",
                      tagColor: "bg-[#4C8AFF]",
                    },
                    {
                      type: "Loyalty",
                      status: "Completed",
                      statusColor: "bg-blue-500",
                      tagColor: "bg-[#B96AFF]",
                    },
                    {
                      type: "Combo",
                      status: "Scheduled",
                      statusColor: "bg-red-500",
                      tagColor: "bg-[#6AB0B9]",
                    },
                    {
                      type: "Referral",
                      status: "Active",
                      statusColor: "bg-green-500",
                      tagColor: "bg-[#4C8AFF]",
                    },
                    {
                      type: "Referral",
                      status: "Completed",
                      statusColor: "bg-blue-500",
                      tagColor: "bg-[#4C8AFF]",
                    },
                    {
                      type: "Loyalty",
                      status: "Active",
                      statusColor: "bg-green-500",
                      tagColor: "bg-[#B96AFF]",
                    },
                    {
                      type: "Loyalty",
                      status: "Active",
                      statusColor: "bg-green-500",
                      tagColor: "bg-[#B96AFF]",
                    },
                  ].map((row, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="px-4 py-3">Pro Gain</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-4 py-1 rounded-lg text-white text-xs font-semibold ${row.tagColor}`}
                        >
                          {row.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">6K</td>
                      <td className="px-4 py-3">3K</td>
                      <td className="px-4 py-3">Airtime</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-3 py-1 rounded-lg text-white text-xs font-semibold ${row.statusColor}`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">10-04-2025</td>
                      <td className="px-4 py-3">...</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
