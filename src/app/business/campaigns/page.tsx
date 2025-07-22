'use client'

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { SearchIcon } from 'lucide-react';
import React from 'react';
import { Dropdown, Button } from 'antd';
import { MoreOutlined } from "@ant-design/icons";
import Link from 'next/link';
import { Filter } from '@/components/Filter';



// Filter component


const campaigns = () => {
  return (
    <DashboardLayout>
      <>
        <section className='bg-white p-4 mb-2 rounded-md lg:flex justify-between'>
          <div className='flex justify-between gap-4 my-auto'>
            <button className='bg-[#ECF3FF] py-2 px-4 rounded-sm text-black text-normal text-sm'>My Campaigns</button>
            <button className='bg-[#ECF3FF] py-2 px-4 rounded-sm text-black text-normal text-sm'>Scheduled</button>
            <button className='bg-[#ECF3FF] py-2 px-4 rounded-sm text-black text-normal text-sm'>Drafts</button>
          </div>

          <div className='relative md:mt-0 mt-2'>
            <input type="text" className='bg-[#F9FAFB] md:w-72 w-full border border-[#E4E7EC] p-3 rounded-sm pl-8 text-sm' placeholder='Search Campaign Name' />

            <SearchIcon size={16} className='absolute top-4 left-3 text-gray-500' />
          </div>
        </section>
        <section className='bg-white p-4 rounded-md'>
          <div className='lg:flex justify-between'>
            <p className='text-black font-semibold text-base'>My Campaigns</p>
            <div className='lg:flex gap-4'>
              {/* <RangePicker /> */}
              <Filter />
              <Link href="/business/campaigns/create">
                <button className='bg-primary p-3 md:w-auto w-full cursor-pointer my-auto rounded-sm text-white text-sm px-6'>Create Campaign</button>
              </Link>
            </div>
          </div>
          {/* Filter component */}
          <div className="overflow-x-auto">
            <table className="w-full mt-4 text-sm">
              <thead>
                <tr className="bg-[#D1DAF4] text-black">
                  <th className="px-4 py-3 font-medium text-left">Campaign Name</th>
                  <th className="px-4 py-3 font-medium text-left">Type</th>
                  <th className="px-4 py-3 font-medium text-left">Referrals</th>
                  <th className="px-4 py-3 font-medium text-left">Conversions</th>
                  <th className="px-4 py-3 font-medium text-left">Rewards</th>
                  <th className="px-4 py-3 font-medium text-left">Status</th>
                  <th className="px-4 py-3 font-medium text-left">Date</th>
                  <th className="px-4 py-3 font-medium text-left">Action</th>
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
                  <tr key={i} className="border-b border-[#E2E8F0] py-2 last:border-0">
                    <td className="px-4 font-black font-normal py-3">Pro Gain</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-4 py-1 rounded-[5px] text-white text-xs ${row.tagColor}`}
                      >
                        {row.type}
                      </span>
                    </td>
                    <td className="px-4 black font-normal py-3">6K</td>
                    <td className="px-4 black font-normal py-3">3K</td>
                    <td className="px-4 black font-normal py-3">Airtime</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-[5px] text-white text-xs ${row.statusColor}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 black font-normal py-3">10-04-2025</td>
                    <td className="px-4 py-3">
                      <Dropdown
                        menu={{
                          items: [
                            { key: 'pause', label: 'Pause Campaign' },
                            { key: 'edit', label: 'Edit Campaign' },
                            { key: 'end', label: 'End Campaign' },
                            { key: 'settings', label: 'Campaign Settings' },
                            { key: 'payouts', label: 'Vew Payouts' },
                            { key: 'download', label: 'Download Report' },
                          ],
                        }}
                        trigger={["click"]}
                      >
                        <Button type="text"><MoreOutlined /> </Button>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </>
    </DashboardLayout>
  );
};

export default campaigns;