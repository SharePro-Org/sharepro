"use client";

import { ArrowLeft, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const walkthroughs = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <section className="bg-white rounded-md p-4">
      <div className="flex gap-2">
        <button onClick={handleGoBack} className="cursor-pointer">
          <ArrowLeft />
        </button>
        <h2 className="text-lg font-semibold">WalkThroughs</h2>
      </div>
      <div className="flex my-3 gap-3">
        <div className="relative md:mt-0 mt-2">
          <input
            type="text"
            className="bg-[#F9FAFB] md:w-80 w-full border border-[#E4E7EC] p-3 rounded-sm pl-8 text-sm"
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
      <div className="flex mb-3 text-sm gap-3 flex-wrap">
        <button className="rounded-md p-3 border border-[#E5E5EA]">
          All Tutorials
        </button>
        <button className="rounded-md p-3 border border-[#E5E5EA]">
          Getting Started
        </button>
        <button className="rounded-md p-3 border border-[#E5E5EA]">
          Campaign Setup
        </button>
        <button className="rounded-md p-3 border border-[#E5E5EA]">
          Analytics
        </button>
        <button className="rounded-md p-3 border border-[#E5E5EA]">
          Team & Settings
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div></div>
      </div>
    </section>
  );
};

export default walkthroughs;
