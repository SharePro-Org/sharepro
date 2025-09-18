'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button, Dropdown, Input, Table } from 'antd';
import { CaretDownOutlined, FilterOutlined, MoreOutlined } from '@ant-design/icons';
import React from 'react';
import { Flame, HeartIcon, MessageCircleReply, SearchIcon, Users } from 'lucide-react';

const mockCustomers = [
    { rank: 1, name: "Jane Mary", points: 3000, purchases: 24, amount: "₦8,000", redeemed: "₦8,000", badge: "Gold" },
    { rank: 2, name: "Obi Ann", points: 3000, purchases: 21, amount: "₦6,500", redeemed: "₦6,500", badge: "Silver" },
    { rank: 3, name: "Ade Nuella", points: 3000, purchases: 17, amount: "₦5,000", redeemed: "₦5,000", badge: "Bronze" },
    { rank: 4, name: "Fola Kayode", points: 2000, purchases: 9, amount: "₦3,000", redeemed: "₦3,000", badge: "-" },
    { rank: 5, name: "Daniel Tayo", points: 1000, purchases: 6, amount: "₦2,000", redeemed: "₦2,000", badge: "-" },
];

const CustomersPage = () => {
    return (
        <DashboardLayout>
            <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                    <div className="flex flex-col bg-[#fff] rounded-md p-6 items-start min-h-[100px] justify-center">
                        <div className="flex justify-evenly">
                            <div className="rounded-full bg-[#FFD66B]/20 w-[40px] h-[40px] flex items-center justify-center">
                                <Users fill="#FFC327" className="text-[#FFC327]" />
                            </div>
                            <div className="ml-4">
                                <div className="text-lg font-bold">12.5K</div>
                                <div className="text-xs text-gray-500">Total Customers</div>
                            </div>
                        </div>
                    </div>
                    {/* Card 1: Ongoing Campaigns (already refactored) */}
                    <div className="flex flex-col bg-[#fff] rounded-md p-6 items-start min-h-[100px] justify-center">
                        <div className="flex justify-evenly">
                            <div className="rounded-full bg-[#EDF3FE] w-[40px] h-[40px] flex items-center justify-center">
                                <HeartIcon fill="#5B93FF" className="text-[#5B93FF]" />
                            </div>
                            <div className="ml-4">
                                <div className="text-lg font-bold">4</div>
                                <div className="text-xs text-gray-500">Inactive Customers</div>
                              
                            </div>
                        </div>
                    </div>
                    {/* Card 2: Customers */}

                    {/* Card 3: Total Referrals */}
                    <div className="flex flex-col bg-[#fff] rounded-md p-6 items-start min-h-[100px] justify-center">
                        <div className="flex justify-evenly">
                            <div className="rounded-full bg-[#FF8F6B]/10 w-[40px] h-[40px] flex items-center justify-center">
                                <Flame className="text-[#FF8F6B]" fill="#FF8F6B" />
                            </div>
                            <div className="ml-4">
                                <div className="text-lg font-bold">30K</div>
                                <div className="text-xs text-gray-500">Active Customers</div>

                            </div>
                        </div>
                    </div>
                    {/* Card 4: Conversion Rate */}
                    <div className="flex flex-col bg-[#fff] rounded-md p-6 items-start min-h-[100px] justify-center">
                        <div className="flex justify-evenly">
                            <div className="rounded-full bg-[#605BFF]/10 opacity-30 w-[40px] h-[40px] flex items-center justify-center">
                                <MessageCircleReply className="text-[#605BFF]" fill="#605BFF" />
                            </div>
                            <div className="ml-4">
                                <div className="text-lg font-bold">32</div>
                                <div className="text-xs text-gray-500">New Customers this Month</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-md p-6">
                    <header className="flex items-center gap-4 mb-8">
                        <div className="flex-1">
                            <h2 className="text-xl">Customers</h2>
                            <p className="text-sm text-gray-500">This section focuses on giving the admin an overview of all customer activities.</p>
                        </div>
                        <div className="relative md:mt-0 mt-2">
                            <input
                                type="text"
                                className="bg-[#F9FAFB] md:w-72 w-full border border-[#E4E7EC] p-3 rounded-sm pl-8 text-sm"
                                placeholder="Search by Name"
                            />

                            <SearchIcon
                                size={16}
                                className="absolute top-4 left-3 text-gray-500"
                            />
                        </div>
                    </header>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-[#D1DAF4] text-black">
                                    <th className="px-4 py-3 font-medium text-left">Rank</th>
                                    <th className="px-4 py-3 font-medium text-left">Customer's Name</th>
                                    <th className="px-4 py-3 font-medium text-left">Points</th>
                                    <th className="px-4 py-3 font-medium text-left">Purchases</th>
                                    <th className="px-4 py-3 font-medium text-left">Amount</th>
                                    <th className="px-4 py-3 font-medium text-left">Redeemed</th>
                                    <th className="px-4 py-3 font-medium text-left">Badge</th>
                                    <th className="px-4 py-3 font-medium text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockCustomers.map((c, i) => (
                                    <tr key={i} className="border-b border-[#E2E8F0] py-2 last:border-0">
                                        <td className="px-4 py-3">{c.rank <= 3 ? `🥇 ${c.rank}` : c.rank}</td>
                                        <td className="px-4 py-3">{c.name}</td>
                                        <td className="px-4 py-3">{c.points}</td>
                                        <td className="px-4 py-3">{c.purchases}</td>
                                        <td className="px-4 py-3">{c.amount}</td>
                                        <td className="px-4 py-3">{c.redeemed}</td>
                                        <td className="px-4 py-3">{c.badge}</td>
                                        <td className="px-4 py-3">
                                            <Dropdown
                                                menu={{
                                                    items: [
                                                        { key: "view", label: "View Customer" },
                                                    ],
                                                }}
                                                trigger={["click"]}
                                            >
                                                <Button type="text"><MoreOutlined /></Button>
                                            </Dropdown>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        </DashboardLayout>
    );
};

export default CustomersPage;