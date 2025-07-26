"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import ReferralRewards from "@/components/rewards/referral";
import LoyaltyRewards from "@/components/rewards/loyalty";

const rewards = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const campaignType = searchParams.get("type");
  const campaignId = searchParams.get('id')

  return (
    <DashboardLayout>
      <section className="bg-white rounded-md md:p-6 p-3">
        <button
          className="text-black cursor-pointer flex items-center"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-3" />
          <span className="text-lg font-semibold capitalize">
            Define Campaign Rewards
          </span>
        </button>
        {/* Render component based on campaignType */}
        {campaignType === "referral" ? (
          <ReferralRewards id={campaignId} />
        ) : campaignType === "loyalty" ? (
          <LoyaltyRewards id={campaignId} />
        ) : (
          <div></div>
        )}
      </section>
    </DashboardLayout>
  );
};

export default rewards;
