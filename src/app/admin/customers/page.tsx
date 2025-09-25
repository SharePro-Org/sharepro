'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button, Dropdown, Input, Table } from 'antd';
import { CaretDownOutlined, FilterOutlined, MoreOutlined } from '@ant-design/icons';
import React from 'react';
import { Flame, HeartIcon, MessageCircleReply, SearchIcon, Users } from 'lucide-react';
import { useQuery } from '@apollo/client/react';
import { ALL_USERS } from '@/apollo/queries/admin';

const columns = [
    {
        title: "Rank",
        dataIndex: "rank",
        key: "rank",
        render: (rank: number) => rank <= 3 ? `🥇 ${rank}` : rank,
    },
    {
        title: "Customer's Name",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "Email",
        dataIndex: "email",
        key: "email",
    },
    {
        title: "Points",
        dataIndex: "points",
        key: "points",
    },
    {
        title: "Purchases",
        dataIndex: "purchases",
        key: "purchases",
    },
    {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
    },
    {
        title: "Redeemed",
        dataIndex: "redeemed",
        key: "redeemed",
    },
    {
        title: "Badge",
        dataIndex: "badge",
        key: "badge",
    },
    {
        title: "Action",
        key: "action",
        render: () => (
            <Dropdown
                menu={{ items: [{ key: "view", label: "View Customer" }] }}
                trigger={["click"]}
            >
                <Button type="text"><MoreOutlined /></Button>
            </Dropdown>
        ),
    },
];

type UserProfile = {
    firstName?: string;
    lastName?: string;
    email?: string;
};

type User = {
    userProfile?: UserProfile;
    // add other fields if needed
};

type AllUsersQueryData = {
    allUsers: User[];
};

const CustomersPage = () => {
    const { data, loading, error } = useQuery<AllUsersQueryData>(ALL_USERS);
    const [search, setSearch] = React.useState('');
    // Map ALL_USERS to table data
    const allCustomers = (data?.allUsers || []).map((user: User, idx: number) => ({
        rank: idx + 1,
        name: `${user.userProfile?.firstName || ''} ${user.userProfile?.lastName || ''}`,
        email: user.userProfile?.email || '-',
        points: '-',
        purchases: '-',
        amount: '-',
        redeemed: '-',
        badge: '-',
        key: user.userProfile?.email || idx,
    }));
    const customers = allCustomers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );
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
                                <div className="text-lg font-bold">{allCustomers.length}</div>
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
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="bg-[#F9FAFB] md:w-72 w-full border border-[#E4E7EC] p-3 rounded-sm pl-8 text-sm"
                                placeholder="Search by Name or Email"
                            />
                            <SearchIcon
                                size={16}
                                className="absolute top-4 left-3 text-gray-500"
                            />
                        </div>
                    </header>

                    <Table
                        columns={columns}
                        dataSource={customers}
                        loading={loading}
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: true }}
                        className="custom-kb-table"
                        rowClassName={() => "border-b border-[#E2E8F0] py-2 last:border-0"}
                    />
                </div>
            </>
        </DashboardLayout>
    );
};

export default CustomersPage;