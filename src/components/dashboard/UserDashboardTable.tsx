import React from "react";
import { useQuery } from "@apollo/client";
import {
  USER_JOINED_CAMPAIGNS,
  USER_REWARD_HISTORY,
} from "@/apollo/queries/user";
import { useAtom } from "jotai";
import { userAtom } from "@/store/User";
import { Campaign, Reward } from "@/apollo/types";
import { Button, Dropdown } from "antd";
import { MoreOutlined } from "@ant-design/icons";

// import { format } from "date-fns";

const UserDashboardTable = ({ type, max }: { type: string; max?: number }) => {
  // Access the current user from the global state
  const [user] = useAtom(userAtom);

  // Fetch campaigns data
  const { data: campaignsData, loading: campaignsLoading } = useQuery(
    USER_JOINED_CAMPAIGNS,
    {
      variables: { userId: user?.userId },
      skip: !user?.userId || type !== "campaigns",
    }
  );

  // Fetch rewards data
  const { data: rewardsData, loading: rewardsLoading } = useQuery(
    USER_REWARD_HISTORY,
    {
      variables: { userId: user?.userId },
      skip: !user?.userId || type !== "rewards",
    }
  );

  // Format date function
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  // Format currency function
  const formatCurrency = (amount: number, currency: string = "₦"): string => {
    return `${currency}${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Get campaigns and slice if max is provided
  const campaigns: Campaign[] = campaignsData?.userJoinedCampaigns || [];
  const displayCampaigns = max ? campaigns.slice(0, max) : campaigns;

  // Get rewards and slice if max is provided
  const rewards: Reward[] = rewardsData?.userRewardHistory || [];
  const displayRewards = max ? rewards.slice(0, max) : rewards;

  return (
    <div>
      {type === "campaigns" ? (
        <table className="w-full mt-4 text-sm">
          <thead>
            <tr className="bg-[#D1DAF4] text-black">
              <th className="px-4 py-3 font-medium text-left">Campaign Name</th>
              <th className="px-4 py-3 font-medium text-left">Type</th>
              <th className="px-4 py-3 font-medium text-left">Rewards</th>
              <th className="px-4 py-3 font-medium text-left">Status</th>
              <th className="px-4 py-3 font-medium text-left">Date</th>
              <th className="px-4 py-3 font-medium text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {campaignsLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-3 text-center">
                  Loading campaigns...
                </td>
              </tr>
            ) : displayCampaigns.length > 0 ? (
              (max ? displayCampaigns.slice(0, max) : displayCampaigns).map(
                (campaign: Campaign) => (
                  <tr
                    key={campaign.campaignId}
                    className="border-b border-gray-200"
                  >
                    <td className="px-4 py-3">{campaign.campaignName}</td>
                    <td className="px-4 py-3">{campaign.campaignType}</td>
                    <td className="px-4 py-3">{campaign.rewardInfo}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          campaign.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : campaign.status === "COMPLETED"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {formatDate(campaign.dateJoined)}
                    </td>
                    <td className="px-4 py-3">
                      <Dropdown
                        menu={{
                          items: [
                            { key: "copy", label: "Copy Referral Link" },
                            { key: "campaign", label: "Campaign Details" },
                            { key: "reward", label: "Claim Reward" },
                            { key: "view", label: "View Performance" },
                          ],
                        }}
                        trigger={["click"]}
                      >
                        <Button type="text">
                          <MoreOutlined />
                        </Button>
                      </Dropdown>
                      {/* <button className="text-primary underline">View</button> */}
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-3 text-center">
                  No campaigns joined yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      ) : type === "rewards" ? (
        <table className="w-full mt-4 text-sm">
          <thead>
            <tr className="bg-[#D1DAF4] text-black">
              <th className="px-4 py-3 font-medium text-left">Campaign Name</th>
              <th className="px-4 py-3 font-medium text-left">Reward Type</th>
              <th className="px-4 py-3 font-medium text-left">Amount</th>
              <th className="px-4 py-3 font-medium text-left">Status</th>
              <th className="px-4 py-3 font-medium text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {rewardsLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-3 text-center">
                  Loading rewards...
                </td>
              </tr>
            ) : displayRewards.length > 0 ? (
              (max ? displayRewards.slice(0, max) : displayRewards).map(
                (reward: Reward) => (
                  <tr
                    key={reward.rewardId}
                    className="border-b border-gray-200"
                  >
                    <td className="px-4 py-3">{reward.campaignName}</td>
                    <td className="px-4 py-3">{reward.rewardType}</td>
                    <td className="px-4 py-3">
                      {formatCurrency(reward.amount, reward.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          reward.status === "CLAIMED"
                            ? "bg-green-100 text-green-800"
                            : reward.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {reward.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        className={`text-primary underline ${
                          !reward.isClaimable && "opacity-50 cursor-not-allowed"
                        }`}
                        disabled={!reward.isClaimable}
                      >
                        {reward.isClaimable ? "Claim" : "View"}
                      </button>
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-3 text-center">
                  No rewards found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      ) : null}
    </div>
  );
};

export default UserDashboardTable;
