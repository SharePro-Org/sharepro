"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_INVOICES, GET_BILLING_SUMMARY, GET_PLANS, DELETE_PAYMENT_METHOD, GET_PAYMENT_METHODS } from "@/apollo/queries/billing";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { message } from "antd";

import Image from "next/image";
import userCheck from "../../../../public/assets/Check.svg";
import { UPDATE_SUBSCRIPTION, RENEW_SUBSCRIPTION } from "@/apollo/mutations/billing";
import { AddPaymentMethodV4Form } from "@/components/payment/AddPaymentMethodV4Form";
import { AddBankAccountForm } from "@/components/payment/AddBankAccountForm";
import { GET_WALLET_BALANCE } from "@/apollo/queries/wallet";
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
  subscription?: {
    id: string;
    status: string;
    cancelAtPeriodEnd: boolean;
  };
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
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [upgrade, setUpgrade] = useState(false);
  const [renewPlan, setRenewPlan] = useState(false);
  const [newPlanId, setNewPlanId] = useState("")
  const [isDowngrade, setIsDowngrade] = useState(false)
  const [subscriptionPaymentType, setSubscriptionPaymentType] = useState<'card' | 'wallet'>('card');

  const { data: billingSummary, refetch, loading: summaryLoading } = useQuery<BillingSummaryData>(GET_BILLING_SUMMARY);
  const { data: walletData } = useQuery<{ businessWallet: { balance: number; currency: string } }>(GET_WALLET_BALANCE);

  const { data, loading, error } = useQuery<InvoicesData>(GET_INVOICES, {
    variables: {
      limit: 10,
      offset: 0
    }
  });

  const invoices = data?.myInvoices;

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
      console.error("Error updating subscription:", error);
    },
  });
  const [renewSubscription, { loading: renewingSubscription }] = useMutation(RENEW_SUBSCRIPTION, {
    onCompleted: (data: any) => {
      if (data?.renewSubscription?.success) {
        setRenewPlan(false);
        refetch()
      } else {
        messageApi.open({
          type: 'error',
          content: data?.renewSubscription?.message,
        });
      }
    },
    onError: (error) => {
      console.error("Error renewing subscription:", error);
    },
  });

  const handlePaymentMethodSuccess = () => {
    setOpen(false);
    setSuccess(true);
    refetch();
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

  interface PaymentMethod {
    id: string;
    type: string;
    cardBrand?: string;
    cardLast4?: string;
    displayName?: string;
    isDefault: boolean;
  }

  interface PaymentMethodsData {
    myPaymentMethods: PaymentMethod[];
  }

  const { data: paymentMethodsData } = useQuery<PaymentMethodsData>(GET_PAYMENT_METHODS);

  function handleWalletSubscription(): void {
    const subId = billingSummary?.billingSummary?.subscription?.id;

    if (renewPlan) {
      renewSubscription({
        variables: {
          input: {
            subscriptionId: subId,
            planId: newPlanId,
            paymentType: 'wallet',
          }
        }
      })
    } else if (subId) {
      updateSubscription({
        variables: {
          input: {
            subscriptionId: subId,
            planId: newPlanId,
            paymentType: 'wallet',
          }
        }
      })
    } else {
      updateSubscription({
        variables: {
          input: {
            planId: newPlanId,
            paymentType: 'wallet',
          }
        }
      })
    }
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
              You can renew your plan anytime for the best benefit from the
              product
            </p>
            {billingSummary?.billingSummary?.currentPlan?.name !== "FREE" && (
              <button className="text-sm text-primary" onClick={() => { setRenewPlan(true); setNewPlanId(billingSummary?.billingSummary?.currentPlan?.id ?? '') }}>Renew Plan</button>
            )}
          </div>
          {summaryLoading ? (
            <div className="bg-[#ECF3FF] w-[65%] rounded-md p-3 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ) : billingSummary?.billingSummary?.currentPlan ? (
            <div className="bg-[#ECF3FF] w-[65%] rounded-md p-3">
              <div className="flex justify-between">
                <div className="flex gap-3">
                  <p className="font-semibold">{billingSummary.billingSummary.currentPlan.name}</p>
                  {billingSummary.billingSummary.nextBillingDate && (
                    <span className="my-auto text-sm">
                      Renews on {new Date(billingSummary.billingSummary.nextBillingDate).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  )}
                </div>
                {billingSummary.billingSummary.subscriptionStatus && (
                  <button className={`text-sm text-white rounded-sm p-1 px-4 ${billingSummary.billingSummary.subscriptionStatus === 'active' ? 'bg-[#27AE60]' :
                    billingSummary.billingSummary.subscriptionStatus === 'trial' ? 'bg-blue-500' :
                      'bg-yellow-500'
                    }`}>
                    {billingSummary.billingSummary.subscriptionStatus.charAt(0).toUpperCase() +
                      billingSummary.billingSummary.subscriptionStatus.slice(1)}
                  </button>
                )}
              </div>
              <p className="text-sm my-2">
                {billingSummary.billingSummary.currentPlan.description ||
                  'Access to premium features based on your current plan.'}
              </p>
              <div className="flex gap-2">
                <p className="font-semibold">
                  {new Intl.NumberFormat('en-NG', {
                    style: 'currency',
                    currency: 'NGN'
                  }).format(billingSummary.billingSummary.currentPlan.price)}
                </p>
                <span className="text-sm">/{billingSummary.billingSummary.currentPlan.billablePeriods}</span>
              </div>
            </div>
          ) : (
            <div className="bg-[#ECF3FF] w-[65%] rounded-md p-3">
              <div className="flex justify-between">
                <p className="font-semibold">FREE</p>
                <span className="text-sm text-white rounded-sm p-1 px-4 bg-[#27AE60]">Active</span>
              </div>
              <p className="text-sm my-2">
                You are currently on the Free plan.
              </p>
              <div className="flex gap-2">
                <p className="font-semibold">
                  {new Intl.NumberFormat('en-NG', {
                    style: 'currency',
                    currency: 'NGN'
                  }).format(0)}
                </p>
                <span className="text-sm">/Monthly</span>
              </div>
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
                  {plan?.name === 'FREE' ?
                    null
                    : billingSummary?.billingSummary?.currentPlan?.id !== plan.id && (
                      <button
                        onClick={() => {
                          const currentPrice = Number(billingSummary?.billingSummary?.currentPlan?.price ?? 0);
                          const newPrice = Number(plan.price);
                          const isDowngrading = newPrice < currentPrice;
                          setIsDowngrade(isDowngrading);
                          setUpgrade(true);
                          setNewPlanId(plan.id);
                        }}
                        className="text-sm text-primary"
                      >
                        {Number(plan.price) > Number(billingSummary?.billingSummary?.currentPlan?.price ?? 0)
                          ? 'Upgrade Plan'
                          : 'Downgrade Plan'}
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
                      }).format(invoice.amountPaid)}
                    </td>
                    <td className="px-4 py-3">
                      {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-4 py-1 rounded-[5px] text-white text-xs ${invoice.status.toLowerCase() === 'paid' ? 'bg-[#27AE60]' :
                        invoice.status.toLowerCase() === 'pending' ? 'bg-yellow-500' :
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

            <div className="space-y-4">
              <div>
                <label htmlFor="paymentMethod" className="block text-sm font-medium mb-2">
                  Payment Method *
                </label>
                <select onChange={(e) => setPaymentMethod(e.target.value)} value={paymentMethod} className="w-full border border-[#E4E7EC] rounded-md p-3 text-sm"
                  name="paymentMethod" id="paymentMethod">
                  <option value="card">Credit/Debit Card</option>
                  {/* <option value="bank">Bank Transfer</option> */}    
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2"
                  htmlFor="">Make default</label>
                <Switch
                  checked={isDefault}
                  onChange={(checked: boolean) => setIsDefault(checked)}
                />
              </div>

              {paymentMethod === "card" && (
                <AddPaymentMethodV4Form
                  isDefault={isDefault}
                  onSuccess={handlePaymentMethodSuccess}
                  onClose={() => setOpen(false)}
                  showHeader={false}
                  showDefaultToggle={false}
                />
              )}

              {paymentMethod === "bank" && (
                <AddBankAccountForm
                  isDefault={isDefault}
                  onSuccess={handlePaymentMethodSuccess}
                  onClose={() => setOpen(false)}
                  showHeader={false}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={upgrade || renewPlan} onOpenChange={() => { setUpgrade(false); setRenewPlan(false); setIsDowngrade(false); setSubscriptionPaymentType('card'); }}>
          <DialogContent size="lg" className="">
            <div className="text-center mb-4">
              <p className="font-semibold text-lg mb-1">
                {renewPlan ? "Renew Plan" : isDowngrade ? "Downgrade Plan" : "Upgrade Plan"}
              </p>
              <p className="text-sm text-gray-600">
                Choose how you want to pay
              </p>
            </div>

            {/* Payment Type Selector */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => setSubscriptionPaymentType('card')}
                className={`p-3 rounded-lg border-2 text-sm text-left transition-colors ${
                  subscriptionPaymentType === 'card'
                    ? 'border-primary bg-primary/5'
                    : 'border-[#E4E7EC] hover:border-gray-300'
                }`}
              >
                <p className="font-medium">Card Payment</p>
                <p className="text-xs text-gray-500 mt-0.5">Pay with debit/credit card</p>
              </button>
              <button
                type="button"
                onClick={() => setSubscriptionPaymentType('wallet')}
                className={`p-3 rounded-lg border-2 text-sm text-left transition-colors ${
                  subscriptionPaymentType === 'wallet'
                    ? 'border-primary bg-primary/5'
                    : 'border-[#E4E7EC] hover:border-gray-300'
                }`}
              >
                <p className="font-medium">Wallet</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Balance: {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(walletData?.businessWallet?.balance ?? 0)}
                </p>
              </button>
            </div>

            {/* Card Payment Form */}
            {subscriptionPaymentType === 'card' && (
              <AddPaymentMethodV4Form
                isDefault={true}
                planId={newPlanId}
                planName={plansData?.plans?.find(p => p.id === newPlanId)?.name}
                planPrice={plansData?.plans?.find(p => p.id === newPlanId)?.price}
                subscriptionId={billingSummary?.billingSummary?.subscription?.id}
                isRenewal={renewPlan}
                onSuccess={() => {
                  setUpgrade(false);
                  setRenewPlan(false);
                  setIsDowngrade(false);
                  refetch();
                }}
                onClose={() => {
                  setUpgrade(false);
                  setRenewPlan(false);
                  setIsDowngrade(false);
                }}
                showHeader={false}
                showDefaultToggle={false}
              />
            )}

            {/* Wallet Payment */}
            {subscriptionPaymentType === 'wallet' && (
              <div className="space-y-4">
                <div className="rounded-lg bg-[#ECF3FF] border border-[#D1DAF4] p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Subscribing to</p>
                      <p className="font-semibold text-base mt-0.5">{plansData?.plans?.find(p => p.id === newPlanId)?.name} Plan</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(plansData?.plans?.find(p => p.id === newPlanId)?.price ?? 0)}
                      </p>
                      <p className="text-xs text-gray-500">/month</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Wallet Balance</span>
                    <span className={`text-sm font-semibold ${
                      Number(walletData?.businessWallet?.balance ?? 0) >= Number(plansData?.plans?.find(p => p.id === newPlanId)?.price ?? 0)
                        ? 'text-green-600'
                        : 'text-red-500'
                    }`}>
                      {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(walletData?.businessWallet?.balance ?? 0)}
                    </span>
                  </div>
                </div>

                {Number(walletData?.businessWallet?.balance ?? 0) < Number(plansData?.plans?.find(p => p.id === newPlanId)?.price ?? 0) && (
                  <p className="text-xs text-red-500">Insufficient wallet balance. Please fund your wallet or pay with card.</p>
                )}

                <button
                  type="button"
                  onClick={handleWalletSubscription}
                  disabled={
                    updatingSubscription || renewingSubscription ||
                    Number(walletData?.businessWallet?.balance ?? 0) < Number(plansData?.plans?.find(p => p.id === newPlanId)?.price ?? 0)
                  }
                  className="px-6 w-full py-3 bg-primary text-white rounded-md text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updatingSubscription || renewingSubscription ? "Processing..." : "Pay from Wallet"}
                </button>
              </div>
            )}
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
