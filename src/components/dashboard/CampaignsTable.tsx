'use client'

import React, { useState, useEffect } from "react";
import { Dropdown, Button, message } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_BUSINESS_CAMPAIGNS, GET_PAYOUT } from "@/apollo/queries/campaigns";
import { ACTIVATE_CAMPAIGN, APPROVE_OR_REJECT_PROOF, PAUSE_CAMPAIGN, END_CAMPAIGN, DELETE_CAMPAIGN } from "@/apollo/mutations/campaigns";
import { useAtom } from "jotai";
import { userAtom } from "@/store/User";
import { useParams, useRouter } from "next/navigation";
import { CAMPAIGNS } from "@/apollo/queries/admin";

const CampaignsTable = ({ type, num }: { type?: string; num?: number }) => {
  const [user] = useAtom(userAtom);
  const [businessId, setBusinessId] = useState<string>("");
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id;

  useEffect(() => {
    if (user?.businessId) {
      setBusinessId(user.businessId);
    }
  }, [user]);

  const { data: payoutData, } = useQuery<any>(GET_PAYOUT, {
    variables: { campaignId },
    skip: !campaignId,
  })


  // Choose query based on userType
  const isAdmin = user?.userType === "ADMIN";
  interface CampaignsQueryResult {
    campaigns?: any[];
    businessCampaigns?: any[];
  }

  const { data, loading, error } = useQuery<CampaignsQueryResult>(
    isAdmin ? CAMPAIGNS : GET_BUSINESS_CAMPAIGNS,
    isAdmin
      ? {}
      : {
        variables: { businessId },
        skip: !businessId,
      }
  );

  const [handleToggleRewardStatus, { loading: setLoading }] = useMutation(APPROVE_OR_REJECT_PROOF)

  const [activateCampaign, { loading: activateLoading }] = useMutation(
    ACTIVATE_CAMPAIGN,
    {
      refetchQueries: [
        { query: GET_BUSINESS_CAMPAIGNS, variables: { businessId } },
      ],
      onCompleted: (data: any) => {
        if (data.activateCampaign.success) {
          message.success(data.activateCampaign.message);
        } else {
          message.error(
            data.activateCampaign.message || "Failed to update campaign status"
          );
        }
      },
      onError: (error) => {
        message.error(`Error: ${error.message}`);
      },
    }
  );
  const [pauseCampaign, { loading: pauseLoading }] = useMutation(
    PAUSE_CAMPAIGN,
    {
      refetchQueries: [
        { query: GET_BUSINESS_CAMPAIGNS, variables: { businessId } },
      ],
      onCompleted: (data: any) => {
        if (data.pauseCampaign.success) {
          message.success(data.pauseCampaign.message);
        } else {
          message.error(
            data.pauseCampaign.message || "Failed to update campaign status"
          );
        }
      },
      onError: (error) => {
        message.error(`Error: ${error.message}`);
      },
    }
  );

  const [endCampaign, { loading: endLoading }] = useMutation(
    END_CAMPAIGN,
    {
      refetchQueries: [
        { query: GET_BUSINESS_CAMPAIGNS, variables: { businessId } },
      ],
      onCompleted: (data: any) => {
        if (data.endCampaign.success) {
          message.success(data.endCampaign.message);
        } else {
          message.error(
            data.endCampaign.message || "Failed to end campaign"
          );
        }
      },
      onError: (error) => {
        message.error(`Error: ${error.message}`);
      },
    }
  );

  const [deleteCampaign, { loading: deleteLoading }] = useMutation(
    DELETE_CAMPAIGN,
    {
      refetchQueries: [
        { query: GET_BUSINESS_CAMPAIGNS, variables: { businessId } },
      ],
      onCompleted: (data: any) => {
        if (data.deleteCampaign.success) {
          message.success(data.deleteCampaign.message);
        } else {
          message.error(
            data.deleteCampaign.message || "Failed to delete campaign"
          );
        }
      },
      onError: (error) => {
        message.error(`Error: ${error.message}`);
      },
    }
  );

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

  const handleToggleCampaignStatus = (
    campaignId: string,
    isCurrentlyActive: boolean
  ) => {
    activateCampaign({
      variables: {
        id: campaignId,
        isActive: !isCurrentlyActive,
      },
    });
  };
  const handlePauseCampaignStatus = (
    campaignId: string
  ) => {
    pauseCampaign({
      variables: {
        id: campaignId,
        pause: true,
      },
    });
  };

  const handleEndCampaign = (campaignId: string) => {
    endCampaign({
      variables: {
        id: campaignId,
      },
    });
  };

  const handleDeleteCampaign = (campaignId: string) => {
    if (window.confirm("Are you sure you want to delete this campaign? This action cannot be undone.")) {
      deleteCampaign({
        variables: {
          id: campaignId,
        },
      });
    }
  };

  const handleAddReward = (campaignType: string, campaignId: string) => {
    router.push(
      `/business/campaigns/create/rewards?type=${campaignType.toLowerCase()}&id=${campaignId}`
    );
  };



  return type === "payout" ? (
    <div>
      <table className="w-full mt-4 text-sm">
        <thead>
          <tr className="bg-[#D1DAF4] text-black">
            <th className="px-4 py-3 font-medium text-left">Campaign</th>
            <th className="px-4 py-3 font-medium text-left">Reward Type</th>
            <th className="px-4 py-3 font-medium text-left">Amount</th>
            {/* <th className="px-4 py-3 font-medium text-left">Reward</th> */}
            <th className="px-4 py-3 font-medium text-left">User</th>
            <th className="px-4 py-3 font-medium text-left">Status</th>
            <th className="px-4 py-3 font-medium text-left">Date</th>
            <th className="px-4 py-3 font-medium text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {payoutData?.campaignRewards && payoutData.campaignRewards.length > 0 ? (
            payoutData.campaignRewards.map((campaign: any) => (
              <tr
                key={campaign.id}
                className="border-b border-[#E2E8F0] py-2 last:border-0"
              >
                <td className="px-4 font-black font-normal py-3">{campaign.campaign.name}</td>
                <td className="px-4 py-3">{campaign.rewardType}</td>
                <td className="px-4 py-3">{campaign.amount}</td>
                {/* <td className="px-4 py-3">Airtime</td> */}
                <td className="px-4 py-3">{campaign.user.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-4 py-1 rounded-[5px] text-white text-xs
                      ${campaign.status === 'PAID' ? 'bg-blue-500'
                        : campaign.status === 'APPROVED' ? 'bg-green-500'
                        : campaign.status === 'PENDING' ? 'bg-yellow-500 text-black'
                        : campaign.status === 'PROOF_SUBMITTED' ? 'bg-orange-500'
                          : 'bg-red-500'}
                    `}
                  >
                    {campaign.status}
                  </span>
                </td>
                <td className="px-4 py-3">{formatDate(campaign.createdAt)}</td>
                <td className="px-4 py-3">
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: "view",
                          label: "Review Payout",
                          onClick: () =>
                            router.push(`/business/campaigns/${campaignId}/payouts/${campaign.id}`),
                        },
                        { key: "payouts", label: "Mark as paid" },
                        //
                      ],
                    }}
                    trigger={["click"]}
                  >
                    <Button type="text">
                      <MoreOutlined />
                    </Button>
                  </Dropdown>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="px-4 py-12 text-center">
                <div className="flex flex-col items-center justify-center gap-3">
                  <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">No payouts yet</h3>
                    <p className="text-sm text-gray-500">Payouts will appear here once rewards are processed</p>
                  </div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  ) : (
    <div className="overflow-x-auto">
      {loading ? (
        <div className="p-8 text-center">Loading campaigns...</div>
      ) : error ? (
        <div className="p-8 text-center text-red-500">
          Error loading campaigns
        </div>
      ) : (
        <table className="w-full mt-4 text-sm">
          <thead>
            <tr className="bg-[#D1DAF4] text-black">
              <th className="px-4 py-3 font-medium text-left">Campaign Name</th>
              <th className="px-4 py-3 font-medium text-left">Type</th>
              <th className="px-4 py-3 font-medium text-left">Referrals</th>
              <th className="px-4 py-3 font-medium text-left">Conversions</th>
              <th className="px-4 py-3 font-medium text-left">Rewards</th>
              <th className="px-4 py-3 font-medium text-left">Status</th>
              <th className="px-4 py-3 font-medium text-left">Date</th>
              <th className="px-4 py-3 font-medium text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {(
              num
                ? (isAdmin ? data?.campaigns?.slice(0, num) : data?.businessCampaigns?.slice(0, num)) || []
                : (isAdmin ? data?.campaigns : data?.businessCampaigns) || []
            ).length > 0 ? (
              (
                num
                  ? (isAdmin ? data?.campaigns?.slice(0, num) : data?.businessCampaigns?.slice(0, num)) || []
                  : (isAdmin ? data?.campaigns : data?.businessCampaigns) || []
              ).map((row: any, i: number) => (
                <tr
                  key={row.id || i}
                  className="border-b border-[#E2E8F0] py-2 last:border-0"
                >
                  <td className="px-4 font-black font-normal py-3">{row.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-4 py-1 rounded-[5px] text-white text-xs ${row.campaignType === "LOYALTY"
                        ? "bg-[#A16AD4]"
                        : row.campaignType === "COMBO"
                          ? "bg-[#6192AE]"
                          : "bg-[#4C8AFF]"
                        }`}
                    >
                      {row.campaignType || "-"}
                    </span>
                  </td>
                  <td className="px-4 black font-normal py-3">
                    {row.totalReferrals ?? "-"}
                  </td>
                  <td className="px-4 black font-normal py-3">
                    {row.conversionRate ?? "-"}
                  </td>
                  <td className="px-4 black font-normal py-3">
                    {row.totalRewardsGiven ?? "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-[5px] text-white text-xs ${row.status === 'ACTIVE' || row.status === 'active'
                        ? 'bg-green-500'
                        : row.status === 'PAUSED' || row.status === 'paused'
                          ? 'bg-yellow-500 text-black'
                          : row.status === 'ENDED' || row.status === 'ended'
                            ? 'bg-red-500'
                            : row.status === 'COMPLETED' || row.status === 'completed'
                              ? 'bg-blue-500'
                              : 'bg-gray-500'
                        }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 black font-normal py-3">
                    {row.startDate
                      ? new Date(row.startDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      })
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: "toggleActive",
                            label: row.isActive
                              ? "Pause Campaign"
                              : "Activate Campaign",
                            onClick: () => {
                              row.isActive ? handlePauseCampaignStatus(
                                row.id
                              ) : handleToggleCampaignStatus(
                                row.id,
                                row.isActive
                              )
                            },
                            disabled: activateLoading,
                          },
                          {
                            key: "edit",
                            label: "Edit Campaign",
                            onClick: () =>
                              router.push(
                                `/business/campaigns/create/new?type=${row.campaignType.toLowerCase()}&id=${row.id}&mode=edit`
                              ),
                            disabled: row.status === 'ENDED' || row.status === 'COMPLETED' || row.status === 'ended' || row.status === 'completed',
                          },
                          {
                            key: "view",
                            label: "View Campaign",
                            onClick: () =>
                              router.push(`/business/campaigns/${row.id}`),
                          },
                          {
                            key: "end",
                            label: "End Campaign",
                            onClick: () => handleEndCampaign(row.id),
                            disabled: endLoading || row.status === 'ENDED' || row.status === 'ended',
                          },
                          // { key: "settings", label: "Campaign Settings" },
                          // { key: "payouts", label: "View Payouts" },
                          // { key: "download", label: "Download Report" },
                          {
                            key: "reward",
                            label: "Add Reward",
                            onClick: () =>
                              handleAddReward(row.campaignType, row.id),
                          },
                          {
                            key: "delete",
                            label: "Delete Campaign",
                            onClick: () => handleDeleteCampaign(row.id),
                            disabled: deleteLoading,
                            danger: true,
                          },
                        ],
                      }}
                      trigger={["click"]}
                    >
                      <Button type="text">
                        <MoreOutlined />
                      </Button>
                    </Dropdown>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700">No campaigns yet</h3>
                      <p className="text-sm text-gray-500">Create your first campaign to get started</p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CampaignsTable;
