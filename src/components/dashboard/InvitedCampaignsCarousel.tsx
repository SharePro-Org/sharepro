"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Calendar, ChevronLeft, ChevronRight, Upload, Copy, Check } from "lucide-react";
import { MdCampaign } from "react-icons/md";
import { GiPriceTag } from "react-icons/gi";
import Link from "next/link";
import ProofSubmissionModal from "./ProofSubmissionModal";
import { useMutation } from "@apollo/client/react";
import { JOIN_CAMPAIGN } from "@/apollo/mutations/campaigns";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAtom } from "jotai";
import { userAtom } from "@/store/User";
import Image from "next/image";
import userCheckIcon from "../../../public/assets/Check.svg";

interface Campaign {
  id: string;
  name: string;
  description: string;
  campaignType: string;
  status: string;
  startDate: string;
  endDate: string;
  referralLink: string;
  websiteLink: string;
  participantsCount: number;
  maxParticipants: number;
  business: {
    id: string;
    name: string;
  };
  loyaltyRewards?: any[];
  referralRewards?: any[];
  comboRewards?: any[];
  userRewards?: any[];
}

interface InvitedCampaignsCarouselProps {
  campaigns: Campaign[];
  loading: boolean;
}

const InvitedCampaignsCarousel: React.FC<InvitedCampaignsCarouselProps> = ({
  campaigns,
  loading,
}) => {
  const [user] = useAtom(userAtom);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      skipSnaps: false,
      align: "start",
    },
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
  );

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Proof submission state
  const [showProofModal, setShowProofModal] = useState(false);
  const [selectedCampaignForProof, setSelectedCampaignForProof] = useState<any>(null);

  // Join campaign state
  const [joiningCampaign, setJoiningCampaign] = useState<string | null>(null);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [referralData, setReferralData] = useState<{
    referralCode: string;
    referralLink: string;
  } | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const [joinCampaign] = useMutation(JOIN_CAMPAIGN);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const getRewardInfo = (campaign: Campaign) => {
    if (campaign.referralRewards && campaign.referralRewards.length > 0) {
      const reward = campaign.referralRewards[0];
      return `₦${reward.referralRewardAmount || 0} per referral`;
    }
    if (campaign.loyaltyRewards && campaign.loyaltyRewards.length > 0) {
      const reward = campaign.loyaltyRewards[0];
      return `${reward.earnRewardPoints || 0} points per action`;
    }
    if (campaign.comboRewards && campaign.comboRewards.length > 0) {
      return "Referral + Loyalty Rewards";
    }
    return "Rewards available";
  };

  // Open proof submission modal
  const handleOpenProofModal = (campaign: any) => {
    setSelectedCampaignForProof(campaign);
    setShowProofModal(true);
  };

  // Join campaign handlers
  const handleJoinCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setJoinError(null);
    setShowJoinDialog(true);
  };

  const joinCampaignClick = async () => {
    if (!selectedCampaign || !user?.userId) return;

    setIsJoining(true);
    setJoinError(null);
    setJoiningCampaign(selectedCampaign.id);

    try {
      const response = await joinCampaign({
        variables: {
          campaignId: selectedCampaign.id,
          userId: user.userId,
        },
        refetchQueries: ['UserInvitedCampaigns'],
      });

      const data = response.data as {
        joinCampaign?: {
          success: boolean;
          referralCode: string;
          referralLink: string;
          message?: string;
        };
      };

      if (data?.joinCampaign?.success) {
        setReferralData({
          referralCode: data.joinCampaign.referralCode,
          referralLink: data.joinCampaign.referralLink,
        });
        setShowJoinDialog(false);
        setShowSuccessModal(true);
      } else {
        setJoinError(data?.joinCampaign?.message || "Failed to join campaign");
      }
    } catch (e: any) {
      console.error("Join campaign error:", e);
      setJoinError(
        e.message || "An unexpected error occurred while joining the campaign"
      );
    } finally {
      setIsJoining(false);
      setJoiningCampaign(null);
    }
  };

  // Copy referral code to clipboard
  const copyReferralCode = async () => {
    if (referralData?.referralCode) {
      try {
        await navigator.clipboard.writeText(referralData.referralCode);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (error) {
        console.error("Failed to copy referral code:", error);
      }
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

  // Handle social sharing
  const handleSharePlatform = async (platform: string) => {
    if (!referralData?.referralLink) return;

    const campaignUrl = referralData.referralLink;
    const encodedLink = encodeURIComponent(campaignUrl);
    const shareText = selectedCampaign ? `Check out ${selectedCampaign.name} on SharePro!` : "Join me on SharePro!";
    const message = encodeURIComponent(shareText);

    let shareUrl = "";
    switch (platform) {
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${message}%20${encodedLink}`;
        window.open(shareUrl, "_blank", "width=600,height=400");
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}&quote=${message}`;
        window.open(shareUrl, "_blank", "width=600,height=400");
        break;
      case "twitter":
        shareUrl = `https://x.com/intent/tweet?text=${message}&url=${encodedLink}`;
        window.open(shareUrl, "_blank", "width=600,height=400");
        break;
      case "instagram":
        await navigator.clipboard.writeText(campaignUrl);
        alert("Campaign link copied! You can now paste it in your Instagram post.");
        break;
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent(selectedCampaign?.name || "Check out this campaign!")}&body=${message}%20${encodedLink}`;
        window.location.href = shareUrl;
        break;
      default:
        window.open(campaignUrl, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6 animate-pulse">
        <div className="h-48 bg-gray-100 rounded-xl"></div>
      </div>
    );
  }

  if (!campaigns || campaigns.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-md p-4">
      {/* Header */}
      <div className="flex justify-between items-start gap-3 mb-4 md:mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {/* <div className="bg-primary/10 rounded-lg p-2 shrink-0">
              <Gift className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </div> */}
            <h2 className="text-base md:text-xl font-semibold text-gray-900">
              <span className="hidden md:inline">Invited Campaigns</span>
              <span className="md:hidden">Invited Campaigns</span>
            </h2>
          </div>
          <p className="text-gray-600 text-xs md:text-sm hidden sm:block">
            Join these campaigns and start earning rewards
          </p>
        </div>
        <Link href="/user/campaigns?tab=invite" className="shrink-0">
          <button className="px-2 py-1 md:px-3 md:py-1.5 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors text-xs font-medium whitespace-nowrap">
            View All
          </button>
        </Link>
      </div>

      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="flex-[0_0_100%] min-w-0"
            >
              <div className="border border-[#CCCCCC33] rounded-md">
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
                  <p className="flex gap-2 my-2">
                    <GiPriceTag className="my-auto" />
                    <span>{getRewardInfo(campaign)}</span>
                  </p>

                  <p className="flex gap-2 my-2">
                    <Calendar size={15} className="my-auto" />
                    <span>End Date: {formatDate(campaign.endDate)}</span>
                  </p>
                </div>

                <div className="p-2 flex justify-between">
                  <p>
                    {campaign.participantsCount}{" "}
                    {campaign.participantsCount === 1 ? "user" : "users"} joined
                    {campaign.maxParticipants > 0 &&
                      ` (max: ${campaign.maxParticipants})`}
                  </p>

                  {/* Show different buttons based on campaign state */}
                  {(campaign as any).referralRewards?.[0]?.referreeRewardAction === 'purchase' &&
                  (campaign as any).userRewards?.some((r: any) => r.status === 'PROOF_REQUIRED' && !r.proofSubmittedAt) ? (
                    // User needs to submit proof
                    <button
                      onClick={() => handleOpenProofModal(campaign)}
                      className="rounded-md px-3 py-2 bg-[#ECF3FF] text-primary hover:bg-[#d9e8ff] flex items-center gap-2 text-sm"
                    >
                      <Upload size={16} />
                      <span className="hidden sm:inline">Submit Proof</span>
                      <span className="sm:hidden">Proof</span>
                    </button>
                  ) : (campaign as any).referralRewards?.[0]?.referreeRewardAction === 'purchase' &&
                    (campaign as any).userRewards?.some((r: any) => r.status === 'PROOF_REQUIRED' && r.proofSubmittedAt) ? (
                    // Proof submitted, under review
                    <div className="rounded-md px-3 py-2 bg-gray-100 text-gray-600 text-xs flex items-center gap-1">
                      <span className="hidden sm:inline">Under Review</span>
                      <span className="sm:hidden">Review</span>
                    </div>
                  ) : (
                    // Default: Show Join Campaign button
                    <button
                      onClick={() => handleJoinCampaign(campaign)}
                      disabled={joiningCampaign === campaign.id}
                      className={`rounded-md px-3 py-2 text-sm ${
                        joiningCampaign === campaign.id
                          ? "bg-[#ECF3FF] text-primary opacity-70"
                          : "bg-[#ECF3FF] text-primary hover:bg-[#d9e8ff]"
                      }`}
                    >
                      {joiningCampaign === campaign.id ? "Joining..." : "Join Campaign"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      {campaigns.length > 1 && (
        <div className="flex items-center justify-center gap-3 md:gap-4 mt-4 md:mt-6">
          <button
            onClick={scrollPrev}
            disabled={!prevBtnEnabled}
            className="border border-gray-300 hover:border-primary hover:bg-primary/5 disabled:opacity-30 disabled:cursor-not-allowed text-gray-700 p-1.5 md:p-2 rounded-lg transition-all touch-manipulation"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          {/* Dots */}
          <div className="flex gap-1.5 md:gap-2">
            {campaigns.slice(0, Math.min(5, campaigns.length)).map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`transition-all duration-300 rounded-full touch-manipulation ${
                  index === selectedIndex
                    ? "w-6 md:w-8 h-1.5 md:h-2 bg-primary"
                    : "w-1.5 md:w-2 h-1.5 md:h-2 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
            {campaigns.length > 5 && (
              <span className="text-gray-400 text-xs self-center ml-1">
                +{campaigns.length - 5}
              </span>
            )}
          </div>

          <button
            onClick={scrollNext}
            disabled={!nextBtnEnabled}
            className="border border-gray-300 hover:border-primary hover:bg-primary/5 disabled:opacity-30 disabled:cursor-not-allowed text-gray-700 p-1.5 md:p-2 rounded-lg transition-all touch-manipulation"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      )}

      {/* Proof Submission Modal */}
      <ProofSubmissionModal
        open={showProofModal}
        onOpenChange={setShowProofModal}
        campaign={selectedCampaignForProof}
        refetchQueries={['UserInvitedCampaigns']}
      />

      {/* Join Campaign Confirmation Dialog */}
      <Dialog
        open={showJoinDialog}
        onOpenChange={(isOpen) => {
          setShowJoinDialog(isOpen);
          if (!isOpen) {
            setJoinError(null);
          }
        }}
      >
        <DialogContent size="3xl" className="w-full flex flex-col gap-6 py-6">
          {selectedCampaign && (
            <>
              <h3 className="text-lg font-medium text-center mb-3">
                {selectedCampaign.name}
              </h3>
              <div className="grid md:grid-cols-4 grid-cols-1 gap-4">
                <div className="flex gap-2">
                  <button className="bg-[#ECF3FF] rounded-sm p-3">
                    <MdCampaign color="#A16AD4" />
                  </button>
                  <div>
                    <p className="text-sm">Campaign Name</p>
                    <p>{selectedCampaign.name}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm">Campaign Type</p>
                  <p>{selectedCampaign.campaignType}</p>
                </div>
                <div>
                  <p className="text-sm">End Date</p>
                  <p>{formatDate(selectedCampaign.endDate)}</p>
                </div>
                <div>
                  <p>
                    {selectedCampaign.participantsCount}{" "}
                    {selectedCampaign.participantsCount === 1 ? "user" : "users"} joined
                    {selectedCampaign.maxParticipants > 0 &&
                      ` (max: ${selectedCampaign.maxParticipants})`}
                  </p>
                </div>
              </div>
              <p className="text-sm">{getRewardInfo(selectedCampaign)}</p>
              {joinError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  <p className="text-sm">{joinError}</p>
                </div>
              )}
              <div className="text-center">
                <button
                  onClick={joinCampaignClick}
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
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent size="3xl">
          <div className="flex items-center justify-center">
            <Image src={userCheckIcon} alt="Success" width={80} height={21} />
          </div>
          <p className="text-center text-lg font-semibold my-3">
            You have successfully joined this campaign!
          </p>

          {referralData && selectedCampaign?.campaignType === "REFERRAL" && (
            <>
              <p className="text-center mb-2">How to Earn Rewards:</p>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                <div className="border text-center p-4 rounded-md border-[#CCCCCC]">
                  <p className="text-lg mb-2">Copy Your Unique Referral Link</p>
                  <p className="mb-2">This link is tied to your account.</p>
                  <div className="mt-4">
                    <div className="bg-gray-50 p-3 rounded-md mb-2">
                      <p className="text-sm font-medium mb-1">Referral Code:</p>
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
                      <p className="text-sm font-medium mb-1">Referral Link:</p>
                      <div className="flex items-center justify-between bg-white p-2 rounded border border-[#CCCCCC]">
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
                </div>
                <div className="border p-4 text-center rounded-md border-[#CCCCCC]">
                  <p className="text-lg mb-2">Share this link</p>
                  <p className="mb-2">Send it to friends via social platforms of choice</p>
                  <div className="grid grid-cols-5 gap-2 w-full mt-4">
                    <button
                      onClick={() => handleSharePlatform("twitter")}
                      className="flex flex-col items-center justify-center gap-1 w-full p-2 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#F0F0F0]">
                        <img src="/assets/icons/devicon_twitter.svg" alt="X" />
                      </div>
                      <span className="text-xs mt-1">X</span>
                    </button>
                    <button
                      onClick={() => handleSharePlatform("facebook")}
                      className="flex flex-col items-center justify-center gap-1 w-full p-2 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#1877F21A]">
                        <img src="/assets/icons/facebook.svg" alt="Facebook" />
                      </div>
                      <span className="text-xs mt-1">Facebook</span>
                    </button>
                    <button
                      onClick={() => handleSharePlatform("instagram")}
                      className="flex flex-col items-center justify-center gap-1 w-full p-2 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#F5E8FE]">
                        <img src="/assets/icons/instagram.svg" alt="Instagram" />
                      </div>
                      <span className="text-xs mt-1">Instagram</span>
                    </button>
                    <button
                      onClick={() => handleSharePlatform("whatsapp")}
                      className="flex flex-col items-center justify-center gap-1 w-full p-2 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#25D3661A]">
                        <img src="/assets/icons/whatsapp.svg" alt="WhatsApp" />
                      </div>
                      <span className="text-xs mt-1">WhatsApp</span>
                    </button>
                    <button
                      onClick={() => handleSharePlatform("email")}
                      className="flex flex-col items-center justify-center gap-1 w-full p-2 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#4285F42E]">
                        <img src="/assets/icons/gmail.svg" alt="Gmail" />
                      </div>
                      <span className="text-xs mt-1">Gmail</span>
                    </button>
                  </div>
                  <p className="text-center text-xs mt-3 text-gray-600">
                    Earn rewards when your friends click and sign up.
                  </p>
                </div>
              </div>
            </>
          )}

          {selectedCampaign?.campaignType !== "REFERRAL" && (
            <div className="text-center">
              <Link href="/user/campaigns?tab=my">
                <button className="bg-primary text-white px-6 py-2 rounded-md">
                  View My Campaigns
                </button>
              </Link>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvitedCampaignsCarousel;
