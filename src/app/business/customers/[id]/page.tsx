"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const singleCustomer = () => {
  const router = useRouter();

  return (
    <DashboardLayout>
      <>
        <section className="bg-white rounded-md md:p-6 p-3 mb-4">
          <div className="flex justify-between mb-4">
            <button
              className="text-black cursor-pointer flex items-center"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-3" />
              <span className="text-lg font-semibold capitalize">
                User Activity
              </span>
            </button>
          </div>
          <div className="bg-[#D1DAF4] rounded-md p-4">
            <div className="flex gap-4 justify-between">
              <div className="m-3 pr-3">
                <h2 className="text-xs mb-2">User Name</h2>
                <p className="text-sm">john Doe</p>
              </div>
              <div className="m-3 pr-3">
                <h2 className="text-xs mb-2">Campaign Name</h2>
                <p className="text-sm">john Doe</p>
              </div>
              <div className="m-3 pr-3">
                <h2 className="text-xs mb-2">Campaign Type</h2>
                <p className="text-sm">Layalty</p>
              </div>
              <div className="m-3 pr-3">
                <h2 className="text-xs mb-2">Rewards</h2>
                <p className="text-sm">2k</p>
              </div>
              <div className="m-3">
                <h2 className="text-xs mb-2">Referral Tier</h2>
                <p className="text-sm">1</p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 border border-[#E2E8F0] rounded-md">
            <p className="font-semibold">Referees</p>

            <div className="overflow-x-auto">
              <table className="w-full mt-4 text-sm">
                <thead>
                  <tr className="bg-[#D1DAF4] text-black">
                    <th className="px-4 py-3 font-medium text-left">User</th>
                    <th className="px-4 py-3 font-medium text-left">Type</th>
                    <th className="px-4 py-3 font-medium text-left">Points</th>
                    <th className="px-4 py-3 font-medium text-left">Date</th>
                    <th className="px-4 py-3 font-medium text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </>
    </DashboardLayout>
  );
};

export default singleCustomer;
