"use client";

import { Calendar, Copy, Check } from "lucide-react";
import React, { useState, useCallback, useEffect } from "react";
import { GiPriceTag } from "react-icons/gi";
import { MdCampaign } from "react-icons/md";
import { useQuery, useMutation } from "@apollo/client/react";

import { AVAILABLE_CAMPAIGNS } from "@/apollo/queries/user";
import { useAtom } from "jotai";
import { userAtom } from "@/store/User";
import { Campaign } from "@/apollo/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { JOIN_CAMPAIGN } from "@/apollo/mutations/campaigns";
import { TRACK_CONVERSION } from "@/apollo/mutations/auth";

import Image from "next/image";
import userCheck from "../../../public/assets/Check.svg";
import Link from "next/link";

const InvitedCampaign = ({
  max = 4,
  grid,
  camp,
}: {
  max?: number;
  grid?: boolean;
  camp?: any;
}) => {
  const [user] = useAtom(userAtom);
  const [joining, setJoining] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [joined, setJoined] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [referralData, setReferralData] = useState<{
    referralCode: string;
    referralLink: string;
  } | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareCampaignData, setShareCampaignData] = useState<any>(null);
  const [businessId, setBusinessId] = useState<string>("");
  const [trackConversion] = useMutation(TRACK_CONVERSION);
  const [joinCampaign] = useMutation(JOIN_CAMPAIGN);


  // Format date function
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  // Join campaign handler
  const handleJoinCampaign = (campaign: any) => {
    setJoining(campaign);
    setJoinError(null); // Reset error when opening dialog
    setOpen(true);
  };

  const joinCampaignClick = async () => {
    setIsJoining(true);
    setJoinError(null);

    try {
      const response = await joinCampaign({
        variables: {
          campaignId: joining.campaignId || joining.id,
          userId: user?.userId,
        },
      });

      const data = response.data as { joinCampaign?: { success: boolean; referralCode: string; referralLink: string; message?: string } };

      if (data?.joinCampaign?.success) {
        setReferralData({
          referralCode: data.joinCampaign.referralCode,
          referralLink: data.joinCampaign.referralLink,
        });
        setOpen(false);
        setJoined(true);
      } else {
        setJoinError(
          data?.joinCampaign?.message || "Failed to join campaign"
        );
      }
    } catch (e: any) {
      console.error("Join campaign error:", e);
      setJoinError(
        e.message || "An unexpected error occurred while joining the campaign"
      );
    } finally {
      setIsJoining(false);
    }
  };

  // Copy referral code to clipboard
  const copyReferralCode = async () => {
    if (referralData?.referralLink) {
      try {
        await navigator.clipboard.writeText(referralData.referralLink);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (error) {
        console.error("Failed to copy referral link:", error);
      }
    }
  };

  const [shareText, setShareText] = useState(
    "🎉 **Exciting news!** I just joined a campaign on SharePro.\n\nJoin me and let's grow together! 🚀\n\n## Key Features:\n- Easy referral tracking\n- Instant rewards\n- Seamless integration\n\n*#SharePro #Campaign #Growth*"
  );
  const [copiedLink, setCopiedLink] = useState(false);


  const createUrlWithParams = (
    baseUrl: string,
    campaignId?: string,
    source: string = "direct"
  ) => {
    try {
      let fullUrl = baseUrl;
      if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
        fullUrl = `https://${baseUrl}`;
      }
      const urlWithParams = new URL(fullUrl);
      if (campaignId) {
        urlWithParams.searchParams.set("cid", campaignId);
      }
      urlWithParams.searchParams.set("src", source);
      return urlWithParams.toString();
    } catch (error) {
      console.error("Invalid URL format:", baseUrl, error);
      const separator = baseUrl.includes("?") ? "&" : "?";
      let params = [];
      if (campaignId) {
        params.push(`cid=${encodeURIComponent(campaignId)}`);
      }
      params.push(`src=${encodeURIComponent(source)}`);
      return `${baseUrl}${separator}${params.join("&")}`;
    }
  };

  const trackAnalyticsEvent = useCallback(
    async (eventData: { eventType: string; properties: any }) => {
      if (!joining?.campaignId) return;
      try {
        await trackConversion({
          variables: {
            campaignId: joining.campaignId,
            businessId: businessId,
            eventType: eventData.eventType,
            properties: JSON.stringify({ ...eventData.properties }),
          },
        });
      } catch (error) {
        console.error("Analytics tracking failed:", error);
      }
    },
    [joining?.campaignId, trackConversion, businessId]
  );

  const handleSharePlatform = async (platform: string) => {
    setIsSharing(true);
    try {
      await trackAnalyticsEvent({
        eventType: "share",
        properties: {
          platform,
          campaign_name: joining?.campaignName,
          share_method: "button_click",
        },
      });
      const campaignUrl = referralData?.referralLink || window.location.href;
      const urlWithParams = createUrlWithParams(campaignUrl, joining?.campaignId, platform);
      const encodedLink = encodeURIComponent(urlWithParams);
      const plainText = shareText
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/~~(.*?)~~/g, "$1")
        .replace(/#{1,6}\s+(.*)/g, "$1")
        .replace(/[-*]\s+(.*)/g, "• $1")
        .replace(/\n{2,}/g, "\n\n");
      const message = encodeURIComponent(`${plainText}\n\n`);
      let shareUrl = "";
      switch (platform) {
        case "whatsapp":
          shareUrl = `https://wa.me/?text=${message}${encodedLink}`;
          window.open(shareUrl, "_blank", "width=600,height=400");
          break;
        case "facebook":
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}&quote=${encodeURIComponent(plainText)}`;
          window.open(shareUrl, "_blank", "width=600,height=400");
          break;
        case "twitter":
          shareUrl = `https://x.com/intent/tweet?text=${message}&url=${encodedLink}`;
          window.open(shareUrl, "_blank", "width=600,height=400");
          break;
        case "instagram":
          await navigator.clipboard.writeText(`${plainText}\n\n${urlWithParams}`);
          alert("Campaign details copied! You can now paste them in your Instagram post.");
          break;
        case "email":
          shareUrl = `mailto:?subject=${encodeURIComponent(joining?.campaignName || "Check out my campaign!")}&body=${message}${encodedLink}`;
          window.location.href = shareUrl;
          break;
        default:
          window.open(urlWithParams, "_blank");
      }
    } catch (error) {
      console.error("Share failed:", error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyShareText = async () => {
    try {
      const campaignUrl = referralData?.referralLink || window.location.href;
      const urlWithParams = createUrlWithParams(campaignUrl, joining?.campaignId);
      const finalShareText = `${shareText.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1").replace(/~~(.*?)~~/g, "$1").replace(/#{1,6}\s+(.*)/g, "$1").replace(/[-*]\s+(.*)/g, "• $1").replace(/\n{2,}/g, "\n\n")}\n\n${urlWithParams}`;
      await navigator.clipboard.writeText(finalShareText);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      await trackAnalyticsEvent({
        eventType: "referral_click",
        properties: {
          campaign_name: joining?.campaignName,
          action: "link_clicked",
        },
      });
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  // Copy referral link to clipboard
  const copyReferralLink = async () => {
    if (referralData?.referralLink) {
      try {
        await navigator.clipboard.writeText(referralData.referralLink);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (error) {
        console.error("Failed to copy referral link:", error);
      }
    }
  };

  return (
    <div>
      <div className={` ${grid ? "grid md:grid-cols-2 grid-cols-1" : "flex flex-col"} gap-3`}>
        {camp?.length > 0 ? (
          camp.map((campaign: Campaign) => (
            <div
              key={campaign.campaignId || campaign.id}
              className="border border-[#CCCCCC33] rounded-md"
            >
              <div className="border-b border-b-[#CCCCCC33] flex justify-between p-2">
                <div className="flex items-center gap-2">
                  <button className="bg-[#ECF3FF] rounded-sm p-3">
                    <MdCampaign color="#A16AD4" />
                  </button>
                  <p className="my-auto">{campaign.name}</p>
                </div>

                <button className="px-2 py-1 text-sm bg-gray-100 rounded-full my-auto">
                  {campaign.campaignType}
                </button>
              </div>

              <div className="p-2 my-1">
                {/* <p className="flex gap-2 my-2">
                  <GiPriceTag className="my-auto" />
                  <span>{campaign.rewards}</span>
                </p> */}
                <span>{campaign.description}</span>

                <p className="flex gap-2 my-2">
                  <Calendar size={15} className="my-auto" />
                  <span>End Date: {formatDate(campaign.endDate)}</span>
                </p>
              </div>

              <div className="p-2 flex justify-between">
                {/* <p>
                  {campaign.participantsCount}{" "}
                  {campaign.participantsCount === 1 ? "user" : "users"} joined
                  {campaign.maxParticipants > 0 &&
                    ` (max: ${campaign.maxParticipants})`}
                </p> */}
                <button
                  onClick={() =>
                    handleJoinCampaign(campaign)
                  }
                  disabled={
                    joining === campaign.campaignId
                  }
                  className={`rounded-md px-4 py-2 ${joining === campaign.campaignId
                    ? "bg-[#ECF3FF] text-primary opacity-70"
                    : "bg-[#ECF3FF] text-primary hover:bg-[#d9e8ff]"
                    }`}
                >
                  {joining === campaign.campaignId
                    ? "Joining..." :
                    "Join Campaign"
                  }
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            No campaigns available at the moment
          </div>
        )}
      </div>

      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) {
            setJoinError(null); // Reset error when closing dialog
          }
        }}
      >
        <DialogContent size="3xl" className="w-full flex flex-col gap-6 py-6">
          {joining?.campaignType === "LOYALTY" && (
            <div>
              <h3 className="text-lg font-medium text-center mb-3">
                {joining.name}
              </h3>
              <div className="grid md:grid-cols-4 grid-cols-">
                <div className="flex gap-2">
                  <button className="bg-[#ECF3FF] rounded-sm p-3">
                    <MdCampaign color="#A16AD4" />
                  </button>
                  <div>
                    <p className="text-sm"> Campaign Name</p>
                    <p> {joining.name}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm"> Campaign Type</p>
                  <p> {joining.campaignType}</p>
                </div>
                <div>
                  <p className="text-sm"> End Date</p>
                  <p> {formatDate(joining.endDate)}</p>
                </div>

                <div>
                  <p>
                    {joining.participantsCount}{" "}
                    {joining.participantsCount === 1 ? "user" : "users"} joined
                    {joining.maxParticipants > 0 &&
                      ` (max: ${joining.maxParticipants})`}
                  </p>
                </div>
              </div>
            </div>
          )}
          {joining?.campaignType === "COMBO" && (
            <div>
              <h3 className="text-lg font-medium text-center mb-3">
                {joining.name}
              </h3>
              <div className="grid md:grid-cols-4 grid-cols-1">
                <div className="flex gap-2">
                  <button className="bg-[#ECF3FF] rounded-sm p-3">
                    <MdCampaign color="#A16AD4" />
                  </button>
                  <div>
                    <p className="text-sm"> Campaign Name</p>
                    <p> {joining.name}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm"> Campaign Type</p>
                  <p> {joining.campaignType}</p>
                </div>
                <div>
                  <p className="text-sm"> End Date</p>
                  <p> {formatDate(joining.endDate)}</p>
                </div>

                <div>
                  <p>
                    {joining.participantsCount}{" "}
                    {joining.participantsCount === 1 ? "user" : "users"} joined
                    {joining.maxParticipants > 0 &&
                      ` (max: ${joining.maxParticipants})`}
                  </p>
                </div>
              </div>
            </div>
          )}
          {joining?.campaignType === "REFERRAL" && (
            <div>
              <h3 className="text-lg font-medium text-center mb-3">
                {joining.name}
              </h3>
              <div className="grid md:grid-cols-4 grid-cols-1">
                <div className="flex gap-2">
                  <button className="bg-[#ECF3FF] rounded-sm p-3">
                    <MdCampaign color="#A16AD4" />
                  </button>
                  <div>
                    <p className="text-sm"> Campaign Name</p>
                    <p> {joining.name}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm"> Campaign Type</p>
                  <p> {joining.campaignType}</p>
                </div>
                <div>
                  <p className="text-sm"> End Date</p>
                  <p> {formatDate(joining.endDate)}</p>
                </div>
                <div>
                  <p>
                    {joining.participantsCount}{" "}
                    {joining.participantsCount === 1 ? "user" : "users"} joined
                    {joining.maxParticipants > 0 &&
                      ` (max: ${joining.maxParticipants})`}
                  </p>
                </div>
              </div>
            </div>
          )}
          <p className="text-sm">{joining?.rewardInfo}</p>
          {joinError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <p className="text-sm">{joinError}</p>
            </div>
          )}
          <div className="text-center">
            <button
              onClick={() => joinCampaignClick()}
              disabled={isJoining}
              className="bg-primary p-3 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex mx-auto items-center justify-center gap-2 min-w-[120px]"
            >
              {isJoining ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Joining...
                </>
              ) : (
                "Join Campaign"
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={joined} onOpenChange={setJoined}>
        <DialogContent size="3xl">
          <>
            <div className="  flex items-center justify-center">
              <Image src={userCheck} alt="userchecker" width={80} height={21} />
            </div>
            <p className="text-center text-lg font-semibold my-3">
              You have successfully joined this {joining?.campaignType}{" "}
              campaign!
            </p>
            {joining?.campaignType === "LOYALTY" && (
              <div>
                <div className="grid md:grid-cols-3 grid-cols-1 gap-4 mt-4 text-center">
                  <div className="border border-[#CCCCCC] rounded-md p-4">
                    <p className="text-sm font-semibold">
                      Shop on the Business Site
                    </p>
                    <p className="text-xs mt-2 mb-4">
                      Click the button below to visit the business and make a
                      purchase.
                    </p>
                    <a href={joining?.websiteLink} target="_blank" rel="noopener noreferrer">
                      <button className="bg-primary text-sm text-white rounded-sm p-3">
                        Go to Website
                      </button>
                    </a>
                  </div>
                  <div className="border border-[#CCCCCC] rounded-md p-4">
                    <p className="text-sm font-semibold">
                      Submit Proof of Engagement:
                    </p>
                    <p className="text-xs mt-2 mb-4">
                      Once done, come back and submit your proof of engagement for
                      reward.
                    </p>
                    <button
                      className="bg-primary/20 text-sm text-white rounded-sm p-3"
                      disabled
                    >
                      Submit Proof of Engagement
                    </button>
                  </div>
                  <div className="border border-[#CCCCCC] rounded-md p-4">
                    <p className="text-sm font-semibold">Earn Rewards</p>
                    <p className="text-xs mt-2 mb-4">
                      Once verified, your reward will be added to your
                      dashboard.
                    </p>
                    <Link href={"/user/dashboard"}>
                      <button className="bg-primary text-sm text-white rounded-sm p-3">
                        Go to Dashboard
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {joining?.campaignType === "COMBO" && (
              <>
                <p className="text-center">Your Two Ways to Earn:</p>
                <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                  <div className="border text-center p-4 rounded-md border-[#CCCCCC]">
                    <h2 className="text-lg font-semibold ">
                      1. Make a Purchase
                    </h2>
                    <p className="my-4">
                      Click the button below to visit the business and make a
                      purchase.
                    </p>
                    <a href={joining?.websiteLink} target="_blank" rel="noopener noreferrer">
                      <button className="bg-primary text-sm text-white rounded-sm p-3">
                        Go to Website
                      </button>
                    </a>
                    <p className="my-4">
                      Then submit your receipt ID for reward
                    </p>
                    <button
                      disabled
                      className="bg-primary/20 text-sm text-white rounded-sm p-3"
                    >
                      Submit Receipt ID
                    </button>
                  </div>
                  <div className="border text-center p-4 rounded-md border-[#CCCCCC]">
                    <h2 className="text-lg font-semibold ">2. Refer Friends</h2>
                    <p className="my-4">Copy your unique link and share it.</p>
                    {referralData && (
                      <div className="mt-4">
                        <div className="bg-gray-50 p-3 rounded-md mb-2">
                          <p className="text-sm font-medium mb-1">
                            Referral Code:
                          </p>
                          <div className="flex items-center justify-between bg-white p-2 rounded border border-[#CCCCCC]">
                            <span className="text-sm font-mono">
                              {referralData.referralCode}
                            </span>
                            <button
                              onClick={copyReferralCode}
                              className="ml-2 p-1 hover:bg-gray-100 rounded"
                              title="Copy referral code"
                            >
                              {copySuccess ? (
                                <Check size={16} className="text-green-500" />
                              ) : (
                                <Copy size={16} className="text-gray-500" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm font-medium mb-1">
                            Referral Link:
                          </p>
                          <div className="flex items-center justify-between bg-white p-2 rounded border">
                            <span className="text-sm truncate flex-1">
                              {referralData.referralLink}
                            </span>
                            <button
                              onClick={copyReferralLink}
                              className="ml-2 p-1 hover:bg-gray-100 rounded"
                              title="Copy referral link"
                            >
                              {copySuccess ? (
                                <Check size={16} className="text-green-500" />
                              ) : (
                                <Copy size={16} className="text-gray-500" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-5 gap-6 w-full">
                      <button
                        onClick={() => handleSharePlatform("twitter")}
                        disabled={isSharing}
                        className="flex flex-col items-center justify-center gap-1 w-full p-3 hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50"
                      >
                        <div className="w-18 h-18 flex items-center justify-center rounded-full bg-[#F0F0F0]">
                          <img src="/assets/icons/devicon_twitter.svg" alt="" />
                        </div>
                        <span className="text-xs mt-1">X</span>
                      </button>
                      <button
                        onClick={() => handleSharePlatform("facebook")}
                        disabled={isSharing}
                        className="flex flex-col items-center justify-center gap-1 w-full p-3 hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50"
                      >
                        <div className="w-18 h-18 flex items-center justify-center rounded-full bg-[#1877F21A]">
                          <img src="/assets/icons/facebook.svg" alt="" />
                        </div>
                        <span className="text-xs mt-1">Facebook</span>
                      </button>
                      <button
                        onClick={() => handleSharePlatform("instagram")}
                        disabled={isSharing}
                        className="flex flex-col items-center justify-center gap-1 w-full p-3 hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50"
                      >
                        <div className="w-18 h-18 flex items-center justify-center rounded-full bg-[#F5E8FE]">
                          <img src="/assets/icons/instagram.svg" alt="" />
                        </div>
                        <span className="text-xs mt-1">Instagram</span>
                      </button>
                      <button
                        onClick={() => handleSharePlatform("whatsapp")}
                        disabled={isSharing}
                        className="flex flex-col items-center justify-center gap-1 w-full p-3 hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50"
                      >
                        <div className="w-18 h-18 flex items-center justify-center rounded-full bg-[#25D3661A]">
                          <img src="/assets/icons/whatsapp.svg" alt="" />
                        </div>
                        <span className="text-xs mt-1">WhatsApp</span>
                      </button>
                      <button
                        onClick={() => handleSharePlatform("email")}
                        disabled={isSharing}
                        className="flex flex-col items-center justify-center gap-1 w-full p-3 hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50"
                      >
                        <div className="w-18 h-18 flex items-center justify-center rounded-full bg-[#4285F42E]">
                          <img src="/assets/icons/gmail.svg" alt="" />
                        </div>
                        <span className="text-xs mt-1">Gmail</span>
                      </button>
                    </div>
                    <p className="text-center my-2">
                      Earn rewards when your friends click and sign up.
                    </p>
                  </div>
                </div>
              </>
            )}

            {joining?.campaignType === "REFERRAL" && (
              <>
                <p className="text-center mb-2">How to Earn Rewards:</p>
                <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                  <div className="border text-center p-4 rounded-md border-[#CCCCCC]">
                    <p className="text-lg mb-2">
                      Copy Your Unique Referral Link
                    </p>
                    <p className="mb-2">This link is tied to your account.</p>
                    {referralData && (
                      <div className="mt-4">
                        <div className="bg-gray-50 p-3 rounded-md mb-2">
                          <p className="text-sm font-medium mb-1">
                            Referral Code:
                          </p>
                          <div className="flex items-center justify-between bg-white p-2 rounded border border-[#CCCCCC]">
                            <span className="text-sm font-mono">
                              {referralData.referralCode}
                            </span>
                            <button
                              onClick={copyReferralCode}
                              className="ml-2 p-1 hover:bg-gray-100 rounded"
                              title="Copy referral code"
                            >
                              {copySuccess ? (
                                <Check size={16} className="text-green-500" />
                              ) : (
                                <Copy size={16} className="text-gray-500" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm font-medium mb-1">
                            Referral Link:
                          </p>
                          <div className="flex items-center justify-between bg-white p-2 rounded border">
                            <span className="text-sm truncate flex-1">
                              {referralData.referralLink}
                            </span>
                            <button
                              onClick={copyReferralLink}
                              className="ml-2 p-1 hover:bg-gray-100 rounded"
                              title="Copy referral link"
                            >
                              {copySuccess ? (
                                <Check size={16} className="text-green-500" />
                              ) : (
                                <Copy size={16} className="text-gray-500" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="border p-4 text-center rounded-md border-[#CCCCCC]">
                    <p className="text-lg mb-2">Share this link</p>
                    <p className="mb-2">
                      Send it to friends via social platforms of choice
                    </p>
                    <div className="grid grid-cols-5 gap-6 w-full">
                      <button
                        onClick={() => handleSharePlatform("twitter")}
                        disabled={isSharing}
                        className="flex flex-col items-center justify-center gap-1 w-full p-3 hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50"
                      >
                        <div className="w-18 h-18 flex items-center justify-center rounded-full bg-[#F0F0F0]">
                          <img src="/assets/icons/devicon_twitter.svg" alt="" />
                        </div>
                        <span className="text-xs mt-1">X</span>
                      </button>
                      <button
                        onClick={() => handleSharePlatform("facebook")}
                        disabled={isSharing}
                        className="flex flex-col items-center justify-center gap-1 w-full p-3 hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50"
                      >
                        <div className="w-18 h-18 flex items-center justify-center rounded-full bg-[#1877F21A]">
                          <img src="/assets/icons/facebook.svg" alt="" />
                        </div>
                        <span className="text-xs mt-1">Facebook</span>
                      </button>
                      <button
                        onClick={() => handleSharePlatform("instagram")}
                        disabled={isSharing}
                        className="flex flex-col items-center justify-center gap-1 w-full p-3 hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50"
                      >
                        <div className="w-18 h-18 flex items-center justify-center rounded-full bg-[#F5E8FE]">
                          <img src="/assets/icons/instagram.svg" alt="" />
                        </div>
                        <span className="text-xs mt-1">Instagram</span>
                      </button>
                      <button
                        onClick={() => handleSharePlatform("whatsapp")}
                        disabled={isSharing}
                        className="flex flex-col items-center justify-center gap-1 w-full p-3 hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50"
                      >
                        <div className="w-18 h-18 flex items-center justify-center rounded-full bg-[#25D3661A]">
                          <img src="/assets/icons/whatsapp.svg" alt="" />
                        </div>
                        <span className="text-xs mt-1">WhatsApp</span>
                      </button>
                      <button
                        onClick={() => handleSharePlatform("email")}
                        disabled={isSharing}
                        className="flex flex-col items-center justify-center gap-1 w-full p-3 hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50"
                      >
                        <div className="w-18 h-18 flex items-center justify-center rounded-full bg-[#4285F42E]">
                          <img src="/assets/icons/gmail.svg" alt="" />
                        </div>
                        <span className="text-xs mt-1">Gmail</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvitedCampaign;
