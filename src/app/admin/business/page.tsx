'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import React from 'react';
import { useQuery } from "@apollo/client/react";
import { BUSINESSES } from "@/apollo/queries/admin";
import { useRouter } from 'next/navigation';
import { Table } from 'antd';

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
    const columns = [
        {
            title: "Business Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Business Type",
            dataIndex: "businessType",
            key: "businessType",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Invited Users",
            dataIndex: "referrals",
            key: "referrals",
            render: (referrals: any[]) => referrals?.length || '-',
        },
        {
            title: "Plan Type",
            dataIndex: "subscriptionStatus",
            key: "subscriptionStatus",
        },
        {
            title: "Date Joined",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (createdAt: string) => createdAt ? new Date(createdAt).toLocaleDateString() : '-',
        },
    ];
    const dataSource = (businessesData?.businesses || []).map((business: any) => ({
        ...business,
        key: business.id,
    }));
    return (
        <DashboardLayout>
            <div className="bg-white p-3 rounded-md">
                <p className='mb-4'>All Business Users</p>
                <div className="overflow-x-auto">
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        loading={businessesLoading}
                        pagination={{ pageSize: 10 }}
                        className="custom-kb-table"
                        scroll={{ x: true }}
                        onRow={record => ({
                            onClick: () => router.push(`/admin/business/${record.id}`),
                            className: "border-b border-[#E2E8F0] py-6 last:border-0 cursor-pointer hover:bg-gray-50 transition"
                        })}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default adminBusiness;