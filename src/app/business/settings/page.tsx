"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Select } from "antd";
import { Country } from "country-state-city";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "@apollo/client/react";
import { UPDATE_NOTIFICATION_PREFERENCES } from "@/apollo/mutations/notification";
import { GET_NOTIFICATION_PREFERENCES } from "@/apollo/queries/notification";

interface NotificationPreferences {
  emailBusiness: boolean;
  emailCampaigns: boolean;
  emailReferrals: boolean;
  emailRewards: boolean;
  emailSystem: boolean;
  realtimeBusiness: boolean;
  realtimeCampaigns: boolean;
  realtimeReferrals: boolean;
  realtimeRewards: boolean;
  realtimeSystem: boolean;
}

const settings = () => {
  const router = useRouter();
  const currencyOptions = Country.getAllCountries();
  const [currency, setCurrency] = useState("NGN");

  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>({
    emailBusiness: true,
    emailCampaigns: true,
    emailReferrals: true,
    emailRewards: true,
    emailSystem: true,
    realtimeBusiness: true,
    realtimeCampaigns: true,
    realtimeReferrals: true,
    realtimeRewards: true,
    realtimeSystem: true
  });

  // Define the expected shape of the query result
  interface GetNotificationPreferencesData {
    notificationPreferences: NotificationPreferences;
  }

  // Fetch notification preferences
  const { data: preferencesData, loading: preferencesLoading } = useQuery<GetNotificationPreferencesData>(GET_NOTIFICATION_PREFERENCES);

  // Update notification preferences mutation
  const [updatePreferences, { loading: updating }] = useMutation(UPDATE_NOTIFICATION_PREFERENCES, {
    onCompleted: () => {
      alert("Settings updated successfully");
    },
    onError: (error: { message: string }) => {
      alert(error.message || "Failed to update settings");
    }
  });

  // Load initial preferences
  useEffect(() => {
    if (preferencesData?.notificationPreferences) {
      setNotificationPreferences(preferencesData.notificationPreferences);
    }
  }, [preferencesData]);

  // Handle preference changes
  const handlePreferenceChange = async (key: keyof NotificationPreferences, value: boolean) => {
    try {
      const updatedPreferences = {
        ...notificationPreferences,
        [key]: value
      };
      setNotificationPreferences(updatedPreferences);

      await updatePreferences({
        variables: {
          emailBusiness: updatedPreferences.emailBusiness,
          emailCampaigns: updatedPreferences.emailCampaigns,
          emailReferrals: updatedPreferences.emailReferrals,
          emailRewards: updatedPreferences.emailRewards,
          emailSystem: updatedPreferences.emailSystem,
          realtimeSystem: updatedPreferences.realtimeSystem,
          realtimeReferrals: updatedPreferences.realtimeReferrals,
          realtimeRewards: updatedPreferences.realtimeRewards,
          realtimeBusiness: updatedPreferences.realtimeBusiness,
          realtimeCampaigns: updatedPreferences.realtimeCampaigns
        }
      });
    } catch (error) {
      // If mutation fails, revert the state
      setNotificationPreferences(prevState => ({
        ...prevState,
        [key]: !value
      }));
    }
  }; return (
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
          {/* <h2 className="text-lg font-semibold text-primary mb-2">Payouts</h2>
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
            {/* <div className="mb-2">
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
          </div> */}

          {/* Rewards Section */}
          {/* <h2 className="text-lg font-semibold text-primary mb-2">Rewards</h2>
          <div className="space-y-4 mb-8 text-[#030229B2]">
            <div className="flex items-center justify-between">
              <span>Send airtime rewards automatically</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span>Automatically create vouchers for discount rewards</span>
              <Switch defaultChecked />
            </div>
          </div> */}

          {/* Email Notifications Section */}
          <h2 className="text-lg font-semibold text-primary mb-2">
            Email Notifications
          </h2>
          <div className="space-y-4 mb-8 text-[#030229B2]">
            <div className="flex items-center justify-between">
              <span>Business updates</span>
              <Switch
                checked={notificationPreferences.emailBusiness}
                onChange={(checked: boolean) => handlePreferenceChange('emailBusiness', checked)}
                disabled={updating}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Campaign notifications</span>
              <Switch
                checked={notificationPreferences.emailCampaigns}
                onChange={(checked: boolean) => handlePreferenceChange('emailCampaigns', checked)}
                disabled={updating}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Referral updates</span>
              <Switch
                checked={notificationPreferences.emailReferrals}
                onChange={(checked: boolean) => handlePreferenceChange('emailReferrals', checked)}
                disabled={updating}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Reward notifications</span>
              <Switch
                checked={notificationPreferences.emailRewards}
                onChange={(checked: boolean) => handlePreferenceChange('emailRewards', checked)}
                disabled={updating}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>System notifications</span>
              <Switch
                checked={notificationPreferences.emailSystem}
                onChange={(checked: boolean) => handlePreferenceChange('emailSystem', checked)}
                disabled={updating}
              />
            </div>
          </div>

          {/* Real-time Notifications Section */}
          <h2 className="text-lg font-semibold text-primary mb-2">
            Real-time Notifications
          </h2>
          <div className="space-y-4 mb-8 text-[#030229B2]">
            <div className="flex items-center justify-between">
              <span>Business updates</span>
              <Switch
                checked={notificationPreferences.realtimeBusiness}
                onChange={(checked: boolean) => handlePreferenceChange('realtimeBusiness', checked)}
                disabled={updating}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Campaign notifications</span>
              <Switch
                checked={notificationPreferences.realtimeCampaigns}
                onChange={(checked: boolean) => handlePreferenceChange('realtimeCampaigns', checked)}
                disabled={updating}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Referral updates</span>
              <Switch
                checked={notificationPreferences.realtimeReferrals}
                onChange={(checked: boolean) => handlePreferenceChange('realtimeReferrals', checked)}
                disabled={updating}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Reward notifications</span>
              <Switch
                checked={notificationPreferences.realtimeRewards}
                onChange={(checked: boolean) => handlePreferenceChange('realtimeRewards', checked)}
                disabled={updating}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>System notifications</span>
              <Switch
                checked={notificationPreferences.realtimeSystem}
                onChange={(checked: boolean) => handlePreferenceChange('realtimeSystem', checked)}
                disabled={updating}
              />
            </div>
          </div>

          {/* Campaigns Section */}
          {/* <h2 className="text-lg font-semibold text-primary mb-2">Campaigns</h2>
          <div className="space-y-4 mb-8 text-[#030229B2]">
            <div className="flex items-center justify-between">
              <span>Make all campaigns public</span>
              <Switch defaultChecked />
            </div>
          </div> */}

          {/* <div className="mt-8">
            <button
              className="bg-primary text-white px-6 py-2 rounded-md font-medium shadow disabled:opacity-50"
              disabled={updating || preferencesLoading}
            >
              {updating ? 'Saving...' : 'Save settings'}
            </button>
          </div> */}
        </div>
      </section>
    </DashboardLayout>
  );
};

export default settings;
