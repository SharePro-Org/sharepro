import React, { useRef, useState } from "react";
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

const ShareModal = ({
  open,
  onClose,
  campaignUrl,
}: {
  open: boolean;
  onClose: () => void;
  campaignUrl: string;
}) => {
  const [step, setStep] = useState(1);
  const [shareText, setShareText] = useState(
    "🎉 **Exciting news!** I just launched my new campaign on SharePro.\n\nJoin me and let's grow together! 🚀\n\n## Key Features:\n- Easy referral tracking\n- Instant rewards\n- Seamless integration\n\n*#SharePro #Campaign #Growth*"
  );

  const finalShareText = `${shareText}\n\n${campaignUrl}`;
  const encodedShareText = encodeURIComponent(shareText);
  const url = encodeURIComponent(campaignUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(finalShareText);
  };

  const handleNext = () => {
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
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
                {/* <Label htmlFor="campaignLink" className="block mb-2 text-sm">
                  Campaign Link (will be added automatically)
                </Label> */}
                <div className="flex text-sm">
                  <p>Campaign Link:</p>
                  <p className="text-primary">{campaignUrl}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCopy}
                className="w-1/2 p-3 flex gap-3 justify-center bg-primary text-white rounded-md"
              >
                <Copy size={16} className="my-auto" />
                <span>Copy</span>
              </button>
              <button
                className="flex w-1/2 gap-3 justify-center bg-secondary p-3 text-white rounded-md"
                onClick={handleNext}
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
              <a
                href={`https://x.com/intent/tweet?text=${encodedShareText}&url=${url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1 w-full p-3 hover:bg-gray-50 rounded-md transition-colors"
              >
                {/* <Twitter size={32} className="text-blue-400" /> */}
                <div className="w-18 h-18 flex items-center justify-center rounded-full bg-[#F0F0F0]">
                  <img src="/assets/icons/devicon_twitter.svg" alt="" />
                </div>
                <span className="text-xs mt-1">X</span>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodedShareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1 w-full p-3 hover:bg-gray-50 rounded-md transition-colors"
              >
                {/* <Facebook size={32} className="text-blue-600" /> */}
                <div className="w-18 h-18 flex items-center justify-center rounded-full bg-[#1877F21A]">
                  <img src="/assets/icons/facebook.svg" alt="" />
                </div>
                <span className="text-xs mt-1">Facebook</span>
              </a>
              <a
                href={`https://www.instagram.com/`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1 w-full p-3 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => {
                  navigator.clipboard.writeText(finalShareText);
                  alert('Campaign details copied! You can now paste them in your Instagram post.');
                }}
              >
                {/* <Instagram size={32} className="text-pink-500" /> */}
                <div className="w-18 h-18 flex items-center justify-center rounded-full bg-[#F5E8FE]">
                  <img src="/assets/icons/instagram.svg" alt="" />
                </div>
                <span className="text-xs mt-1">Instagram</span>
              </a>
              <a
                href={`https://wa.me/?text=${encodedShareText}%20${url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1 w-full p-3 hover:bg-gray-50 rounded-md transition-colors"
              >
                {/* <MessageCircle size={32} className="text-green-500" /> */}
                <div className="w-18 h-18 flex items-center justify-center rounded-full bg-[#25D3661A]">
                  <img src="/assets/icons/whatsapp.svg" alt="" />
                </div>
                <span className="text-xs mt-1">WhatsApp</span>
              </a>
              <a
                href={`mailto:?subject=Check%20out%20my%20campaign!&body=${encodedShareText}%0A%0A${url}`}
                className="flex flex-col items-center justify-center gap-1 w-full p-3 hover:bg-gray-50 rounded-md transition-colors"
              >
                {/* <Mail size={32} className="text-gray-600" /> */}
                <div className="w-18 h-18 flex items-center justify-center rounded-full bg-[#4285F42E]">
                  <img src="/assets/icons/gmail.svg" alt="" />
                </div>
                <span className="text-xs mt-1">Gmail</span>
              </a>
            </div>

            <button
              className="w-full bg-primary hover:bg-primary/90 p-4 text-white rounded-sm mt-4"
              onClick={onClose}
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
