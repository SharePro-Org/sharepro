import React, { useRef, useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Twitter,
  Facebook,
  Instagram,
  MessageCircle,
  Mail,
  ArrowLeft,
  Copy,
  Share,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MDEditor, { commands } from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import { useMutation } from "@apollo/client";
import { TRACK_CONVERSION } from "@/apollo/mutations/auth";
import { userAtom } from "@/store/User";
import { useAtom } from "jotai";

const ShareModal = ({
  open,
  onClose,
  campaignUrl,
  campaignId,
  campaignName,
  campaignType,
}: {
  open: boolean;
  onClose: () => void;
  campaignUrl: string;
  campaignId?: string;
  campaignName?: string;
  campaignType?: string;
}) => {
  const [step, setStep] = useState(1);
  const [businessId, setBusinessId] = useState<string>("");
  const [user] = useAtom(userAtom);

  useEffect(() => {
    if (user?.businessId) {
      setBusinessId(user.businessId);
    }
  }, [user]);

  const [copiedLink, setCopiedLink] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [trackConversion] = useMutation(TRACK_CONVERSION);
  const [shareText, setShareText] = useState(
    "🎉 **Exciting news!** I just launched my new campaign on SharePro.\n\nJoin me and let's grow together! 🚀\n\n## Key Features:\n- Easy referral tracking\n- Instant rewards\n- Seamless integration\n\n*#SharePro #Campaign #Growth*"
  );

  // Create URL with tracking parameters
  const createUrlWithParams = (baseUrl: string, source: string = 'direct') => {
    try {
      // Check if the URL is already complete (has protocol)
      let fullUrl = baseUrl;
      if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
        fullUrl = `https://${baseUrl}`;
      }
      
      const urlWithParams = new URL(fullUrl);
      if (campaignId) {
        urlWithParams.searchParams.set('cid', campaignId);
      }
      urlWithParams.searchParams.set('src', source);
      return urlWithParams.toString();
    } catch (error) {
      console.error('Invalid URL format:', baseUrl, error);
      // Fallback: return the original URL with query parameters appended manually
      const separator = baseUrl.includes('?') ? '&' : '?';
      let params = [];
      if (campaignId) {
        params.push(`cid=${encodeURIComponent(campaignId)}`);
      }
      params.push(`src=${encodeURIComponent(source)}`);
      return `${baseUrl}${separator}${params.join('&')}`;
    }
  };

  const urlWithParams = createUrlWithParams(campaignUrl);

  const finalShareText = `${shareText
    .replace(/\*\*(.*?)\*\*/g, "$1") // Bold
    .replace(/\*(.*?)\*/g, "$1") // Italic
    .replace(/~~(.*?)~~/g, "$1") // Strikethrough
    .replace(/#{1,6}\s+(.*)/g, "$1") // Headers
    .replace(/[-*]\s+(.*)/g, "• $1") // Lists
    .replace(/\n{2,}/g, "\n\n")}\n\n${urlWithParams}`;
  const encodedShareText = encodeURIComponent(shareText);
  const url = encodeURIComponent(campaignUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  // Analytics tracking function
  const trackAnalyticsEvent = useCallback(
    async (eventData: { eventType: string; properties: any }) => {
      if (!campaignId) return;

      try {
        await trackConversion({
          variables: {
            campaignId: campaignId,
            businessId: businessId,
            eventType: eventData.eventType,
            properties: JSON.stringify({
              ...eventData.properties,
            }),
          },
        });
      } catch (error) {
        console.error("Analytics tracking failed:", error);
      }
    },
    [campaignId, trackConversion]
  );

  // Generate share URLs for different platforms
  const generateShareUrl = (platform: string) => {
    // Add query parameters to the campaign URL for tracking
    const urlWithParams = createUrlWithParams(campaignUrl, platform);
    
    const encodedLink = encodeURIComponent(urlWithParams);
    // Convert markdown to plain text for sharing
    const plainText = shareText
      .replace(/\*\*(.*?)\*\*/g, "$1") // Bold
      .replace(/\*(.*?)\*/g, "$1") // Italic
      .replace(/~~(.*?)~~/g, "$1") // Strikethrough
      .replace(/#{1,6}\s+(.*)/g, "$1") // Headers
      .replace(/[-*]\s+(.*)/g, "• $1") // Lists
      .replace(/\n{2,}/g, "\n\n"); // Multiple line breaks

    const message = encodeURIComponent(`${plainText}\n\n`);

    switch (platform) {
      case "whatsapp":
        return `https://wa.me/?text=${message}${encodedLink}`;
      case "facebook":
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}&quote=${encodeURIComponent(
          plainText
        )}`;
      case "twitter":
        return `https://x.com/intent/tweet?text=${message}&url=${encodedLink}`;
      case "instagram":
        return `https://www.instagram.com/`;
      case "email":
        return `mailto:?subject=${encodeURIComponent(
          campaignName || "Check out my campaign!"
        )}&body=${message}${encodedLink}`;
      default:
        return urlWithParams;
    }
  };

  // Track share modal view when opened
  useEffect(() => {
    trackAnalyticsEvent({
      eventType: "campaign_view",
      properties: {
        campaign_name: campaignName,
        campaign_type: campaignType,
        view_source: "campaign_card",
      },
    });
  }, []);

  // Handle sharing to different platforms
  const handleShare = async (platform: string) => {
    setIsSharing(true);

    try {
      // Track share intent
      await trackAnalyticsEvent({
        eventType: "share",
        properties: {
          platform: platform,
          campaign_name: campaignName,
          share_method: "button_click",
        },
      });

      // Open sharing platform
      const shareUrl = generateShareUrl(platform);

      if (
        platform === "whatsapp" ||
        platform === "facebook" ||
        platform === "twitter"
      ) {
        window.open(shareUrl, "_blank", "width=600,height=400");
      } else if (platform === "email") {
        window.location.href = shareUrl;
      } else if (platform === "instagram") {
        // Copy to clipboard for Instagram
        await navigator.clipboard.writeText(finalShareText);
        alert(
          "Campaign details copied! You can now paste them in your Instagram post."
        );
      }
    } catch (error) {
      console.error("Share failed:", error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(finalShareText);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);

      // Track copy action
      await trackAnalyticsEvent({
        eventType: "referral_click",
        properties: {
          campaign_name: campaignName,
          action: "link_clicked",
        },
      });
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const handleNext = async () => {
    setStep(2);
  };

  const handleBack = async () => {
    setStep(1);
  };

  const handleReferralLinkClick = async () => {
    // Track referral link generation/copy
    await trackAnalyticsEvent({
      eventType: "referral_link_click",
      properties: {
        action: "link_clicked",
        campaign_name: campaignName,
        campaign_type: campaignType,
      },
    });
  };

  const handleModalClose = async () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-2xl w-full flex flex-col gap-6 py-6">
        {step === 1 && (
          <>
            <div className="flex items-center justify-center">
              <h2 className="text-xl">Share Campaign</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="shareText" className="block mb-2 text-sm">
                  Attach a description message for your customers
                </Label>
                <div className="border border-gray-300 rounded-md overflow-hidden">
                  <MDEditor
                    value={shareText}
                    onChange={(value) => setShareText(value || "")}
                    preview="live"
                    hideToolbar={false}
                    height={300}
                    data-color-mode="light"
                    textareaProps={{
                      placeholder:
                        "Write your share message here... Use markdown for formatting!",
                    }}
                    commands={[
                      // Basic formatting commands only
                      commands.bold,
                      commands.italic,
                      commands.strikethrough,
                      commands.divider,
                      commands.divider,
                      commands.unorderedListCommand,
                      commands.orderedListCommand,
                      commands.divider,
                    ]}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Use the toolbar above for formatting or write markdown
                  directly. Live preview is shown on the right.
                </p>
              </div>

              <div>
                <div className="flex text-sm" onClick={handleReferralLinkClick}>
                  <p>Campaign Link:</p>
                  <p className="text-primary cursor-pointer hover:underline">
                    {campaignUrl}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCopy}
                disabled={isSharing}
                className="w-1/2 p-3 flex gap-3 justify-center bg-primary text-white rounded-md disabled:opacity-50"
              >
                <Copy size={16} className="my-auto" />
                <span>{copiedLink ? "Copied!" : "Copy"}</span>
              </button>
              <button
                className="flex w-1/2 gap-3 justify-center bg-secondary p-3 text-white rounded-md disabled:opacity-50"
                onClick={handleNext}
                disabled={isSharing}
              >
                <Share size={16} className="my-auto" />
                <span>Share</span>
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="flex items-center justify-center relative">
              <button
                onClick={handleBack}
                className="absolute left-0 p-2 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl">Share Campaigns</h2>
            </div>

            {/* <div className="bg-gray-50 p-4 rounded-md">
              <Label className="block mb-2 text-sm font-medium">
                Your message preview:
              </Label>
              <div className="text-sm text-gray-700 bg-white p-3 rounded border max-h-32 overflow-y-auto">
                <MDEditor.Markdown
                  source={shareText}
                  style={{ whiteSpace: "pre-wrap" }}
                />
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <a
                    href={campaignUrl}
                    className="text-primary hover:underline break-all"
                  >
                    {campaignUrl}
                  </a>
                </div>
              </div>
            </div> */}

            <div className="grid grid-cols-5 gap-6 w-full">
              <button
                onClick={() => handleShare("twitter")}
                disabled={isSharing}
                className="flex flex-col items-center justify-center gap-1 w-full p-3 hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50"
              >
                <div className="w-18 h-18 flex items-center justify-center rounded-full bg-[#F0F0F0]">
                  <img src="/assets/icons/devicon_twitter.svg" alt="" />
                </div>
                <span className="text-xs mt-1">X</span>
              </button>
              <button
                onClick={() => handleShare("facebook")}
                disabled={isSharing}
                className="flex flex-col items-center justify-center gap-1 w-full p-3 hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50"
              >
                <div className="w-18 h-18 flex items-center justify-center rounded-full bg-[#1877F21A]">
                  <img src="/assets/icons/facebook.svg" alt="" />
                </div>
                <span className="text-xs mt-1">Facebook</span>
              </button>
              <button
                onClick={() => handleShare("instagram")}
                disabled={isSharing}
                className="flex flex-col items-center justify-center gap-1 w-full p-3 hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50"
              >
                <div className="w-18 h-18 flex items-center justify-center rounded-full bg-[#F5E8FE]">
                  <img src="/assets/icons/instagram.svg" alt="" />
                </div>
                <span className="text-xs mt-1">Instagram</span>
              </button>
              <button
                onClick={() => handleShare("whatsapp")}
                disabled={isSharing}
                className="flex flex-col items-center justify-center gap-1 w-full p-3 hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50"
              >
                <div className="w-18 h-18 flex items-center justify-center rounded-full bg-[#25D3661A]">
                  <img src="/assets/icons/whatsapp.svg" alt="" />
                </div>
                <span className="text-xs mt-1">WhatsApp</span>
              </button>
              <button
                onClick={() => handleShare("email")}
                disabled={isSharing}
                className="flex flex-col items-center justify-center gap-1 w-full p-3 hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50"
              >
                <div className="w-18 h-18 flex items-center justify-center rounded-full bg-[#4285F42E]">
                  <img src="/assets/icons/gmail.svg" alt="" />
                </div>
                <span className="text-xs mt-1">Gmail</span>
              </button>
            </div>

            <button
              className="w-full bg-primary hover:bg-primary/90 p-4 text-white rounded-sm mt-4 disabled:opacity-50"
              onClick={handleModalClose}
              disabled={isSharing}
            >
              Done
            </button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
