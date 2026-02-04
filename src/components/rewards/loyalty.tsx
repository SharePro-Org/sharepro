import React, { useState, useRef, useEffect } from "react";
import { CustomSelect } from "@/components/ui/custom-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "antd";
import { BriefcaseIcon, ClockIcon, CurrencyIcon } from "lucide-react";
import { Country } from "country-state-city";
import Tiers from "./Tiers";
import { useMutation, useQuery } from "@apollo/client/react";

import { CREATE_LOYALTY_REWARD, UPDATE_LOYALTY_REWARD } from "@/apollo/mutations/campaigns";
import { GET_CAMPAIGN } from "@/apollo/queries/campaigns";
import { message } from "antd";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { useRouter } from "next/navigation";
import ShareModal from "../ShareModal";
import { userAtom } from "@/store/User";
import { useAtom } from "jotai";

const emptyTier = { name: "", pointsRequired: "", benefits: "" };

const LoyaltyRewards = ({ id, mode }: { id: string | null; mode?: string | null }) => {
  const [isEditMode, setIsEditMode] = useState(mode === "edit");
  const [rewardId, setRewardId] = useState<string | null>(null);
  const [tiers, setTiers] = useState([{ ...emptyTier }]);
  const [success, setSuccess] = useState(false);
  const [campaignData, setCampaignData] = useState<any>(null);
  const router = useRouter();
  const [shareOpen, setShareOpen] = useState(false);
  const [user] = useAtom(userAtom);
  const [businessId, setBusinessId] = useState<string>("");

  useEffect(() => {
    if (user?.businessId) {
      setBusinessId(user.businessId);
    }
  }, [user]);

  const handleTierChange = (index: number, field: string, value: string) => {
    setTiers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddTier = () => {
    setTiers((prev) => [...prev, { ...emptyTier }]);
  };

  const handleRemoveTier = (index: number) => {
    setTiers((prev) => prev.filter((_, i) => i !== index));
  };
  const [businessType, setBusinessType] = useState("");
  const [triggerAmount, setTriggerAmount] = useState("");
  const [triggerPurchases, setTriggerPurchases] = useState("purchases");
  const [pointsAwarded, setPointsAwarded] = useState("");
  const [currency, setCurrency] = useState("NGN");
  const [rewardType, setRewardType] = useState("");
  const [pointsRequired, setPointsRequired] = useState("");
  const [rewardValue, setRewardValue] = useState("");
  const [redemptionChannel, setRedemptionChannel] = useState("");
  const [validityPeriod, setValidityPeriod] = useState("");
  const businessTypes = [
    { label: "Make a Purchase", value: "purchase" },
    // { label: "Leave a Review", value: "review" },
  ];

  const redemptionTypes = [
    // { label: "Wallet", value: "wallet" },
    // { label: "Checkout", value: "checkout" },
    { label: "Manual claim", value: "manual-claim" },
    { label: "Voucher", value: "voucher" },
  ];

  const rewardTypes = [
    { label: "Discount", value: "discount" },
    { label: "Airtime", value: "airtime" },
    { label: "Cashback", value: "cashback" },
  ];

  const currencyOptions = Country.getAllCountries();

  type CampaignQueryResponse = {
    campaign?: {
      id: string;
      name: string;
      campaignType?: string;
      referralLink?: string;
      loyaltyRewards?: Array<{
        id: string;
        earnRewardAction?: string;
        earnRewardAmount?: string;
        earnRewardPoints?: number;
        currency?: string;
        redeemRewardAction?: string;
        redeemRewardValue?: string;
        redeemRewardPointRequired?: number;
        redeemRewardChannels?: string[];
        redeemValidityPeriod?: number;
        loyaltyPoints?: number;
        loyaltyName?: string;
        loyaltyTierBenefits?: string;
      }>;
    };
  };

  // Fetch campaign data - always fetch if ID exists to check for existing rewards
  const { data: campaignDataQuery, loading: loadingCampaign } = useQuery<CampaignQueryResponse>(GET_CAMPAIGN, {
    variables: { id, businessId },
    skip: !id || !businessId,
  });

  // Pre-populate form fields if rewards exist (auto-detect edit mode)
  useEffect(() => {
    if (campaignDataQuery?.campaign?.loyaltyRewards?.[0]) {
      const reward = campaignDataQuery.campaign.loyaltyRewards[0];

      // Automatically switch to edit mode if rewards exist
      if (!isEditMode) {
        setIsEditMode(true);
      }

      setRewardId(reward.id);
      setBusinessType(reward.earnRewardAction || "");
      setTriggerAmount(reward.earnRewardAmount || "");
      setPointsAwarded(reward.earnRewardPoints?.toString() || "");
      setCurrency(reward.currency || "NGN");
      setRewardType(reward.redeemRewardAction || "");
      setPointsRequired(reward.redeemRewardPointRequired?.toString() || "");
      setRewardValue(reward.redeemRewardValue || "");

      // Parse redeemRewardChannels from JSON string to array
      try {
        const channels = typeof reward.redeemRewardChannels === 'string'
          ? JSON.parse(reward.redeemRewardChannels)
          : reward.redeemRewardChannels;
        setRedemptionChannel(Array.isArray(channels) && channels.length > 0 ? channels[0] : "");
      } catch (e) {
        console.error("Error parsing redemption channels:", e);
        setRedemptionChannel("");
      }

      setValidityPeriod(reward.redeemValidityPeriod?.toString() || "");

      // Parse tier data
      if (reward.loyaltyTierBenefits) {
        try {
          const tierData = JSON.parse(reward.loyaltyTierBenefits);
          // Check if tierData is an array (new format) or object (old format)
          if (Array.isArray(tierData) && tierData.length > 0) {
            setTiers(tierData);
          } else {
            // Fallback for old format
            setTiers([{
              name: reward.loyaltyName || "",
              pointsRequired: reward.loyaltyPoints?.toString() || "",
              benefits: tierData.benefits || ""
            }]);
          }
        } catch (e) {
          console.error("Error parsing tier data:", e);
        }
      }
    }
  }, [campaignDataQuery]);

  const [createLoyaltyReward, { loading }] = useMutation(
    CREATE_LOYALTY_REWARD,
    {
      onError: (error) => {
        console.log(error);
      },
    }
  );

  type UpdateLoyaltyRewardResult = {
    updateLoyaltyReward?: {
      success: boolean;
      message?: string;
      campaign?: any;
    };
  };

  const [updateLoyaltyReward, { loading: updateLoading }] = useMutation<UpdateLoyaltyRewardResult>(
    UPDATE_LOYALTY_REWARD,
    {
      onCompleted: (data) => {
        if (data?.updateLoyaltyReward?.success) {
          setCampaignData(data.updateLoyaltyReward.campaign);
          setSuccess(true);
        } else {
          message.error(data?.updateLoyaltyReward?.message || "Failed to update loyalty reward");
        }
      },
      onError: (error) => {
        message.error(error.message || "An error occurred while updating loyalty reward");
      },
    }
  );

  type CreateCampaignRewardResult = {
    createCampaignReward?: {
      success: boolean;
      message?: string;
      campaign?: any;
    };
  };

  const handleSubmit = async () => {
    const campaignId = id;
    const loyaltyCampaignData = {
      earnRewardAction: businessType,
      earnRewardAmount: triggerAmount,
      earnRewardPoints: Number(pointsAwarded),
      currency,
      redeemRewardAction: rewardType,
      redeemRewardValue: rewardValue,
      redeemRewardPointRequired: Number(pointsRequired),
      redeemRewardChannels: [redemptionChannel],
      redeemValidityPeriod: Number(validityPeriod),
      loyaltyPoints: Number(pointsAwarded),
      loyaltyName: tiers[0]?.name || "Loyalty Tier",
      loyaltyTierBenefits: JSON.stringify(tiers),
    };
    try {
      if (isEditMode && rewardId) {
        // Update existing reward
        await updateLoyaltyReward({
          variables: {
            rewardId,
            input: loyaltyCampaignData,
          },
        });
      } else {
        // Create new reward
        const { data } = await createLoyaltyReward({
          variables: {
            input: {
              campaignId,
              loyaltyCampaignData,
            },
          },
        }) as { data: CreateCampaignRewardResult };
        if (data?.createCampaignReward?.success) {
          setCampaignData(data.createCampaignReward.campaign);
          setSuccess(true);
        } else {
          message.error(
            data?.createCampaignReward?.message ||
              "Failed to create loyalty reward."
          );
        }
      }
    } catch (e: any) {
      message.error(
        e.message || `An error occurred while ${isEditMode ? "updating" : "creating"} loyalty reward.`
      );
    }
  };

  return (
    <div>
      <div className="my-6 md:flex gap-8">
        <div className="md:w-[70%]">
          <p className="text-base text-primary font-semibold">Earning Rules</p>
          <p className="text-sm text-primary">
            Define how customers earn points.
          </p>

          <div>
            <Label htmlFor="action" className="block mb-2 text-sm">
              Action
            </Label>

            <div className="flex gap-3">
              {/* <span className="my-auto w-20 text-sm"></span> */}
              <CustomSelect
                options={businessTypes}
                value={businessType}
                onChange={setBusinessType}
                prefix="If User"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="tirgger" className="block mb-2 text-sm">
              Trigger Condition
            </Label>

            <div className="flex gap-3">
              <Select
                style={{ minWidth: 100, height: 55, borderRadius: 30 }}
                options={currencyOptions.map((opt) => ({
                  value: opt.currency,
                  label: (
                    <span className="flex items-center gap-2">
                      <img
                        src={`https://flagcdn.com/24x18/${opt.isoCode.toLowerCase()}.png`}
                        alt={opt.name + " flag"}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span>{opt.currency}</span>
                    </span>
                  ),
                }))}
                value={currency}
                onChange={setCurrency}
                placeholder="Currency"
              />
              <Input
                id="trigger"
                placeholder="Amount"
                value={triggerAmount}
                onChange={(e) => setTriggerAmount(e.target.value)}
                className="w-full"
                prefix="Up to"
              />

              <Input
                id="trigger"
                placeholder="Purchases"
                value={triggerPurchases}
                onChange={(e) => setTriggerPurchases(e.target.value)}
                className="w-full"
                prefix="In"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="points" className="block mb-2 text-sm">
              Equivalent (Points Awarded)
            </Label>
            <Input
              id="points"
              placeholder="10 points"
              value={pointsAwarded}
              onChange={(e) => setPointsAwarded(e.target.value)}
              className="w-full"
              prefix="The user gains"
            />
          </div>
        </div>

        <div className="md:mt-auto mt-4 md:w-[30%] p-3 border border-[#CCCCCC] rounded-md">
          <div className="mb-4">
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <span className="w-4 h-4 flex items-center justify-center rounded-full bg-primary text-white font-bold"></span>
                  <span className="h-12 w-[2px] bg-primary/30"></span>
                </div>
                <div className="flex w-full gap-3">
                  <span className="font-medium text-sm">If user</span>
                  {businessType ? (
                    <button className="flex gap-2 px-2 py-1 text-xs rounded-sm bg-[#FFFAB2]">
                      <BriefcaseIcon size={16} className="text-[#D4A207]" />
                      <span>
                        {
                          businessTypes.find((b) => b.value === businessType)
                            ?.label
                        }
                      </span>
                    </button>
                  ) : null}
                </div>
              </div>
              <div className="flex items-start gap-3 -mt-6">
                <div className="flex flex-col items-center">
                  <span className="w-4 h-4 flex items-center justify-center rounded-full bg-primary text-white font-bold"></span>
                  <span className="h-12 w-[2px] bg-primary/30"></span>
                </div>
                <div className="flex w-full gap-3">
                  <span className="font-medium text-sm">Up to</span>
                  <div className="flex gap-2">
                    {triggerAmount ? (
                      <button className="flex gap-2 px-2 py-1 text-xs rounded-sm bg-[#CBFBDC]">
                        <CurrencyIcon size={16} className="text-[#16A34A]" />
                        <span>{triggerAmount}</span>
                      </button>
                    ) : null}

                    {triggerPurchases ? (
                      <button className="flex gap-2 px-2 py-1 text-xs rounded-sm bg-[#FFFAB2]">
                        <BriefcaseIcon size={16} className="text-[#D4A207]" />
                        <span>{triggerPurchases}</span>
                      </button>
                    ) : null}
                  </div>
                  {/* {triggerPurchases ? `${triggerPurchases}` : ""} */}
                </div>
              </div>
              <div className="flex items-start gap-3 -mt-6">
                <div className="flex flex-col items-center">
                  <span className="w-4 h-4 flex items-center justify-center rounded-full bg-primary text-white font-bold"></span>
                </div>
                <div className="flex w-full gap-3">
                  <span className="font-medium text-sm">Then user gains</span>
                  {pointsAwarded ? (
                    <button className="flex gap-2 px-2 py-1 text-xs rounded-sm bg-[#FFE0D6]">
                      <CurrencyIcon size={16} className="text-[#F05A28]" />
                      <span>{pointsAwarded}</span>
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="my-6 md:flex gap-8">
        <div className="md:w-[70%]">
          <p className="text-base text-primary font-semibold">
            Redemption Rules
          </p>
          <p className="text-sm text-primary">
            Define how customers use their points and what they get.
          </p>

          <div>
            <Label htmlFor="reward_type" className="block mb-2 text-sm">
              Reward Type
            </Label>

            <div className="flex gap-3">
              {/* <span className="my-auto w-20 text-sm"></span> */}
              <CustomSelect
                options={rewardTypes}
                value={rewardType}
                onChange={setRewardType}
                placeholder="e.g. Discount, airtime, cashback"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 w-full gap-3">
            <div>
              <Label htmlFor="points" className="block mb-2 text-sm">
                Points Required
              </Label>

              <div className="flex gap-3">
                <Input
                  id="points"
                  placeholder="100 points"
                  className="w-full"
                  value={pointsRequired}
                  onChange={(e) => setPointsRequired(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="points" className="block mb-2 text-sm">
                Reward Value
              </Label>
              <div className="flex">
                <Select
                  style={{ minWidth: 100, height: 55, borderRadius: 30 }}
                  options={currencyOptions.map((opt) => ({
                    value: opt.currency,
                    label: (
                      <span className="flex items-center gap-2">
                        <img
                          src={`https://flagcdn.com/24x18/${opt.isoCode.toLowerCase()}.png`}
                          alt={opt.name + " flag"}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span>{opt.currency}</span>
                      </span>
                    ),
                  }))}
                  value={currency}
                  onChange={setCurrency}
                  placeholder="Currency"
                />
                <Input
                  id="trigger"
                  placeholder="1000"
                  value={rewardValue}
                  onChange={(e) => setRewardValue(e.target.value)}
                  className="w-full ml-3"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 w-full gap-3">
            <div>
              <Label htmlFor="reward_type" className="block mb-2 text-sm">
                Redemption Channel
              </Label>

              <div className="flex gap-3">
                {/* <span className="my-auto w-20 text-sm"></span> */}
                <CustomSelect
                  options={redemptionTypes}
                  value={redemptionChannel}
                  onChange={setRedemptionChannel}
                  placeholder="checkout"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="validity" className="block mb-2 text-sm">
                Validity Period
              </Label>

              <div className="flex gap-3">
                <Input
                  id="validity"
                  placeholder="30 Days"
                  className="w-full"
                  value={validityPeriod}
                  onChange={(e) => setValidityPeriod(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="md:mt-auto mt-4 md:w-[30%] p-3 border border-[#CCCCCC] rounded-md">
          <div className="mb-4">
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <span className="w-4 h-4 flex items-center justify-center rounded-full bg-primary text-white font-bold"></span>
                  <span className="h-12 w-[2px] bg-primary/30"></span>
                </div>
                <div className="flex w-full gap-3">
                  <span className="font-medium text-sm">User gains</span>
                  {rewardType ? (
                    <button className="flex gap-2 px-2 py-1 text-xs rounded-sm bg-[#FFFAB2]">
                      <BriefcaseIcon size={16} className="text-[#D4A207]" />
                      <span>
                        {rewardTypes.find((b) => b.value === rewardType)?.label}
                      </span>
                    </button>
                  ) : null}
                </div>
              </div>
              <div className="flex items-start gap-3 -mt-6">
                <div className="flex flex-col items-center">
                  <span className="w-4 h-4 flex items-center justify-center rounded-full bg-primary text-white font-bold"></span>
                  <span className="h-12 w-[2px] bg-primary/30"></span>
                </div>
                <div className="flex w-full gap-3">
                  <span className="font-medium text-sm">Worth</span>
                  <div className="flex gap-2">
                    {rewardValue ? (
                      <button className="flex gap-2 px-2 py-1 text-xs rounded-sm bg-[#CBFBDC]">
                        <CurrencyIcon size={16} className="text-[#16A34A]" />
                        <span>{rewardValue}</span>
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 -mt-6">
                <div className="flex flex-col items-center">
                  <span className="w-4 h-4 flex items-center justify-center rounded-full bg-primary text-white font-bold"></span>
                  <span className="h-12 w-[2px] bg-primary/30"></span>
                </div>
                <div className="flex w-full gap-3">
                  <span className="font-medium text-sm">With</span>
                  <div className="flex gap-2 w-[80%]">
                    {pointsRequired ? (
                      <button className="flex gap-2 px-2 py-1 text-xs rounded-sm bg-[#FFE0D6]">
                        <CurrencyIcon size={16} className="text-[#F05A28]" />
                        <span>{pointsRequired}</span>
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 -mt-6">
                <div className="flex flex-col items-center">
                  <span className="w-4 h-4 flex items-center justify-center rounded-full bg-primary text-white font-bold"></span>
                  <span className="h-12 w-[2px] bg-primary/30"></span>
                </div>
                <div className="flex w-full gap-3">
                  <span className="font-medium text-sm">Redeemed at</span>
                  <div className="flex gap-2">
                    {redemptionChannel ? (
                      <button className="flex gap-2 px-2 py-1 text-xs rounded-sm bg-[#FFE0D6]">
                        <CurrencyIcon size={16} className="text-[#F05A28]" />
                        <span>{redemptionChannel}</span>
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 -mt-6">
                <div className="flex flex-col items-center">
                  <span className="w-4 h-4 flex items-center justify-center rounded-full bg-primary text-white font-bold"></span>
                </div>
                <div className="flex gap-3 w-full">
                  <span className="font-medium text-sm">Valid for</span>
                  {validityPeriod ? (
                    <button className="flex gap-2 px-2 py-1 text-xs rounded-sm bg-[#DBE0FF]">
                      <ClockIcon size={16} className="text-[#4C8AFF]" />
                      <span>{validityPeriod}</span>
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section>
        <p className="text-base text-primary my-4 font-semibold">
          Loyalty Tiers (Optional)
        </p>

        <Tiers
          handleTierChange={handleTierChange}
          tiers={tiers}
          handleAddTier={handleAddTier}
          handleRemoveTier={handleRemoveTier}
        />
      </section>
      <button
        className="mt-6 px-6 py-2 bg-primary text-white rounded hover:bg-primary/90"
        onClick={handleSubmit}
        disabled={loading || updateLoading || loadingCampaign}
        type="button"
      >
        {loading || updateLoading
          ? isEditMode
            ? "Updating..."
            : "Creating..."
          : isEditMode
          ? "Update Loyalty Reward"
          : "Create Loyalty Reward"}
      </button>

      <Dialog
        open={success}
        onOpenChange={() => router.push(`/business/campaigns`)}
      >
        <DialogContent className="max-w-md w-full flex flex-col items-center justify-center gap-6 py-12">
          <VisuallyHidden>
            <DialogTitle>
              Loyalty Program {isEditMode ? "Updated" : "Created"}
            </DialogTitle>
          </VisuallyHidden>
          <VisuallyHidden>
            <DialogDescription>
              Your loyalty program has been successfully {isEditMode ? "updated" : "created"}. Review the details and proceed to share your campaign.
            </DialogDescription>
          </VisuallyHidden>
          <div className="bg-[#009B541A] p-4 rounded-md">
            <div className="text-body text-base mb-2">
              <span role="img" aria-label="trophy" className="mr-2">
                🏆
              </span>
              You've {isEditMode ? "updated" : "created"} a Loyalty Program where:
            </div>
            <div>
              <ul className="check-list">
                <li>
                  Customers earn {pointsAwarded || "X"} points for every{" "}
                  {currency}
                  {triggerAmount || "Y"} spent
                </li>
                <li>
                  Points can be redeemed for {currency}
                  {rewardValue || "Z"} ({pointsRequired || "W"} pts)
                </li>
                {tiers.length >= 1 && (
                  <li>
                    Users move from {tiers[0]?.name || "First Tier"} to{" "}
                    {tiers[1]?.name || "Second Tier"} at{" "}
                    {tiers[1]?.pointsRequired || "Threshold"} points
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="">
            <button
              className="w-full bg-primary p-4 text-white mb-3 rounded-sm"
              onClick={() => {
                setSuccess(false);
                setShareOpen(true);
              }}
            >
              Proceed
            </button>

            <button
              className="w-full bg-secondary p-4 text-white rounded-sm"
              onClick={() => router.push(`/business/campaigns`)}
            >
              Go back to Campaigns
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <ShareModal
        open={shareOpen}
        onClose={() => router.push(`/business/campaigns`)}
        campaignUrl={campaignDataQuery?.campaign?.referralLink || campaignData?.referralLink || ""}
        campaignId={campaignDataQuery?.campaign?.id || campaignData?.id || id || ""}
        campaignName={campaignDataQuery?.campaign?.name || campaignData?.name || ""}
        campaignType={campaignDataQuery?.campaign?.campaignType || campaignData?.type || ""}
      />
    </div>
  );
};

export default LoyaltyRewards;
