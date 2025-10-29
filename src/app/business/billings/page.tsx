"use client";

import { Plan } from "@/apollo/types";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_INVOICES, GET_BILLING_SUMMARY, GET_PLANS, DELETE_PAYMENT_METHOD } from "@/apollo/queries/billing";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Button, Dropdown, message } from "antd";

import Image from "next/image";
import userCheck from "../../../../public/assets/Check.svg";
import { ADD_PAYMENT_METHOD, UPDATE_SUBSCRIPTION } from "@/apollo/mutations/billing";
interface Invoice {
  id: string;
  status: string;
  amountDue: number;
  amountPaid: number;
  currency: string;
  issueDate: string;
  dueDate: string;
  invoiceNumber: string;
  createdAt: string;
  subscription: {
    id: string;
    plan: {
      name: string;
    };
  };
}

interface InvoicesData {
  myInvoices: Invoice[];
}

interface BillingSummary {
  currentPlan: {
    id: string;
    name: string;
    price: number;
    billablePeriods: string;
    description?: string;
  };
  subscriptionStatus: string;
  nextBillingDate: string;
  amountDue: number;
  paymentMethod?: {
    id: string;
    displayName: string;
    cardBrand: string;
    cardLast4: string;
  };
}

interface BillingSummaryData {
  billingSummary: BillingSummary;
}

const billingsSubscription = () => {
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isDefault, setIsDefault] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [messageApi, contextHolder] = message.useMessage();
  const [paymentType, setPaymentType] = useState("card");
  const [upgrade, setUpgrade] = useState(false);

  const { data: billingSummary, refetch, loading: summaryLoading } = useQuery<BillingSummaryData>(GET_BILLING_SUMMARY);

  const { data, loading, error } = useQuery<InvoicesData>(GET_INVOICES, {
    variables: {
      limit: 10,
      offset: 0
    }
  });

  const invoices = data?.myInvoices;

  const [addPaymentMethod, { loading: addingPaymentMethod }] = useMutation(ADD_PAYMENT_METHOD, {
    onCompleted: (data: any) => {
      if (data?.addPaymentMethod?.success) {
        // setSuccess(true);
        window.location.href = data?.addPaymentMethod?.checkOutData?.checkoutUrl;
      } else {

      }
    },
    onError: (error) => {
      console.error("Error adding payment method:", error);
    },
  });

  const [updateSubscription, { loading: updatingSubscription }] = useMutation(UPDATE_SUBSCRIPTION, {
    onCompleted: (data: any) => {
      if (data?.updateSubscription?.success) {
        setUpgrade(false);
        refetch()
      } else {
        messageApi.open({
          type: 'error',
          content: data?.updateSubscription?.message,
        });
      }
    },
    onError: (error) => {
      console.error("Error adding payment method:", error);
    },
  });

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle card submission here
    addPaymentMethod({
      variables: {
        input: {
          methodType: "card",
          isDefault
        }
      }
    })

    // setSuccess(true);
    // setOpen(false);
  };

  // Fetch all available plans from API
  interface PlanAPI {
    id: string;
    name: string;
    description: string;
    price: number;
    billablePeriods: string;
    maxCampaigns: number;
    maxReferrals: number;
    maxTeamMembers: number;
    analyticsEnabled: boolean;
    customBranding: boolean;
    prioritySupport: boolean;
    isPopular: boolean;
  }

  const { data: plansData, loading: plansLoading, error: plansError } = useQuery<{ plans: PlanAPI[] }>(GET_PLANS);

  function handleUpgradePlan(id: string, paymentType?: string): void {
    updateSubscription({
      variables: {
        input: {
          planId: id,
          subscriptionId: billingSummary?.billingSummary ? billingSummary?.billingSummary?.currentPlan?.id : '',
          paymentType: paymentType || undefined
        }
      }
    })
  }

  const [deletePaymentMethod] = useMutation(DELETE_PAYMENT_METHOD, {
    onCompleted: (data) => {
      console.log("Payment method deleted:", data);
      refetch();
    },
    onError: (error) => {
      console.error("Error deleting payment method:", error);
    },
  });


  return (
    <DashboardLayout>
      <>
        {contextHolder}
        <h1 className="text-lg font-semibold">Billing & Subscription</h1>
        <section className="my-4 bg-white rounded-md p-4 flex gap-3">
          <div className="w-[35%]">
            <p className="font-medium">Current Plan</p>
            <p className="text-sm my-2">
              You can update your plan anytime for the best benefit from the
              product
            </p>
            {/* <button className="text-sm text-primary">Upgrade Plan</button> */}
          </div>
          {summaryLoading ? (
            <div className="bg-[#ECF3FF] w-[65%] rounded-md p-3 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ) : billingSummary?.billingSummary ? (
            <div className="bg-[#ECF3FF] w-[65%] rounded-md p-3">
              <div className="flex justify-between">
                <div className="flex gap-3">
                  <p className="font-semibold">{billingSummary?.billingSummary?.currentPlan?.name}</p>
                  <span className="my-auto text-sm">
                    Renews on {new Date(billingSummary?.billingSummary?.nextBillingDate).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <button className={`text-sm text-white rounded-sm p-1 px-4 ${billingSummary?.billingSummary?.subscriptionStatus === 'active' ? 'bg-[#27AE60]' :
                  billingSummary?.billingSummary?.subscriptionStatus === 'trial' ? 'bg-blue-500' :
                    'bg-yellow-500'
                  }`}>
                  {billingSummary?.billingSummary?.subscriptionStatus?.charAt(0).toUpperCase() +
                    billingSummary?.billingSummary?.subscriptionStatus?.slice(1)}
                </button>
              </div>
              <p className="text-sm my-2">
                {billingSummary?.billingSummary?.currentPlan?.description ||
                  'Access to premium features based on your current plan.'}
              </p>
              <div className="flex gap-2">
                <p className="font-semibold">
                  {new Intl.NumberFormat('en-NG', {
                    style: 'currency',
                    currency: 'NGN'
                  }).format(billingSummary?.billingSummary?.currentPlan?.price)}
                </p>
                <span className="text-sm">/{billingSummary?.billingSummary?.currentPlan?.billablePeriods}</span>
              </div>
            </div>
          ) : (
            <div className="bg-[#ECF3FF] w-[65%] rounded-md p-3">
              <p className="text-center text-sm text-gray-500">No active subscription found</p>
            </div>
          )}
        </section>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plansLoading ? (
            <div className="col-span-3 flex justify-center items-center py-8">
              <span className="text-gray-500">Loading plans...</span>
            </div>
          ) : plansError ? (
            <div className="col-span-3 flex justify-center items-center py-8">
              <span className="text-red-500">Error loading plans</span>
            </div>
          ) : plansData?.plans?.length ? (
            plansData.plans.map((plan) => (
              <div key={plan.id} className="bg-white rounded-md p-4 border border-[#E5E5EA]">
                <div className="border-b border-b-[#E5E5EA] pb-3">
                  <h2 className="text-primary mb-2 flex items-center gap-2">
                    {plan.name}
                    {plan.isPopular && (
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">Popular</span>
                    )}
                  </h2>
                  <div className="flex gap-2">
                    <span className="font-semibold text-lg">
                      {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(plan.price)}
                    </span>
                    <span className="my-auto">/{plan.billablePeriods}</span>
                  </div>
                </div>
                <ul className="text-sm space-y-1 my-3 min-h-[120px]">
                  {plan.description && (
                    <li className="flex items-center gap-2 my-1">
                      <span className="text-black">✓</span>
                      {plan.description}
                    </li>
                  )}
                  <li className="flex items-center gap-2 my-1">
                    <span className="text-black">✓</span>
                    Max Campaigns: {plan.maxCampaigns}
                  </li>
                  <li className="flex items-center gap-2 my-1">
                    <span className="text-black">✓</span>
                    Max Referrals: {plan.maxReferrals}
                  </li>
                  <li className="flex items-center gap-2 my-1">
                    <span className="text-black">✓</span>
                    Max Team Members: {plan.maxTeamMembers}
                  </li>
                  <li className="flex items-center gap-2 my-1">
                    <span className="text-black">✓</span>
                    Analytics: {plan.analyticsEnabled ? 'Yes' : 'No'}
                  </li>
                  <li className="flex items-center gap-2 my-1">
                    <span className="text-black">✓</span>
                    Custom Branding: {plan.customBranding ? 'Yes' : 'No'}
                  </li>
                  <li className="flex items-center gap-2 my-1">
                    <span className="text-black">✓</span>
                    Priority Support: {plan.prioritySupport ? 'Yes' : 'No'}
                  </li>
                </ul>
                <div className="flex justify-between mt-2">
                  <span></span>
                  {billingSummary?.billingSummary?.currentPlan?.id !== plan.id && (
                    <button onClick={() => { setUpgrade(true) }} className="text-sm text-primary">
                      Upgrade Plan
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 flex justify-center items-center py-8">
              <span className="text-gray-500">No plans available</span>
            </div>
          )}
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
            {summaryLoading ? (
              <div className="animate-pulse flex justify-center">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ) : billingSummary?.billingSummary?.paymentMethod ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-[#F9FAFB] p-3 rounded-md">
                    <span className="font-medium">{billingSummary.billingSummary.paymentMethod.cardBrand.toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-medium">{billingSummary.billingSummary.paymentMethod.displayName}</p>
                    <p className="text-sm text-gray-500">**** **** **** {billingSummary.billingSummary.paymentMethod.cardLast4}</p>
                  </div>
                </div>
                <button onClick={() => deletePaymentMethod({ variables: { paymentMethodId: billingSummary?.billingSummary?.paymentMethod?.id } })} className="text-sm text-red-500 hover:text-red-600">Remove</button>
              </div>
            ) : (
              <p className="text-center text-sm text-gray-500">No Active Card</p>
            )}
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
                <th className="px-4 py-3 font-medium text-left">Due Date</th>
                <th className="px-4 py-3 font-medium text-left">Status</th>
                <th className="px-4 py-3 font-medium text-left">Invoice No</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">Loading...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-red-500">Error loading invoices</td>
                </tr>
              ) : invoices?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">No invoices found</td>
                </tr>
              ) : (
                invoices?.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-[#E2E8F0] py-2 last:border-0"
                  >
                    <td className="px-4 py-3">{new Date(invoice.issueDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{invoice.subscription?.plan?.name || '-'}</td>
                    <td className="px-4 py-3">
                      {new Intl.NumberFormat('en-NG', {
                        style: 'currency',
                        currency: invoice.currency || 'NGN'
                      }).format(invoice.amountDue)}
                    </td>
                    <td className="px-4 py-3">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-4 py-1 rounded-[5px] text-white text-xs ${invoice.status === 'paid' ? 'bg-green-500' :
                        invoice.status === 'pending' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {invoice.invoiceNumber}
                      {/* {invoice.status === 'paid' && (
                        <button className="text-primary text-sm hover:underline">
                          Download
                        </button>
                      )} */}
                    </td>
                  </tr>
                ))
              )}
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

              <div>
                <label htmlFor="paymentMethod" className="block text-sm font-medium mb-2">
                  Payment Method *
                </label>
                <select onChange={(e) => setPaymentMethod(e.target.value)} value={paymentMethod} className="w-full border border-[#E4E7EC] rounded-md p-3 text-sm"
                  name="paymentMethod" id="paymentMethod">
                  <option value="card">Credit/Debit Card</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2"
                  htmlFor="">Make default</label>
                <Switch
                  checked={isDefault}
                  onChange={(checked: boolean) => setIsDefault(checked)}
                  disabled={addingPaymentMethod}
                />
              </div>


              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="submit"
                  className="px-6 w-full py-3 bg-primary text-white rounded-md text-sm hover:bg-primary/90 transition-colors"
                >
                  {addingPaymentMethod ? "Adding..." : "Add Card"}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={upgrade} onOpenChange={() => setUpgrade(false)}>
          <DialogContent size="lg" className="">
            <div className="text-center mb-6">
              <p className="font-semibold text-lg text-center mb-2">
                Select Payment Method
              </p>
            </div>

            <form className="space-y-4">

              <div>
                <label htmlFor="paymentType" className="block text-sm font-medium mb-2">
                  Payment Method *
                </label>
                <select onChange={(e) => setPaymentType(e.target.value)} value={paymentType} className="w-full border border-[#E4E7EC] rounded-md p-3 text-sm"
                  name="paymentType" id="paymentType">
                  <option value="card">Credit/Debit Card</option>
                  <option value="wallet">Wallet</option>
                </select>
              </div>



              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    const planId = billingSummary?.billingSummary?.currentPlan?.id;
                    if (typeof handleUpgradePlan === 'function' && planId) {
                      handleUpgradePlan(planId, paymentType);
                    } else {
                      messageApi.open({
                        type: 'error',
                        content: 'No plan selected for upgrade.',
                      });
                    }
                  }}
                  className="px-6 w-full py-3 bg-primary text-white rounded-md text-sm hover:bg-primary/90 transition-colors"
                >
                  {updatingSubscription ? "Upgrading..." : "Upgrade Plan"}
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
