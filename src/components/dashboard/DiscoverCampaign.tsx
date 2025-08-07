'use client'

import { Calendar } from "lucide-react";
import React, { useState } from "react";
import { GiPriceTag } from "react-icons/gi";
import { MdCampaign } from "react-icons/md";
import { useQuery } from "@apollo/client";
import { AVAILABLE_CAMPAIGNS } from "@/apollo/queries/user";
import { useAtom } from "jotai";
import { userAtom } from "@/store/User";
import { Campaign } from "@/apollo/types";


const DiscoverCampaign = ({ max = 4 }: { max?: number }) => {
  const [user] = useAtom(userAtom);
  const [joining, setJoining] = useState<string | null>(null);

  // Fetch available campaigns
  const { data, loading, error } = useQuery(AVAILABLE_CAMPAIGNS, {
    variables: { userId: user?.userId },
    skip: !user?.userId
  });

  // Format date function
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  // Join campaign handler
  const handleJoinCampaign = (campaignId: string) => {
    setJoining(campaignId);
    // Here you would call the mutation to join the campaign
    console.log(`Joining campaign: ${campaignId}`);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setJoining(null);
      // You would handle success/error here
    }, 1000);
  };

  // Get campaigns and slice if max is provided
  const campaigns: Campaign[] = data?.availableCampaigns || [];
  const displayCampaigns = max ? campaigns.slice(0, max) : campaigns;


  const campaignsToShow = displayCampaigns;

  return (
    <div>
      <p className="text-lg font-medium">Discover Campaigns</p>
      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="text-center py-4">Loading available campaigns...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">Error loading campaigns</div>
        ) : campaignsToShow.length > 0 ? (
          campaignsToShow.map((campaign: Campaign) => (
            <div key={campaign.campaignId} className="border border-[#CCCCCC33] rounded-md">
              <div className="border-b border-b-[#CCCCCC33] flex justify-between p-2">
                <div className="flex items-center gap-2">
                  <button className="bg-[#ECF3FF] rounded-sm p-3">
                    <MdCampaign color="#A16AD4" />
                  </button>
                  <p className="my-auto">{campaign.campaignName}</p>
                </div>

                <button className="px-2 py-1 text-sm bg-gray-100 rounded-full my-auto">
                  {campaign.campaignType}
                </button>
              </div>

              <div className="p-2 my-1">
                <p className="flex gap-2 my-2">
                  <GiPriceTag className="my-auto" />
                  <span>{campaign.rewardInfo}</span>
                </p>

                <p className="flex gap-2 my-2">
                  <Calendar size={15} className="my-auto" />
                  <span>End Date: {formatDate(campaign.endDate)}</span>
                </p>
              </div>

              <div className="p-2 flex justify-between">
                <p>{campaign.participantsCount} {campaign.participantsCount === 1 ? 'user' : 'users'} joined 
                  {campaign.maxParticipants > 0 && ` (max: ${campaign.maxParticipants})`}
                </p>
                <button 
                  onClick={() => campaign.isJoinable && handleJoinCampaign(campaign.campaignId)}
                  disabled={!campaign.isJoinable || joining === campaign.campaignId}
                  className={`rounded-md px-4 py-2 ${
                    !campaign.isJoinable ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 
                    joining === campaign.campaignId ? 'bg-[#ECF3FF] text-primary opacity-70' : 
                    'bg-[#ECF3FF] text-primary hover:bg-[#d9e8ff]'
                  }`}
                >
                  {joining === campaign.campaignId ? 'Joining...' : campaign.isJoinable ? 'Join Campaign' : 'Not Available'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4">No campaigns available at the moment</div>
        )}
      </div>
    </div>
  );
};

export default DiscoverCampaign;
