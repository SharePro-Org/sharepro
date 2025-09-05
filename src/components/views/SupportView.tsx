"use client";

import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { HelpCircle, MessageCircleQuestion, SearchIcon } from "lucide-react";
import { TbArrowGuide } from "react-icons/tb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client/react";
import { ALL_FAQS, CREATE_SUPPORT_REQUEST } from "@/apollo/queries/support";
import { FAQ } from "@/apollo/types";

const helpAndSupport = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    issueType: "",
    subject: "",
    contactEmail: "",
    description: "",
    priority: "medium",
    screenshot: null as File | null,
  });

  const {
    data: faqData,
    loading: faqLoading,
    error: faqError,
  } = useQuery(ALL_FAQS);
  const [createSupportRequest, { loading: submitLoading, error: submitError }] =
    useMutation(CREATE_SUPPORT_REQUEST);

  const issueTypes = [
    { value: "technical", label: "Technical Issues" },
    { value: "account", label: "Account Related Problems" },
    { value: "billing", label: "Billing and Payment Issues" },
    { value: "feature_request", label: "New Feature Requests" },
    { value: "bug_report", label: "Bug Reports" },
    { value: "general", label: "General Inquiries" },
  ];

  const priorityTypes = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        screenshot: file,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await createSupportRequest({
        variables: {
          issueType: formData.issueType,
          subject: formData.subject,
          contactEmail: formData.contactEmail,
          description: formData.description,
        },
      });

      if (result.data?.createSupportRequest?.success) {
        // Success - reset form and close dialog
        setFormData({
          issueType: "",
          subject: "",
          contactEmail: "",
          description: "",
          priority: "medium",
          screenshot: null,
        });
        setOpen(false);
      } else {
        // Handle server-side errors - they will be displayed in the UI via submitError
        console.error("Server error:", result.data?.createSupportRequest?.errors);
      }
    } catch (error) {
      console.error("Mutation error:", error);
      // Network errors will be handled by the submitError from useMutation
    }
  };

  return (
    <>
      <section className="bg-white rounded-md text-center p-10">
        <h2 className="text-lg font-semibold">Help and Support</h2>
        <p className="my-2">
          Find answers, reach support, or explore tutorials to get the most out
          of your experience.
        </p>

        <div className="flex justify-center items-center gap-3">
          <div className="relative md:mt-0 mt-2">
            <input
              type="text"
              className="bg-[#F9FAFB] md:w-80 w-full border border-[#E4E7EC] p-3 rounded-sm pl-8 text-sm"
              placeholder="Search By Keyword or topic"
            />

            <SearchIcon
              size={16}
              className="absolute top-4 left-3 text-gray-500"
            />
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded-sm">
            Search
          </button>
        </div>
      </section>
      <section className="my-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-md p-4">
          <div className="bg-[#ECF3FF] rounded-sm p-3 w-12 h-12 flex items-center justify-center mb-3">
            <HelpCircle className="text-primary" />
          </div>
          <p className="font-semibold">Help Center</p>
          <p className="my-2 text-sm">
            Quick answers to common questions. Browse articles, how-tos, and
            troubleshooting tips.
          </p>
          <Link
            href={
              typeof window !== "undefined" &&
              window.location.pathname.startsWith("/user")
                ? "/user/support/help-center"
                : "/business/support/help-center"
            }
          >
            <button className="border-b text-sm">Browse Help Articles</button>
          </Link>
        </div>

        <div className="bg-white rounded-md p-4">
          <div className="bg-[#ECF3FF] rounded-sm p-3 w-12 h-12 flex items-center justify-center mb-3">
            <MessageCircleQuestion className="text-primary" />
          </div>
          <p className="font-semibold">Support Request</p>
          <p className="my-2 text-sm">
            Need to speak with someone? Our support team is here to help.
          </p>
          <button
            onClick={() => {
              setOpen(true);
            }}
            className="border-b text-sm"
          >
            Submit a Request
          </button>
        </div>

        <div className="bg-white rounded-md p-4">
          <div className="bg-[#ECF3FF] rounded-sm p-3 w-12 h-12 flex items-center justify-center mb-3">
            <TbArrowGuide className="text-primary" />
          </div>
          <p className="font-semibold">Walkthroughs</p>
          <p className="my-2 text-sm">
            Step-by-step video guides to help you onboard, explore features, and
            solve issues faster.
          </p>
          <Link
            href={
              typeof window !== "undefined" &&
              window.location.pathname.startsWith("/user")
                ? "/user/support/walkthroughs"
                : "/business/support/walkthroughs"
            }
          >
            <button className="border-b text-sm">Watch Tutorials</button>
          </Link>
        </div>
      </section>
      <section className="bg-white rounded-md p-4">
        <p className="font-semibold ">Frequently Asked Questions</p>
        {faqLoading ? (
          <div className="py-4 text-center text-gray-500">Loading FAQs...</div>
        ) : faqError ? (
          <div className="py-4 text-center text-red-500">
            Error loading FAQs
          </div>
        ) : (
          <div>
            <Accordion
              type="single"
              collapsible
              className="border border-[#E5E5EA] rounded-md px-3 my-2"
            >
              {faqData?.faqs?.map((faq: FAQ) => (
                <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>
                    <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </section>

      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        <DialogContent size="lg" className="">
          <div>
            <p className="font-semibold text-lg text-center mb-6">
              Submit a Support Request
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Issue Type */}
              <div>
                <label
                  htmlFor="issueType"
                  className="block text-sm font-medium mb-2"
                >
                  Issue Type *
                </label>
                <select
                  id="issueType"
                  value={formData.issueType}
                  onChange={(e) =>
                    handleInputChange("issueType", e.target.value)
                  }
                  className="w-full border border-[#E4E7EC] rounded-md p-3 text-sm"
                  required
                >
                  <option value="">Select an issue type</option>
                  {issueTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              {/* <div>
                <label
                  htmlFor="priority"
                  className="block text-sm font-medium mb-2"
                >
                  Priority *
                </label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) =>
                    handleInputChange("priority", e.target.value)
                  }
                  className="w-full border border-[#E4E7EC] rounded-md p-3 text-sm"
                  required
                >
                  {priorityTypes.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div> */}

              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium mb-2"
                >
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  className="w-full border border-[#E4E7EC] rounded-md p-3 text-sm"
                  placeholder="Brief description of your issue"
                  required
                />
              </div>

              {/* Contact Email */}
              <div>
                <label
                  htmlFor="contactEmail"
                  className="block text-sm font-medium mb-2"
                >
                  Contact Email *
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  value={formData.contactEmail}
                  onChange={(e) =>
                    handleInputChange("contactEmail", e.target.value)
                  }
                  className="w-full border border-[#E4E7EC] rounded-md p-3 text-sm"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              {/* Screenshot Upload */}
              <div>
                <label
                  htmlFor="screenshot"
                  className="block text-sm font-medium mb-2"
                >
                  Attach Screenshot
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="screenshot"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("screenshot")?.click()
                    }
                    className="w-full border border-dashed border-[#E4E7EC] rounded-md p-4 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    {formData.screenshot ? (
                      <span className="text-green-600">
                        ✓ {formData.screenshot.name} selected
                      </span>
                    ) : (
                      <span>Click to upload a screenshot (PNG, JPG, GIF)</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium mb-2"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={3}
                  className="w-full border border-[#E4E7EC] rounded-md p-3 text-sm resize-vertical"
                  placeholder="Please provide detailed information about your issue, including steps to reproduce if applicable..."
                  required
                />
              </div>

              {/* Error Display */}
              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-600 text-sm">
                    Error submitting request: {submitError.message}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-6 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
                  disabled={submitLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-6 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitLoading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  {submitLoading ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default helpAndSupport;
