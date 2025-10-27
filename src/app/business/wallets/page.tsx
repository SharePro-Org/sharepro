"use client";

import TransactionHistory from "@/components/dashboard/TransactionHistory";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { EyeIcon, SearchIcon } from "lucide-react";
import { useQuery } from "@apollo/client/react";
import React, { useEffect, useState } from "react";
import {GET_WALLET_BALANCE, WALLET_TRANSACTIONS} from "@/apollo/queries/wallet"

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

  useEffect(() => {
    setIsClient(true);
  }, []);

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
            <button className="bg-primary p-3 rounded-sm text-white">
              Fund Wallet
            </button>
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
      </>
    </DashboardLayout>
  );
};

export default wallets;
