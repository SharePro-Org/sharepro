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
      <section className="bg-white rounded-md md:p-6 p-3 mb-4">
        <div className="flex justify-between mb-4">
          <button
            className="text-black cursor-pointer flex items-center"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-3" />
            <span className="text-lg font-semibold capitalize">
              Campaign Analytics
            </span>
          </button>

          <button className="flex text-primary items-center gap-2">
            <RefreshCwIcon size={15} />
            <span className="text-sm">Refresh</span>
          </button>
        </div>
        <div className="bg-[#D1DAF4] rounded-md flex justify-between">
          <div className="flex gap-4 justify-between">
            <div className="border-r m-3 pr-3 border-r-[#CCCCCC]">
              <h2 className="text-xs mb-2">Campaign Name</h2>
              <p className="text-sm"> Pro Gain</p>
            </div>
            <div className="border-r m-3 pr-3 border-r-[#CCCCCC]">
              <h2 className="text-xs mb-2">Campaign Type</h2>
              <p className="text-sm"> Pro Gain</p>
            </div>
            <div className="border-r m-3 pr-3 border-r-[#CCCCCC]">
              <h2 className="text-xs mb-2">Duration</h2>
              <p className="text-sm"> Pro Gain</p>
            </div>
            <div className="m-3">
              <h2 className="text-xs mb-2">Status</h2>
              <p className="text-sm"> Pro Gain</p>
            </div>
          </div>
          <div className="w-32 flex justify-between">
            <Dropdown
              menu={{
                items: [
                  { key: "pause", label: "Pause Campaign" },
                  { key: "edit", label: "Edit Campaign" },
                  { key: "end", label: "End Campaign" },
                  { key: "settings", label: "Campaign Settings" },
                  { key: "download", label: "Download Report" },
                ],
              }}
              trigger={["click"]}
            >
              <Button type="text" className="my-auto">
                <MoreOutlined />
              </Button>
            </Dropdown>
          </div>
        </div>

        <div className="rounded-md mt-6">
          <div className="lg:flex justify-between">
            <p className="text-black font-medium my-auto text-base">
              All Payouts
            </p>
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
