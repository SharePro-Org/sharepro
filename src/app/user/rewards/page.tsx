"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import UserDashboardTable from "@/components/dashboard/UserDashboardTable";
import { HeartIcon, RefreshCwIcon, SearchIcon } from "lucide-react";
import React from "react";

const userRewards = () => {
  return (
    <DashboardLayout user={true}>
      <section className="p-4 rounded-md bg-white">
        <div className="flex justify-between mb-6">
          <p className="text-xl font-medium">My Rewards</p>
          <button
            className="flex text-primary items-center gap-2"
            // onClick={() => refetch()}
            // disabled={analyticsLoading}
          >
            <RefreshCwIcon size={15} />
            <span className="text-sm">Refresh</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Card 1: Ongoing Campaigns (already refactored) */}
          <div className="flex flex-col border border-[#CCCCCC33] rounded-md p-6 items-start min-h-[100px] justify-center">
            <div className="flex justify-evenly">
              <div className="rounded-full bg-[#EDF3FE] w-[30px] h-[30px] flex my-auto items-center justify-center">
                <HeartIcon
                  size={16}
                  fill="#5B93FF"
                  className="text-[#5B93FF]"
                />
              </div>
              <div className="ml-4">
                <div className="text-lg font-bold">₦25,560.20</div>
                <div className="text-xs text-gray-500">
                  Total Rewards Earned
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col border border-[#CCCCCC33] rounded-md p-6 items-start min-h-[100px] justify-center">
            <div className="flex justify-evenly">
              <div className="rounded-full bg-[#EDF3FE] w-[30px] h-[30px] flex my-auto items-center justify-center">
                <HeartIcon
                  size={16}
                  fill="#5B93FF"
                  className="text-[#5B93FF]"
                />
              </div>
              <div className="ml-4">
                <div className="text-lg font-bold">2</div>
                <div className="text-xs text-gray-500">Unclaimed Rewards </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col border border-[#CCCCCC33] rounded-md p-6 items-start min-h-[100px] justify-center">
            <div className="flex justify-evenly">
              <div className="rounded-full bg-[#EDF3FE] w-[30px] h-[30px] flex my-auto items-center justify-center">
                <HeartIcon
                  size={16}
                  fill="#5B93FF"
                  className="text-[#5B93FF]"
                />
              </div>
              <div className="ml-4">
                <div className="text-lg font-bold">25</div>
                <div className="text-xs text-gray-500">Claimed Rewards</div>
              </div>
            </div>
          </div>
          <div className="my-auto flex items-end ml-auto">
            <button className="bg-primary p-3 rounded-md text-white">
              Claim Reward
            </button>
          </div>
        </div>
        <div className="border border-[#CCCCCC4D] rounded-md p-3 mt-3">
          <div className="mb-3 flex justify-between">
            <div></div>
            <div className="relative ml-auto md:mt-0 mt-2">
              <input
                type="text"
                className="bg-[#F9FAFB] md:w-72 w-full border border-[#E4E7EC] p-3 rounded-sm pl-8 text-base"
                placeholder="Search Campaign Name"
              />

              <SearchIcon
                size={16}
                className="absolute top-4 left-3 text-gray-500"
              />
            </div>
          </div>
          <UserDashboardTable type="rewards" />
        </div>
      </section>
    </DashboardLayout>
  );
};

export default userRewards;
