"use client";
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import React from 'react';
import { MoreOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import { ArrowLeft, RefreshCwIcon, SearchIcon } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@apollo/client/react';
import { BUSINESS, BUSINESS_MEMBERS } from '@/apollo/queries/admin';

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
    const [searchCampaign, setSearchCampaign] = React.useState('');
    const [searchCustomer, setSearchCustomer] = React.useState('');

    const filterCampaigns = (campaigns: Business['campaigns']) => {
        if (!searchCampaign) return campaigns;
        const searchTerm = searchCampaign.toLowerCase();
        return campaigns.filter(campaign =>
            campaign.name.toLowerCase().includes(searchTerm) ||
            campaign.campaignType.toLowerCase().includes(searchTerm)
        );
    };

    const filterMembers = (members: any[]) => {
        if (!searchCustomer) return members;
        const searchTerm = searchCustomer.toLowerCase();
        return members.filter(member => {
            const fullName = `${member.user?.userProfile?.firstName} ${member.user?.userProfile?.lastName}`.toLowerCase();
            const email = member.user?.userProfile?.email?.toLowerCase() || '';
            return fullName.includes(searchTerm) || email.includes(searchTerm);
        });
    };

    const { data, loading, error, refetch } = useQuery<BusinessData>(BUSINESS, {
        variables: { id: businessId },
        skip: !businessId
    });
    const { data: membersData, loading: membersLoading, error: membersError, refetch: refetchMembers } = useQuery<any>(BUSINESS_MEMBERS, {
        variables: { businessId },
        skip: !businessId
    });

    const business = data?.business;
    const members = membersData?.businessMembers || [];

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
                        onClick={async () => {
                            await Promise.all([refetch(), refetchMembers()]);
                        }}
                        disabled={loading || membersLoading}
                    >
                        <RefreshCwIcon size={15} />
                        <span className="text-sm">{(loading || membersLoading) ? "Refreshing..." : "Refresh"}</span>
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
                        <div className="relative md:mt-0 mt-2">
                            <input
                                type="text"
                                value={searchCampaign}
                                onChange={e => setSearchCampaign(e.target.value)}
                                className="bg-[#F9FAFB] md:w-[400px] w-full border border-[#E4E7EC] p-3 rounded-sm pl-8 text-sm"
                                placeholder="Search by campaign name or type"
                            />
                            <SearchIcon
                                size={16}
                                className="absolute top-4 left-3 text-gray-500"
                            />
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
                                ) : business === null || business?.campaigns?.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="px-4 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <svg className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <h3 className="mt-2 text-lg font-medium text-gray-900">No campaigns found</h3>
                                                {/* <p className="mt-1 text-sm text-gray-500">Start a campaign to see it listed here.</p> */}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filterCampaigns(business?.campaigns || [])?.map((campaign, i) => (
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
                        {/* <div>
                            <Button>View All</Button>
                        </div> */}

                        <div className="relative md:mt-0 mt-2">
                            <input
                                type="text"
                                value={searchCustomer}
                                onChange={e => setSearchCustomer(e.target.value)}
                                className="bg-[#F9FAFB] md:w-[400px] w-full border border-[#E4E7EC] p-3 rounded-sm pl-8 text-sm"
                                placeholder="Search by customer name or email"
                            />
                            <SearchIcon
                                size={16}
                                className="absolute top-4 left-3 text-gray-500"
                            />
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
                                {membersLoading ? (
                                    <tr><td colSpan={7} className="px-4 py-3 text-center">Loading...</td></tr>
                                ) : membersError ? (
                                    <tr><td colSpan={7} className="px-4 py-3 text-center text-red-500">Error loading members</td></tr>
                                ) : members.length === 0 ? (
                                    <tr><td colSpan={7} className="px-4 py-3 text-center">No customers found</td></tr>
                                ) : (
                                    filterMembers(members).map((m: any, i: number) => (
                                        <tr key={i} className="border-b border-[#E2E8F0] py-2 last:border-0 hover:bg-gray-50">
                                            <td className="px-4 py-3">{i + 1}</td>
                                            <td className="px-4 py-3">{m.user?.userProfile?.firstName} {m.user?.userProfile?.lastName}</td>
                                            <td className="px-4 py-3">{m.user?.totalRewards || 0}</td>
                                            <td className="px-4 py-3">{m.user?.totalCampaignsJoined || 0}</td>
                                            <td className="px-4 py-3">₦{m.user?.totalRewardsEarned?.toLocaleString() || '0'}</td>
                                            <td className="px-4 py-3">{m.user?.redeemedRewards || 0}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-block px-2 py-1 rounded-full text-xs ${m.user?.totalReferrals > 100
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : m.user?.totalReferrals > 50
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : m.user?.totalReferrals > 20
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {m.user?.totalReferrals > 100
                                                        ? 'Diamond'
                                                        : m.user?.totalReferrals > 50
                                                            ? 'Platinum'
                                                            : m.user?.totalReferrals > 20
                                                                ? 'Gold'
                                                                : 'Silver'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Dropdown
                                                    menu={{
                                                        items: [
                                                            {
                                                                key: "view",
                                                                label: "View Customer",
                                                                onClick: () => router.push(`/admin/customers/${m.user?.userProfile?.id}`)
                                                            },
                                                            {
                                                                key: "rewards",
                                                                label: "View Rewards",
                                                                onClick: () => router.push(`/admin/customers/${m.user?.userProfile?.id}/rewards`)
                                                            }
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
