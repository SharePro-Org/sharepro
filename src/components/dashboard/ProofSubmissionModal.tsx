"use client";

import React, { useState } from "react";
import { Upload, FileCheck, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { message } from "antd";
import { useMutation } from "@apollo/client/react";
import { SUBMIT_PROOF } from "@/apollo/mutations/campaigns";

interface ProofSubmissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: any;
  refetchQueries?: string[];
}

// File validation constants
const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGE_WIDTH = 2000;
const MAX_IMAGE_HEIGHT = 2000;

const ProofSubmissionModal: React.FC<ProofSubmissionModalProps> = ({
  open,
  onOpenChange,
  campaign,
  refetchQueries = ['UserInvitedCampaigns'],
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [proofDescription, setProofDescription] = useState("");
  const [submittingProof, setSubmittingProof] = useState(false);
  const [submitProof] = useMutation(SUBMIT_PROOF, {
    refetchQueries,
  });

  // File validation for proof submission
  const validateImageDimensions = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(true);
        return;
      }
      const img = new window.Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        if (img.width > MAX_IMAGE_WIDTH || img.height > MAX_IMAGE_HEIGHT) {
          message.error(`Image "${file.name}" is ${img.width}x${img.height}px. Maximum allowed is ${MAX_IMAGE_WIDTH}x${MAX_IMAGE_HEIGHT}px.`);
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
        message.error(`File "${f.name}" is too large (${sizeMB}MB). Maximum size is 5MB.`);
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
      message.error(`You can upload a maximum of ${MAX_FILES} files.`);
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

  // Handle proof submission
  const handleProofSubmission = async () => {
    if (!files || files.length === 0) {
      message.error("Please select at least one file");
      return;
    }

    if (!campaign) {
      message.error("No campaign selected");
      return;
    }

    // Find the reward that needs proof
    const rewardNeedingProof = campaign.userRewards?.find(
      (r: any) => r.status === 'PROOF_REQUIRED'
    );

    if (!rewardNeedingProof) {
      message.error("No reward found that requires proof");
      return;
    }

    setSubmittingProof(true);

    try {
      const filePromises = files.map(fileToBase64);
      const base64Files = await Promise.all(filePromises);
      const fileNames = files.map(f => f.name);

      const { data } = await submitProof({
        variables: {
          rewardId: rewardNeedingProof.id,
          files: base64Files,
          fileNames,
          description: proofDescription
        }
      }) as { data?: { submitProof?: { success: boolean; message?: string } } };

      if (data?.submitProof?.success) {
        message.success("Proof submitted successfully! Your submission is under review.");
        onOpenChange(false);
        setFiles([]);
        setProofDescription("");
      } else {
        message.error(data?.submitProof?.message || "Failed to submit proof");
      }
    } catch (error: any) {
      console.error("Error submitting proof:", error);
      message.error(error?.message || "Error submitting proof");
    } finally {
      setSubmittingProof(false);
    }
  };

  // Reset state when modal closes
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setFiles([]);
      setProofDescription("");
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent size="3xl" className="w-full flex flex-col gap-6 py-6">
        <h3 className="text-lg font-medium text-center">
          Submit Proof of Purchase
        </h3>

        {/* Campaign Info */}
        {campaign && (
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="font-medium">{campaign.name}</p>
            <p className="text-sm text-gray-600 mt-2">
              You signed up for this campaign via a referral link. To receive your reward and enable the referrer to get their reward, please submit proof of your purchase from {campaign.business?.name}.
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="border-l-4 border-blue-500 bg-blue-50 p-4">
          <p className="font-medium text-blue-900 mb-2">What to submit:</p>
          <ul className="text-sm text-blue-800 list-disc list-inside space-y-1">
            <li>Receipt or order confirmation from the business website</li>
            <li>Screenshot showing purchase details</li>
            <li>Invoice or payment confirmation</li>
          </ul>
          <p className="text-xs text-blue-700 mt-3">
            Maximum 5 files, 5MB each. Accepted formats: images, PDF
          </p>
        </div>

        {/* File Upload */}
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Upload Proof Files</span>
            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-primary">
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
                id="proof-upload"
              />
              <label htmlFor="proof-upload" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
              </label>
            </div>
          </label>

          {/* File Preview */}
          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <div className="flex items-center gap-2">
                    <FileCheck size={20} className="text-green-600" />
                    <span className="text-sm">{file.name}</span>
                    <span className="text-xs text-gray-500">
                      ({(file.size / 1024).toFixed(2)} KB)
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          <label className="block">
            <span className="text-sm font-medium">Description (Optional)</span>
            <textarea
              value={proofDescription}
              onChange={(e) => setProofDescription(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
              rows={3}
              placeholder="Add any additional details about your purchase..."
            />
          </label>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            onClick={handleProofSubmission}
            disabled={submittingProof || files.length === 0}
            className="bg-primary p-3 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submittingProof ? "Submitting..." : "Submit Proof"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProofSubmissionModal;
