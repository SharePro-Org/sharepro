"use client";

import { MoreOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button, Dropdown } from "antd";
import { ArrowRight, SearchIcon, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const customers = () => {
  const router = useRouter();

  return (
    <DashboardLayout>
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Total Rewards Earned */}
          <div className="flex flex-col bg-[#fff] rounded-md p-4 items-start min-h-[100px] justify-center">
            <div className="flex w-full flex-col">
              <div className="flex justify-between">
                <p className="my-auto font-medium">Total Customers</p>
                <div className="rounded-full ml-auto bg-[#A16AD4]/20 w-[30px] h-[30px] flex items-center justify-center">
                  <Users size={16} fill="#A16AD4" className="text-[#A16AD4]" />
                </div>
              </div>
              <div className="text-xl my-3 font-bold">4,500</div>
              <div className="flex justify-between w-full mt-2">
                <div className="text-xs text-gray-500">
                  Referral links shared.
                </div>
                <div className={`text-xs text-green-600 mt-1 font-bold`}>
                  10% ↑
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Total Campaigns Joined */}
          <div className="flex flex-col bg-[#fff] rounded-md p-4 items-start min-h-[100px] justify-center">
            <div className="flex w-full flex-col">
              <div className="flex justify-between">
                <p className="my-auto font-medium">Total Referrers</p>
                <div className="rounded-full ml-auto bg-[#233E97]/20 w-[30px] h-[30px] flex items-center justify-center">
                  <Users size={16} fill="#233E97" className="text-[#233E97]" />
                </div>
              </div>
              <div className="text-xl my-3 font-bold">500</div>
              <div className="flex justify-between w-full mt-2">
                <div className="text-xs text-gray-500">
                  Referral purchases made.
                </div>
                <div className="text-xs text-green-600 mt-1 font-bold">
                  10% ↑
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Total Referrals */}
          <div className="flex flex-col bg-[#fff] rounded-md p-4 items-start min-h-[100px] justify-center">
            <div className="flex w-full flex-col">
              <div className="flex justify-between">
                <p className="my-auto font-medium">Recent Purchases</p>
                <div className="rounded-full ml-auto bg-[#233E97]/20 w-[30px] h-[30px] flex items-center justify-center">
                  <Users size={16} fill="#233E97" className="text-[#233E97]" />
                </div>
              </div>
              <div className="text-xl my-3 font-bold">100</div>
              <div className="flex justify-between w-full mt-2">
                <div className="text-xs text-gray-500">
                  Rewards claimed by customers
                </div>
                <div className="text-xs text-green-600 mt-1 font-bold">
                  5% ↑
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="bg-white p-4 rounded-md mt-4 border border-[#E2E8F0]">
          <div className="flex justify-between">
            <div>
              <p className="font-medium">Customers</p>
              <p className="text-sm text-[#030229B2]">
                Identify your most loyal customers.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="relative md:mt-0 mt-2">
                <input
                  type="text"
                  className="bg-[#F9FAFB] md:w-72 w-full border border-[#E4E7EC] p-3 rounded-sm pl-8 text-sm"
                  placeholder="Search Campaign Name"
                />

                <SearchIcon
                  size={16}
                  className="absolute top-4 left-3 text-gray-500"
                />
              </div>
              {/* <button className="flex my-auto gap-2 text-sm text-primary cursor-pointer">
                <span className="my-auto">View All </span>
                <ArrowRight size={15} className="my-auto" />
              </button> */}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full mt-4 text-sm">
              <thead>
                <tr className="bg-[#D1DAF4] text-black">
                  <th className="px-4 py-3 font-medium text-left">Rank</th>
                  <th className="px-4 py-3 font-medium text-left">
                    Customer Name
                  </th>
                  <th className="px-4 py-3 font-medium text-left">Points</th>
                  <th className="px-4 py-3 font-medium text-left">Purchases</th>
                  <th className="px-4 py-3 font-medium text-left">Amount</th>
                  <th className="px-4 py-3 font-medium text-left">Redeemed</th>
                  <th className="px-4 py-3 font-medium text-left">Badge</th>
                  <th className="px-4 py-3 font-medium text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 black font-normal py-3">1</td>
                  <td className="px-4 black font-normal py-3">John Doe</td>
                  <td className="px-4 black font-normal py-3">10</td>
                  <td className="px-4 black font-normal py-3">18</td>
                  <td className="px-4 black font-normal py-3">#1000</td>
                  <td className="px-4 black font-normal py-3">Gold</td>
                  <td className="px-4 black font-normal py-3">Gold</td>
                  <td>
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: "view",
                            label: "View activity",
                            onClick: () => router.push(`/business/customers/1`),
                          },
                        ],
                      }}
                      trigger={["click"]}
                    >
                      <Button type="text">
                        <MoreOutlined />
                      </Button>
                    </Dropdown>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* <section className="bg-white p-4 rounded-md mt-4 border border-[#E2E8F0]">
          <div className="flex justify-between">
            <div>
              <p className="font-medium">Top Referrers</p>
              <p className="text-sm text-[#030229B2]">
                Identify your most impactful advocates.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="relative md:mt-0 mt-2">
                <input
                  type="text"
                  className="bg-[#F9FAFB] md:w-72 w-full border border-[#E4E7EC] p-3 rounded-sm pl-8 text-sm"
                  placeholder="Search Campaign Name"
                />

                <SearchIcon
                  size={16}
                  className="absolute top-4 left-3 text-gray-500"
                />
              </div>
              <button className="flex my-auto gap-2 text-sm text-primary cursor-pointer">
                <span className="my-auto">View All </span>
                <ArrowRight size={15} className="my-auto" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full mt-4 text-sm">
              <thead>
                <tr className="bg-[#D1DAF4] text-black">
                  <th className="px-4 py-3 font-medium text-left">Rank</th>
                  <th className="px-4 py-3 font-medium text-left">
                    Customer Name
                  </th>
                  <th className="px-4 py-3 font-medium text-left">Referrals</th>
                  <th className="px-4 py-3 font-medium text-left">
                    Conversions
                  </th>
                  <th className="px-4 py-3 font-medium text-left">Rewards</th>
                  <th className="px-4 py-3 font-medium text-left">Badge</th>
                  <th className="px-4 py-3 font-medium text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 black font-normal py-3">1</td>
                  <td className="px-4 black font-normal py-3">John Doe</td>
                  <td className="px-4 black font-normal py-3">10</td>
                  <td className="px-4 black font-normal py-3">18</td>
                  <td className="px-4 black font-normal py-3">#1000</td>
                  <td className="px-4 black font-normal py-3">Gold</td>
                  <td>
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: "view",
                            label: "View activity",
                            onClick: () => router.push(`/business/customers/1`),
                          },
                        ],
                      }}
                      trigger={["click"]}
                    >
                      <Button type="text">
                        <MoreOutlined />
                      </Button>
                    </Dropdown>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section> */}
      </>
    </DashboardLayout>
  );
};

export default customers;
