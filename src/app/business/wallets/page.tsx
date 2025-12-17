"use client";

import TransactionHistory from "@/components/dashboard/TransactionHistory";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { EyeIcon, SearchIcon } from "lucide-react";
import { useMutation, useQuery } from "@apollo/client/react";
import React, { useEffect, useState } from "react";
import { GET_WALLET_BALANCE, WALLET_TRANSACTIONS, BANK_LIST, GET_WALLET_STATS } from "@/apollo/queries/wallet"
import { useAtom } from "jotai";
import { userAtom } from "@/store/User";
import { message } from "antd";
import { CREATE_DEDICATED_VIRTUAL_ACCOUNT } from "@/apollo/mutations/billing";

interface WalletBalance {
  businessWallet: {
    currency: string;
    balance: number;
    isVerified: boolean;
    accountName: string;
    accountNumber: string;
    bankName: string;
    autoRechargeThreshold: number;
  }
}
interface WalletTransactions {
  walletTransactions: Array<any>;
}
interface WalletStats {
  walletTransactions: Array<{
    transactionType: string;
    amount: number;
    status: string;
  }>;
}


const wallets = () => {

   const { data: balanceData, error, loading } = useQuery<WalletBalance>(GET_WALLET_BALANCE, {
    variables: {}
  })

  const { data: statsData } = useQuery<WalletStats>(GET_WALLET_STATS, {
    variables: {}
  })

  const [isClient, setIsClient] = useState(false);
  const [showWalletBalance, setShowWalletBalance] = useState(false);
  // Wallet Setup modal state
  const [user] = useAtom(userAtom);
  
  const [walletOpen, setWalletOpen] = useState(false);
  const [bankSearch, setBankSearch] = useState("");
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);
  const [walletForm, setWalletForm] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    bankCode: "",
    accountNumber: "",
    bvn: ""
  });

  useEffect(() => {
    if (!balanceData?.businessWallet?.isVerified) {
      setWalletOpen(true);
    }
    setIsClient(true);

    setWalletForm(f => ({ ...f, email: user?.email }));
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.bank-dropdown-container')) {
        setIsBankDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { data: bankList } = useQuery<any>(BANK_LIST, {
    variables: {}
  })

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

 
  const { data: transactionsData, error: transactionError, loading: transactionLoading } = useQuery<WalletTransactions>(WALLET_TRANSACTIONS, {
    variables: {}
  })

  const toggleWalletBalance = () => {
    setShowWalletBalance(!showWalletBalance);
  }

  // Calculate total deposits and debits
  const totalDeposit = statsData?.walletTransactions
    ?.filter(t => t.transactionType === 'DEPOSIT' && t.status === 'COMPLETED')
    ?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const totalDebit = statsData?.walletTransactions
    ?.filter(t => ['WITHDRAWAL', 'SUBSCRIPTION', 'FEE'].includes(t.transactionType) && t.status === 'COMPLETED')
    ?.reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0) || 0;

  // Filter banks based on search
  const filteredBanks = bankList?.bankList?.filter((bank: any) =>
    bank.name.toLowerCase().includes(bankSearch.toLowerCase())
  ) || [];

  const getSelectedBankName = () => {
    const bank = bankList?.bankList?.find((b: any) => b.code === walletForm.bankCode);
    return bank?.name || "";
  };

  const [createDVA] = useMutation(CREATE_DEDICATED_VIRTUAL_ACCOUNT, {
      onCompleted: (data: any) => {
      if (data?.createDedicatedVirtualAccount?.success) {
         setWalletOpen(true)
        message.success(data?.createDedicatedVirtualAccount?.message);
      } else {
        message.error(
          data?.createDedicatedVirtualAccount?.message || "Failed to create campaign."
        );
         setWalletOpen(false)
      }
      },
      onError: (error) => {
        console.error("Error creating dva:", error);
      },
    });
  
    const handleCreateDVA = () =>{
      console.log("DVA :", walletForm)
     createDVA({ variables:{
        input:{
          ...walletForm
        }
      }})
    }

  return (
    <DashboardLayout>
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Available Balance Section */}
          <div className={`p-6 rounded-lg shadow-sm ${
            (balanceData?.businessWallet?.balance || 0) <= (balanceData?.businessWallet?.autoRechargeThreshold || 0)
              ? 'bg-red-50 border-2 border-red-300'
              : 'bg-white'
          }`}>
            <p className="text-sm text-[#030229B2] mb-2">Available Balance</p>
            {showWalletBalance ? (
              <h1 className={`text-3xl my-3 font-bold ${
                (balanceData?.businessWallet?.balance || 0) <= (balanceData?.businessWallet?.autoRechargeThreshold || 0)
                  ? 'text-red-600'
                  : 'text-[#030229]'
              }`}>
                {`${balanceData?.businessWallet?.currency || 'NGN'} ${Number(balanceData?.businessWallet?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </h1>
            ) : (
              <h1 className="text-3xl my-3 font-bold text-[#030229]">****</h1>
            )}
            {(balanceData?.businessWallet?.balance || 0) <= (balanceData?.businessWallet?.autoRechargeThreshold || 0) && showWalletBalance && (
              <div className="mb-2 p-2 bg-red-100 rounded-md">
                <p className="text-xs text-red-700 font-medium">
                  ⚠️ Low Balance Warning
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Threshold: {balanceData?.businessWallet?.currency || 'NGN'} {Number(balanceData?.businessWallet?.autoRechargeThreshold || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            )}
            <div className="flex justify-start">
              <button onClick={toggleWalletBalance} className="text-[#CCCCCC] hover:text-[#030229] transition-colors">
                <EyeIcon size={20} />
              </button>
            </div>
          </div>

          {/* Total Deposits & Debits Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-[#030229B2] mb-2">Transaction Summary</p>
            <div className="space-y-3 my-3">
              <div>
                <p className="text-xs text-gray-500">Total Deposits</p>
                   <p className="text-xl font-semibold text-green-600">
                    {`${balanceData?.businessWallet?.currency || 'NGN'} ${totalDeposit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Debits</p>
                  <p className="text-xl font-semibold text-red-600">
                    {`${balanceData?.businessWallet?.currency || 'NGN'} ${totalDebit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </p>
              </div>
            </div>
          </div>

          {/* Wallet Account Details Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-[#030229B2] mb-2">Wallet Account Details</p>
            <div className="space-y-2 my-3">
              {balanceData?.businessWallet?.bankName && (
                <div>
                  <p className="text-xs text-gray-500">Bank Name</p>
                  <p className="text-sm font-medium text-[#030229]">{balanceData.businessWallet.bankName}</p>
                </div>
              )}
              {balanceData?.businessWallet?.accountNumber && (
                <div>
                  <p className="text-xs text-gray-500">Account Number</p>
                  <p className="text-sm font-medium text-[#030229]">{balanceData.businessWallet.accountNumber}</p>
                </div>
              )}
              {balanceData?.businessWallet?.accountName && (
                <div>
                  <p className="text-xs text-gray-500">Account Name</p>
                  <p className="text-sm font-medium text-[#030229]">{balanceData.businessWallet.accountName}</p>
                </div>
              )}
              {!balanceData?.businessWallet?.bankName && !balanceData?.businessWallet?.accountNumber && (
                <p className="text-sm text-gray-400 italic">No account details available</p>
              )}
            </div>
          </div>
        </div>
       
        <section className="bg-white p-4 rounded-md mt-4">
          <div className="flex flex-col lg:flex-row justify-between gap-4">
            <p className="text-black font-semibold my-auto text-base">
              Transaction History
            </p>
            <div className="flex gap-4">
              <div className="relative">
                <input
                  type="text"
                  className="w-full md:w-80 border border-[#E4E7EC] p-3 rounded-sm pl-8 text-sm"
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
            <div className="bg-white rounded-[32px] p-8 w-full max-w-3xl mx-4 relative">
              <button className="absolute right-6 top-6" onClick={() => setWalletOpen(false)}>✕</button>
              <h2 className="text-center text-2xl font-bold mb-2 mt-2">Wallet Setup</h2>
              <p className="text-center text-gray-600 mb-4">You can use personal bank information, if you do not have business bank information.</p>
              <div className="bg-[#EEF3FF] rounded-xl p-4 mb-6">
                <span className="font-bold text-sm">Note:</span> <span className="text-sm">Sharepro does not save your BVN, It will only be used for verification purposes.</span>
              </div>
              <form className="space-y-4 grid grid-cols-2 gap-3" onSubmit={e =>  e.preventDefault()}>
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
                  <input disabled type="email" className="border border-[#E4E7EC] rounded-md p-3 w-full" placeholder="e.g business email address" value={walletForm.email} onChange={e => setWalletForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div className="bank-dropdown-container">
                  <label className="block text-sm font-medium mb-1">Select Bank</label>
                  <div className="relative">
                    <div
                      className="border border-[#E4E7EC] rounded-md p-3 w-full bg-white text-gray-900 focus-within:ring-2 focus-within:ring-[#24348B] focus-within:border-[#24348B] outline-none cursor-pointer transition-all duration-200 hover:border-[#24348B] flex items-center justify-between"
                      onClick={() => setIsBankDropdownOpen(!isBankDropdownOpen)}
                    >
                      <span className={walletForm.bankCode ? "text-gray-900" : "text-gray-400"}>
                        {walletForm.bankCode ? getSelectedBankName() : "Select your bank"}
                      </span>
                      <svg className={`w-4 h-4 transition-transform ${isBankDropdownOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>

                    {isBankDropdownOpen && (
                      <div className="absolute z-50 mt-1 w-full bg-white border border-[#E4E7EC] rounded-md shadow-lg max-h-64 overflow-hidden">
                        <div className="p-2 border-b border-[#E4E7EC]">
                          <div className="relative">
                            <input
                              type="text"
                              className="w-full pl-8 pr-3 py-2 border border-[#E4E7EC] rounded-md focus:ring-2 focus:ring-[#24348B] focus:border-[#24348B] outline-none text-sm"
                              placeholder="Search banks..."
                              value={bankSearch}
                              onChange={e => setBankSearch(e.target.value)}
                              onClick={e => e.stopPropagation()}
                            />
                            <SearchIcon size={14} className="absolute top-2.5 left-2 text-gray-400" />
                          </div>
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                          {filteredBanks.length > 0 ? (
                            filteredBanks.map((bank: any) => (
                              <div
                                key={bank.code}
                                className={`px-3 py-2 cursor-pointer hover:bg-[#EEF3FF] transition-colors ${
                                  walletForm.bankCode === bank.code ? 'bg-[#EEF3FF] text-[#24348B] font-medium' : 'text-gray-900'
                                }`}
                                onClick={() => {
                                  setWalletForm(f => ({ ...f, bankCode: bank.code }));
                                  setBankSearch("");
                                  setIsBankDropdownOpen(false);
                                }}
                              >
                                {bank.name}
                              </div>
                            ))
                          ) : (
                            <div className="px-3 py-4 text-center text-gray-500 text-sm">
                              No banks found matching "{bankSearch}"
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Account Number</label>
                  <input type="text" className="border border-[#E4E7EC] rounded-md p-3 w-full" placeholder="02334456789" value={walletForm.accountNumber} onChange={e => setWalletForm(f => ({ ...f, accountNumber: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bank Verification Number (BVN)</label>
                  <input type="text" className="border border-[#E4E7EC] rounded-md p-3 w-full" placeholder="02334456709" value={walletForm.bvn} onChange={e => setWalletForm(f => ({ ...f, bvn: e.target.value }))} />
                </div>
                <div className="pt-2 col-span-2">
                  <button type="submit" className="w-full py-4 rounded-xl bg-[#24348B] text-white text-lg font-medium" onClick={handleCreateDVA}>Proceed</button>
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
