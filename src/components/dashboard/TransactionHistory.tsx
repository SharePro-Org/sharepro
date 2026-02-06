'use client'

import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { userAtom } from "@/store/User";


const TransactionHistory = ( { transHistory }: { transHistory: any }) => {
  const [user] = useAtom(userAtom);
  const [businessId, setBusinessId] = useState<string>("");


  useEffect(() => {
    if (user?.businessId) {
      setBusinessId(user.businessId);
    }
  }, [user]);


 
 
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };




  return (
    <div>
      <table className="w-full mt-4 text-sm">
        <thead>
          <tr className="bg-[#D1DAF4] text-black">
            <th className="px-4 py-3 font-medium text-left">Ref</th>
            <th className="px-4 py-3 font-medium text-left">Trans Type</th>
            <th className="px-4 py-3 font-medium text-left">Amount</th>
            <th className="px-4 py-3 font-medium text-left">Status</th>
            <th className="px-4 py-3 font-medium text-left">Date</th>

          </tr>
        </thead>
        <tbody>
          {transHistory?.map((transaction: any, index: number) => (
            <tr
              key={transaction.id || index}
              className="border-b border-[#E2E8F0] py-2 last:border-0"
            >
              <td className="px-4 py-3">{(transaction.reference).slice(0, 12)}</td>
              <td className="px-4 font-black font-normal py-3">{transaction.transactionType}</td>
              <td className="px-4 py-3">{transaction.amount}</td>
   
              <td className="px-4 py-3">
                  {transaction.status}
              </td>
              <td className="px-4 py-3">{formatDate(transaction.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) 
};

export default TransactionHistory;
