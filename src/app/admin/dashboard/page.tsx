import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Flame, HeartIcon, MessageCircleReply, Users } from 'lucide-react';
import React from 'react';

const adminDashboard = () => {
    return (
        <DashboardLayout>
            <section>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                    <div className="flex flex-col bg-[#fff] rounded-md p-6 items-start min-h-[100px] justify-center">
                        <div className="flex justify-evenly">
                            <div className="rounded-full bg-[#FFD66B]/20 w-[63px] h-[63px] flex items-center justify-center">
                                <Users fill="#FFC327" className="text-[#FFC327]" />
                            </div>
                            <div className="ml-4">
                                <div className="text-lg font-bold">12.5K</div>
                                <div className="text-xs text-gray-500">Total Businesses</div>
                                <div className="text-xs text-red-600 mt-1 font-bold">12% ↑</div>
                            </div>
                        </div>
                    </div>
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

                    {/* Card 3: Total Referrals */}
                    <div className="flex flex-col bg-[#fff] rounded-md p-6 items-start min-h-[100px] justify-center">
                        <div className="flex justify-evenly">
                            <div className="rounded-full bg-[#FF8F6B]/10 w-[63px] h-[63px] flex items-center justify-center">
                                <Flame className="text-[#FF8F6B]" fill="#FF8F6B" />
                            </div>
                            <div className="ml-4">
                                <div className="text-lg font-bold">30K</div>
                                <div className="text-xs text-gray-500">Users Referred</div>
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
                                <div className="text-xs text-gray-500">Paid Rewards</div>
                                <div className="text-xs text-red-600 mt-1 font-bold">12% ↑</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='grid md:grid-cols-2 grid-cols-1 gap-4 mt-4'>
                    <div className="bg-white p-3 rounded-md">
                        <p>Recent Business Signups</p>
                        <div className="overflow-x-auto">
                            <table className="w-full mt-4 text-sm">
                                <thead>
                                    <tr className="bg-[#D1DAF4] text-black">
                                        <th className="px-4 py-3 font-medium text-left">Business Name</th>
                                        <th className="px-4 py-3 font-medium text-left">Active Campaigns</th>
                                        <th className="px-4 py-3 font-medium text-left">Invited Users</th>
                                        <th className="px-4 py-3 font-medium text-left">Date Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                                        <tr
                                            key={item}
                                            className="border-b border-[#E2E8F0] py-6 last:border-0"
                                        >
                                            <td className="py-3 px-4">John Doe</td>
                                            <td className="py-3 px-4">Loyalty</td>
                                            <td className="py-3 px-4">10</td>
                                            <td className="py-3 px-4">2023-10-01</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white p-3 rounded-md">
                        <p>Recent Customer Signups</p>
                        <div className="overflow-x-auto">
                            <table className="w-full mt-4 text-sm">
                                <thead>
                                    <tr className="bg-[#D1DAF4] text-black">
                                        <th className="px-4 py-3 font-medium text-left">Customer Name</th>
                                        <th className="px-4 py-3 font-medium text-left">Loyalty Campaigns</th>
                                        <th className="px-4 py-3 font-medium text-left">Referral Campaigns</th>
                                        <th className="px-4 py-3 font-medium text-left">Referrals</th>
                                        <th className="px-4 py-3 font-medium text-left">Date Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[1, 2, 3, 4, 5].map((item) => (
                                        <tr
                                            key={item}
                                            className="border-b border-[#E2E8F0] py-6 last:border-0"
                                        >
                                            <td className="py-3 px-4">John Doe</td>
                                            <td className="py-3 px-4">10</td>
                                            <td className="py-3 px-4">10</td>
                                            <td className='py-3 px-4'>20</td>
                                            <td className="py-3 px-4">2023-10-01</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </DashboardLayout>
    );
};

export default adminDashboard;