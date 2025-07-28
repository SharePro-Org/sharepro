import React, { useState } from "react";
import { CustomSelect } from "@/components/ui/custom-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "antd";
import { Country } from "country-state-city";
import { BriefcaseIcon, Clock, CurrencyIcon } from "lucide-react";
import { useMutation } from "@apollo/client";
import { CREATE_REFERRAL_REWARD } from "@/apollo/mutations/campaigns";
import { message } from "antd";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import ShareModal from "../ShareModal";
import Tiers from "./Tiers";

const emptyTier = { name: "", pointsRequired: "", benefits: "" };

const ReferralRewards = ({ id }: { id: string | null }) => {
  const currencyOptions = Country.getAllCountries();
  const [tiers, setTiers] = useState([{ ...emptyTier }]);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const [shareOpen, setShareOpen] = useState(false);

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

  // Referrer state
  const [referrerAction, setReferrerAction] = useState("");
  const [referrerRewardType, setReferrerRewardType] = useState("");
  const [referrerRewardValue, setReferrerRewardValue] = useState("");
  const [referralRewardLimit, setReferralRewardLimit] = useState("");
  const [referralRewardLimitType, setReferralRewardLimitType] = useState("daily");

  // Referee state
  const [refereeAction, setRefereeAction] = useState("");
  const [refereeRewardType, setRefereeRewardType] = useState("");
  const [refereeRewardValue, setRefereeRewardValue] = useState("");
  const [refereeRewardChannels, setRefereeRewardChannels] = useState<string>("");
  const [refereeValidityPeriod, setRefereeValidityPeriod] = useState("");

  // Common state
  const [currency, setCurrency] = useState("NGN");

  const [createReferralReward, { loading }] = useMutation(
    CREATE_REFERRAL_REWARD
  );

  const handleSubmit = async () => {
    const input = {
      campaignId: id,
      referralCampaignData: {
        referralRewardAction: referrerAction,
        referralRewardAmount: referrerRewardValue,
        referralRewardLimit: Number(referralRewardLimit),
        referralRewardType: referrerRewardType,
        referralRewardLimitType: referralRewardLimitType,
        referreeRewardAction: refereeAction,
        referreeRewardValue: refereeRewardValue,
        referreeRewardType: refereeRewardType,
        referreeRewardChannels: refereeRewardChannels,
        referreeValidityPeriod: Number(refereeValidityPeriod),
        loyaltyPoints: 0, // Default value
        loyaltyName: tiers[0]?.name || "",
        loyaltyTierBenefits: JSON.stringify({ benefits: tiers[0]?.benefits || "" }),
      },
    };
    try {
      const { data } = await createReferralReward({ variables: { input } });
      if (data?.createCampaignReward?.success) {
        setSuccess(true);
        // message.success("Referral reward created successfully!");
      } else {
        message.error(
          data?.createCampaignReward?.message ||
            "Failed to create referral reward."
        );
      }
    } catch (e: any) {
      message.error(
        e.message || "An error occurred while creating referral reward."
      );
    }
  };

  return (
    <div>
      <div className="my-6 md:flex gap-8">
        <div className="md:w-[70%]">
          <p className="text-base text-primary font-semibold">For Referrer</p>
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
          <p className="text-base text-primary font-semibold">For Referee</p>
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
                          RefreeBusinessTypes.find((b) => b.value === refereeAction)
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
                    Then Referee gets
                  </span>
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
                  <span className="font-medium text-sm">
                    Up to
                  </span>
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
                  <span className="font-medium text-sm">
                    Redeemed at
                  </span>
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
        disabled={loading}
        type="button"
      >
        {loading ? "Creating..." : "Create Referral Reward"}
      </button>

      <Dialog open={success}>
        <DialogContent className="max-w-md w-full flex flex-col items-center justify-center gap-6 py-12">
          <div className="bg-[#009B541A] p-4 rounded-md">
            <div className="text-body text-base mb-2">
              <span role="img" aria-label="trophy" className="mr-2">
                🏆
              </span>
              You've created a Referral Program where:
            </div>
            <div>
              <ul className="check-list">
                <li>
                  Referrers earn {currency}
                  {referrerRewardValue || "X"} {referrerRewardType || "reward"}{" "}
                  for each successful referral
                </li>
                <li>
                  Referee's must {refereeAction || "sign up"} for a
                  referral to be successful
                </li>
                <li>
                  Referee's earn {currency}
                  {refereeRewardValue || "Y"} {refereeRewardType || "reward"}{" "}
                  after {refereeAction || "sign up"}
                </li>
                {tiers.length >= 1 && (
                  <li>
                    Users move from {tiers[0]?.name || "Silver"} to{" "}
                    {tiers[1]?.name || "Gold"} at{" "}
                    {tiers[1]?.pointsRequired || "Z"} points
                  </li>
                )}
                <li>
                  Rewards are redeemed at {refereeRewardChannels[0] || "checkout"}
                </li>
              </ul>
            </div>
          </div>
          <div className="">
            <button
              className="w-full bg-primary p-4 text-white mb-3 rounded-sm"
              onClick={() => setShareOpen(true)}
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
        campaignUrl={
          typeof window !== "undefined" && id
            ? `${window.location.origin}/campaign/${id}`
            : ""
        }
      />
    </div>
  );
};

export default ReferralRewards;
