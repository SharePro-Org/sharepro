import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  USER_JOINED_CAMPAIGNS,
  USER_REWARD_HISTORY,
} from "@/apollo/queries/user";
import { CLAIM_REWARD } from "@/apollo/mutations/campaigns";
import { useAtom } from "jotai";
import { userAtom } from "@/store/User";
import { Campaign, Reward } from "@/apollo/types";
import { Button, Dropdown } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle, XCircle } from "lucide-react";

// import { format } from "date-fns";

const UserDashboardTable = ({ type, max }: { type: string; max?: number }) => {
  // Access the current user from the global state
  const [user] = useAtom(userAtom);

  // State for claim reward functionality
  const [claimingReward, setClaimingReward] = useState<string | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [claimSuccess, setClaimSuccess] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Mutations
  const [claimReward] = useMutation(CLAIM_REWARD);

  // Fetch campaigns data
  const { data: campaignsData, loading: campaignsLoading } = useQuery<{ userJoinedCampaigns: Campaign[] }>(
    USER_JOINED_CAMPAIGNS,
    {
      variables: { userId: user?.userId },
      skip: !user?.userId || type !== "campaigns",
    }
  );

  // Fetch rewards data
  const { data: rewardsData, loading: rewardsLoading } = useQuery<{ userRewardHistory: Reward[] }>(
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

  // Handle claim reward
  type ClaimRewardResponse = {
    claimReward?: {
      success: boolean;
      message?: string;
    };
  };

  const handleClaimReward = async (rewardId: string) => {
    setClaimingReward(rewardId);
    setClaimError(null);
    setClaimSuccess(null);

    try {
      const response = await claimReward({
        variables: {
          rewardId,
          userId: user?.userId,
        },
        refetchQueries: [
          {
            query: USER_REWARD_HISTORY,
            variables: { userId: user?.userId },
          },
        ],
      });

      const data = response.data as ClaimRewardResponse;

      if (data?.claimReward?.success) {
        setClaimSuccess(
          data.claimReward.message || "Reward claimed successfully!"
        );
        setModalOpen(true);
      } else {
        setClaimError(
          data?.claimReward?.message || "Failed to claim reward"
        );
        setModalOpen(true);
      }
    } catch (error: any) {
      console.error("Claim reward error:", error);
      setClaimError(
        error.message ||
          "An unexpected error occurred while claiming the reward"
      );
      setModalOpen(true);
    } finally {
      setClaimingReward(null);
    }
  };

  // Close modal and reset states
  const closeModal = () => {
    setModalOpen(false);
    setClaimError(null);
    setClaimSuccess(null);
  };

  // Handle dropdown action
  const handleDropdownAction = (action: string, campaign: Campaign) => {
    if (action === "copy") {
      if (campaign.referralCode) {
        navigator.clipboard.writeText(campaign.referralCode);
        // message.success("Referral link copied to clipboard!");
      } else {
        // message.error("No referral link available.");
      }
    } else if (action === "campaign") {
      // Show campaign details modal (simple alert for now)
      // message.info(
      //   `Campaign: ${campaign.campaignName}\nType: ${campaign.campaignType}\nReward: ${campaign.rewardInfo}`
      // );
    }
    //  else if (action === "reward") {
    //   if (campaign.isClaimable && campaign.rewardId) {
    //     handleClaimReward(campaign.rewardId);
    //   } else {
    //     message.error("Reward not claimable or missing reward ID.");
    //   }
    // }
  };

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
                    <td className={`px-4 py-3`}>
                      <span
                        className={`inline-block px-4 py-1 rounded-[5px] text-white text-xs ${
                          campaign.campaignType.toLowerCase() === "loyalty"
                            ? "bg-[#A16AD4]"
                            : campaign.campaignType.toLowerCase() === "combo"
                            ? "bg-[#6192AE]"
                            : "bg-[#4C8AFF]"
                        }`}
                      >
                        {" "}
                        {campaign.campaignType}
                      </span>
                    </td>
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
                            // { key: "reward", label: "Claim Reward" },
                          ],
                          onClick: ({ key }) => handleDropdownAction(key, campaign),
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
        <div>
          {claimError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
              <p className="text-sm">{claimError}</p>
            </div>
          )}
          <table className="w-full mt-4 text-sm">
            <thead>
              <tr className="bg-[#D1DAF4] text-black">
                <th className="px-4 py-3 font-medium text-left">
                  Campaign Name
                </th>
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
                            reward.status === "Paid"
                              ? "bg-green-200 text-green-800"
                              : reward.status === "Approved"
                              ? "bg-yellow-200 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {reward.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() =>
                            reward.isClaimable &&
                            handleClaimReward(reward.rewardId)
                          }
                          className={`text-primary underline ${
                            !reward.isClaimable &&
                            "opacity-50 cursor-not-allowed"
                          } ${
                            claimingReward === reward.rewardId &&
                            "opacity-50 cursor-not-allowed"
                          }`}
                          disabled={
                            !reward.isClaimable ||
                            claimingReward === reward.rewardId
                          }
                        >
                          {claimingReward === reward.rewardId
                            ? "Claiming..."
                            : reward.isClaimable
                            ? "Claim"
                            : "View"}
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
        </div>
      ) : null}

      {/* Success/Error Modal */}
      <Dialog open={modalOpen} onOpenChange={closeModal}>
        <DialogContent size="sm">
          <div className="flex flex-col justify-center text-center items-center p-6">
            {claimSuccess ? (
              <>
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <p className="font-semibold text-lg mb-2">Success!</p>
                <p className="text-sm text-gray-600 mb-4">{claimSuccess}</p>
              </>
            ) : claimError ? (
              <>
                <XCircle className="w-16 h-16 text-red-500 mb-4" />
                <p className="font-semibold text-lg mb-2">Error</p>
                <p className="text-sm text-gray-600 mb-4">{claimError}</p>
              </>
            ) : null}
            <button
              onClick={closeModal}
              className="bg-primary text-white px-6 py-2 rounded-md w-full hover:bg-primary/90 transition-colors"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDashboardTable;
