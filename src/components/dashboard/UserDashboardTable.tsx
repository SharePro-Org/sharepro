import React, { useMemo, useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  TRACK_LOYALTY_ACTION,
  USER_JOINED_CAMPAIGNS,
  USER_REWARD_HISTORY,
} from "@/apollo/queries/user";
import { GET_CAMPAIGN_REFERRALS } from "@/apollo/queries/referrals";
import { CLAIM_REWARD, SUBMIT_PROOF } from "@/apollo/mutations/campaigns";
import { useAtom } from "jotai";
import { userAtom } from "@/store/User";
import { Campaign, Reward } from "@/apollo/types";
import { Button, Dropdown, message } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle, SearchIcon, XCircle } from "lucide-react";
import { MdCampaign } from "react-icons/md";
import { Upload, FileCheck, X } from "lucide-react";

// import { format } from "date-fns";

const UserDashboardTable = ({ type, max }: { type: string; max?: number }) => {
  // Access the current user from the global state
  const [user] = useAtom(userAtom);
  const [messageApi, contextHolder] = message.useMessage();
  const [searchTerm, setSearchTerm] = useState("");
  const [showClaim, setShowClaim] = useState(false)

  const [files, setFiles] = useState<File[]>([]);
  const [submittingProof, setSubmittingProof] = useState(false);

  // State for claim reward functionality
  const [claimingReward, setClaimingReward] = useState<string | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [claimSuccess, setClaimSuccess] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showCampaign, setShowCampaign] = useState(false)
  const [joining, setJoining] = useState<any>(null);
  const [showReferralsModal, setShowReferralsModal] = useState(false);
  const [selectedCampaignForReferrals, setSelectedCampaignForReferrals] = useState<Campaign | null>(null);


  // Mutations
  const [claimReward] = useMutation(CLAIM_REWARD);

  // Fetch campaigns data
  const { data: campaignsData, loading: campaignsLoading } = useQuery<{ userJoinedCampaigns: Campaign[] }>(
    USER_JOINED_CAMPAIGNS,
    {
      variables: { userId: user?.userId },
      skip: !user?.userId || type !== "campaigns",
    }
  );

  // Fetch rewards data
  const { data: rewardsData, loading: rewardsLoading } = useQuery<{ userRewardHistory: Reward[] }>(
    USER_REWARD_HISTORY,
    {
      variables: { userId: user?.userId },
      skip: !user?.userId || type !== "rewards",
    }
  );

  // Fetch campaign referrals when modal is open
  const { data: referralsData, loading: referralsLoading } = useQuery<{ campaignReferrals: any[] }>(
    GET_CAMPAIGN_REFERRALS,
    {
      variables: { campaignId: selectedCampaignForReferrals?.campaign?.id },
      skip: !selectedCampaignForReferrals || !showReferralsModal,
    }
  );

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_FILES = 5;
  const MAX_IMAGE_WIDTH = 2000; // px
  const MAX_IMAGE_HEIGHT = 2000; // px

  const validateImageDimensions = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(true);
        return;
      }
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        if (img.width > MAX_IMAGE_WIDTH || img.height > MAX_IMAGE_HEIGHT) {
          messageApi.open({
            type: 'error',
            content: `Image "${file.name}" is ${img.width}x${img.height}px. Maximum allowed is ${MAX_IMAGE_WIDTH}x${MAX_IMAGE_HEIGHT}px.`,
          });
          resolve(false);
        } else {
          resolve(true);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        resolve(true);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;

    for (const f of selectedFiles) {
      if (f.size > MAX_FILE_SIZE) {
        const sizeMB = (f.size / (1024 * 1024)).toFixed(1);
        messageApi.open({
          type: 'error',
          content: `File "${f.name}" is too large (${sizeMB}MB). Maximum size is 5MB.`,
        });
        e.target.value = '';
        return;
      }
    }

    for (const f of selectedFiles) {
      const valid = await validateImageDimensions(f);
      if (!valid) {
        e.target.value = '';
        return;
      }
    }

    const combined = [...files, ...selectedFiles];
    if (combined.length > MAX_FILES) {
      messageApi.open({
        type: 'error',
        content: `You can upload a maximum of ${MAX_FILES} files.`,
      });
      e.target.value = '';
      return;
    }

    setFiles(combined);
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  function fileToBase64(file: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  const [trackAction] = useMutation(TRACK_LOYALTY_ACTION);
  const [submitProof] = useMutation(SUBMIT_PROOF);

  // Enhanced handleAction function for different types of loyalty actions
  const handleAction = async (
    userId: string, 
    campaignId: string, 
    actionType: string,
    metadata: any = {}
  ) => {
    try {
      const result: any = await trackAction({
        variables: {
          userId: userId,
          campaignId: campaignId,
          actionType: actionType,
          metadata: JSON.stringify(metadata),
          checkDuplicates: true
        }
      });

      if (result?.data?.trackLoyaltyAction?.success) {
        const trackingMessage = result?.data?.trackLoyaltyAction?.message;
        if (trackingMessage) {
          messageApi.open({
            type: 'success',
            content: trackingMessage,
          });
        }
        return result.data.trackLoyaltyAction;
      } else {
        messageApi.open({
          type: 'info',
          content: result?.data?.trackLoyaltyAction?.message || 'Action tracked successfully!',
        });
        return result?.data?.trackLoyaltyAction;
      }
    } catch (error: any) {
      console.error('Error tracking loyalty action:', error);
      messageApi.open({
        type: 'error',
        content: 'Failed to track action. Please try again.',
      });
      return null;
    }
  };

  // Handle website visit with loyalty tracking
  const handleBusinessWebsiteVisit = async (joining: any) => {
    // Track the website visit action
    console.log("Tracking website visit:", joining)
    if (user?.userId && joining?.campaignId) {
      await handleAction(
        user.userId,
        joining.campaignId,
        "referral",
        {
          website_url: joining?.campaign?.websiteLink,
          campaign_name: joining?.campaign?.campaignName,
          campaign_type: joining?.campaign?.campaignType,
          visit_timestamp: new Date().toISOString()
        }
      );
    }
    
    // Open the website
    gotToBusinessWebsite(joining?.campaign?.websiteLink);
  };

  // Handle proof submission with loyalty tracking + file upload
  const handleProofSubmission = async () => {
    if (!files.length) {
      messageApi.open({
        type: 'error',
        content: 'Please upload at least one proof file before submitting.',
      });
      return;
    }

    if (!user?.userId || !joining?.campaignId) {
      messageApi.open({
        type: 'error',
        content: 'Missing user or campaign information.',
      });
      return;
    }

    setSubmittingProof(true);

    try {
      // Step 1: Track the loyalty action (no file data in metadata)
      const trackingResult = await handleAction(
        user.userId,
        joining.campaignId,
        "engagement",
        {
          campaign_name: joining.campaignName,
          campaign_type: joining.campaignType,
          file_count: files.length,
          submission_timestamp: new Date().toISOString(),
        }
      );

      if (!trackingResult?.success || !trackingResult?.rewardId) {
        messageApi.open({
          type: 'error',
          content: trackingResult?.message || 'Failed to track action. Please try again.',
        });
        setSubmittingProof(false);
        return;
      }

      // Step 2: Upload proof files to the reward
      const base64Files = await Promise.all(files.map(f => fileToBase64(f)));
      const fileNames = files.map(f => f.name);

      const proofResult: any = await submitProof({
        variables: {
          rewardId: trackingResult.rewardId,
          files: base64Files,
          fileNames: fileNames,
          description: "",
        }
      });

      if (proofResult?.data?.submitProof?.success) {
        messageApi.open({
          type: 'success',
          content: 'Proof submitted successfully! Your reward will be processed.',
        });
        setFiles([]);
        setShowClaim(false);
      } else {
        messageApi.open({
          type: 'error',
          content: proofResult?.data?.submitProof?.message || 'Failed to upload proof files.',
        });
      }
    } catch (error) {
      console.error('Error submitting proof:', error);
      messageApi.open({
        type: 'error',
        content: 'Failed to submit proof. Please try again.',
      });
    } finally {
      setSubmittingProof(false);
    }
  };

  // Format date function
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  // Format currency function
  const formatCurrency = (amount: number, currency: string = "₦"): string => {
    return `${currency}${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Get campaigns and slice if max is provided
  const campaigns: Campaign[] = campaignsData?.userJoinedCampaigns || [];
  const displayCampaigns = max ? campaigns.slice(0, max) : campaigns;

  // Get rewards and slice if max is provided
  const rewards: Reward[] = rewardsData?.userRewardHistory || [];
  const displayRewards = max ? rewards.slice(0, max) : rewards;

  // Handle claim reward
  type ClaimRewardResponse = {
    claimReward?: {
      success: boolean;
      message?: string;
    };
  };

  const gotToBusinessWebsite = (url: string) => {
    window.open(url, "_blank");
    console.log("Opened website:", url);
  };

  const handleClaimReward = async (rewardId: string) => {
    setClaimingReward(rewardId);
    setClaimError(null);
    setClaimSuccess(null);

    try {
      const response = await claimReward({
        variables: {
          rewardId,
          userId: user?.userId,
        },
        refetchQueries: [
          {
            query: USER_REWARD_HISTORY,
            variables: { userId: user?.userId },
          },
        ],
      });

      const data = response.data as ClaimRewardResponse;

      if (data?.claimReward?.success) {
        setClaimSuccess(
          data.claimReward.message || "Reward claimed successfully!"
        );
        setModalOpen(true);
      } else {
        setClaimError(
          data?.claimReward?.message || "Failed to claim reward"
        );
        setModalOpen(true);
      }
    } catch (error: any) {
      console.error("Claim reward error:", error);
      setClaimError(
        error.message ||
        "An unexpected error occurred while claiming the reward"
      );
      setModalOpen(true);
    } finally {
      setClaimingReward(null);
    }
  };

  // Close modal and reset states
  const closeModal = () => {
    setModalOpen(false);
    setClaimError(null);
    setClaimSuccess(null);
  };

  // Handle dropdown action
  const handleDropdownAction = (action: string, campaign: Campaign) => {
    if (action === "copy") {
      if (campaign.campaignReferralLink) {
        const userRefLink = campaign.referralCode
          ? `${campaign.campaignReferralLink}/${campaign.referralCode}`
          : campaign.campaignReferralLink;
        navigator.clipboard.writeText(userRefLink);
        messageApi.open({
          type: 'success',
          content: 'Referral link copied to clipboard!',
        });
      } else {
        // message.error("No referral link available.");
      }
    } else if (action === "campaign") {
      // Show campaign details modal (simple alert for now)
      setShowCampaign(true)
      setJoining(campaign)
    }
    else if (action === "reward") {
      setShowCampaign(true)
      setJoining(campaign)
      setShowClaim(true)
      // if (campaign.isClaimable && campaign.rewardId) {
      //   handleClaimReward(campaign.rewardId);
      // } else {
      //   message.error("Reward not claimable or missing reward ID.");
      // }
    }
    else if (action === "referrals") {
      setSelectedCampaignForReferrals(campaign);
      setShowReferralsModal(true);
    }
  };

  const filteredCampaigns = useMemo(() => {
    if (!searchTerm) return displayCampaigns;
    const term = searchTerm.toLowerCase();
    return displayCampaigns.filter(
      (c) =>
        c.campaignName.toLowerCase().includes(term) ||
        c.campaignType.toLowerCase().includes(term) ||
        c.status.toLowerCase().includes(term)
    );
  }, [displayCampaigns, searchTerm]);

  // Filter rewards
  const filteredRewards = useMemo(() => {
    if (!searchTerm) return displayRewards;
    const term = searchTerm.toLowerCase();
    return displayRewards.filter(
      (r) =>
        r.campaignName.toLowerCase().includes(term) ||
        r.rewardType.toLowerCase().includes(term) ||
        r.status.toLowerCase().includes(term)
    );
  }, [displayRewards, searchTerm]);

  return (
    <div className="overflow-x-auto">
      {contextHolder}
      <div className="relative md:mt-0 mt-2">
        <input
          type="text"
          className="bg-[#F9FAFB] md:w-96 w-full border border-[#E4E7EC] p-3 rounded-sm pl-8 text-base"
          placeholder={`Search ${type === "campaigns" ? "Campaign Name" : "Reward or Campaign"}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <SearchIcon size={16} className="absolute top-4 left-3 text-gray-500" />
      </div>
      {type === "campaigns" ? (
        <table className="w-full mt-4 text-sm">
          <thead>
            <tr className="bg-[#D1DAF4] text-black">
              <th className="px-4 py-3 font-medium text-left">Campaign Name</th>
              <th className="px-4 py-3 font-medium text-left">Type</th>
              <th className="px-4 py-3 font-medium text-left">Rewards</th>
              <th className="px-4 py-3 font-medium text-left">Status</th>
              <th className="px-4 py-3 font-medium text-left">Date</th>
              <th className="px-4 py-3 font-medium text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {campaignsLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-3 text-center">
                  Loading campaigns...
                </td>
              </tr>
            ) : filteredCampaigns.length > 0 ? (
              (max ? filteredCampaigns.slice(0, max) : filteredCampaigns).map(
                (campaign: Campaign) => (
                  <tr
                    key={campaign.campaignId}
                    className="border-b border-gray-200"
                  >
                    <td className="px-4 py-3">{campaign.campaignName}</td>
                    <td className={`px-4 py-3`}>
                      <span
                        className={`inline-block px-4 py-1 rounded-[5px] text-white text-xs ${campaign.campaignType.toLowerCase() === "loyalty"
                          ? "bg-[#A16AD4]"
                          : campaign.campaignType.toLowerCase() === "combo"
                            ? "bg-[#6192AE]"
                            : "bg-[#4C8AFF]"
                          }`}
                      >
                        {" "}
                        {campaign.campaignType}
                      </span>
                    </td>
                    <td className="px-4 py-3">{campaign.rewardInfo}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${campaign.status === "Active"
                          ? "bg-green-300 text-green-800"
                          : campaign.status === "Completed"
                            ? "bg-blue-300 text-blue-800"
                            : "bg-gray-300 text-gray-800"
                          }`}
                      >
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {formatDate(campaign.dateJoined)}
                    </td>
                    <td className="px-4 py-3">
                      <Dropdown
                        menu={{
                          items: [
                            { key: "copy", label: "Copy Referral Link" },
                            { key: "campaign", label: "Campaign Details" },
                            { key: "referrals", label: "View Referrals" },
                            { key: "reward", label: "Claim Reward" },
                          ],
                          onClick: ({ key }) => handleDropdownAction(key, campaign),
                        }}
                        trigger={["click"]}
                      >
                        <Button type="text">
                          <MoreOutlined />
                        </Button>
                      </Dropdown>
                      {/* <button className="text-primary underline">View</button> */}
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-3 text-center">
                  No campaigns joined yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      ) : type === "rewards" ? (
        <div>
          {claimError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
              <p className="text-sm">{claimError}</p>
            </div>
          )}
          <table className="w-full mt-4 text-sm">
            <thead>
              <tr className="bg-[#D1DAF4] text-black">
                <th className="px-4 py-3 font-medium text-left">
                  Campaign Name
                </th>
                <th className="px-4 py-3 font-medium text-left">Reward Type</th>
                <th className="px-4 py-3 font-medium text-left">Amount</th>
                <th className="px-4 py-3 font-medium text-left">Status</th>
                <th className="px-4 py-3 font-medium text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {rewardsLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-3 text-center">
                    Loading rewards...
                  </td>
                </tr>
              ) : filteredRewards.length > 0 ? (
                (max ? filteredRewards.slice(0, max) : filteredRewards).map(
                  (reward: Reward) => (
                    <tr
                      key={reward.rewardId}
                      className="border-b border-gray-200"
                    >
                      <td className="px-4 py-3">{reward.campaignName}</td>
                      <td className="px-4 py-3">{reward.rewardType}</td>
                      <td className="px-4 py-3">
                        {/* {formatCurrency(reward.amount, reward.currency)} */}
                        {reward.amount} Points
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${reward.status === "Paid"
                            ? "bg-green-200 text-green-800"
                            : reward.status === "Approved"
                              ? "bg-yellow-200 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {reward.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() =>
                            reward.isClaimable &&
                            handleClaimReward(reward.rewardId)
                          }
                          className={`text-primary underline ${!reward.isClaimable &&
                            "opacity-50 cursor-not-allowed"
                            } ${claimingReward === reward.rewardId &&
                            "opacity-50 cursor-not-allowed"
                            }`}
                          disabled={
                            !reward.isClaimable ||
                            claimingReward === reward.rewardId
                          }
                        >
                          {claimingReward === reward.rewardId
                            ? "Claiming..."
                            : reward.isClaimable
                              ? "View"
                              : "Claim"}
                        </button>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-3 text-center">
                    No rewards found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : null}

      {/* Success/Error Modal */}
      <Dialog open={modalOpen} onOpenChange={closeModal}>
        <DialogContent size="sm">
          <div className="flex flex-col justify-center text-center items-center p-6">
            {claimSuccess ? (
              <>
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <p className="font-semibold text-lg mb-2">Success!</p>
                <p className="text-sm text-gray-600 mb-4">{claimSuccess}</p>
              </>
            ) : claimError ? (
              <>
                <XCircle className="w-16 h-16 text-red-500 mb-4" />
                <p className="font-semibold text-lg mb-2">Error</p>
                <p className="text-sm text-gray-600 mb-4">{claimError}</p>
              </>
            ) : null}
            <button
              onClick={closeModal}
              className="bg-primary text-white px-6 py-2 rounded-md w-full hover:bg-primary/90 transition-colors"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showCampaign}
        onOpenChange={(isOpen) => {
          setShowCampaign(false);
          setShowClaim(false)
        }}
      >
        <DialogContent size="3xl" className="w-full flex flex-col gap-6 py-6">
          {joining?.campaignType === "Loyalty" && (
            <div>
              {showClaim ? <div className="text-center my-3">
                <h3 className="text-lg font-medium mb-3">Claim Reward</h3>
                <p>Fill the following information to claim your reward</p>
              </div> : <h3 className="text-lg font-medium text-center mb-3">
                {joining.campaignName}
              </h3>}

              <div className="grid md:grid-cols-4 grid-cols-">
                <div className="flex gap-2">
                  <button className="bg-[#ECF3FF] rounded-sm p-3">
                    <MdCampaign color="#A16AD4" />
                  </button>
                  <div>
                    <p className="text-sm"> Campaign Name</p>
                    <p> {joining.campaignName}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm"> Campaign Type</p>
                  <p> {joining.campaignType}</p>
                </div>
                <div>
                  <p className="text-sm"> End Date</p>
                  <p> {joining.campaign?.endDate ? formatDate(joining.campaign.endDate) : "N/A"}</p>
                </div>

                <div>
                  <p>
                    {joining.campaign?.participantsCount || 0}{" "}
                    {(joining.campaign?.participantsCount || 0) === 1 ? "user" : "users"} joined
                    {(joining.campaign?.maxParticipants || 0) > 0 &&
                      ` (max: ${joining.campaign.maxParticipants})`}
                  </p>
                </div>
              </div>
              {showClaim ? <div className="my-6">
                <label>Upload Proof of Engagement</label>
                <label
                  htmlFor="proofUpload"
                  className="border-2 my-4 border-dashed border-gray-300 hover:border-[#233E97] transition-all rounded-lg w-full flex flex-col items-center justify-center gap-3 py-4 cursor-pointer bg-[#ECF3FF]/30"
                >
                  <Upload className="text-gray-500 w-8 h-8" />
                  <p className="text-sm text-gray-500">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, or PDF (max 5MB each, up to {MAX_FILES} files)
                  </p>
                  <p className="text-xs text-gray-500">
                    Max image dimensions: {MAX_IMAGE_WIDTH}x{MAX_IMAGE_HEIGHT}px
                  </p>
                  <input
                    type="file"
                    id="proofUpload"
                    className="hidden"
                    accept="image/*,.pdf"
                    multiple
                    onChange={handleFileChange}
                  />
                </label>
                {files.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {files.map((f, i) => (
                      <div key={i} className="flex items-center gap-1 bg-[#ECF3FF] rounded-md px-3 py-1.5 text-sm">
                        <FileCheck className="text-[#233E97] w-4 h-4" />
                        <span className="text-[#233E97] font-medium max-w-[150px] truncate">{f.name}</span>
                        <span className="text-gray-400 text-xs">({(f.size / (1024 * 1024)).toFixed(1)}MB)</span>
                        <button type="button" onClick={() => removeFile(i)} className="ml-1 text-gray-400 hover:text-red-500">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-center">
                  <button
                    className="p-3 rounded-md bg-[#233E97] text-white disabled:opacity-50"
                    onClick={handleProofSubmission}
                    disabled={submittingProof}
                  >
                    {submittingProof ? 'Submitting...' : 'Submit & Claim Reward'}
                  </button>
                </div>
              </div> :
                <>
                  <p className="text-sm py-6">Invite your friends and earn {joining?.rewardInfo} for each new signup who makes a purchase</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <strong>How It Works</strong>
                      <ul className="list-disc ml-4">
                        <li>Step 1: Tap Join Campaign</li>
                        <li>Step 2: Make purchases at participating outlets</li>
                        <li>Step 3: Earn loyalty points automatically</li>
                        <li>Step 4: Redeem points for rewards in your wallet</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Rules & Conditions</strong>

                    </div>
                  </div>
                  <div className="flex gap-4 justify-center mt-6">
                    <button
                      className="bg-[#233E97] p-4 rounded-md text-white"
                      onClick={() => handleBusinessWebsiteVisit(joining)}
                    >
                      Visit Business Website
                    </button>
                    <button
                      onClick={() => setShowClaim(true)}
                      className="text-[#233E97] p-4 rounded-md bg-[#ECF3FF]"
                    >
                      Claim Reward
                    </button>
                  </div>
                </>}

            </div>
          )}

          {joining?.campaignType === "Combo" && (
            <div>
              {showClaim ? <div className="text-center my-3">
                <h3 className="text-lg font-medium mb-3">Claim Reward</h3>
                <p>Fill the following information to claim your reward</p>
              </div> : <h3 className="text-lg font-medium text-center mb-3">
                {joining.campaignName}
              </h3>}

              <div className="grid md:grid-cols-4 grid-cols-1">
                <div className="flex gap-2">
                  <button className="bg-[#ECF3FF] rounded-sm p-3">
                    <MdCampaign color="#A16AD4" />
                  </button>
                  <div>
                    <p className="text-sm"> Campaign Name</p>
                    <p> {joining.campaignName}</p>
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
              {showClaim ? <div className="my-6">
                <label>Upload Proof of Engagement</label>
                <label
                  htmlFor="proofUploadCombo"
                  className="border-2 my-4 border-dashed border-gray-300 hover:border-[#233E97] transition-all rounded-lg w-full flex flex-col items-center justify-center gap-3 py-4 cursor-pointer bg-[#ECF3FF]/30"
                >
                  <Upload className="text-gray-500 w-8 h-8" />
                  <p className="text-sm text-gray-500">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, or PDF (max 5MB each, up to {MAX_FILES} files)
                  </p>
                  <p className="text-xs text-gray-500">
                    Max image dimensions: {MAX_IMAGE_WIDTH}x{MAX_IMAGE_HEIGHT}px
                  </p>
                  <input
                    type="file"
                    id="proofUploadCombo"
                    className="hidden"
                    accept="image/*,.pdf"
                    multiple
                    onChange={handleFileChange}
                  />
                </label>
                {files.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {files.map((f, i) => (
                      <div key={i} className="flex items-center gap-1 bg-[#ECF3FF] rounded-md px-3 py-1.5 text-sm">
                        <FileCheck className="text-[#233E97] w-4 h-4" />
                        <span className="text-[#233E97] font-medium max-w-[150px] truncate">{f.name}</span>
                        <span className="text-gray-400 text-xs">({(f.size / (1024 * 1024)).toFixed(1)}MB)</span>
                        <button type="button" onClick={() => removeFile(i)} className="ml-1 text-gray-400 hover:text-red-500">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-center">
                  <button
                    className="p-3 rounded-md bg-[#233E97] text-white disabled:opacity-50"
                    onClick={handleProofSubmission}
                    disabled={submittingProof}
                  >
                    {submittingProof ? 'Submitting...' : 'Submit & Claim Reward'}
                  </button>
                </div>
              </div> : <>
                <p className="text-sm py-6">Invite your friends and earn {joining?.rewardInfo} for each new signup who makes a purchase</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Rules & Conditions</strong>
                    <ul className="list-disc ml-4">
                      <li>Users must sign up and make a valid purchase</li>
                      <li>Reward is credited after 24hrs of verification</li>
                      <li>Limit: 10 referrals per user</li>
                    </ul>
                  </div>
                  <div>
                  </div>
                </div>
                <div className="flex gap-4 justify-center mt-6">
                  <button className="bg-[#233E97] p-4 rounded-md text-white" onClick={() => handleBusinessWebsiteVisit(joining)}> Visit Business Website</button>
                  <button onClick={() => setShowClaim(true)} className="text-[#233E97] p-4 rounded-md bg-[#ECF3FF]">Claim Reward</button>
                </div>
              </>}

            </div>
          )}

          {joining?.campaignType === "Referral" && (
            <div>
              <h3 className="text-lg font-medium text-center mb-3">
                {joining.campaignName}
              </h3>

              <div className="grid md:grid-cols-4 grid-cols-1 gap-4 mb-6">
                <div className="flex gap-2">
                  <button className="bg-[#ECF3FF] rounded-sm p-3">
                    <MdCampaign color="#A16AD4" />
                  </button>
                  <div>
                    <p className="text-sm"> Campaign Name</p>
                    <p> {joining.campaignName}</p>
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

              <p className="text-sm mb-6">Invite your friends and earn {joining?.rewardInfo} for each new signup who makes a purchase</p>

      
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <strong>How It Works</strong>
                  <ul className="list-disc ml-4 text-sm">
                    <li>Step 1: Tap Join Campaign</li>
                    <li>Step 2: Copy your referral link and share with friends</li>
                    <li>Step 3: Earn rewards when your friends sign up on participating outlets</li>
                    <li>Step 4: Claim your reward now</li>
                  </ul>
                </div>
                <div>
                </div>
              </div>

               {/* Referral Link Section */}
              <div className="grid md:grid-cols-2 grid-cols-1 gap-6 mb-6">
                {/* Copy Referral Link */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-center mb-4">Copy Your Unique Referral Link</h4>
                  <p className="text-sm text-gray-600 text-center mb-4">This link is tied to your account.</p>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-center mb-2">Referral Code:</p>
                    <div className="flex items-center gap-2 border rounded px-3 py-2">
                      <input
                        type="text"
                        value={joining.referralCode || ''}
                        readOnly
                        className="flex-1 bg-transparent outline-none text-sm"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(joining.referralCode || '');
                          messageApi.success('Referral code copied!');
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-center mb-2">Referral Link:</p>
                    <div className="flex items-center gap-2 border rounded px-3 py-2">
                      <input
                        type="text"
                        value={`${joining.campaignReferralLink}/${joining.referralCode}` || ''}
                        readOnly
                        className="flex-1 bg-transparent outline-none text-sm truncate"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${joining.campaignReferralLink}/${joining.referralCode}`);
                          messageApi.success('Referral link copied!');
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Share Link */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-center mb-4">Share this link</h4>
                  <p className="text-sm text-gray-600 text-center mb-6">Send it to friends via social platforms of choice</p>

                  <div className="flex justify-center gap-4 flex-wrap">
                    {/* X (Twitter) */}
                    <button
                      onClick={() => {
                        const userRefLink = `${joining.campaignReferralLink}/${joining.referralCode}`;
                        const text = `Join this campaign: ${joining.campaignName}`;
                        window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(userRefLink)}`, '_blank');
                      }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </div>
                      <span className="text-xs">X</span>
                    </button>

                    {/* Facebook */}
                    <button
                      onClick={() => {
                        const userRefLink = `${joining.campaignReferralLink}/${joining.referralCode}`;
                        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(userRefLink)}`, '_blank');
                      }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center hover:bg-blue-100">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </div>
                      <span className="text-xs">Facebook</span>
                    </button>

                    {/* Instagram */}
                    <button
                      onClick={() => {
                        messageApi.info('Instagram sharing requires the mobile app');
                      }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center hover:bg-pink-100">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="url(#instagram-gradient)">
                          <defs>
                            <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#f09433" />
                              <stop offset="25%" stopColor="#e6683c" />
                              <stop offset="50%" stopColor="#dc2743" />
                              <stop offset="75%" stopColor="#cc2366" />
                              <stop offset="100%" stopColor="#bc1888" />
                            </linearGradient>
                          </defs>
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </div>
                      <span className="text-xs">Instagram</span>
                    </button>

                    {/* WhatsApp */}
                    <button
                      onClick={() => {
                        const userRefLink = `${joining.campaignReferralLink}/${joining.referralCode}`;
                        const text = `Join this campaign: ${joining.campaignName} - ${userRefLink}`;
                        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                      }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center hover:bg-green-100">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                      </div>
                      <span className="text-xs">WhatsApp</span>
                    </button>

                    {/* Gmail */}
                    <button
                      onClick={() => {
                        const userRefLink = `${joining.campaignReferralLink}/${joining.referralCode}`;
                        const subject = `Join ${joining.campaignName}`;
                        const body = `Hi,\n\nI'd like to share this campaign with you: ${joining.campaignName}\n\nJoin here: ${userRefLink}`;
                        window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
                      }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center hover:bg-red-100">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#EA4335">
                          <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                        </svg>
                      </div>
                      <span className="text-xs">Gmail</span>
                    </button>
                  </div>
                </div>
              </div>


              <div className="flex gap-4 justify-center mt-6">
                <button className="bg-[#233E97] p-4 rounded-md text-white" onClick={() => handleBusinessWebsiteVisit(joining)}> Visit Business Website</button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Referrals Modal */}
      <Dialog open={showReferralsModal} onOpenChange={setShowReferralsModal}>
        <DialogContent size="3xl" className="w-full max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-medium">
              Referrals for {selectedCampaignForReferrals?.campaignName}
            </h3>

            {referralsLoading ? (
              <div className="text-center py-8">Loading referrals...</div>
            ) : (referralsData?.campaignReferrals?.length ?? 0) > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#D1DAF4] text-black">
                      <th className="px-4 py-3 font-medium text-left">Name</th>
                      <th className="px-4 py-3 font-medium text-left">Email</th>
                      <th className="px-4 py-3 font-medium text-left">Phone</th>
                      <th className="px-4 py-3 font-medium text-left">Status</th>
                      <th className="px-4 py-3 font-medium text-left">Date Joined</th>
                      <th className="px-4 py-3 font-medium text-left">Proof</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referralsData?.campaignReferrals
                      ?.filter((ref: any) => ref.referrer?.id === user?.userId && ref.referee !== null)
                      .map((referral: any) => (
                        <tr key={referral.id} className="border-b border-gray-200">
                          <td className="px-4 py-3">
                            {referral.referee?.firstName && referral.referee?.lastName
                              ? `${referral.referee.firstName} ${referral.referee.lastName}`
                              : referral.refereeName || "N/A"}
                          </td>
                          <td className="px-4 py-3">
                            {referral.referee?.email || referral.refereeEmail || "N/A"}
                          </td>
                          <td className="px-4 py-3">
                            {referral.referee?.phone || referral.refereePhone || "N/A"}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                referral.status === "CONVERTED"
                                  ? "bg-green-300 text-green-800"
                                  : referral.status === "REGISTERED"
                                  ? "bg-blue-300 text-blue-800"
                                  : referral.status === "CLICKED"
                                  ? "bg-yellow-300 text-yellow-800"
                                  : "bg-gray-300 text-gray-800"
                              }`}
                            >
                              {referral.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {referral.registeredAt
                              ? formatDate(referral.registeredAt)
                              : referral.clickedAt
                              ? formatDate(referral.clickedAt)
                              : formatDate(referral.createdAt)}
                          </td>
                          <td className="px-4 py-3">
                            {referral.rewards && referral.rewards.length > 0 && referral.rewards.some((r: any) => r.proofFiles && r.proofFiles.length > 0) ? (
                              <div className="space-y-1">
                                {referral.rewards
                                  .filter((r: any) => r.proofFiles && r.proofFiles.length > 0)
                                  .map((reward: any) => (
                                    <div key={reward.id} className="space-y-1">
                                      {reward.proofFiles.map((proofFile: any) => (
                                        <a
                                          key={proofFile.id}
                                          href={proofFile.fileUrl || proofFile.file}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-1 text-primary hover:underline text-xs"
                                        >
                                          <FileCheck size={14} />
                                          <span>{proofFile.originalFilename}</span>
                                        </a>
                                      ))}
                                      {reward.proofDescription && (
                                        <p className="text-xs text-gray-600 italic mt-1">
                                          {reward.proofDescription}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-xs">No proof</span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>

                {/* Summary Stats */}
                <div className="mt-6 grid grid-cols-4 gap-4 bg-gray-50 p-4 rounded-md">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {referralsData?.campaignReferrals?.filter((r: any) => r.referrer?.id === user?.userId && r.referee !== null).length ?? 0}
                    </p>
                    <p className="text-sm text-gray-600">Total Referrals</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {referralsData?.campaignReferrals?.filter((r: any) => r.referrer?.id === user?.userId && r.referee !== null && r.status === "REGISTERED").length ?? 0}
                    </p>
                    <p className="text-sm text-gray-600">Registered</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {referralsData?.campaignReferrals?.filter((r: any) => r.referrer?.id === user?.userId && r.referee !== null && r.status === "CONVERTED").length ?? 0}
                    </p>
                    <p className="text-sm text-gray-600">Converted</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">
                      {referralsData?.campaignReferrals?.filter((r: any) => r.referrer?.id === user?.userId && r.referee !== null && r.status === "CLICKED").length ?? 0}
                    </p>
                    <p className="text-sm text-gray-600">Clicked Only</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No referrals yet for this campaign.</p>
                <p className="text-sm mt-2">Share your referral link to start earning!</p>
              </div>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowReferralsModal(false)}
                className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default UserDashboardTable;
