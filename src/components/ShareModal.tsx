import React, { useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Twitter,
  Facebook,
  Instagram,
  MessageCircle,
  Mail,
} from "lucide-react";

const ShareModal = ({
  open,
  onClose,
  campaignUrl,
}: {
  open: boolean;
  onClose: () => void;
  campaignUrl: string;
}) => {
  const shareText = encodeURIComponent(
    "Check out my new campaign on SharePro!"
  );
  const url = encodeURIComponent(campaignUrl);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleCopy = () => {
    if (inputRef.current) {
      inputRef.current.select();
      document.execCommand("copy");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full flex flex-col items-center justify-center gap-6 py-12">
        <h2 className="text-lg font-semibold mb-4">Share your campaign</h2>
        <div className="grid grid-cols-5 gap-6 w-full">
          <a
            href={`https://x.com/intent/tweet?text=${shareText}&url=${url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1 w-full"
          >
            <Twitter size={32} />
            <span className="text-xs mt-1">X</span>
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1 w-full"
          >
            <Facebook size={32} />
            <span className="text-xs mt-1">Facebook</span>
          </a>
          <a
            href={`https://wa.me/?text=${shareText}%20${url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1 w-full"
          >
            <Instagram size={32} />
            <span className="text-xs mt-1">Instagram</span>
          </a>

          <a
            href={`https://wa.me/?text=${shareText}%20${url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1 w-full"
          >
            <MessageCircle size={32} />
            <span className="text-xs mt-1">WhatsApp</span>
          </a>
          <a
            href={`mailto:?subject=Check%20out%20my%20campaign!&body=${shareText}%20${url}`}
            className="flex flex-col items-center justify-center gap-1 w-full"
          >
            <Mail size={32} />
            <span className="text-xs mt-1">Mail</span>
          </a>
        </div>
        <button
          className="w-full bg-primary p-4 text-white rounded-sm mt-4"
          onClick={onClose}
        >
          Done
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
