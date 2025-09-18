'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import React from 'react';
import { useQuery } from "@apollo/client/react";
import { BUSINESSES } from "@/apollo/queries/admin";
import { useRouter } from 'next/navigation';

type Business = {
    id: string;
    name: string;
    businessType?: string;
    email?: string;
    referrals: any[];
    subscriptionStatus?: string;
    createdAt?: string;
};

type BusinessesQueryData = {
    businesses: Business[];
};
const adminBusiness = () => {
    const router = useRouter();
    const { data: businessesData, loading: businessesLoading, error: businessesError } = useQuery<BusinessesQueryData>(BUSINESSES);
    return (
        <DashboardLayout>
            <div className="bg-white p-3 rounded-md">
                <p>All Business Users</p>
                <div className="overflow-x-auto">
                    <table className="w-full mt-4 text-sm">
                        <thead>
                            <tr className="bg-[#D1DAF4] text-black">
                                <th className="px-4 py-3 font-medium text-left">Business Name</th>
                                <th className="px-4 py-3 font-medium text-left">Business Type</th>
                                <th className="px-4 py-3 font-medium text-left">Email</th>
                                <th className="px-4 py-3 font-medium text-left">Invited Users</th>
                                <th className="px-4 py-3 font-medium text-left">Plan Type</th>
                                <th className="px-4 py-3 font-medium text-left">Date Joined</th>
                                {/* <th className="px-4 py-3 font-medium text-left">Action</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {businessesLoading ? (
                                <tr><td colSpan={7} className="py-3 px-4 text-center">Loading...</td></tr>
                            ) : businessesError ? (
                                <tr><td colSpan={7} className="py-3 px-4 text-center text-red-500">Error loading businesses</td></tr>
                            ) : (
                                (businessesData?.businesses || []).map((business: any) => (
                                    <tr
                                        key={business.id}
                                        className="border-b border-[#E2E8F0] py-6 last:border-0 cursor-pointer hover:bg-gray-50 transition"
                                        onClick={() => router.push(`/admin/business/${business.id}`)}
                                    >
                                        <td className="py-3 px-4">{business.name}</td>
                                        <td className="py-3 px-4">{business.businessType || '-'}</td>
                                        <td className="py-3 px-4">{business.email || '-'}</td>
                                        <td className="py-3 px-4">{business.referrals.length || '-'}</td>
                                        <td className="py-3 px-4">{business.subscriptionStatus || '-'}</td>
                                        <td className="py-3 px-4">{business.createdAt ? new Date(business.createdAt).toLocaleDateString() : '-'}</td>
                                        {/* <td></td> */}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default adminBusiness;