"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DiscoverCampaign from "@/components/dashboard/DiscoverCampaign";
import UserDashboardTable from "@/components/dashboard/UserDashboardTable";
import { USER_DASHBOARD_SUMMARY, USER_INVITED_CAMPAIGNS } from "@/apollo/queries/user";
import { useQuery, useMutation } from "@apollo/client/react";

import { Calendar, Users, XIcon } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { userAtom } from "@/store/User";
import { useAtom } from "jotai";
import Link from "next/link";

const userDashboard = () => {
  const [user] = useAtom(userAtom);

  type InvitedCampaignsData = { userInvitedCampaigns: any[] | null };
  const { data: invitedData, loading: invitedLoading, error: invitedError } = useQuery<InvitedCampaignsData>(USER_INVITED_CAMPAIGNS);

  // Check if any invited campaign has a non-null reward object (accepts `reward` or `rewards` keys)
  const hasRewardInInvited = useMemo(() => {
    const campaigns = invitedData?.userInvitedCampaigns;
    if (!campaigns || campaigns.length === 0) return false;
    return campaigns.some((c: any) => {
      const rewardVal = c?.rewards ?? c?.rewards;
      return rewardVal !== null && rewardVal !== undefined;
    });
  }, [invitedData]);

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

  interface UserDashboardSummaryData {
    userDashboardSummary: {
      totalRewardsEarned: number;
      recentRewardChange: number;
      recentRewardPercentage: number;
      totalCampaignsJoined: number;
      totalReferrals: number;
      pendingActions: number;
      walletBalance: number;
      // Add any other fields as needed
    };
  }

  const { data, loading, error } = useQuery<UserDashboardSummaryData>(USER_DASHBOARD_SUMMARY, {
    variables: { userId: user?.userId },
    skip: !user?.userId,
  });

  const { data: userInvitedCampaigns } = useQuery(USER_INVITED_CAMPAIGNS, {
    variables: {},
    // skip: !user?.userId,
  })
  console.log("User Invited Campaigns: ", userInvitedCampaigns);

  useEffect(() => {
    if (data?.userDashboardSummary) {
      const dashboardData = data.userDashboardSummary;
      setSummary({
        totalRewardsEarned: formatCurrency(
          dashboardData.totalRewardsEarned || 0
        ),
        recentRewardChange: formatCurrency(
          dashboardData.recentRewardChange || 0
        ),
        recentRewardPercentage: dashboardData.recentRewardPercentage || 0,
        totalCampaignsJoined: dashboardData.totalCampaignsJoined || 0,
        ongoingCampaigns: Math.ceil(
          (dashboardData.totalCampaignsJoined || 0) / 2
        ), // Estimate, replace with actual data if available
        totalReferrals: dashboardData.totalReferrals || 0,
        convertedReferrals: Math.floor(
          (dashboardData.totalReferrals || 0) * 0.1
        ), // Estimate, replace with actual data if available
        pendingActions: dashboardData.pendingActions || 0,
        walletBalance: formatCurrency(dashboardData.walletBalance || 0),
      });
    }
  }, [data]);

  // Format currency to display as naira
  const formatCurrency = (amount: number): string => {
    return `₦${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <DashboardLayout user={true}>
      <>
        <section className="flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Card 1: Total Rewards Earned */}
            <div className="flex flex-col bg-[#fff] rounded-md p-4 items-start min-h-[100px] justify-center">
              <div className="flex w-full flex-col">
                <div className="flex justify-between">
                  <p className="my-auto font-medium">Total Rewards Earned</p>
                  <div className="rounded-full ml-auto bg-[#A16AD4]/20 w-[30px] h-[30px] flex items-center justify-center">
                    <Users
                      size={16}
                      fill="#A16AD4"
                      className="text-[#A16AD4]"
                    />
                  </div>
                </div>
                <div className="text-xl my-3 font-bold">
                  {loading ? "Loading..." : summary.totalRewardsEarned}
                </div>
                <div className="flex justify-between w-full mt-2">
                  <div className="text-sm text-gray-500">
                    Last: {summary.recentRewardChange || "N/A"}
                  </div>
                  <div
                    className={`text-sm ${summary.recentRewardPercentage >= 0
                      ? "text-green-600"
                      : "text-red-600"
                      } mt-1 font-bold`}
                  >
                    {summary.recentRewardPercentage}%{" "}
                    {summary.recentRewardPercentage >= 0 ? "↑" : "↓"}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Total Campaigns Joined */}
            <div className="flex flex-col bg-[#fff] rounded-md p-4 items-start min-h-[100px] justify-center">
              <div className="flex w-full flex-col">
                <div className="flex justify-between">
                  <p className="my-auto font-medium">Total Campaigns Joined</p>
                  <div className="rounded-full ml-auto bg-[#233E97]/20 w-[30px] h-[30px] flex items-center justify-center">
                    <Users
                      size={16}
                      fill="#233E97"
                      className="text-[#233E97]"
                    />
                  </div>
                </div>
                <div className="text-xl my-3 font-bold">
                  {loading ? "Loading..." : summary.totalCampaignsJoined}
                </div>
                <div className="flex justify-between w-full mt-2">
                  <div className="text-sm text-gray-500">
                    Ongoing: {summary.ongoingCampaigns}
                  </div>
                  <div className="text-sm text-green-600 mt-1 font-bold">
                    {summary.recentRewardPercentage}% ↑
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Total Referrals */}
            <div className="flex flex-col bg-[#fff] rounded-md p-4 items-start min-h-[100px] justify-center">
              <div className="flex w-full flex-col">
                <div className="flex justify-between">
                  <p className="my-auto font-medium">Total Referrals</p>
                  <div className="rounded-full ml-auto bg-[#233E97]/20 w-[30px] h-[30px] flex items-center justify-center">
                    <Users
                      size={16}
                      fill="#233E97"
                      className="text-[#233E97]"
                    />
                  </div>
                </div>
                <div className="text-xl my-3 font-bold">
                  {loading ? "Loading..." : summary.totalReferrals}
                </div>
                <div className="flex justify-between w-full mt-2">
                  <div className="text-sm text-gray-500">
                    {summary.convertedReferrals} converted
                  </div>
                  <div className="text-sm text-green-600 mt-1 font-bold">
                    {summary.recentRewardPercentage}% ↑
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Pending Actions */}
            <div className="flex flex-col bg-[#fff] rounded-md p-4 items-start min-h-[100px] justify-center">
              <div className="flex w-full flex-col">
                <div className="flex justify-between">
                  <p className="my-auto font-medium">Pending Actions</p>
                  <div className="rounded-full ml-auto bg-[#233E97]/20 w-[30px] h-[30px] flex items-center justify-center">
                    <Users
                      size={16}
                      fill="#233E97"
                      className="text-[#233E97]"
                    />
                  </div>
                </div>
                <div className="text-xl my-3 font-bold">
                  {loading ? "Loading..." : summary.pendingActions}
                </div>
                <div className="flex justify-between w-full mt-2">
                  <div className="text-sm text-gray-500">
                    Rewards Awaiting Claim
                  </div>
                  <div className="text-sm text-green-600 mt-1 font-bold">
                    {summary.recentRewardPercentage}% ↑
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="bg-white relative p-4 rounded-md">
            <button className="absolute top-2 right-4 mb-2">
              <XIcon />
            </button>
            <div className="bg-[#ECF3FF] p-4 my-5 rounded-md flex justify-between">
              <div>
                <p className="text-primary mb-2 text-lg font-medium">
                  New Reward!
                </p>
                <p className="text-[#030229B2]">
                  Someone signed up with your referral link, you’ve earned a
                  reward.
                </p>
              </div>
              <button className="bg-primary text-white px-6 my-auto py-3 rounded-md">
                Claim Reward
              </button>
            </div>
          </div> */}

          <div className={`grid ${hasRewardInInvited ? 'md:grid-cols-3' : 'grid-cols-1'} grid-cols-1 gap-6`}>
            <div className={`${hasRewardInInvited ? 'col-span-2' : 'col-span-1'} p-4 bg-white rounded-md`}>
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Joined Campaigns</p>
                  <p className="test-sm mt-2 text-[#030229B2]">
                    A list of campaigns the user is already part of:
                  </p>
                </div>
                <Link href="/user/campaigns">
                  <button className="text-primary mt-auto">View All</button>
                </Link>
              </div>
              <UserDashboardTable type="campaigns" max={6} />
            </div>
            {hasRewardInInvited && (
              <div className="row-span-2 p-4 bg-white rounded-md">
                <DiscoverCampaign />
              </div>
            )}
            <div className={`${hasRewardInInvited ? 'col-span-2' : 'col-span-1'} p-4 bg-white rounded-md`}>
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Rewards</p>
                  <p className="test-sm mt-2 text-[#030229B2]">
                    A list of campaigns the user is already part of:
                  </p>
                </div>
                <Link href="/user/rewards">
                  <button className="text-primary mt-auto">View All</button>
                </Link>
              </div>
              <UserDashboardTable type="rewards" max={4} />
            </div>
          </div>
        </section>
      </>
    </DashboardLayout>
  );
};

export default userDashboard;
