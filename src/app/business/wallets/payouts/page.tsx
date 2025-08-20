"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button, Dropdown } from "antd";
import { ArrowLeft, ArrowRight, RefreshCwIcon, SearchIcon } from "lucide-react";
import React from "react";
import { MoreOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import CampaignsTable from "@/components/dashboard/CampaignsTable";
import { Filter } from "@/components/Filter";
import Link from "next/link";

const payouts = () => {
  const router = useRouter();

  return (
    <DashboardLayout>
      <section className="bg-white rounded-md md:p-6 p-3">
        <div className="rounded-md">
          <div className="lg:flex justify-between">
            <p className="text-black font-medium text-lg">Recent Payouts</p>
            <div className="flex gap-4">
              {/* <RangePicker /> */}
              <Filter filter={false} />

              <div className="relative md:mt-0 mt-2">
                <input
                  type="text"
                  className="bg-[#F9FAFB] md:w-72 w-full border border-[#E4E7EC] p-3 rounded-sm pl-8 text-sm"
                  placeholder="Search Campaign Name"
                />

                <SearchIcon
                  size={16}
                  className="absolute top-4 left-3 text-gray-500"
                />
              </div>
            </div>
          </div>
          <CampaignsTable type="payout" />
        </div>
      </section>
    </DashboardLayout>
  );
};

export default payouts;
