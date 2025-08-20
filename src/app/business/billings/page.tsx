"use client";

import { Plan } from "@/apollo/types";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import Image from "next/image";
import userCheck from "../../../../public/assets/Check.svg";
const billingsSubscription = () => {
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cardData, setCardData] = useState({
    nameOnCard: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    billingAddress: "",
  });

  const handleCardInputChange = (field: string, value: string) => {
    setCardData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Card data submitted:", cardData);
    // Handle card submission here
    setSuccess(true);
    setOpen(false);
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digits and add spaces every 4 digits
    const digits = value.replace(/\D/g, "");
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    return formatted;
  };

  const formatExpiryDate = (value: string) => {
    // Format as MM/YY
    const digits = value.replace(/\D/g, "");
    if (digits.length >= 2) {
      return (
        digits.substring(0, 2) +
        (digits.length > 2 ? "/" + digits.substring(2, 4) : "")
      );
    }
    return digits;
  };

  const plans: Record<"monthly" | "yearly", Plan[]> = {
    monthly: [
      {
        name: "Growth",
        price: "₦7,500",
        per: "/ month",
        features: ["10 Campaigns", "Basic Analytics", "Limited Reward Budget"],
        planType: "growth",
        type: "paid",
      },
      {
        name: "Pro",
        price: "₦18,000",
        per: "/ month",
        features: [
          "Unlimited Campaigns",
          "Full Analytics",
          "₦50K Reward Cap",
          "₦200k Reward Budget",
        ],
        planType: "pro",
        type: "paid",
        recommended: true,
      },
      {
        name: "Enterprise",
        price: "Custom Pricing",
        per: "",
        features: [
          "Unlimited Campaigns",
          "Full Analytics",
          "Dedicated Support",
          "Custom Integrations",
          "Flexible Budgeting",
        ],
        planType: "enterprise",
        type: "custom",
      },
    ],
    yearly: [
      {
        name: "Growth",
        price: "₦75,000",
        per: "/ year",
        features: ["10 Campaigns", "Basic Analytics", "Limited Reward Budget"],
        planType: "growth",
        type: "paid",
      },
      {
        name: "Pro",
        price: "₦180,000",
        per: "/ year",
        features: [
          "Unlimited Campaigns",
          "Full Analytics",
          "₦600K Reward Cap",
          "₦2M Reward Budget",
        ],
        planType: "pro",
        type: "paid",
        recommended: true,
      },
      {
        name: "Enterprise",
        price: "Custom Pricing",
        per: "",
        features: [
          "Unlimited Campaigns",
          "Full Analytics",
          "Dedicated Support",
          "Custom Integrations",
          "Flexible Budgeting",
        ],
        planType: "enterprise",
        type: "custom",
      },
    ],
  };

  return (
    <DashboardLayout>
      <>
        <h1 className="text-lg font-semibold">Billing & Subscription</h1>
        <section className="my-4 bg-white rounded-md p-4 flex gap-3">
          <div className="w-[35%]">
            <p className="font-medium">Current Plan</p>
            <p className="text-sm my-2">
              You can update your plan anytime for the best benefit from the
              product
            </p>
            <button className="text-sm text-primary">Upgrade Plan</button>
          </div>
          <div className="bg-[#ECF3FF] w-[65%] rounded-md p-3">
            <div className="flex justify-between">
              <div className="flex gap-3">
                <p className="font-semibold">Growth Plan</p>
                <span className="my-auto text-sm">Renews on 13 Jun, 2025</span>
              </div>
              <button className="text-sm text-white rounded-sm p-1 px-4 bg-[#27AE60]">
                Active
              </button>
            </div>
            <p className="text-sm my-2">
              With access to up to 10 campaigns, ₦50,000 in reward budget, full
              analytics, and basic branding features.
            </p>
            <div className="flex gap-2">
              <p className="font-semibold">N 7,000</p>
              <span className="text-sm">/month</span>
            </div>
          </div>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.monthly.map((plan) => (
            <div key={plan.name} className="bg-white rounded-md p-4">
              <div className="border-b border-b-[#E5E5EA] pb-3">
                <h2 className="text-primary mb-2">{plan.name}</h2>
                <div className="flex gap-2">
                  <span className="font-semibold text-lg">{plan.price}</span>
                  <span className="my-auto">/month</span>
                </div>
              </div>

              <ul className="text-sm space-y-1 my-3 h-32">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 my-1">
                    <span className="text-black">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="flex justify-between mt-2">
                <span></span>
                <button className="text-sm text-primary">Upgrade Plan</button>
              </div>
            </div>
          ))}
        </section>
        <section className="bg-white rounded-md p-4 flex gap-4 my-4">
          <div className="w-[35%]">
            <p className="font-medium">Payment Methods</p>
            <p className="text-sm my-2">
              Select Default payment method or switch card details
            </p>
            <button
              onClick={() => setOpen(true)}
              className="text-sm text-primary"
            >
              Add Payment Method
            </button>
          </div>
          <div className="w-[65%] border border-[#E5E5EA] rounded-md p-6">
            <p className="text-center text-sm">No Active Card</p>
          </div>
        </section>
        <section className="my-4 bg-white rounded-md p-4 gap-3">
          <p className="font-medium">Invoice History</p>

          <table className="w-full mt-4 text-sm">
            <thead>
              <tr className="bg-[#D1DAF4] text-black">
                <th className="px-4 py-3 font-medium text-left">Date</th>
                <th className="px-4 py-3 font-medium text-left">Plan</th>
                <th className="px-4 py-3 font-medium text-left">Amount</th>
                <th className="px-4 py-3 font-medium text-left">Method</th>
                <th className="px-4 py-3 font-medium text-left">Status</th>
                <th className="px-4 py-3 font-medium text-left">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map((campaign: any) => (
                <tr
                  key={campaign}
                  className="border-b border-[#E2E8F0] py-2 last:border-0"
                >
                  <td className="px-4 py-3">2020-10-10</td>
                  <td className="px-4 py-3">reward</td>
                  <td className="px-4 py-3">10,000</td>
                  <td className="px-4 py-3">Airtime</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-4 py-1 rounded-[5px] text-white text-xs bg-green-500">
                      Paid
                    </span>
                  </td>
                  <td className="px-4 py-3"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <Dialog open={open} onOpenChange={() => setOpen(false)}>
          <DialogContent size="lg" className="">
            <div className="text-center mb-6">
              <p className="font-semibold text-lg text-center mb-2">
                Add Payment Method
              </p>
              <p className="text-sm text-gray-600">
                Update your billing details
              </p>
            </div>

            <form onSubmit={handleCardSubmit} className="space-y-4">
              {/* Name on Card */}
              <div>
                <label
                  htmlFor="nameOnCard"
                  className="block text-sm font-medium mb-2"
                >
                  Name on Card *
                </label>
                <input
                  type="text"
                  id="nameOnCard"
                  value={cardData.nameOnCard}
                  onChange={(e) =>
                    handleCardInputChange("nameOnCard", e.target.value)
                  }
                  className="w-full border border-[#E4E7EC] rounded-md p-3 text-sm"
                  placeholder="John Doe"
                  required
                />
              </div>

              {/* Card Number */}
              <div>
                <label
                  htmlFor="cardNumber"
                  className="block text-sm font-medium mb-2"
                >
                  Card Number *
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  value={cardData.cardNumber}
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value);
                    if (formatted.replace(/\s/g, "").length <= 16) {
                      handleCardInputChange("cardNumber", formatted);
                    }
                  }}
                  className="w-full border border-[#E4E7EC] rounded-md p-3 text-sm"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
              </div>

              {/* Expiry Date and CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="expiryDate"
                    className="block text-sm font-medium mb-2"
                  >
                    Expiry Date *
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    value={cardData.expiryDate}
                    onChange={(e) => {
                      const formatted = formatExpiryDate(e.target.value);
                      handleCardInputChange("expiryDate", formatted);
                    }}
                    className="w-full border border-[#E4E7EC] rounded-md p-3 text-sm"
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="cvv"
                    className="block text-sm font-medium mb-2"
                  >
                    CVV *
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    value={cardData.cvv}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "");
                      if (digits.length <= 4) {
                        handleCardInputChange("cvv", digits);
                      }
                    }}
                    className="w-full border border-[#E4E7EC] rounded-md p-3 text-sm"
                    placeholder="123"
                    maxLength={4}
                    required
                  />
                </div>
              </div>

              {/* Billing Address (Optional) */}
              <div>
                <label
                  htmlFor="billingAddress"
                  className="block text-sm font-medium mb-2"
                >
                  Billing Address{" "}
                  <span className="text-gray-500">(Optional)</span>
                </label>
                <textarea
                  id="billingAddress"
                  value={cardData.billingAddress}
                  onChange={(e) =>
                    handleCardInputChange("billingAddress", e.target.value)
                  }
                  className="w-full border border-[#E4E7EC] rounded-md p-3 text-sm resize-vertical"
                  placeholder="Enter your billing address..."
                  rows={2}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="submit"
                  className="px-6 w-full py-3 bg-primary text-white rounded-md text-sm hover:bg-primary/90 transition-colors"
                >
                  Add Card
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={success} onOpenChange={() => setSuccess(false)}>
          <DialogContent size="sm" className="">
            <div className="flex flex-col justify-center text-center items-center">
              <Image src={userCheck} alt="userchecker" width={80} height={21} />
              <p className="font-semibold text-lg my-2">Card added!</p>
              <p className="text-sm text-gray-500">
                Your card has been successfully added.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="bg-primary text-white p-3 mt-3 rounded-sm w-full"
              >
                Close
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    </DashboardLayout>
  );
};

export default billingsSubscription;
