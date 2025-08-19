import DashboardLayout from "@/components/dashboard/DashboardLayout";
import React from "react";
import { HelpCircle, MessageCircleQuestion, SearchIcon } from "lucide-react";
import { TbArrowGuide } from "react-icons/tb";

const helpAndSupport = () => {
  return (
    <DashboardLayout>
      <>
        <section className="bg-white rounded-md text-center p-10">
          <h2 className="text-lg font-semibold">Help and Support</h2>
          <p className="my-2">
            Find answers, reach support, or explore tutorials to get the most
            out of your experience.
          </p>

          <div className="flex justify-center items-center gap-3">
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
        </section>
        <section className="my-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-md p-4">
            <div className="bg-[#ECF3FF] rounded-sm p-3 w-12 h-12 flex items-center justify-center mb-3">
              <HelpCircle className="text-primary" />
            </div>
            <p className="font-semibold">Help Center</p>
            <p className="my-2 text-sm">
              Quick answers to common questions. Browse articles, how-tos, and
              troubleshooting tips.
            </p>
            <button className="border-b text-sm">Browse Help Articles</button>
          </div>

          <div className="bg-white rounded-md p-4">
            <div className="bg-[#ECF3FF] rounded-sm p-3 w-12 h-12 flex items-center justify-center mb-3">
              <MessageCircleQuestion className="text-primary" />
            </div>
            <p className="font-semibold">Support Request</p>
            <p className="my-2 text-sm">
              Need to speak with someone? Our support team is here to help.
            </p>
            <button className="border-b text-sm">Submit a Request</button>
          </div>

          <div className="bg-white rounded-md p-4">
            <div className="bg-[#ECF3FF] rounded-sm p-3 w-12 h-12 flex items-center justify-center mb-3">
              <TbArrowGuide className="text-primary" />
            </div>
            <p className="font-semibold">Walkthroughs</p>
            <p className="my-2 text-sm">
              Step-by-step video guides to help you onboard, explore features,
              and solve issues faster.
            </p>
            <button className="border-b text-sm">Watch Tutorials</button>
          </div>
        </section>
      </>
    </DashboardLayout>
  );
};

export default helpAndSupport;
