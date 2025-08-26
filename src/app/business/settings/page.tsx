"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Select } from "antd";
import { Country } from "country-state-city";
import { Input } from "@/components/ui/input";

const settings = () => {
  const router = useRouter();
  const currencyOptions = Country.getAllCountries();
  const [currency, setCurrency] = useState("NGN");

  return (
    <DashboardLayout>
      <section className="bg-white rounded-md md:p-6 p-3 ">
        <button
          className="text-black cursor-pointer flex mb-6 items-center"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-3" />
          <span className="text-lg font-semibold capitalize">Settings</span>
        </button>

        <div className="mx-auto">
          {/* Payouts Section */}
          <h2 className="text-lg font-semibold text-primary mb-2">Payouts</h2>
          <div className="space-y-4 mb-8 text-[#030229B2]">
            <div className="flex items-center justify-between">
              <span>Send rewards automatically</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span>Manually approve bulk rewards</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span>Device/IP validation</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span>Activate payout threshold limit</span>
              <Switch defaultChecked />
            </div>
            <div>
              <span className="block mb-2">Set payout threshold limit</span>
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
                  // value={refereeRewardValue}
                  // onChange={(e) => setRefereeRewardValue(e.target.value)}
                  className="w-full ml-3"
                />
              </div>
            </div>
            <div className="mb-2">
              <span className="font-medium">Send Payouts via:</span>

              <div className="flex items-center gap-6 mt-2">
                <label className="flex items-center gap-2">
                  <Switch defaultChecked /> Wallet
                </label>
                <label className="flex items-center gap-2">
                  <Switch /> Manual Transfers
                </label>
              </div>
            </div>
            <div className="mb-2">
              <span className="font-medium">
                Customers will receive rewards via:
              </span>
              <div className="flex items-center gap-6 mt-2">
                <label className="flex items-center gap-2">
                  <Switch defaultChecked /> Wallet
                </label>
                <label className="flex items-center gap-2">
                  <Switch /> Manual Transfers
                </label>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Flag suspicious transactions</span>
              <Switch />
            </div>
          </div>

          {/* Rewards Section */}
          <h2 className="text-lg font-semibold text-primary mb-2">Rewards</h2>
          <div className="space-y-4 mb-8 text-[#030229B2]">
            <div className="flex items-center justify-between">
              <span>Send airtime rewards automatically</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span>Automatically create vouchers for discount rewards</span>
              <Switch defaultChecked />
            </div>
          </div>

          {/* Notifications and Alerts Section */}
          <h2 className="text-lg font-semibold text-primary mb-2">
            Notifications and Alerts
          </h2>
          <div className="space-y-4 mb-8 text-[#030229B2]">
            <div className="flex items-center justify-between">
              <span>Enable push notifications</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span>Receive alerts for failed payouts</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span>Receive notifications for successful referrals</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span>Receive notifications for purchases</span>
              <Switch defaultChecked />
            </div>
          </div>

          {/* Wallet and Subscription Section */}
          <h2 className="text-lg font-semibold text-primary mb-2">
            Wallet and Subscription
          </h2>
          <div className="space-y-4 mb-8 text-[#030229B2]">
            <div className="flex items-center justify-between">
              <span>Receive reminder to fund wallet when low on funds</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span>Auto renew subscription</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span>Receive alerts before subscription expires</span>
              <Switch defaultChecked />
            </div>
          </div>

          {/* Campaigns Section */}
          <h2 className="text-lg font-semibold text-primary mb-2">Campaigns</h2>
          <div className="space-y-4 mb-8 text-[#030229B2]">
            <div className="flex items-center justify-between">
              <span>Make all campaigns public</span>
              <Switch defaultChecked />
            </div>
          </div>

          <div className="mt-8">
            <button className="bg-primary text-white px-6 py-2 rounded-md font-medium shadow">
              Save settings
            </button>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default settings;
