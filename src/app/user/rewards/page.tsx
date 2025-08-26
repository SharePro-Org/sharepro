"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import UserDashboardTable from "@/components/dashboard/UserDashboardTable";
import { HeartIcon, RefreshCwIcon, SearchIcon, Users } from "lucide-react";
import React, { useState } from "react";

const userRewards = () => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({
    totalRewardsEarned: "₦0.00",
    recentRewardChange: "",
    recentRewardPercentage: 0,
    totalCampaignsJoined: 0,
    ongoingCampaigns: 0,
    totalReferrals: 0,
    convertedReferrals: 0,
    pendingActions: 0,
    walletBalance: "₦0.00",
  });

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
          {/* Card 1: Total Rewards Earned */}
          <div className="flex flex-col bg-[#fff] rounded-md p-4 items-start min-h-[100px] justify-center">
            <div className="flex w-full flex-col">
              <div className="flex justify-between">
                <p className="my-auto font-medium">Total Rewards Earned</p>
                <div className="rounded-full ml-auto bg-[#A16AD4]/20 w-[30px] h-[30px] flex items-center justify-center">
                  <Users size={16} fill="#A16AD4" className="text-[#A16AD4]" />
                </div>
              </div>
              <div className="text-xl my-3 font-bold">
                {loading ? "Loading..." : summary.totalRewardsEarned}
              </div>
              <div className="w-full mt-2">
                <div className="text-sm text-gray-500">
                  Across all campaigns
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Total Campaigns Joined */}
          <div className="flex flex-col bg-[#fff] rounded-md p-4 items-start min-h-[100px] justify-center">
            <div className="flex w-full flex-col">
              <div className="flex justify-between">
                <p className="my-auto font-medium">Referral Rewards</p>
                <div className="rounded-full ml-auto bg-[#233E97]/20 w-[30px] h-[30px] flex items-center justify-center">
                  <Users size={16} fill="#233E97" className="text-[#233E97]" />
                </div>
              </div>
              <div className="text-xl my-3 font-bold">
                {loading ? "Loading..." : summary.totalCampaignsJoined}
              </div>
              <div className="w-full mt-2">
                <div className="text-sm text-gray-500">
                  Invite more to earn more
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Total Referrals */}
          <div className="flex flex-col bg-[#fff] rounded-md p-4 items-start min-h-[100px] justify-center">
            <div className="flex w-full flex-col">
              <div className="flex justify-between">
                <p className="my-auto font-medium">Loyalty Rewards</p>
                <div className="rounded-full ml-auto bg-[#233E97]/20 w-[30px] h-[30px] flex items-center justify-center">
                  <Users size={16} fill="#233E97" className="text-[#233E97]" />
                </div>
              </div>
              <div className="text-xl my-3 font-bold">
                {loading ? "Loading..." : summary.totalReferrals}
              </div>
              <div className="w-full mt-2">
                <div className="text-sm text-gray-500">
                  Upload receipts to earn more
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Pending Actions */}
          <div className="flex flex-col bg-[#fff] rounded-md p-4 items-start min-h-[100px] justify-center">
            <div className="flex w-full flex-col">
              <div className="flex justify-between">
                <p className="my-auto font-medium">Combo Rewards</p>
                <div className="rounded-full ml-auto bg-[#233E97]/20 w-[30px] h-[30px] flex items-center justify-center">
                  <Users size={16} fill="#233E97" className="text-[#233E97]" />
                </div>
              </div>
              <div className="text-xl my-3 font-bold">
                {loading ? "Loading..." : summary.pendingActions}
              </div>
              <div className=" w-full mt-2">
                <div className="text-sm text-gray-500">
                  Earn faster with combined efforts
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border border-[#CCCCCC4D] rounded-md p-3 mt-3">
          <div className="mb-3 flex justify-between">
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
            <div className="my-auto flex items-end ml-auto">
              <button className="bg-primary p-3 rounded-md text-white">
                Redeem Reward
              </button>
            </div>
          </div>
          <UserDashboardTable type="rewards" />
        </div>
      </section>
    </DashboardLayout>
  );
};

export default userRewards;
