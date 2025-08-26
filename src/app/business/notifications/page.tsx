"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ArrowLeft, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { BsCurrencyDollar } from "react-icons/bs";

const notifications = () => {
  const router = useRouter();

  return (
    <DashboardLayout>
      <section className="bg-white rounded-md md:p-6 p-3 ">
        <button
          className="text-black cursor-pointer flex mb-6 items-center"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-3" />
          <span className="text-lg font-semibold capitalize">
            Notifications
          </span>
        </button>

        <>
          <div className="p-3 border-b border-b-[#EAECF0] flex justify-between">
            <div className="flex gap-3">
              <button className="bg-[#ABEFC6] flex justify-center items-center w-12 h-12 text-[#067647] rounded-sm">
                <UserCircle />
              </button>
              <div className="my-auto">
                <p className="font-medium mb-1">Successfull Referral</p>
                <p className="text-sm">Lorem ipsum dolor sit amet.</p>
              </div>
            </div>
            <p className="my-auto text-sm">Just Now</p>
          </div>
          <div className="p-3 border-b border-b-[#EAECF0] flex justify-between">
            <div className="flex gap-3">
              <button className="bg-[#FEDF89] flex justify-center items-center w-12 h-12 text-[#B54708] rounded-sm">
                <BsCurrencyDollar size={24} />
              </button>
              <div className="my-auto">
                <p className="font-medium mb-1">Referral Bonus Earned</p>
                <p className="text-sm">Lorem ipsum dolor sit amet.</p>
              </div>
            </div>
            <p className="my-auto text-sm">Just Now</p>
          </div>
        </>
      </section>
    </DashboardLayout>
  );
};

export default notifications;
