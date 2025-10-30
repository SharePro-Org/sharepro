
'use client'

import React, { useState, useEffect } from "react";
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { GET_BUSINESS_REWARDS } from '@/apollo/queries/payout';
import { useQuery } from '@apollo/client/react';
import { SearchIcon } from 'lucide-react';
import { useAtom } from "jotai";
import { userAtom } from "@/store/User";

const Payout = () => {
    const [user] = useAtom(userAtom);
    const [businessId, setBusinessId] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        if (user?.businessId) {
            setBusinessId(user.businessId);
        }
    }, [user]);

    type Reward = {
        id: string;
        user: { username: string; email: string };
        campaign: { name: string };
        amount: number;
        currency: string;
        status: 'COMPLETED' | 'PENDING' | string;
        createdAt: string;
    };

    type BusinessRewardsData = { businessRewards: Reward[] };

    const { data, loading, error } = useQuery<BusinessRewardsData>(GET_BUSINESS_REWARDS, {
        variables: {
            businessId
        },
        skip: !businessId
    });
    return (
        <DashboardLayout>
            <section className="bg-white rounded-md md:p-6 p-3 mt-4">
                <div className="">
                    <div className="lg:flex justify-between">
                        <p className="text-black font-medium my-auto text-base">
                            All Payouts
                        </p>
                        <div className="flex gap-4">
                            {/* <RangePicker /> */}
                            {/* <Filter filter={false} /> */}

                            <div className="relative md:mt-0 mt-2">
                                <input
                                    type="text"
                                    className="bg-[#F9FAFB] md:w-72 w-full border border-[#E4E7EC] p-3 rounded-sm pl-8 text-sm"
                                    placeholder="Search Campaign Name"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />

                                <SearchIcon
                                    size={16}
                                    className="absolute top-4 left-3 text-gray-500"
                                />
                            </div>
                        </div>
                    </div>

                </div>
                {loading ? (
                    <div className="mt-4">Loading...</div>
                ) : error ? (
                    <div className="mt-4 text-red-500">Error loading rewards data</div>
                ) : (
                    <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data?.businessRewards
                                    .filter((reward) =>
                                        reward.campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
                                    )
                                    .map((reward: any) => (
                                        <tr key={reward.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{reward.user.username}</div>
                                                <div className="text-sm text-gray-500">{reward.user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{reward.campaign.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {reward.amount} {reward.currency}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${reward.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                        reward.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-gray-100 text-gray-800'}`}>
                                                    {reward.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(reward.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </DashboardLayout>
    );
};

export default Payout;