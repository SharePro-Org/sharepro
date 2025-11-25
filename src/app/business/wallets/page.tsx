"use client";

import TransactionHistory from "@/components/dashboard/TransactionHistory";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { EyeIcon, SearchIcon } from "lucide-react";
import { useQuery } from "@apollo/client/react";
import React, { useEffect, useState } from "react";
import {GET_WALLET_BALANCE, WALLET_TRANSACTIONS, BANK_LIST} from "@/apollo/queries/wallet"

interface WalletBalance {
  businessWallet: {
    currency: string;
    balance: number;
  }
}
interface WalletTransactions {
  walletTransactions: Array<any>;
}


const wallets = () => {
  const [isClient, setIsClient] = useState(false);
  const [showWalletBalance, setShowWalletBalance] = useState(false);
  // Wallet Setup modal state
      const [walletOpen, setWalletOpen] = useState(true);
      const [walletForm, setWalletForm] = useState({
          firstName: "",
          lastName: "",
          email: "",
          bank: "",
          accountNumber: "",
          bvn: ""
      });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {data:bankList} = useQuery<any>(BANK_LIST,{
    variables:{}
  })
console.log("Bank List:", bankList);
  const [cash, setCash] = useState({
    series: [30, 70],
    options: {
      chart: {
        width: 380,
        type: "pie" as const,
      },
      colors: ["#5977D9", "#A16AD4"],
      labels: ["Loyalty Campaign", "Referral Campaign"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom" as const,
            },
          },
        },
      ],
    },
  });

  const [state, setState] = React.useState({
    series: [44, 55, 41, 17, 15],
    options: {
      chart: {
        type: "donut" as const,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom" as const,
            },
          },
        },
      ],
      labels: ["Airtime", "Vouchers", "Discount", "Free Shipping", "Cashback"],
    },
  });

  const {data:balanceData, error, loading} = useQuery<WalletBalance>(GET_WALLET_BALANCE,{
    variables:{}
  })
  const {data:transactionsData, error:transactionError, loading:transactionLoading} = useQuery<WalletTransactions>(WALLET_TRANSACTIONS,{
    variables:{}
  })

  const toggleWalletBalance = () => {
   setShowWalletBalance(!showWalletBalance);
  }
  return (
    <DashboardLayout>
      <>
        <section className="bg-white p-4 rounded-md ">
          <div className="flex gap-4">
            {/* <button className="bg-primary p-3 rounded-sm text-white">
              Fund Wallet
            </button> */}
          </div>
        </section>
        <section className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-white p-4 rounded-md">
            <p className="text-sm text-[#030229B2]">Available Balance</p>
            {showWalletBalance ? <h1 className="text-2xl my-3 font-bold">{`${balanceData?.businessWallet?.currency || ''} ${balanceData?.businessWallet?.balance || 0}`}</h1> : <h1 className="text-2xl my-3 font-bold">****</h1>}
            <div className="flex justify-between">
              <EyeIcon size={20} className="text-[#CCCCCC]" onClick={toggleWalletBalance} />
            </div>
          </div>
        </section>
        <section className="bg-white p-4 rounded-md mt-4">
          <div className="lg:flex justify-between">
            <p className="text-black font-semibold my-auto text-base">
              Transaction History
            </p>
            <div className="flex gap-4">
              <div className="relative md:mt-0 mt-2">
                <input
                  type="text"
                  className="md:w-80 w-full border border-[#E4E7EC] p-3 rounded-sm pl-8 text-sm"
                  placeholder="Search Transactions"
                />

                <SearchIcon
                  size={16}
                  className="absolute top-4 left-3 text-gray-500"
                />
              </div>
            </div>
          </div>
          <TransactionHistory transHistory={transactionsData?.walletTransactions} />
        </section>
        {walletOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                        <div className="bg-white rounded-[32px] p-8 w-full max-w-lg mx-4 relative">
                            <button className="absolute right-6 top-6" onClick={() => setWalletOpen(false)}>✕</button>
                            <h2 className="text-center text-2xl font-bold mb-2 mt-2">Wallet Setup</h2>
                            <p className="text-center text-gray-600 mb-4">You can use personal bank information, if you do not have business bank information.</p>
                            <div className="bg-[#EEF3FF] rounded-xl p-4 mb-6">
                                <span className="font-bold text-sm">Note:</span> <span className="text-sm">Sharepro does not save your BVN, It will only be used for verification purposes.</span>
                            </div>
                            <form className="space-y-4" onSubmit={e => { e.preventDefault(); alert('Wallet info submitted (UI only)'); setWalletOpen(false); }}>
                                <div>
                                    <label className="block text-sm font-medium mb-1">First Name *</label>
                                    <input type="text" className="border border-[#E4E7EC] rounded-md p-3 w-full" placeholder="e.g John" value={walletForm.firstName} onChange={e => setWalletForm(f => ({ ...f, firstName: e.target.value }))} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Last Name*</label>
                                    <input type="text" className="border border-[#E4E7EC] rounded-md p-3 w-full" placeholder="e.g James" value={walletForm.lastName} onChange={e => setWalletForm(f => ({ ...f, lastName: e.target.value }))} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email Address</label>
                                    <input type="email" className="border border-[#E4E7EC] rounded-md p-3 w-full" placeholder="e.g business email address" value={walletForm.email} onChange={e => setWalletForm(f => ({ ...f, email: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Select Bank</label>
                                    <select className="border border-[#E4E7EC] rounded-md p-3 w-full" value={walletForm.bank} onChange={e => setWalletForm(f => ({ ...f, bank: e.target.value }))} required>
                                        <option value="">Select Bank</option>
                                         {bankList?.bankList?.map((bank: any) => (
                                            <option key={bank.code} value={bank.code}>{bank.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Account Number</label>
                                    <input type="text" className="border border-[#E4E7EC] rounded-md p-3 w-full" placeholder="02334456789" value={walletForm.accountNumber} onChange={e => setWalletForm(f => ({ ...f, accountNumber: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Bank Verification Number (BVN)</label>
                                    <input type="text" className="border border-[#E4E7EC] rounded-md p-3 w-full" placeholder="02334456709" value={walletForm.bvn} onChange={e => setWalletForm(f => ({ ...f, bvn: e.target.value }))} />
                                </div>
                                <div className="pt-2">
                                    <button type="submit" className="w-full py-4 rounded-xl bg-[#24348B] text-white text-lg font-medium">Proceed</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
      </>
    </DashboardLayout>
  );
};

export default wallets;
