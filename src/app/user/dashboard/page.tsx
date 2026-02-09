"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DiscoverCampaign from "@/components/dashboard/DiscoverCampaign";
import UserDashboardTable from "@/components/dashboard/UserDashboardTable";
import { USER_DASHBOARD_SUMMARY, USER_INVITED_CAMPAIGNS } from "@/apollo/queries/user";
import { useQuery, useMutation } from "@apollo/client/react";
import { REQUEST_PAYOUT, GET_USER } from "@/apollo/mutations/account";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { message } from "antd"
import { Calendar, Users, XIcon, Wallet } from "lucide-react";
import React, { useEffect, useState, useMemo, useRef, Suspense } from "react";
import { userAtom } from "@/store/User";
import { useAtom } from "jotai";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

const userDashboard = () => {
  const [user] = useAtom(userAtom);
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasOpenedRedirect = useRef(false);
  const [openPayoutModal, setOpenPayoutModal] = useState(false);
  const [payoutForm, setPayoutForm] = useState({
    amount: "",
    bankAccountId: "",
  });

  type InvitedCampaignsData = { userInvitedCampaigns: any[] | null };
  const { data: invitedData, loading: invitedLoading, error: invitedError } = useQuery<InvitedCampaignsData>(USER_INVITED_CAMPAIGNS);

  const { data: userData } = useQuery<UserData>(GET_USER, {
    variables: { id: user?.userId },
    skip: !user?.userId,
  });

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

  interface UserData {
    currentUser: {
      bankAccounts: Array<{
        id: string;
        bankName: string;
        accountNumber: string;
        accountName: string;
      }>;
    };
  }

  const { data, loading, error } = useQuery<UserDashboardSummaryData>(USER_DASHBOARD_SUMMARY, {
    variables: { userId: user?.userId },
    skip: !user?.userId,
  });

  // Check if user has earned any rewards (same logic as campaigns page)
  const hasRewards = useMemo(() => {
    return (data?.userDashboardSummary?.totalRewardsEarned ?? 0) > 0;
  }, [data]);


  const [requestPayout, { loading: payoutLoading }] = useMutation(REQUEST_PAYOUT, {
    onCompleted: (data:any) => {
      if (data.requestPayout.success) {
        message.success(data.requestPayout.message || "Payout request submitted successfully!");
        setOpenPayoutModal(false);
        setPayoutForm({ amount: "", bankAccountId: "" });
      } else {
        message.error(data.requestPayout.message || "Failed to request payout");
      }
    },
    onError: (error) => {
      message.error(error.message);
    },
    refetchQueries: [{ query: USER_DASHBOARD_SUMMARY, variables: { userId: user?.userId } }]
  });

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

  // Auto-open external redirect link in new tab (from referral signup/login)
  useEffect(() => {
    const redirect = searchParams.get("redirect");
    if (redirect && !hasOpenedRedirect.current) {
      hasOpenedRedirect.current = true;
      // Open the external site in a new tab
      window.open(redirect, '_blank');
      // Clean up the URL by removing the redirect param
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("redirect");
      router.replace(newUrl.pathname + newUrl.search);
    }
  }, [searchParams, router]);

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
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <button
              onClick={() => setOpenPayoutModal(true)}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              <Wallet size={18} />
              <span>Request Payout</span>
            </button>
          </div>
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
                    {summary.recentRewardPercentage}%{" "}
                    {summary.recentRewardPercentage >= 0 ? "↑" : "↓"}
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
                   {summary.recentRewardPercentage}%{" "}
                    {summary.recentRewardPercentage >= 0 ? "↑" : "↓"}
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
                    {summary.recentRewardPercentage}%{" "}
                    {summary.recentRewardPercentage >= 0 ? "↑" : "↓"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`grid ${hasRewards ? 'md:grid-cols-3' : 'grid-cols-1'} grid-cols-1 gap-6`}>
            <div className={`${hasRewards ? 'col-span-2' : 'col-span-1'} p-4 bg-white rounded-md`}>
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
            {hasRewards && (
              <div className="row-span-2 p-4 bg-white rounded-md">
                <DiscoverCampaign />
              </div>
            )}
            <div className={`${hasRewards ? 'col-span-2' : 'col-span-1'} p-4 bg-white rounded-md`}>
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

        {/* Payout Request Modal */}
        <Dialog open={openPayoutModal} onOpenChange={() => setOpenPayoutModal(false)}>
          <DialogContent>
            <h2 className="font-medium text-center text-xl mb-4">Request Payout</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Available Balance:</strong> {summary.walletBalance}
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!payoutForm.amount || !payoutForm.bankAccountId) {
                  alert("Please fill in all fields");
                  return;
                }
                const amount = parseFloat(payoutForm.amount);
                if (isNaN(amount) || amount <= 0) {
                  alert("Please enter a valid amount");
                  return;
                }
                requestPayout({
                  variables: {
                    input: {
                      amount: amount,
                      bankAccountId: payoutForm.bankAccountId,
                    },
                  },
                });
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="amount" className="block text-sm font-medium mb-2">
                  Amount to Withdraw
                </label>
                <input
                  type="number"
                  id="amount"
                  step="0.01"
                  min="0"
                  value={payoutForm.amount}
                  onChange={(e) => setPayoutForm({ ...payoutForm, amount: e.target.value })}
                  placeholder="Enter amount"
                  className="border border-[#E5E5EA] rounded-md p-3 w-full"
                  required
                />
              </div>
              <div>
                <label htmlFor="bankAccount" className="block text-sm font-medium mb-2">
                  Select Bank Account
                </label>
                {userData?.currentUser?.bankAccounts && userData.currentUser.bankAccounts.length > 0 ? (
                  <select
                    id="bankAccount"
                    value={payoutForm.bankAccountId}
                    onChange={(e) => setPayoutForm({ ...payoutForm, bankAccountId: e.target.value })}
                    className="border border-[#E5E5EA] rounded-md p-3 w-full"
                    required
                  >
                    <option value="">Select Bank Account</option>
                    {userData.currentUser.bankAccounts.map((account: any) => (
                      <option key={account.id} value={account.id}>
                        {account.bankName} - {account.accountNumber} ({account.accountName})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-md">
                    No bank accounts found. Please{" "}
                    <Link href="/user/account" className="text-primary underline">
                      add a bank account
                    </Link>{" "}
                    first.
                  </div>
                )}
              </div>
              <div className="text-center space-y-2">
                <button
                  type="submit"
                  className="w-full p-3 bg-primary rounded-md text-white hover:bg-primary/90 transition-colors"
                  disabled={payoutLoading || !userData?.currentUser?.bankAccounts?.length}
                >
                  {payoutLoading ? "Processing..." : "Submit Request"}
                </button>
                <button
                  type="button"
                  onClick={() => setOpenPayoutModal(false)}
                  className="w-full p-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </>
    </DashboardLayout>
  );
};

export default function UserDashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {React.createElement(userDashboard)}
    </Suspense>
  );
}
