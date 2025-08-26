'use client'

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DiscoverCampaign from "@/components/dashboard/DiscoverCampaign";
import UserDashboardTable from "@/components/dashboard/UserDashboardTable";
import { RefreshCwIcon, SearchIcon } from "lucide-react";
import React from "react";

const userCampaigns = () => {
  const [activeTab, setActiveTab] = React.useState<'my' | 'discover'>('my');
  return (
    <DashboardLayout user={true}>
      <section className="mt-4">
        <div className="bg-white rounded-md p-4">
          <div className="flex gap-4 border-b border-[#E4E7EC] mb-6">
            <button
              className={`px-6 py-2 font-medium text-base border-b-2 transition-colors ${
                activeTab === 'my'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-primary'
              }`}
              onClick={() => setActiveTab('my')}
            >
              My Campaigns
            </button>
            <button
              className={`px-6 py-2 font-medium text-base border-b-2 transition-colors ${
                activeTab === 'discover'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-primary'
              }`}
              onClick={() => setActiveTab('discover')}
            >
              Discover Campaigns
            </button>
          </div>
          {activeTab === 'my' && (
            <>
              <div className="flex justify-between mb-4">
                <p className="text-xl font-medium">My Campaigns</p>
                <button
                  className="flex text-primary items-center gap-2"
                  // onClick={() => refetch()}
                  // disabled={analyticsLoading}
                >
                  <RefreshCwIcon size={15} />
                  <span className="text-sm">Refresh</span>
                </button>
              </div>
              <div>
                <div className="relative md:mt-0 mt-2">
                  <input
                    type="text"
                    className="bg-[#F9FAFB] md:w-72 w-full border border-[#E4E7EC] p-3 rounded-sm pl-8 text-base"
                    placeholder="Search Campaign Name"
                  />
                  <SearchIcon
                    size={16}
                    className="absolute top-4 left-3 text-gray-500"
                  />
                </div>
              </div>
              <UserDashboardTable type="campaigns" />
            </>
          )}
          {activeTab === 'discover' && (
            <DiscoverCampaign grid={true} />
          )}
        </div>
      </section>
    </DashboardLayout>
  );
};

export default userCampaigns;
