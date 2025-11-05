"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { SearchIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Dropdown, Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Filter } from "@/components/Filter";
import { useQuery } from "@apollo/client/react";

import { GET_BUSINESS_CAMPAIGNS } from "@/apollo/queries/campaigns";
import CampaignsTable from "@/components/dashboard/CampaignsTable";
import { useAtom } from "jotai";
import { userAtom } from "@/store/User";

// Filter component

const campaigns = () => {
  const [businessId, setBusinessId] = useState<string>("");
  const [user] = useAtom(userAtom);

  useEffect(() => {
    if (user?.businessId) {
      setBusinessId(user.businessId);
    }
  }, [user]);

  const { data, loading, error } = useQuery(GET_BUSINESS_CAMPAIGNS, {
    variables: { businessId },
    skip: !businessId,
  });

  return (
    <DashboardLayout>
      <>
        <section className="bg-white p-4 mb-2 rounded-md lg:flex justify-between">
          {/* <div className="flex justify-between gap-4 my-auto">
            <button className="bg-[#ECF3FF] py-2 px-4 rounded-sm text-black text-normal text-sm">
              My Campaigns
            </button>
            <button className="bg-[#ECF3FF] py-2 px-4 rounded-sm text-black text-normal text-sm">
              Scheduled
            </button>
            <button className="bg-[#ECF3FF] py-2 px-4 rounded-sm text-black text-normal text-sm">
              Drafts
            </button>
          </div> */}

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
        </section>
        <section className="bg-white p-4 rounded-md">
          <div className="lg:flex justify-between">
            <p className="text-black font-semibold text-base">My Campaigns</p>
            <div className="lg:flex gap-4">
              {/* <RangePicker /> */}
              {/* <Filter /> */}
              <Link href="/business/campaigns/create">
                <button className="bg-primary p-3 md:w-auto w-full cursor-pointer my-auto rounded-sm text-white text-sm px-6">
                  Create Campaign
                </button>
              </Link>
            </div>
          </div>
          {/* Filter component */}
          <CampaignsTable />
        </section>
      </>
    </DashboardLayout>
  );
};

export default campaigns;
