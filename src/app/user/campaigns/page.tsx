'use client'

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DiscoverCampaign from "@/components/dashboard/DiscoverCampaign";
import UserDashboardTable from "@/components/dashboard/UserDashboardTable";
import { RefreshCwIcon, SearchIcon } from "lucide-react";
import React from "react";

const userCampaigns = () => {
  const [activeTab, setActiveTab] = React.useState<'my' | 'discover' | 'invite'>('my');
  const [inviteEmail, setInviteEmail] = React.useState<string>("");
  return (
    <DashboardLayout user={true}>
      <section className="mt-4">
        <div className="bg-white rounded-md p-4">
          <div className="flex gap-4 border-b border-[#E4E7EC] mb-6">
            <button
              className={`px-6 py-2 font-medium text-base border-b-2 transition-colors ${activeTab === 'my'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-primary'
                }`}
              onClick={() => setActiveTab('my')}
            >
              My Campaigns
            </button>
            <button
              className={`px-6 py-2 font-medium text-base border-b-2 transition-colors ${activeTab === 'discover'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-primary'
                }`}
              onClick={() => setActiveTab('discover')}
            >
              Discover Campaigns
            </button>
            <button
              className={`px-6 py-2 font-medium text-base border-b-2 transition-colors ${activeTab === 'invite'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-primary'
                }`}
              onClick={() => setActiveTab('invite')}
            >
              Campaign Invite
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
              {/* <div>
                
              </div> */}
              <UserDashboardTable type="campaigns" />
            </>
          )}
          {activeTab === 'discover' && (
            <DiscoverCampaign grid={true} />
          )}
          {activeTab === 'invite' && (
            <div>
              <p className="text-xl font-medium mb-3">Campaign Invite</p>
            </div>
          )}
        </div>
      </section>
    </DashboardLayout>
  );
};

export default userCampaigns;
