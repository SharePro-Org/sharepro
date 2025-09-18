import React, { useState } from "react";
import Tiers from "./Tiers";
import { useRouter } from "next/navigation";
import { CustomSelect } from "@/components/ui/custom-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "antd";
import { Country } from "country-state-city";
import { BriefcaseIcon, Clock, ClockIcon, CurrencyIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ShareModal from "../ShareModal";
import { CREATE_COMBO_REWARD } from "@/apollo/mutations/campaigns";
import { useMutation } from "@apollo/client/react";

import { message } from "antd";

const emptyTier = { name: "", pointsRequired: "", benefits: "" };

const ComboRewards = ({ id }: { id: string | null }) => {
  const [tiers, setTiers] = useState([{ ...emptyTier }]);
  const [success, setSuccess] = useState(false);
  const [campaignData, setCampaignData] = useState<any>(null);
  const router = useRouter();
  const [shareOpen, setShareOpen] = useState(false);

  const [businessType, setBusinessType] = useState<string>("");
  const [triggerAmount, setTriggerAmount] = useState<string>("");
  const [triggerPurchases, setTriggerPurchases] = useState<string>("");
  const [pointsAwarded, setPointsAwarded] = useState<string>("");

  const [rewardType, setRewardType] = useState<string>("");
  const [pointsRequired, setPointsRequired] = useState<string>("");
  const [rewardValue, setRewardValue] = useState<string>("");
  const [currency, setCurrency] = useState<string>("NGN");
  const [redemptionChannel, setRedemptionChannel] = useState<string>("");
  const [validityPeriod, setValidityPeriod] = useState<string>("");

  const [referrerAction, setReferrerAction] = useState<string>("");
  const [referrerRewardType, setReferrerRewardType] = useState<string>("");
  const [referrerRewardValue, setReferrerRewardValue] = useState<string>("");

  const [referralRewardLimit, setReferralRewardLimit] = useState<string>("");
  const [referralRewardLimitType, setReferralRewardLimitType] =
    useState<string>("");

  const [refereeAction, setRefereeAction] = useState<string>("");
  const [refereeRewardType, setRefereeRewardType] = useState<string>("");
  const [refereeRewardValue, setRefereeRewardValue] = useState<string>("");
  const [refereeRewardChannels, setRefereeRewardChannels] =
    useState<string>("");
  const [refereeValidityPeriod, setRefereeValidityPeriod] =
    useState<string>("");

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

  const loyaltyBusinessTypes = [
    { label: "Make a Purchase", value: "purchase" },
    { label: "Leave a Review", value: "review" },
  ];

  const businessTypes = [
    { label: "Refers a friend", value: "refers" },
    { label: "Shares on social", value: "shares" },
  ];

  const RefreeBusinessTypes = [
    { label: "Signs up", value: "sign-up" },
    { label: "Makes a purchase", value: "purchase" },
  ];

  const redemptionTypes = [
    { label: "Wallet", value: "wallet" },
    { label: "Checkout", value: "checkout" },
    { label: "Manual claim", value: "manual-claim" },
    { label: "Voucher", value: "voucher" },
  ];

  const rewardTypes = [
    { label: "Discount", value: "discount" },
    { label: "Airtime", value: "airtime" },
    { label: "Cashback", value: "cashback" },
  ];

  const limitTypes = [
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
    { label: "Quarterly", value: "quarterly" },
    { label: "Yearly", value: "yearly" },
  ];

  const currencyOptions = Country.getAllCountries();

  const [createComboReward, { loading }] = useMutation(CREATE_COMBO_REWARD, {
    onError: (error) => {
      console.log(error);
      // setSuccessMsg("");
    },
  });

  type CreateCampaignRewardResponse = {
    createCampaignReward?: {
      success: boolean;
      message?: string;
      campaign?: any;
    };
  };

  const handleSubmit = async () => {
    const tier = tiers[0]; // You may want to support multiple tiers

    try {
      const { data } = await createComboReward({
        variables: {
          input: {
            campaignId: id,
            comboCampaignData: {
              // Referral component
              referralRewardAction: referrerAction || "",
              referralRewardAmount: referrerRewardValue,
              referralRewardLimit: parseInt(referralRewardLimit, 10),
              referralRewardType: referrerRewardType || "",
              referralRewardLimitType: referralRewardLimitType || "",
              referreeRewardAction: refereeAction || "",
              referreeRewardValue: refereeRewardValue,
              referreeRewardType: refereeRewardType || "",
              referreeRewardChannels: refereeRewardChannels
                ? refereeRewardChannels.split(",").map((ch) => ch.trim())
                : [],
              referreeValidityPeriod: parseInt(refereeValidityPeriod, 10),
              referralPoints: 50,
              referralName: "Combo Referrer",
              referralTierBenefits: JSON.stringify({ bonus_multiplier: 1.5 }),

              // Loyalty component
              earnRewardAction: businessType || "",
              earnRewardAmount: triggerAmount,
              earnRewardPoints: parseInt(pointsAwarded, 10),
              currency: currency || "NGN",
              redeemRewardAction: rewardType || "",
              redeemRewardValue: rewardValue,
              redeemRewardPointRequired: parseInt(pointsRequired, 10),
              redeemRewardChannels: redemptionChannel
                ? redemptionChannel.split(",").map((ch) => ch.trim())
                : [],
              redeemValidityPeriod: parseInt(validityPeriod, 10),
              loyaltyPoints: 75,
              loyaltyName: tier.name || "Platinum Combo",
              loyaltyTierBenefits: JSON.stringify({ benefits: tier.benefits }),
            },
          },
        },
      });

      const response = data as CreateCampaignRewardResponse;

      if (response?.createCampaignReward?.success) {
        setCampaignData(response.createCampaignReward.campaign);
        setSuccess(true);
      } else {
        message.error(
          response?.createCampaignReward?.message ||
            "Failed to create loyalty reward."
        );
      }
    } catch (err) {
      console.error("🚨 Mutation error:", err);
    }
  };

  return (
    <div>
      <div className="my-6 md:flex gap-8">
        <div className="md:w-[70%]">
          <p className="text-base text-primary font-semibold">
            Earning Rules for Loyalty Points
          </p>
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
                options={loyaltyBusinessTypes}
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
            Redemption Rules for Loyalty Points
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

      <div className="my-6 md:flex gap-8">
        <div className="md:w-[70%]">
          <p className="text-base text-primary font-semibold">
            Earning Rules For Referrer
          </p>
          <p className="text-sm text-primary">
            Define how customers earn points.
          </p>

          <div>
            <Label htmlFor="action" className="block mb-2 text-sm">
              Action
            </Label>

            <div className="flex gap-3">
              <CustomSelect
                placeholder="e.g. signs up, makes a purchase"
                options={businessTypes}
                value={referrerAction}
                onChange={setReferrerAction}
                prefix="If Referrer"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="action" className="block mb-2 text-sm">
              Reward type
            </Label>

            <div className="flex gap-3">
              <CustomSelect
                placeholder="e.g. Discount, airtime, cashback"
                options={rewardTypes}
                value={referrerRewardType}
                onChange={setReferrerRewardType}
                prefix="Then referrer gets"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="points" className="block mb-2 text-sm">
              Reward Value (Per "Successful referal")
            </Label>
            <div className="flex">
              <Select
                style={{ minWidth: 120, height: 55, borderRadius: 30 }}
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
                value={referrerRewardValue}
                onChange={(e) => setReferrerRewardValue(e.target.value)}
                className="w-full ml-3"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="validity" className="block mb-2 text-sm">
              Limit (optional)
            </Label>
            <div className="grid grid-cols-2 w-full gap-3">
              <div className="flex gap-3">
                <Input
                  id="validity"
                  placeholder="Number of referrals per user"
                  className="w-full"
                  value={referralRewardLimit}
                  onChange={(e) => setReferralRewardLimit(e.target.value)}
                />
              </div>
              <div>
                <CustomSelect
                  options={limitTypes}
                  value={referralRewardLimitType}
                  onChange={setReferralRewardLimitType}
                  placeholder="Daily"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="md:mt-auto mt-4 md:w-[30%] px-3 py-10 border border-[#CCCCCC] rounded-md">
          <div className="mb-4">
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <span className="w-4 h-4 flex items-center justify-center rounded-full bg-primary text-white font-bold"></span>
                  <span className="h-12 w-[2px] bg-primary/30"></span>
                </div>
                <div className="flex w-full gap-3">
                  <span className="font-medium text-sm">If Referee</span>
                  {referrerAction ? (
                    <button className="flex gap-2 px-2 py-1 text-xs rounded-sm bg-[#FFFAB2]">
                      <BriefcaseIcon size={16} className="text-[#D4A207]" />
                      <span>
                        {
                          businessTypes.find((b) => b.value === referrerAction)
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
                  <span className="font-medium text-sm">
                    Then Referrer gets
                  </span>
                  <div className="flex gap-2">
                    {referrerRewardType ? (
                      <button className="flex gap-2 px-2 py-1 text-xs rounded-sm bg-[#CBFBDC]">
                        <CurrencyIcon size={16} className="text-[#16A34A]" />
                        <span>{referrerRewardType}</span>
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 -mt-6">
                <div className="flex flex-col items-center">
                  <span className="w-4 h-4 flex items-center justify-center rounded-full bg-primary text-white font-bold"></span>
                </div>
                <div className="flex w-full gap-3">
                  <span className="font-medium text-sm">Up to</span>
                  {referrerRewardValue ? (
                    <button className="flex gap-2 px-2 py-1 text-xs rounded-sm bg-[#FFE0D6]">
                      <CurrencyIcon size={16} className="text-[#F05A28]" />
                      <span>{referrerRewardValue}</span>
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
            Earning Rules For Referee
          </p>
          <p className="text-sm text-primary">
            Define how customers earn points.
          </p>

          <div>
            <Label htmlFor="action" className="block mb-2 text-sm">
              Action
            </Label>

            <div className="flex gap-3">
              <CustomSelect
                placeholder="e.g. signs up, makes a purchase"
                options={RefreeBusinessTypes}
                value={refereeAction}
                onChange={setRefereeAction}
                prefix="If Referee"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="action" className="block mb-2 text-sm">
              Reward type
            </Label>

            <div className="flex gap-3">
              <CustomSelect
                placeholder="e.g. Discount, airtime, cashback"
                options={rewardTypes}
                value={refereeRewardType}
                onChange={setRefereeRewardType}
                prefix="Then referee gets"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="points" className="block mb-2 text-sm">
              Reward Value
            </Label>
            <div className="flex">
              <Select
                style={{ minWidth: 120, height: 55, borderRadius: 30 }}
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
                value={refereeRewardValue}
                onChange={(e) => setRefereeRewardValue(e.target.value)}
                className="w-full ml-3"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 w-full gap-3">
            <div>
              <Label htmlFor="validity" className="block mb-2 text-sm">
                Redemption Channel
              </Label>
              <CustomSelect
                options={redemptionTypes}
                value={refereeRewardChannels}
                onChange={(value) => setRefereeRewardChannels(value)}
                placeholder="Checkout"
              />
            </div>
            <div>
              <Label htmlFor="validity" className="block mb-2 text-sm">
                Validity Period
              </Label>
              <Input
                id="validity"
                placeholder="Number of days"
                className="w-full"
                value={refereeValidityPeriod}
                onChange={(e) => setRefereeValidityPeriod(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="md:mt-auto mt-4 md:w-[30%] px-3 py-10 border border-[#CCCCCC] rounded-md">
          <div className="mb-4">
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <span className="w-4 h-4 flex items-center justify-center rounded-full bg-primary text-white font-bold"></span>
                  <span className="h-12 w-[2px] bg-primary/30"></span>
                </div>
                <div className="flex w-full gap-3">
                  <span className="font-medium text-sm">If Referee</span>
                  {refereeAction ? (
                    <button className="flex gap-2 px-2 py-1 text-xs rounded-sm bg-[#FFFAB2]">
                      <BriefcaseIcon size={16} className="text-[#D4A207]" />
                      <span>
                        {
                          RefreeBusinessTypes.find(
                            (b) => b.value === refereeAction
                          )?.label
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
                  <span className="font-medium text-sm">Then Referee gets</span>
                  <div className="flex gap-2">
                    {refereeRewardType ? (
                      <button className="flex gap-2 px-2 py-1 text-xs rounded-sm bg-[#CBFBDC]">
                        <CurrencyIcon size={16} className="text-[#16A34A]" />
                        <span>{refereeRewardType}</span>
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
                  <span className="font-medium text-sm">Up to</span>
                  <div className="flex gap-2">
                    {refereeRewardValue ? (
                      <button className="flex gap-2 px-2 py-1 text-xs rounded-sm bg-[#CBFBDC]">
                        <CurrencyIcon size={16} className="text-[#16A34A]" />
                        <span>{refereeRewardValue}</span>
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
                    {refereeRewardChannels ? (
                      <button className="flex gap-2 px-2 py-1 text-xs rounded-sm bg-[#FFE0D6]">
                        <CurrencyIcon size={16} className="text-[#F05A28]" />
                        <span>{refereeRewardChannels}</span>
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 -mt-6">
                <div className="flex flex-col items-center">
                  <span className="w-4 h-4 flex items-center justify-center rounded-full bg-primary text-white font-bold"></span>
                </div>
                <div className="flex w-full gap-3">
                  <span className="font-medium text-sm">Valid for</span>
                  {refereeValidityPeriod ? (
                    <button className="flex gap-2 px-2 py-1 text-xs rounded-sm bg-[#DBE0FF]">
                      <Clock size={16} className="text-[#203BD7]" />
                      <span>{refereeValidityPeriod}</span>
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
          Referral/Loyalty Tiers (Optional)
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
        disabled={loading}
        type="button"
      >
        {loading ? "Creating..." : "Create Combo Reward"}
      </button>

      <Dialog
        open={success}
        onOpenChange={() => router.push(`/business/campaigns`)}
      >
        <DialogContent className="max-w-md w-full flex flex-col items-center justify-center gap-6 py-12">
          <div className="bg-[#009B541A] p-4 rounded-md">
            <div className="text-body text-base mb-2">
              <span role="img" aria-label="trophy" className="mr-2">
                🏆
              </span>
              You’ve created a Combo Program where:
            </div>
            <div>
              <ul className="check-list">
                <li>
                  Referrers earn {currency}
                  {referrerRewardValue || "X"} {referrerRewardType || "reward"}{" "}
                  for each successful referral
                </li>
                <li>
                  Referee's must {refereeAction || "sign up"} for a referral to
                  be successful
                </li>
                <li>
                  Referee's earn {currency}
                  {refereeRewardValue || "Y"} {refereeRewardType || "reward"}{" "}
                  after {refereeAction || "sign up"}
                </li>
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
        campaignUrl={campaignData?.referralLink || ""}
        campaignId={campaignData?.id || id || ""}
        campaignName={campaignData?.name || ""}
        campaignType={campaignData?.type || ""}
      />
    </div>
  );
};

export default ComboRewards;
