'use client';

import CampaignsTable from '@/components/dashboard/CampaignsTable';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { ArrowRight, Flame, HeartIcon, MessageCircleReply, Users } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useQuery } from "@apollo/client/react";
import { BUSINESSES, ALL_USERS } from "@/apollo/queries/admin";
type Business = {
    id: string;
    name: string;
    businessType?: string;
    email?: string;
    createdAt?: string;
};

type BusinessesQueryResult = {
    businesses: Business[];
};

const adminDashboard = () => {

    const { data: businessesData, loading: businessesLoading, error: businessesError } = useQuery<BusinessesQueryResult>(BUSINESSES);
    type UserProfile = {
        firstName?: string;
        lastName?: string;
        email?: string;
        createdAt?: string;
    };

    type User = {
        userProfile?: UserProfile;
    };

    type UsersQueryResult = {
        allUsers: User[];
    };

    const { data: usersData, loading: usersLoading, error: usersError } = useQuery<UsersQueryResult>(ALL_USERS);

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
                                <div className="text-lg font-bold">{businessesData?.businesses.length || 0}</div>
                                <div className="text-xs text-gray-500">Total Businesses</div>
                                {/* <div className="text-xs text-red-600 mt-1 font-bold">12% ↑</div> */}
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
                                <div className="text-lg font-bold">{0}</div>
                                <div className="text-xs text-gray-500">Ongoing Campaigns</div>
                                {/* <div className="text-xs text-green-600 mt-1 font-bold">
                                    12% ↑
                                </div> */}
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
                                <div className="text-lg font-bold">{usersData?.allUsers.length || 0}</div>
                                <div className="text-xs text-gray-500">Users Referred</div>
                                {/* <div className="text-xs text-green-600 mt-1 font-bold">
                                    12% ↑
                                </div> */}
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
                                {/* <div className="text-xs text-red-600 mt-1 font-bold">12% ↑</div> */}
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
                                        <th className="px-4 py-3 font-medium text-left">Business Type</th>
                                        <th className="px-4 py-3 font-medium text-left">Email</th>
                                        <th className="px-4 py-3 font-medium text-left">Date Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {businessesLoading ? (
                                        <tr><td colSpan={4} className="py-3 px-4 text-center">Loading...</td></tr>
                                    ) : businessesError ? (
                                        <tr><td colSpan={4} className="py-3 px-4 text-center text-red-500">Error loading businesses</td></tr>
                                    ) : (
                                        (businessesData?.businesses?.slice(0, 5) || []).map((business: any) => (
                                            <tr
                                                key={business.id}
                                                className="border-b border-[#E2E8F0] py-6 last:border-0"
                                            >
                                                <td className="py-3 px-4">{business.name}</td>
                                                <td className="py-3 px-4">{business.businessType || '-'}</td>
                                                <td className="py-3 px-4">{business.email || '-'}</td>
                                                <td className="py-3 px-4">{business.createdAt ? new Date(business.createdAt).toLocaleDateString() : '-'}</td>
                                            </tr>
                                        ))
                                    )}
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
                                        <th className="px-4 py-3 font-medium text-left">Email</th>
                                        <th className="px-4 py-3 font-medium text-left">Date Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usersLoading ? (
                                        <tr><td colSpan={5} className="py-3 px-4 text-center">Loading...</td></tr>
                                    ) : usersError ? (
                                        <tr><td colSpan={5} className="py-3 px-4 text-center text-red-500">Error loading users</td></tr>
                                    ) : (
                                        (usersData?.allUsers?.slice(0, 5) || []).map((user: any, idx: number) => (
                                            <tr
                                                key={user.userProfile?.email || idx}
                                                className="border-b border-[#E2E8F0] py-6 last:border-0"
                                            >
                                                <td className="py-3 px-4">{user.userProfile?.firstName} {user.userProfile?.lastName}</td>
                                                <td className="py-3 px-4">-</td>
                                                <td className="py-3 px-4">-</td>
                                                <td className='py-3 px-4'>{user.userProfile?.email}</td>
                                                <td className="py-3 px-4">{user.userProfile?.createdAt ? new Date(user.userProfile.createdAt).toLocaleDateString() : '-'}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <section className="bg-white p-4 mt-5 rounded-md">
                    <div className="lg:flex justify-between">
                        <p className="text-black font-semibold my-auto text-base">
                            Campaigns
                        </p>
                        <div className="flex gap-4">
                            {/* <RangePicker /> */}
                            <Link
                                href={"/admin/campaigns"}
                                className="my-auto cursor-pointer"
                            >
                                <button className="flex my-auto gap-2 text-sm text-primary cursor-pointer">
                                    <span className="my-auto">View All </span>
                                    <ArrowRight size={15} className="my-auto" />
                                </button>
                            </Link>
                        </div>
                    </div>
                    {/* Filter component */}
                    <CampaignsTable num={6} />
                </section>
            </section>
        </DashboardLayout>
    );
};

export default adminDashboard;