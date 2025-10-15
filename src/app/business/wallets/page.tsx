"use client";

import CampaignsTable from "@/components/dashboard/CampaignsTable";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Filter } from "@/components/Filter";
import { ArrowRight, EyeIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamic import for ReactApexChart with SSR disabled
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const wallets = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [cash, setCash] = useState({
    series: [30, 70],
    options: {
      chart: {
        width: 380,
        type: "pie" as const,
      },
      colors: ["#5977D9", "#A16AD4"],
      labels: ["Loyalty Campaign", "Referral Campaign"],
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

  const [state, setState] = React.useState({
    series: [44, 55, 41, 17, 15],
    options: {
      chart: {
        type: "donut" as const,
      },
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
      labels: ["Airtime", "Vouchers", "Discount", "Free Shipping", "Cashback"],
    },
  });

  return (
    <DashboardLayout>
      <>
        <section className="bg-white p-4 rounded-md ">
          <div className="flex gap-4">
            <button className="bg-primary p-3 rounded-sm text-white">
              Fund Wallet
            </button>
            <button className="bg-secondary p-3 rounded-sm text-white">
              Campaign Rewards
            </button>
            <button className="border border-[#CCCCCC] p-3 rounded-sm">
              View Wallet Transactions
            </button>
          </div>
        </section>
        <section className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-white p-4 rounded-md">
            <p className="text-sm text-[#030229B2]">Total Balance</p>
            <h1 className="text-2xl my-3 font-bold">#25,000.20</h1>
            <div className="flex justify-between">
              <p className="text-[#009B54] text-sm">30% than last month</p>

              <EyeIcon size={20} className="text-[#CCCCCC]" />
            </div>
          </div>
          {/* <div className="bg-white p-4 rounded-md">
            <p className="text-sm text-[#030229B2]">Total Balance</p>
            <h1 className="text-2xl my-3 font-bold">#25,000.20</h1>
            <div className="flex justify-between">
              <p className="text-[#009B54] text-sm">30% than last month</p>

              <EyeIcon size={20} className="text-[#CCCCCC]" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-md">
            <p className="text-sm text-[#030229B2]">Total Balance</p>
            <h1 className="text-2xl my-3 font-bold">#25,000.20</h1>
            <div className="flex justify-between">
              <p className="text-[#009B54] text-sm">30% than last month</p>

              <EyeIcon size={20} className="text-[#CCCCCC]" />
            </div>
          </div> */}
        </section>
        {/* <section className="grid grid-cols-3 gap-4 mt-4">
          <div className="col-span-2 bg-white rounded-md ">
            <div className="border-b border-b-[#E4E7EC] p-2 mb-6">
              <div className="font-semibold text-black w-32 text-base">
                Payouts
              </div>
            </div>
            {isClient && (
              <div>
                <ReactApexChart
                  options={state.options}
                  series={state.series}
                  type="donut"
                  width={450}
                />
              </div>
            )}
          </div>
          <div className="w-full bg-white rounded-md">
            <div className="border-b border-b-[#E4E7EC] p-2 mb-6">
              <div className="font-semibold text-black w-32 text-base">
                Cash Flow in Numbers
              </div>
            </div>

            <div className="flex items-center justify-center min-h-[300px] w-full">
              {isClient && (
                <div id="chart">
                  <ReactApexChart
                    options={cash.options}
                    series={cash.series}
                    type="pie"
                    width={350}
                  />
                </div>
              )}
            </div>
          </div>
        </section> */}
        <section className="bg-white p-4 rounded-md mt-4">
          <div className="lg:flex justify-between">
            <p className="text-black font-semibold my-auto text-base">
              Recent Payouts
            </p>
            <div className="flex gap-4">
              {/* <RangePicker /> */}
              {/* <Filter /> */}
              <div className="relative md:mt-0 mt-2">
                <input
                  type="text"
                  className="md:w-80 w-full border border-[#E4E7EC] p-3 rounded-sm pl-8 text-sm"
                  placeholder="Search Campaign Name"
                />

                <SearchIcon
                  size={16}
                  className="absolute top-4 left-3 text-gray-500"
                />
              </div>
              <Link
                href={"/business/wallets/payouts"}
                className="my-auto cursor-pointer"
              >
                <button className="flex my-auto gap-2 text-sm text-primary cursor-pointer">
                  <span className="my-auto">View All </span>
                  <ArrowRight size={15} className="my-auto" />
                </button>
              </Link>
            </div>
          </div>
          <CampaignsTable type="payout" />
        </section>
      </>
    </DashboardLayout>
  );
};

export default wallets;
