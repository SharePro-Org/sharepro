import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Flame, HeartIcon, MessageCircleReply, Users } from "lucide-react";

// Demo stat icons—replace with your real icons
const StatIcon = ({ color }: { color: string }) => (
  <span
    className={`inline-flex items-center justify-center rounded-full`}
    style={{ width: 44, height: 44, background: color, minWidth: 44 }}
  >
    {/* Put your SVG or Icon here */}
    <span className="w-7 h-7 block" />
  </span>
);

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 w-full">
        {/* Top stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Card 1: Ongoing Campaigns (already refactored) */}
          <div className="flex flex-col bg-[#fff] rounded-md p-6 items-start min-h-[100px] justify-center">
            <div className="flex justify-evenly">
              <div className="rounded-full bg-[#EDF3FE] w-[63px] h-[63px] flex items-center justify-center">
                <HeartIcon fill="#5B93FF" className="text-[#5B93FF]" />
              </div>
              <div className="ml-4">
                <div className="text-lg font-bold">4</div>
                <div className="text-xs text-gray-500">Ongoing Campaigns</div>
                <div className="text-xs text-green-600 mt-1 font-bold">
                  12% ↑
                </div>
              </div>
            </div>
          </div>
          {/* Card 2: Customers */}
          <div className="flex flex-col bg-[#fff] rounded-md p-6 items-start min-h-[100px] justify-center">
            <div className="flex justify-evenly">
              <div className="rounded-full bg-[#FFD66B]/20 w-[63px] h-[63px] flex items-center justify-center">
                <Users fill="#FFC327" className="text-[#FFC327]" />
              </div>
              <div className="ml-4">
                <div className="text-lg font-bold">12.5K</div>
                <div className="text-xs text-gray-500">Customers</div>
                <div className="text-xs text-red-600 mt-1 font-bold">12% ↑</div>
              </div>
            </div>
          </div>
          {/* Card 3: Total Referrals */}
          <div className="flex flex-col bg-[#fff] rounded-md p-6 items-start min-h-[100px] justify-center">
            <div className="flex justify-evenly">
              <div className="rounded-full bg-[#FF8F6B]/10 w-[63px] h-[63px] flex items-center justify-center">
                <Flame className="text-[#FF8F6B]" fill="#FF8F6B" />
              </div>
              <div className="ml-4">
                <div className="text-lg font-bold">30K</div>
                <div className="text-xs text-gray-500">Total Referrals</div>
                <div className="text-xs text-green-600 mt-1 font-bold">
                  12% ↑
                </div>
              </div>
            </div>
          </div>
          {/* Card 4: Conversion Rate */}
          <div className="flex flex-col bg-[#fff] rounded-md p-6 items-start min-h-[100px] justify-center">
            <div className="flex justify-evenly">
              <div className="rounded-full bg-[#605BFF]/10 opacity-30 w-[63px] h-[63px] flex items-center justify-center">
                <MessageCircleReply className="text-[#605BFF]" fill="#605BFF" />
              </div>
              <div className="ml-4">
                <div className="text-lg font-bold">32.03%</div>
                <div className="text-xs text-gray-500">Conversion Rate</div>
                <div className="text-xs text-red-600 mt-1 font-bold">12% ↑</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main graphs/cards */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          <Card className="w-full min-h-[220px]">
            <div className="font-semibold text-base mb-1">
              Referral Engagement Graph
            </div>
            <div className="text-xs text-gray-500 mb-3">
              Referrals over time
            </div>
            {/* Placeholder for chart */}
            <div className="bg-gray-100 h-28 rounded-lg" />
          </Card>
        </div>

        {/* 2x2 chart grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="w-full min-h-[180px]">
            <div className="font-semibold text-base mb-1">Top Referrers</div>
            <div className="text-xs text-gray-500 mb-3">
              Users chart over time
            </div>
            {/* Placeholder */}
            <div className="bg-gray-100 h-24 rounded-lg" />
          </Card>
          <Card className="w-full min-h-[180px]">
            <div className="font-semibold text-base mb-1">Top Channels</div>
            <div className="text-xs text-gray-500 mb-3">
              Channels with the most referrals over time
            </div>
            {/* Placeholder */}
            <div className="bg-gray-100 h-24 rounded-lg" />
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="w-full min-h-[180px]">
            <div className="font-semibold text-base mb-1">Reward Chart</div>
            <div className="text-xs text-gray-500 mb-3">Most used rewards</div>
            {/* Placeholder */}
            <div className="bg-gray-100 h-24 rounded-lg" />
          </Card>
          <Card className="w-full min-h-[180px]">
            <div className="font-semibold text-base mb-1">
              Cash Flow in Numbers
            </div>
            {/* Placeholder */}
            <div className="bg-gray-100 h-24 rounded-lg" />
          </Card>
        </div>

        {/* Campaigns table */}
        <Card className="w-full">
          <div className="flex flex-col gap-4">
            {/* Table header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="font-semibold text-[16px]">My Campaigns</div>
              <div className="flex gap-2 items-center mt-2 md:mt-0">
                {/* Calendar filter (placeholder) */}
                <div className="flex items-center bg-[#F7F9FB] px-4 py-2 rounded-md border border-gray-200 text-sm font-medium">
                  <span className="mr-2">🗓</span>
                  05 Feb - 06 March
                </div>
                {/* Search (placeholder) */}
                <input
                  className="border border-gray-200 rounded-md px-3 py-2 w-48 text-sm bg-[#F7F9FB] focus:outline-none"
                  placeholder="Search campaign name"
                />
                {/* Filters (placeholder) */}
                <button className="border border-gray-200 rounded-md px-3 py-2 text-sm bg-[#F7F9FB]">
                  Filters
                </button>
                <a className="text-primary font-medium text-sm ml-2 cursor-pointer hover:underline">
                  View All &rarr;
                </a>
              </div>
            </div>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full mt-4 text-sm">
                <thead>
                  <tr className="bg-[#EFF1FA] text-[#233E97] font-semibold">
                    <th className="px-4 py-3 text-left">Campaign Name</th>
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-left">Referrals</th>
                    <th className="px-4 py-3 text-left">Conversions</th>
                    <th className="px-4 py-3 text-left">Rewards</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Example rows */}
                  {[
                    {
                      type: "Referral",
                      status: "Active",
                      statusColor: "bg-green-500",
                      tagColor: "bg-[#4C8AFF]",
                    },
                    {
                      type: "Loyalty",
                      status: "Completed",
                      statusColor: "bg-blue-500",
                      tagColor: "bg-[#B96AFF]",
                    },
                    {
                      type: "Combo",
                      status: "Scheduled",
                      statusColor: "bg-red-500",
                      tagColor: "bg-[#6AB0B9]",
                    },
                    {
                      type: "Referral",
                      status: "Active",
                      statusColor: "bg-green-500",
                      tagColor: "bg-[#4C8AFF]",
                    },
                    {
                      type: "Referral",
                      status: "Completed",
                      statusColor: "bg-blue-500",
                      tagColor: "bg-[#4C8AFF]",
                    },
                    {
                      type: "Loyalty",
                      status: "Active",
                      statusColor: "bg-green-500",
                      tagColor: "bg-[#B96AFF]",
                    },
                    {
                      type: "Loyalty",
                      status: "Active",
                      statusColor: "bg-green-500",
                      tagColor: "bg-[#B96AFF]",
                    },
                  ].map((row, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="px-4 py-3">Pro Gain</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-4 py-1 rounded-lg text-white text-xs font-semibold ${row.tagColor}`}
                        >
                          {row.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">6K</td>
                      <td className="px-4 py-3">3K</td>
                      <td className="px-4 py-3">Airtime</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-3 py-1 rounded-lg text-white text-xs font-semibold ${row.statusColor}`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">10-04-2025</td>
                      <td className="px-4 py-3">...</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
