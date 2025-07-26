import React, { useState } from "react";
import { CustomSelect } from "@/components/ui/custom-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "antd";
import { Country } from "country-state-city";
import { BriefcaseIcon, CurrencyIcon } from "lucide-react";

const ReferralRewards = () => {
  const currencyOptions = Country.getAllCountries();

  const businessTypes = [
    { label: "Refers a friend", value: "refers" },
    { label: "Shares on social", value: "shares" },
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

  const [businessType, setBusinessType] = useState("");
  const [rewardType, setRewardType] = useState("");
  const [currency, setCurrency] = useState("NGN");
  const [rewardValue, setRewardValue] = useState("");
  const [validityPeriod, setValidityPeriod] = useState("");
  const [limitFrequency, setLimitFrequency] = useState("daily");

  return (
    <div>
      <div className="my-6 flex gap-8">
        <div className="w-[70%]">
          <p className="text-base text-primary font-semibold">For Referrer</p>
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
                placeholder="e.g. signs up, makes a purchase"
                options={businessTypes}
                value={businessType}
                onChange={setBusinessType}
                prefix="If Referee"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="action" className="block mb-2 text-sm">
              Reward type
            </Label>

            <div className="flex gap-3">
              {/* <span className="my-auto w-20 text-sm"></span> */}
              <CustomSelect
                placeholder="e.g. Discount, airtime, cashback"
                options={rewardTypes}
                value={rewardType}
                onChange={setRewardType}
                prefix="Then referrer gets"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="points" className="block mb-2 text-sm">
              Reward Value (Per “Successful referal”)
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
                value={rewardValue}
                onChange={(e) => setRewardValue(e.target.value)}
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
                  value={validityPeriod}
                  onChange={(e) => setValidityPeriod(e.target.value)}
                />
              </div>
              <div>
                <CustomSelect
                  options={limitTypes}
                  value={limitFrequency}
                  onChange={setLimitFrequency}
                  placeholder="Daily"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto w-[30%] px-3 py-10 border border-[#CCCCCC] rounded-md">
          <div className="mb-4">
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <span className="w-4 h-4 flex items-center justify-center rounded-full bg-primary text-white font-bold"></span>
                  <span className="h-12 w-[2px] bg-primary/30"></span>
                </div>
                <div className="flex w-full gap-3">
                  <span className="font-medium text-sm">If Referee</span>
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
                  <span className="font-medium text-sm">
                    Then Referrer gets
                  </span>
                  <div className="flex gap-2">
                    {rewardType ? (
                      <button className="flex gap-2 px-2 py-1 text-xs rounded-sm bg-[#CBFBDC]">
                        <CurrencyIcon size={16} className="text-[#16A34A]" />
                        <span>{rewardType}</span>
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
                  <span className="font-medium text-sm">Up tp</span>
                  {rewardValue ? (
                    <button className="flex gap-2 px-2 py-1 text-xs rounded-sm bg-[#FFE0D6]">
                      <CurrencyIcon size={16} className="text-[#F05A28]" />
                      <span>{rewardValue}</span>
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="my-6 flex gap-8">
        <div className="w-[70%]">
          <p className="text-base text-primary font-semibold">For Referree</p>
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
                placeholder="e.g. signs up, makes a purchase"
                options={businessTypes}
                value={businessType}
                onChange={setBusinessType}
                prefix="If Referee"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="action" className="block mb-2 text-sm">
              Reward type
            </Label>

            <div className="flex gap-3">
              {/* <span className="my-auto w-20 text-sm"></span> */}
              <CustomSelect
                placeholder="e.g. Discount, airtime, cashback"
                options={rewardTypes}
                value={rewardType}
                onChange={setRewardType}
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
                value={rewardValue}
                onChange={(e) => setRewardValue(e.target.value)}
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
                value={limitFrequency}
                onChange={setLimitFrequency}
                placeholder="Checkout"
              />
            </div>
            <div>
              <Label htmlFor="validity" className="block mb-2 text-sm">
               Validity Period
              </Label>
              <Input
                id="validity"
                placeholder="Number of referrals per user"
                className="w-full"
                value={validityPeriod}
                onChange={(e) => setValidityPeriod(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mt-auto w-[30%] px-3 py-10 border border-[#CCCCCC] rounded-md">
          <div className="mb-4">
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <span className="w-4 h-4 flex items-center justify-center rounded-full bg-primary text-white font-bold"></span>
                  <span className="h-12 w-[2px] bg-primary/30"></span>
                </div>
                <div className="flex w-full gap-3">
                  <span className="font-medium text-sm">If Referee</span>
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
                  <span className="font-medium text-sm">
                    Then Referrer gets
                  </span>
                  <div className="flex gap-2">
                    {rewardType ? (
                      <button className="flex gap-2 px-2 py-1 text-xs rounded-sm bg-[#CBFBDC]">
                        <CurrencyIcon size={16} className="text-[#16A34A]" />
                        <span>{rewardType}</span>
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
                  <span className="font-medium text-sm">Up tp</span>
                  {rewardValue ? (
                    <button className="flex gap-2 px-2 py-1 text-xs rounded-sm bg-[#FFE0D6]">
                      <CurrencyIcon size={16} className="text-[#F05A28]" />
                      <span>{rewardValue}</span>
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralRewards;
