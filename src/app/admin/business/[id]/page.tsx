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
    businessCategory: string;
    description: string;
    phone: string;
    email: string;
    website: string;
    tagline: string;
    logo: string | null;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    createdAt: string;
    onBoardingComplete: boolean;
    isKycVerified: boolean;
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

const PAGE_SIZE = 10;

function InfoRow({
    label,
    value,
    multiline,
}: {
    label: string;
    value: React.ReactNode;
    multiline?: boolean;
}) {
    const isEmpty =
        value === null ||
        value === undefined ||
        (typeof value === 'string' && value.trim() === '');
    return (
        <div className="flex flex-col gap-1">
            <dt className="text-xs text-gray-500">{label}</dt>
            <dd className={`text-sm text-gray-900 ${multiline ? 'whitespace-pre-wrap' : 'break-words'}`}>
                {isEmpty ? <span className="text-gray-400">—</span> : value}
            </dd>
        </div>
    );
}

function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
    if (totalPages <= 1) return null;
    return (
        <div className="flex items-center justify-end gap-2 mt-4 text-sm">
            <button
                className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                disabled={page <= 1}
                onClick={() => onChange(page - 1)}
            >
                Previous
            </button>
            <span className="px-2">Page {page} of {totalPages}</span>
            <button
                className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                disabled={page >= totalPages}
                onClick={() => onChange(page + 1)}
            >
                Next
            </button>
        </div>
    );
}

export default function BusinessProfilePage() {
    const router = useRouter();
    const params = useParams();
    const businessId = typeof params?.id === 'string' ? params.id : '';
    const [searchCampaign, setSearchCampaign] = React.useState('');
    const [searchCustomer, setSearchCustomer] = React.useState('');
    const [campaignPage, setCampaignPage] = React.useState(1);
    const [customerPage, setCustomerPage] = React.useState(1);

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

    const filteredCampaigns = filterCampaigns(business?.campaigns || []);
    const filteredMembers = filterMembers(members);
    const campaignTotalPages = Math.max(1, Math.ceil(filteredCampaigns.length / PAGE_SIZE));
    const customerTotalPages = Math.max(1, Math.ceil(filteredMembers.length / PAGE_SIZE));
    const paginatedCampaigns = filteredCampaigns.slice((campaignPage - 1) * PAGE_SIZE, campaignPage * PAGE_SIZE);
    const paginatedMembers = filteredMembers.slice((customerPage - 1) * PAGE_SIZE, customerPage * PAGE_SIZE);
    const totalRewardsPaid = (business?.campaigns || []).reduce((sum, c) => sum + (c.totalRewardsGiven || 0), 0);
    const activeCampaignCount = (business?.campaigns || []).filter(c => c.status?.toUpperCase() === "ACTIVE").length;

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
                            <p className="text-sm">{business ? activeCampaignCount : "-"}</p>
                        </div>
                        <div className="m-3">
                            <h2 className="text-xs mb-2">Customers</h2>
                            <p className="text-sm">{membersLoading ? "-" : members.length}</p>
                        </div>
                        <div className="m-3">
                            <h2 className="text-xs mb-2">Rewards Paid</h2>
                            <p className="text-sm">{business ? totalRewardsPaid : "-"}</p>
                        </div>
                    </div>
                </div>

                {/* Business Information Section */}
                <div className="bg-white rounded-md p-4 my-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4">
                            {business?.logo ? (
                                <img
                                    src={business.logo}
                                    alt={`${business.name} logo`}
                                    className="w-16 h-16 rounded-md object-cover border border-gray-200"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-md border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400">
                                    No logo
                                </div>
                            )}
                            <div>
                                <div className="font-semibold text-base">Business Information</div>
                                {business?.tagline ? (
                                    <p className="text-sm text-gray-500 mt-1">{business.tagline}</p>
                                ) : null}
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 text-xs">
                            <span className={`inline-block px-2 py-1 rounded-full ${business?.onBoardingComplete ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {business?.onBoardingComplete ? 'Onboarding complete' : 'Onboarding pending'}
                            </span>
                            <span className={`inline-block px-2 py-1 rounded-full ${business?.isKycVerified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                                {business?.isKycVerified ? 'KYC verified' : 'KYC not verified'}
                            </span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-sm text-gray-500">Loading business information...</div>
                    ) : error ? (
                        <div className="text-sm text-red-500">Error loading business information</div>
                    ) : !business ? (
                        <div className="text-sm text-gray-500">Business not found</div>
                    ) : (
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                            <InfoRow label="Email" value={business.email} />
                            <InfoRow label="Phone" value={business.phone} />
                            <InfoRow
                                label="Website"
                                value={
                                    business.website ? (
                                        <a
                                            href={business.website.startsWith('http') ? business.website : `https://${business.website}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-primary underline break-all"
                                        >
                                            {business.website}
                                        </a>
                                    ) : null
                                }
                            />
                            <InfoRow label="Business Category" value={business.businessCategory} />
                            <InfoRow label="Business Type" value={business.businessType} />
                            <InfoRow label="Country" value={business.country} />
                            <InfoRow
                                label="Address"
                                value={[
                                    business.addressLine1,
                                    business.addressLine2,
                                    business.city,
                                    business.state,
                                    business.postalCode,
                                ].filter(Boolean).join(', ')}
                            />
                            <InfoRow
                                label="Date Joined"
                                value={business.createdAt ? new Date(business.createdAt).toLocaleDateString() : null}
                            />
                            <InfoRow label="Plan" value={business.subscriptionStatus} />
                            <div className="sm:col-span-2">
                                <InfoRow label="Description" value={business.description} multiline />
                            </div>
                        </dl>
                    )}
                </div>

                {/* Campaigns Section */}
                <div className="bg-white rounded-md p-4 my-6">
                    <div className="flex justify-between items-center mb-2">
                        <div className="font-semibold text-base">Campaigns</div>
                        <div className="relative md:mt-0 mt-2">
                            <input
                                type="text"
                                value={searchCampaign}
                                onChange={e => { setSearchCampaign(e.target.value); setCampaignPage(1); }}
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
                                ) : filteredCampaigns.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="px-4 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <svg className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <h3 className="mt-2 text-lg font-medium text-gray-900">No campaigns found</h3>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedCampaigns.map((campaign, i) => (
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
                    <Pagination page={campaignPage} totalPages={campaignTotalPages} onChange={setCampaignPage} />
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
                                onChange={e => { setSearchCustomer(e.target.value); setCustomerPage(1); }}
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
                                ) : filteredMembers.length === 0 ? (
                                    <tr><td colSpan={7} className="px-4 py-3 text-center">No customers found</td></tr>
                                ) : (
                                    paginatedMembers.map((m: any, i: number) => {
                                        const first = m.user?.userProfile?.firstName || '';
                                        const last = m.user?.userProfile?.lastName || '';
                                        const fullName = `${first} ${last}`.trim();
                                        const displayName = fullName || m.user?.userProfile?.email || '—';
                                        return (
                                        <tr key={i} className="border-b border-[#E2E8F0] py-2 last:border-0 hover:bg-gray-50">
                                            <td className="px-4 py-3">{(customerPage - 1) * PAGE_SIZE + i + 1}</td>
                                            <td className="px-4 py-3">{displayName}</td>
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
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                    <Pagination page={customerPage} totalPages={customerTotalPages} onChange={setCustomerPage} />
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
