
'use client'

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
        points: number;
        currency: string;
        rewardType: string;
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
                        <table className="w-full mt-4 text-sm">
                            <thead className="">
                                <tr className="bg-[#D1DAF4] text-black">
                                    <th className="px-4 py-3 font-medium text-left">User</th>
                                    <th className="px-4 py-3 font-medium text-left">Campaign</th>
                                    <th className="px-4 py-3 font-medium text-left">Amount</th>
                                    <th className="px-4 py-3 font-medium text-left">Status</th>
                                    <th className="px-4 py-3 font-medium text-left">Date</th>
                                    <th className="px-4 py-3 font-medium text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data?.businessRewards
                                    .filter((reward) =>
                                        reward.campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
                                    )
                                    .map((reward: any) => (
                                        <tr
                                          key={reward.id}
                                          className="border-b border-[#E2E8F0] py-2 last:border-0"
                                        >
                                          <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{reward.user.username}</div>
                                            <div className="text-sm text-gray-500">{reward.user.email}</div>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{reward.campaign.name}</div>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                              {reward.currency} {Number(reward.amount).toFixed(2)}
                                              {reward.points > 0 && (
                                                <span className="text-gray-500 ml-2">
                                                  ({reward.points} pts)
                                                </span>
                                              )}
                                            </div>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                              reward.status === 'PAID'
                                                ? 'bg-blue-500 text-white'
                                                : reward.status === 'APPROVED'
                                                ? 'bg-green-500 text-white'
                                                : reward.status === 'PENDING'
                                                  ? 'bg-yellow-500 text-white'
                                                  : reward.status === 'PROOF_SUBMITTED'
                                                  ? 'bg-orange-500 text-white'
                                                  : 'bg-red-500 text-white'
                                            }`}>
                                              {reward.status}
                                            </span>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(reward.createdAt).toLocaleDateString()}
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                            <Link href={`/business/campaigns/1/payouts/${reward.id}`}>
                                              <button className="px-4 py-2 text-sm font-medium text-primary">
                                                View
                                              </button>
                                            </Link>
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