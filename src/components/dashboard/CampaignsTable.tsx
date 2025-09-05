import React, { useState, useEffect } from "react";
import { Dropdown, Button, message } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_BUSINESS_CAMPAIGNS } from "@/apollo/queries/campaigns";
import { ACTIVATE_CAMPAIGN } from "@/apollo/mutations/campaigns";
import { useAtom } from "jotai";
import { userAtom } from "@/store/User";
import { useRouter } from "next/navigation";

const CampaignsTable = ({ type, num }: { type?: string; num?: Number }) => {
  const [user] = useAtom(userAtom);
  const [businessId, setBusinessId] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (user?.businessId) {
      setBusinessId(user.businessId);
    }
  }, [user]);

  const { data, loading, error } = useQuery(GET_BUSINESS_CAMPAIGNS, {
    variables: { businessId },
    skip: !businessId,
  });

  const [activateCampaign, { loading: activateLoading }] = useMutation(
    ACTIVATE_CAMPAIGN,
    {
      refetchQueries: [
        { query: GET_BUSINESS_CAMPAIGNS, variables: { businessId } },
      ],
      onCompleted: (data) => {
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
            <th className="px-4 py-3 font-medium text-left">Reward</th>
            <th className="px-4 py-3 font-medium text-left">User</th>
            <th className="px-4 py-3 font-medium text-left">Status</th>
            <th className="px-4 py-3 font-medium text-left">Date</th>
            <th className="px-4 py-3 font-medium text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4].map((campaign: any) => (
            <tr
              key={campaign}
              className="border-b border-[#E2E8F0] py-2 last:border-0"
            >
              <td className="px-4 font-black font-normal py-3">Pro Gain</td>
              <td className="px-4 py-3">Referral reward</td>
              <td className="px-4 py-3">10,000</td>
              <td className="px-4 py-3">Airtime</td>
              <td className="px-4 py-3">John Doe</td>
              <td className="px-4 py-3">
                <span className="inline-block px-4 py-1 rounded-[5px] text-white text-xs bg-green-500">
                  Paid
                </span>
              </td>
              <td className="px-4 py-3">2020-10-10</td>
              <td className="px-4 py-3"></td>
            </tr>
          ))}
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
            {(num
              ? data?.businessCampaigns.slice(0, num) || []
              : data?.businessCampaigns || []
            ).map((row: any, i: number) => (
              <tr
                key={row.id || i}
                className="border-b border-[#E2E8F0] py-2 last:border-0"
              >
                <td className="px-4 font-black font-normal py-3">{row.name}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-4 py-1 rounded-[5px] text-white text-xs ${
                      row.campaignType === "LOYALTY"
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
                    className={`inline-block px-3 py-1 rounded-[5px] text-white text-xs bg-green-500`}
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
                          onClick: () =>
                            handleToggleCampaignStatus(
                              row.id,
                              row.isActive
                            ),
                          disabled: activateLoading,
                        },
                        { key: "edit", label: "Edit Campaign" },
                        {
                          key: "view",
                          label: "View Campaign",
                          onClick: () =>
                            router.push(`/business/campaigns/${row.id}`),
                        },
                        { key: "end", label: "End Campaign" },
                        { key: "settings", label: "Campaign Settings" },
                        { key: "payouts", label: "Vew Payouts" },
                        { key: "download", label: "Download Report" },
                        {
                          key: "reward",
                          label: "Add Reward",
                          onClick: () =>
                            handleAddReward(row.campaignType, row.id),
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
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CampaignsTable;
