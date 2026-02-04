'use client'

import React, { useState, useMemo } from "react";
import { Dropdown, Button, DatePicker, Select } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client/react";
import { GET_CAMPAIGN_REFERRALS } from "@/apollo/queries/referrals";
import { CampaignReferralsResponse, AggregatedReferrer, CampaignReferral, ReferralUser } from "@/apollo/types";
import { SearchIcon, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const { RangePicker } = DatePicker;

interface CampaignReferrersTableProps {
  campaignId: string;
}

const CampaignReferrersTable: React.FC<CampaignReferrersTableProps> = ({ campaignId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReferrer, setSelectedReferrer] = useState<AggregatedReferrer | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch campaign referrals
  const { data, loading, error } = useQuery<CampaignReferralsResponse>(
    GET_CAMPAIGN_REFERRALS,
    {
      variables: { campaignId },
      skip: !campaignId,
    }
  );

  // Helper: Get display name from user object
  const getDisplayName = (user?: ReferralUser, fallbackName?: string): string => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return fallbackName || user?.email || 'Unknown';
  };

  // Helper: Aggregate referrals by referrer
  const aggregateByReferrer = (referrals: CampaignReferral[]): AggregatedReferrer[] => {
    const referrerMap = new Map<string, AggregatedReferrer>();

    referrals.forEach(referral => {
      const referrerId = referral.referrer.id;
      if (!referrerMap.has(referrerId)) {
        referrerMap.set(referrerId, {
          referrer: referral.referrer,
          totalReferrals: 0,
          conversions: 0,
          totalCommission: 0,
          firstReferralDate: referral.createdAt,
          referrals: []
        });
      }

      const stats = referrerMap.get(referrerId)!;
      stats.totalReferrals += 1;
      if (referral.status === 'converted') stats.conversions += 1;
      stats.totalCommission += referral.commissionAmount || 0;
      stats.referrals.push(referral);

      // Update first referral date if earlier
      if (new Date(referral.createdAt) < new Date(stats.firstReferralDate)) {
        stats.firstReferralDate = referral.createdAt;
      }
    });

    return Array.from(referrerMap.values());
  };

  // Aggregate data
  const aggregatedData = useMemo(() => {
    if (!data?.campaignReferrals) return [];
    return aggregateByReferrer(data.campaignReferrals);
  }, [data]);

  // Filter data based on search and date range
  const filteredData = useMemo(() => {
    let filtered = aggregatedData;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(item => {
        const name = getDisplayName(item.referrer).toLowerCase();
        const email = item.referrer.email?.toLowerCase() || '';
        const phone = item.referrer.phone?.toLowerCase() || '';
        return name.includes(searchLower) || email.includes(searchLower) || phone.includes(searchLower);
      });
    }

    // Date range filter
    if (dateRange && dateRange[0] && dateRange[1]) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.firstReferralDate);
        return itemDate >= dateRange[0].toDate() && itemDate <= dateRange[1].toDate();
      });
    }

    return filtered;
  }, [aggregatedData, searchTerm, dateRange]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, pageSize]);

  // Format date
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Total Referrals', 'Conversions', 'Total Commission', 'Date Joined'];
    const rows = filteredData.map(item => [
      getDisplayName(item.referrer),
      item.referrer.email || '',
      item.referrer.phone || '',
      item.totalReferrals,
      item.conversions,
      `$${Number(item.totalCommission).toFixed(2)}`,
      formatDate(item.firstReferralDate)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campaign-referrers-${campaignId}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // View details handler
  const handleViewDetails = (referrer: AggregatedReferrer) => {
    setSelectedReferrer(referrer);
    setModalOpen(true);
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / pageSize);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="text-sm text-gray-600">Loading referrers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <div className="text-sm">Error loading referrers: {error.message}</div>
      </div>
    );
  }

  return (
    <div>
      {/* Filters Section */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            className="bg-[#F9FAFB] w-full border border-[#E4E7EC] p-3 rounded-sm pl-8 text-sm"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <SearchIcon size={16} className="absolute top-4 left-3 text-gray-500" />
        </div>

        <RangePicker
          className="border border-[#E4E7EC] rounded-sm"
          onChange={(dates) => {
            setDateRange(dates as [any, any]);
            setCurrentPage(1);
          }}
        />

        <Button
          type="default"
          icon={<Download size={16} />}
          onClick={exportToCSV}
          disabled={filteredData.length === 0}
        >
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full mt-4 text-sm">
          <thead>
            <tr className="bg-[#D1DAF4] text-black">
              <th className="px-4 py-3 font-medium text-left">Referrer Name</th>
              <th className="px-4 py-3 font-medium text-left">Email</th>
              <th className="px-4 py-3 font-medium text-left">Phone</th>
              <th className="px-4 py-3 font-medium text-left">Total Referrals</th>
              <th className="px-4 py-3 font-medium text-left">Conversions</th>
              <th className="px-4 py-3 font-medium text-left">Total Commission</th>
              <th className="px-4 py-3 font-medium text-left">Date Joined</th>
              <th className="px-4 py-3 font-medium text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <tr
                  key={item.referrer.id}
                  className="border-b border-[#E2E8F0] py-2 last:border-0"
                >
                  <td className="px-4 py-3 font-normal">{getDisplayName(item.referrer)}</td>
                  <td className="px-4 py-3">{item.referrer.email || '-'}</td>
                  <td className="px-4 py-3">{item.referrer.phone || '-'}</td>
                  <td className="px-4 py-3">{item.totalReferrals}</td>
                  <td className="px-4 py-3">{item.conversions}</td>
                  <td className="px-4 py-3">${Number(item.totalCommission || 0).toFixed(2)}</td>
                  <td className="px-4 py-3">{formatDate(item.firstReferralDate)}</td>
                  <td className="px-4 py-3">
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: "view",
                            label: "View Details",
                            onClick: () => handleViewDetails(item),
                          },
                          {
                            key: "export",
                            label: "Export Referrer Data",
                            onClick: () => {
                              // Export individual referrer data
                              const csv = [
                                'Referrer,Email,Total Referrals,Conversions,Commission',
                                `${getDisplayName(item.referrer)},${item.referrer.email},${item.totalReferrals},${item.conversions},$${Number(item.totalCommission).toFixed(2)}`
                              ].join('\n');
                              const blob = new Blob([csv], { type: 'text/csv' });
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `referrer-${item.referrer.id}.csv`;
                              a.click();
                              window.URL.revokeObjectURL(url);
                            },
                          },
                        ],
                      }}
                      trigger={["click"]}
                    >
                      <Button type="text">
                        <MoreOutlined />
                      </Button>
                    </Dropdown>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700">No referrers found</h3>
                      <p className="text-sm text-gray-500">
                        {searchTerm || dateRange ? 'Try adjusting your filters' : 'No referrers have joined this campaign yet'}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredData.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show</span>
            <Select
              value={pageSize}
              onChange={(value) => {
                setPageSize(value);
                setCurrentPage(1);
              }}
              options={[
                { value: 10, label: '10' },
                { value: 25, label: '25' },
                { value: 50, label: '50' },
              ]}
              className="w-20"
            />
            <span className="text-sm text-gray-600">per page</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="default"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              type="default"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>Referrer Details</DialogTitle>
          </DialogHeader>
          {selectedReferrer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{getDisplayName(selectedReferrer.referrer)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{selectedReferrer.referrer.email || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{selectedReferrer.referrer.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date Joined</p>
                  <p className="font-medium">{formatDate(selectedReferrer.firstReferralDate)}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Referral Statistics</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-sm text-gray-600">Total Referrals</p>
                    <p className="text-2xl font-bold text-blue-600">{selectedReferrer.totalReferrals}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <p className="text-sm text-gray-600">Conversions</p>
                    <p className="text-2xl font-bold text-green-600">{selectedReferrer.conversions}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded">
                    <p className="text-sm text-gray-600">Total Commission</p>
                    <p className="text-2xl font-bold text-purple-600">${Number(selectedReferrer.totalCommission).toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Recent Referrals ({selectedReferrer.referrals.length})</h4>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {selectedReferrer.referrals.slice(0, 10).map(referral => (
                    <div key={referral.id} className="border p-3 rounded text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {referral.referee ? getDisplayName(referral.referee) : referral.refereeName || referral.refereeEmail}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          referral.status === 'converted' ? 'bg-green-300 text-green-800' :
                          referral.status === 'registered' ? 'bg-yellow-300 text-yellow-800' :
                          referral.status === 'clicked' ? 'bg-blue-300 text-blue-800' :
                          'bg-gray-300 text-gray-800'
                        }`}>
                          {referral.status}
                        </span>
                      </div>
                      <div className="text-gray-600 mt-1">
                        {formatDate(referral.createdAt)}
                        {referral.commissionAmount && <span className="ml-2">• ${Number(referral.commissionAmount).toFixed(2)}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CampaignReferrersTable;
