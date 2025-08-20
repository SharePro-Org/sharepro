"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, SearchIcon } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";

const HelpCircle = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <DashboardLayout>
      <section className="flex gap-4">
        <div className="w-[40%] bg-white rounded-md p-4">
          <div className="flex gap-2">
            <button onClick={handleGoBack} className="cursor-pointer">
              <ArrowLeft />
            </button>
            <h2 className="text-lg font-semibold">Help Center</h2>
          </div>
          <div className="flex justify-center items-center gap-3 my-3">
            <div className="relative md:mt-0 mt-2">
              <input
                type="text"
                className="bg-[#F9FAFB] md:w-72 w-full border border-[#E4E7EC] p-3 rounded-sm pl-8 text-sm"
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

          <Accordion
            type="single"
            collapsible
            className="border border-[#E5E5EA] rounded-md px-3 my-2"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>Account and Security</AccordionTrigger>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="w-[60%] bg-white rounded-md p-4"></div>
      </section>
    </DashboardLayout>
  );
};

export default HelpCircle;
