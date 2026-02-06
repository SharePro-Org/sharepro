'use client'

import React, { useState, useMemo } from "react";
import { Dropdown, Button, DatePicker, Select } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client/react";
import { GET_CAMPAIGN_REFERRALS } from "@/apollo/queries/referrals";
import { CampaignReferralsResponse, CampaignReferral, ReferralUser } from "@/apollo/types";
import { SearchIcon, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const { RangePicker } = DatePicker;

interface CampaignReferralsTableProps {
  campaignId: string;
}

const CampaignReferralsTable: React.FC<CampaignReferralsTableProps> = ({ campaignId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReferral, setSelectedReferral] = useState<CampaignReferral | null>(null);
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

  // Helper: Get status badge color
  const getStatusBadgeColor = (status: string): string => {
    const colors: Record<string, string> = {
      pending: 'bg-gray-300 text-gray-800',
      clicked: 'bg-blue-300 text-blue-800',
      registered: 'bg-yellow-300 text-yellow-800',
      converted: 'bg-green-300 text-green-800',
      rejected: 'bg-red-300 text-red-800',
      expired: 'bg-gray-400 text-gray-900',
    };
    return colors[status] || 'bg-gray-300 text-gray-800';
  };

  // Filter data based on search, status, and date range
  const filteredData = useMemo(() => {
    if (!data?.campaignReferrals) return [];

    let filtered = data.campaignReferrals;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(referral => {
        const refereeName = referral.referee
          ? getDisplayName(referral.referee).toLowerCase()
          : (referral.refereeName || '').toLowerCase();
        const refereeEmail = (referral.referee?.email || referral.refereeEmail || '').toLowerCase();
        const refereePhone = (referral.referee?.phone || referral.refereePhone || '').toLowerCase();
        const referrerName = getDisplayName(referral.referrer).toLowerCase();

        return refereeName.includes(searchLower) ||
               refereeEmail.includes(searchLower) ||
               refereePhone.includes(searchLower) ||
               referrerName.includes(searchLower);
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(referral => referral.status === statusFilter);
    }

    // Date range filter
    if (dateRange && dateRange[0] && dateRange[1]) {
      filtered = filtered.filter(referral => {
        const referralDate = new Date(referral.createdAt);
        return referralDate >= dateRange[0].toDate() && referralDate <= dateRange[1].toDate();
      });
    }

    return filtered;
  }, [data, searchTerm, statusFilter, dateRange]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, pageSize]);

  // Format date
  const formatDate = (dateString?: string): string => {
    if (!dateString) return '-';
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
    const headers = ['Referee Name', 'Email', 'Phone', 'Referred By', 'Status', 'Date Referred', 'Converted Date', 'Commission'];
    const rows = filteredData.map(referral => [
      referral.referee ? getDisplayName(referral.referee) : referral.refereeName || referral.refereeEmail || '',
      referral.referee?.email || referral.refereeEmail || '',
      referral.referee?.phone || referral.refereePhone || '',
      getDisplayName(referral.referrer),
      referral.status,
      formatDate(referral.createdAt),
      formatDate(referral.convertedAt),
      referral.commissionAmount ? `$${Number(referral.commissionAmount).toFixed(2)}` : '$0.00'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campaign-referrals-${campaignId}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // View details handler
  const handleViewDetails = (referral: CampaignReferral) => {
    setSelectedReferral(referral);
    setModalOpen(true);
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / pageSize);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="text-sm text-gray-600">Loading referrals...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <div className="text-sm">Error loading referrals: {error.message}</div>
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

        <Select
          value={statusFilter}
          onChange={(value) => {
            setStatusFilter(value);
            setCurrentPage(1);
          }}
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'pending', label: 'Pending' },
            { value: 'clicked', label: 'Clicked' },
            { value: 'registered', label: 'Registered' },
            { value: 'converted', label: 'Converted' },
            { value: 'rejected', label: 'Rejected' },
            { value: 'expired', label: 'Expired' },
          ]}
          className="w-40"
        />

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
              <th className="px-4 py-3 font-medium text-left">Referee Name</th>
              <th className="px-4 py-3 font-medium text-left">Email</th>
              <th className="px-4 py-3 font-medium text-left">Phone</th>
              <th className="px-4 py-3 font-medium text-left">Referred By</th>
              <th className="px-4 py-3 font-medium text-left">Status</th>
              <th className="px-4 py-3 font-medium text-left">Date Referred</th>
              <th className="px-4 py-3 font-medium text-left">Converted</th>
              <th className="px-4 py-3 font-medium text-left">Commission</th>
              <th className="px-4 py-3 font-medium text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((referral) => (
                <tr
                  key={referral.id}
                  className="border-b border-[#E2E8F0] py-2 last:border-0"
                >
                  <td className="px-4 py-3 font-normal">
                    {referral.referee
                      ? getDisplayName(referral.referee)
                      : referral.refereeName || referral.refereeEmail || '-'}
                  </td>
                  <td className="px-4 py-3">{referral.referee?.email || referral.refereeEmail || '-'}</td>
                  <td className="px-4 py-3">{referral.referee?.phone || referral.refereePhone || '-'}</td>
                  <td className="px-4 py-3">{getDisplayName(referral.referrer)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-3 py-1 rounded-[5px] text-xs ${getStatusBadgeColor(referral.status)}`}>
                      {referral.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{formatDate(referral.createdAt)}</td>
                  <td className="px-4 py-3">{formatDate(referral.convertedAt)}</td>
                  <td className="px-4 py-3">
                    ${Number(referral.commissionAmount || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: "view",
                            label: "View Details",
                            onClick: () => handleViewDetails(referral),
                          },
                          {
                            key: "export",
                            label: "Export Referral Data",
                            onClick: () => {
                              const csv = [
                                'Referee,Email,Phone,Referred By,Status,Date,Commission',
                                `${referral.referee ? getDisplayName(referral.referee) : referral.refereeName},${referral.referee?.email || referral.refereeEmail},${referral.referee?.phone || referral.refereePhone},${getDisplayName(referral.referrer)},${referral.status},${formatDate(referral.createdAt)},${referral.commissionAmount ? `$${Number(referral.commissionAmount).toFixed(2)}` : '$0.00'}`
                              ].join('\n');
                              const blob = new Blob([csv], { type: 'text/csv' });
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `referral-${referral.id}.csv`;
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
                <td colSpan={9} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700">No referrals found</h3>
                      <p className="text-sm text-gray-500">
                        {searchTerm || statusFilter !== 'all' || dateRange ? 'Try adjusting your filters' : 'No referrals have been made for this campaign yet'}
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
            <DialogTitle>Referral Details</DialogTitle>
          </DialogHeader>
          {selectedReferral && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Referee Name</p>
                  <p className="font-medium">
                    {selectedReferral.referee
                      ? getDisplayName(selectedReferral.referee)
                      : selectedReferral.refereeName || selectedReferral.refereeEmail || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{selectedReferral.referee?.email || selectedReferral.refereeEmail || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{selectedReferral.referee?.phone || selectedReferral.refereePhone || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Referred By</p>
                  <p className="font-medium">{getDisplayName(selectedReferral.referrer)}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Referral Timeline</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${selectedReferral.createdAt ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Created</p>
                      <p className="text-xs text-gray-600">{formatDate(selectedReferral.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${selectedReferral.clickedAt ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Clicked</p>
                      <p className="text-xs text-gray-600">{formatDate(selectedReferral.clickedAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${selectedReferral.registeredAt ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Registered</p>
                      <p className="text-xs text-gray-600">{formatDate(selectedReferral.registeredAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${selectedReferral.convertedAt ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Converted</p>
                      <p className="text-xs text-gray-600">{formatDate(selectedReferral.convertedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Commission & Status</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-3 rounded">
                    <p className="text-sm text-gray-600">Commission Amount</p>
                    <p className="text-xl font-bold text-purple-600">
                      {selectedReferral.commissionAmount ? `$${Number(selectedReferral.commissionAmount).toFixed(2)}` : '$0.00'}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`inline-block px-3 py-1 rounded text-sm font-semibold ${getStatusBadgeColor(selectedReferral.status)}`}>
                      {selectedReferral.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Additional Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Referral Code:</span>
                    <span className="ml-2 font-mono font-medium">{selectedReferral.referralCode}</span>
                  </div>
                  {selectedReferral.purchaseAmount && (
                    <div>
                      <span className="text-gray-600">Purchase Amount:</span>
                      <span className="ml-2 font-medium">${Number(selectedReferral.purchaseAmount).toFixed(2)}</span>
                    </div>
                  )}
                  {selectedReferral.commissionPercentage && (
                    <div>
                      <span className="text-gray-600">Commission %:</span>
                      <span className="ml-2 font-medium">{selectedReferral.commissionPercentage}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CampaignReferralsTable;
