'use client'

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import React from 'react';
import { Table } from 'antd';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const customer = {
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '02942049490',
    registrationDate: '14 March 2024',
};

const activity = {
    lastLogin: '08 Aug 2025, 5:32 PM',
    lastPurchase: '04 Aug 2025',
    campaignsJoined: 7,
    accountStatus: true,
};

const rewards = [
    { reward: '₦1,000 Discount Voucher', dateEarned: '20-07-2025', status: 'Redeemed', dateRedeemed: '10-04-2025' },
    { reward: 'Free Coffee', dateEarned: '20-07-2025', status: 'Pending', dateRedeemed: '10-04-2025' },
    { reward: '₦1,000 Discount Voucher', dateEarned: '20-07-2025', status: 'Redeemed', dateRedeemed: '10-04-2025' },
    { reward: '₦1,000 Discount Voucher', dateEarned: '20-07-2025', status: 'Redeemed', dateRedeemed: '10-04-2025' },
    { reward: 'Free Coffee', dateEarned: '20-07-2025', status: 'Pending', dateRedeemed: '10-04-2025' },
];

const statusColors = {
    Redeemed: 'bg-green-500 text-white',
    Pending: 'bg-yellow-400 text-black',
};

const rewardColumns = [
    { title: 'Reward Earned', dataIndex: 'reward', key: 'reward' },
    { title: 'Date Earned', dataIndex: 'dateEarned', key: 'dateEarned' },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => (
            <span className={`inline-block px-3 py-1 rounded-[5px] text-xs ${statusColors[status as keyof typeof statusColors] || 'bg-gray-300'}`}>{status}</span>
        ),
    },
    { title: 'Date Redeemed', dataIndex: 'dateRedeemed', key: 'dateRedeemed' },
];

const singleCustomers = () => {
    const router = useRouter();
    return (
        <DashboardLayout>
            <div className="px-0 py-8">

                <div className="bg-white rounded-md p-6 mb-6">
                    <button
                        className="text-black cursor-pointer flex mb-4 items-center"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="mr-3" />
                        <span className="text-lg font-semibold capitalize">
                            Customer Profile Insights
                        </span>
                    </button>
                    <h3 className="text-lg font-semibold mb-4">Basic Info</h3>
                    <div className="grid grid-cols-4 gap-6 items-center">
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Name</div>
                            <div className="font-medium">{customer.name}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Email Address</div>
                            <div className="font-medium">{customer.email}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Phone number</div>
                            <div className="font-medium">{customer.phone}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Registration Date</div>
                            <div className="font-medium">{customer.registrationDate}</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-md p-6 mb-6 ">
                    <h3 className="text-lg font-semibold mb-4"> Activity Summary</h3>

                    <div className='flex items-center justify-between'>
                        <div className="flex gap-12">
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Last Login</div>
                                <div className="font-medium">{activity.lastLogin}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Last Purchase Date</div>
                                <div className="font-medium">{activity.lastPurchase}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Number of Campaigns Joined</div>
                                <div className="font-medium">{activity.campaignsJoined}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Account Status</span>
                            <label className="inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={activity.accountStatus} readOnly className="sr-only peer" />
                                <span className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#2D3A8C] transition-all"></span>
                                <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-all"></span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Reward History</h3>
                    <Table
                        dataSource={rewards}
                        columns={rewardColumns}
                        pagination={{ pageSize: 5, showSizeChanger: false }}
                        rowKey="reward"
                        className="custom-kb-table"
                    />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default singleCustomers;