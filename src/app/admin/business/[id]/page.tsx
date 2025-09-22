"use client";
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import React from 'react';
import { MoreOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import { ArrowLeft, RefreshCwIcon } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@apollo/client/react';
import { BUSINESS } from '@/apollo/queries/admin';

type Business = {
    id: string;
    name: string;
    subscriptionStatus: string;
    businessType: string;
    description: string;
    phone: string;
    campaigns: Array<{
        id: string;
        name: string;
        status: string;
        startDate: string;
        totalViews: number;
        totalReferrals: number;
        totalRewardsGiven: number;
        maxParticipants: number;
        isActive: boolean;
        campaignType: string;
    }>;
};

type BusinessData = {
    business: Business;
};

const mockBusiness = {
    name: "GlovBox LTD",
    walletBalance: 25560.2,
    planType: "Free",
    allCampaigns: 15,
    activeCampaigns: 2,
    customers: 20,
    rewardsPaid: 20,
};


const mockCustomers = [
    { rank: 1, name: "Jane Mary", points: 3000, purchases: 24, amount: "₦8,000", redeemed: "₦8,000", badge: "Gold" },
    { rank: 2, name: "Obi Ann", points: 3000, purchases: 21, amount: "₦6,500", redeemed: "₦6,500", badge: "Silver" },
    { rank: 3, name: "Ade Nuella", points: 3000, purchases: 17, amount: "₦5,000", redeemed: "₦5,000", badge: "Bronze" },
    { rank: 4, name: "Fola Kayode", points: 2000, purchases: 9, amount: "₦3,000", redeemed: "₦3,000", badge: "-" },
    { rank: 5, name: "Daniel Tayo", points: 1000, purchases: 6, amount: "₦2,000", redeemed: "₦2,000", badge: "-" },
];

const mockPayouts = [
    { campaign: "Shp2Earn", type: "Referral reward", amount: "10,000", reward: "Airtime", user: "John Busco", status: "Pending", date: "10-04-2025" },
    { campaign: "Shp2Earn", type: "Referral reward", amount: "10,000", reward: "Airtime", user: "John Busco", status: "Paid", date: "10-04-2025" },
    { campaign: "Shp2Earn", type: "Referral reward", amount: "10,000", reward: "Airtime", user: "John Busco", status: "Failed", date: "10-04-2025" },
    { campaign: "Shp2Earn", type: "Referral reward", amount: "10,000", reward: "Airtime", user: "John Busco", status: "Paid", date: "10-04-2025" },
    { campaign: "Shp2Earn", type: "Referral reward", amount: "10,000", reward: "Airtime", user: "John Busco", status: "Failed", date: "10-04-2025" },
];

const statusColors: Record<string, string> = {
    active: "bg-green-500 text-white",
    completed: "bg-blue-500 text-white",
    scheduled: "bg-yellow-400 text-black",
    paid: "bg-green-500 text-white",
    pending: "bg-yellow-400 text-black",
    failed: "bg-red-500 text-white",
};

export default function BusinessProfilePage() {
    const router = useRouter();
    const params = useParams();
    const businessId = typeof params?.id === 'string' ? params.id : '';

    const { data, loading, error } = useQuery<BusinessData>(BUSINESS, {
        variables: { id: businessId },
        skip: !businessId
    });

    const business = data?.business;

    return (
        <DashboardLayout>
            <div className="mt-4">
                <div className='flex justify-between'>
                    <button
                        className="text-black cursor-pointer flex mb-4 items-center"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="mr-3" />
                        <span className="text-lg font-semibold capitalize">
                            Business Profile
                        </span>
                    </button>
                    <button
                        className="flex text-primary items-center gap-2"
                    // onClick={() => refetch()}
                    // disabled={analyticsLoading}
                    >
                        <RefreshCwIcon size={15} />
                        <span className="text-sm">Refresh</span>
                    </button>
                </div>
                <div className="bg-[#D1DAF4] p-2 rounded-md flex justify-between">
                    <div className="flex gap-4 justify-between">
                        <div className="border-r m-3 pr-3 border-r-[#CCCCCC]">
                            <h2 className="text-xs mb-2">Business Name</h2>
                            <p className="text-sm">{business?.name || "-"}</p>
                        </div>
                        <div className="border-r m-3 pr-3 border-r-[#CCCCCC]">
                            <h2 className="text-xs mb-2">Business Type</h2>
                            <p className="text-sm">{business?.businessType || "-"}</p>
                        </div>
                        <div className="border-r m-3 pr-3 border-r-[#CCCCCC]">
                            <h2 className="text-xs mb-2">Plan Type</h2>
                            <p className="text-sm">
                                <p className="text-sm">{business?.subscriptionStatus || "-"}</p>
                            </p>
                        </div>
                        <div className="m-3">
                            <h2 className="text-xs mb-2">All Campaigns</h2>
                            <p className="text-sm">
                                <p className="text-sm">{business?.campaigns.length || "-"}</p>
                            </p>
                        </div>
                        <div className="m-3">
                            <h2 className="text-xs mb-2">Active Campaigns</h2>
                            <p className="text-sm">
                                <p className="text-sm">{business?.campaigns.filter(campaign => campaign.status === "Active").length || "-"}</p>
                            </p>
                        </div>
                        <div className="m-3">
                            <h2 className="text-xs mb-2">Customers</h2>
                            <p className="text-sm">
                                {/* {campaignAnalytics?.campaign?.status || "-"} */}
                            </p>
                        </div>
                        <div className="m-3">
                            <h2 className="text-xs mb-2">Rewards Paid</h2>
                            <p className="text-sm">
                                {/* {campaignAnalytics?.campaign?.status || "-"} */}
                            </p>
                        </div>
                    </div>
                </div>


                {/* Campaigns Section */}
                <div className="bg-white rounded-md p-4 my-6">
                    <div className="flex justify-between items-center mb-2">
                        <div className="font-semibold text-base">Campaigns</div>
                        <div>

                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-[#D1DAF4] text-black">
                                    <th className="px-4 py-3 font-medium text-left">Campaign Name</th>
                                    {/* <th className="px-4 py-3 font-medium text-left">Campaign ID</th> */}
                                    <th className="px-4 py-3 font-medium text-left">Type</th>
                                    <th className="px-4 py-3 font-medium text-left">Referrals</th>
                                    <th className="px-4 py-3 font-medium text-left">Conversions</th>
                                    <th className="px-4 py-3 font-medium text-left">Rewards</th>
                                    <th className="px-4 py-3 font-medium text-left">Status</th>
                                    <th className="px-4 py-3 font-medium text-left">Date</th>
                                    <th className="px-4 py-3 font-medium text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={9} className="px-4 py-3 text-center">Loading...</td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan={9} className="px-4 py-3 text-center text-red-500">Error loading campaigns</td>
                                    </tr>
                                ) : business?.campaigns?.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="px-4 py-3 text-center">No campaigns found</td>
                                    </tr>
                                ) : (
                                    business?.campaigns?.map((campaign, i) => (
                                        <tr key={campaign.id || i} className="border-b border-[#E2E8F0] py-2 last:border-0">
                                            <td className="px-4 py-3">{campaign.name}</td>
                                            {/* <td className="px-4 py-3">{campaign.id}</td> */}
                                            <td className="px-4 py-3">
                                                <span className={`inline-block px-4 py-1 rounded-[5px] text-white text-xs ${campaign.campaignType === "REFERRAL" ? "bg-[#4C8AFF]" :
                                                    campaign.campaignType === "LOYALTY" ? "bg-[#A16AD4]" :
                                                        "bg-[#6192AE]"
                                                    }`}>
                                                    {campaign.campaignType}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">{campaign.totalReferrals || 0}</td>
                                            <td className="px-4 py-3">{campaign.totalViews || 0}</td>
                                            <td className="px-4 py-3">{campaign.totalRewardsGiven || 0}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-block px-3 py-1 rounded-[5px] text-xs ${statusColors[campaign.status.toLocaleLowerCase()] || "bg-gray-300"}`}>
                                                    {campaign.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">{campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : '-'}</td>
                                            <td className="px-4 py-3">
                                                <Dropdown
                                                    menu={{
                                                        items: [
                                                            { key: "view", label: "View Campaign" },
                                                            { key: "flag", label: "Flag Account" },
                                                            { key: "delete", label: "Delete Account" },
                                                            { key: "download", label: "Download Report" },
                                                        ],
                                                    }}
                                                    trigger={["click"]}
                                                >
                                                    <Button type="text"><MoreOutlined /></Button>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Customers Section */}
                <div className="bg-white rounded-md p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <div className="font-semibold text-base">Customers</div>
                        <div>
                            <Button>View All</Button>
                        </div>
                    </div>
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

                {/* Recent Payouts Section */}
                {/* <div className="bg-white rounded-md p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <div className="font-semibold text-base">Recent Payouts</div>
                        <div>
                            <Button>Download Report</Button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-[#D1DAF4] text-black">
                                    <th className="px-4 py-3 font-medium text-left">Campaign</th>
                                    <th className="px-4 py-3 font-medium text-left">Reward Type</th>
                                    <th className="px-4 py-3 font-medium text-left">Amount</th>
                                    <th className="px-4 py-3 font-medium text-left">Reward</th>
                                    <th className="px-4 py-3 font-medium text-left">User</th>
                                    <th className="px-4 py-3 font-medium text-left">Status</th>
                                    <th className="px-4 py-3 font-medium text-left">Date</th>
                                    <th className="px-4 py-3 font-medium text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockPayouts.map((p, i) => (
                                    <tr key={i} className="border-b border-[#E2E8F0] py-2 last:border-0">
                                        <td className="px-4 py-3">{p.campaign}</td>
                                        <td className="px-4 py-3">{p.type}</td>
                                        <td className="px-4 py-3">{p.amount}</td>
                                        <td className="px-4 py-3">{p.reward}</td>
                                        <td className="px-4 py-3">{p.user}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-block px-3 py-1 rounded-[5px] text-xs ${statusColors[p.status] || "bg-gray-300"}`}>{p.status}</span>
                                        </td>
                                        <td className="px-4 py-3">{p.date}</td>
                                        <td className="px-4 py-3">
                                            <Dropdown
                                                menu={{
                                                    items: [
                                                        { key: "view", label: "View Payout" },
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
                </div> */}
            </div>
        </DashboardLayout>
    );
}
