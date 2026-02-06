'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useQuery } from '@apollo/client/react';
import { GET_USER_WITHDRAWAL_REQUESTS } from '@/apollo/queries/rewards';
import { Clock, DollarSign, CheckCircle, XCircle, Eye } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface WithdrawalRequest {
  id: string;
  amount: string;
  currency: string;
  method: string;
  status: string;
  paymentDetails: any;
  rejectionReason?: string;
  transactionReference?: string;
  createdAt: string;
  processedAt?: string;
}

interface UserWithdrawalRequestsData {
  userWithdrawalRequests: WithdrawalRequest[];
}

export default function UserWithdrawalRequestsPage() {
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);

  const { data, loading, error } = useQuery<UserWithdrawalRequestsData>(
    GET_USER_WITHDRAWAL_REQUESTS
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock size={14} />;
      case 'processing':
        return <Clock size={14} className="animate-spin" />;
      case 'approved':
      case 'completed':
        return <CheckCircle size={14} />;
      case 'rejected':
        return <XCircle size={14} />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const requests = data?.userWithdrawalRequests || [];
  const pendingCount = requests.filter((r) => r.status.toLowerCase() === 'pending').length;
  const completedCount = requests.filter((r) =>
    ['completed', 'approved'].includes(r.status.toLowerCase())
  ).length;
  const totalAmount = requests
    .filter((r) => ['completed', 'approved'].includes(r.status.toLowerCase()))
    .reduce((sum, r) => sum + Number(r.amount), 0);

  if (loading) {
    return (
      <DashboardLayout user={true}>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading withdrawal requests...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout user={true}>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Error loading requests: {error.message}</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={true}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Withdrawals</h1>
          <p className="text-gray-500 mt-1">Track your payout requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col bg-[#fff] rounded-md p-4 items-start min-h-[100px] justify-center">
            <div className="flex w-full flex-col">
              <div className="flex justify-between">
                <p className="my-auto font-medium">Pending</p>
                <div className="rounded-full ml-auto bg-[#FFC327]/20 w-[30px] h-[30px] flex items-center justify-center">
                  <Clock size={16} className="text-[#FFC327]" />
                </div>
              </div>
              <div className="text-xl my-3 font-bold">{pendingCount}</div>
            </div>
          </div>

          <div className="flex flex-col bg-[#fff] rounded-md p-4 items-start min-h-[100px] justify-center">
            <div className="flex w-full flex-col">
              <div className="flex justify-between">
                <p className="my-auto font-medium">Total Requests</p>
                <div className="rounded-full ml-auto bg-[#233E97]/20 w-[30px] h-[30px] flex items-center justify-center">
                  <DollarSign size={16} fill="#233E97" className="text-[#233E97]" />
                </div>
              </div>
              <div className="text-xl my-3 font-bold">{requests.length}</div>
            </div>
          </div>

          <div className="flex flex-col bg-[#fff] rounded-md p-4 items-start min-h-[100px] justify-center">
            <div className="flex w-full flex-col">
              <div className="flex justify-between">
                <p className="my-auto font-medium">Total Paid Out</p>
                <div className="rounded-full ml-auto bg-[#A16AD4]/20 w-[30px] h-[30px] flex items-center justify-center">
                  <CheckCircle size={16} fill="#A16AD4" className="text-[#A16AD4]" />
                </div>
              </div>
              <div className="text-xl my-3 font-bold">
                NGN {totalAmount.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Requests</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No withdrawal requests yet
                    </td>
                  </tr>
                ) : (
                  requests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-semibold text-gray-900">
                          {request.currency} {Number(request.amount).toLocaleString()}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900 capitalize">
                          {request.method.replace('_', ' ')}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            request.status
                          )}`}
                        >
                          {getStatusIcon(request.status)}
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-500">{formatDate(request.createdAt)}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-primary hover:bg-primary/10 rounded-md"
                        >
                          <Eye size={14} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent>
          <h2 className="text-center font-medium">Withdrawal Details</h2>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="border border-[#E4E7EC] rounded-lg p-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <p className="text-gray-500">Amount</p>
                    <p className="font-medium text-gray-800">
                      {selectedRequest.currency} {Number(selectedRequest.amount).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-500">Method</p>
                    <p className="font-medium text-gray-800 capitalize">
                      {selectedRequest.method.replace('_', ' ')}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-500">Status</p>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        selectedRequest.status
                      )}`}
                    >
                      {getStatusIcon(selectedRequest.status)}
                      {selectedRequest.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-500">Requested</p>
                    <p className="font-medium text-gray-800">{formatDate(selectedRequest.createdAt)}</p>
                  </div>
                  {selectedRequest.processedAt && (
                    <div className="flex justify-between">
                      <p className="text-gray-500">Processed</p>
                      <p className="font-medium text-gray-800">{formatDate(selectedRequest.processedAt)}</p>
                    </div>
                  )}
                  {selectedRequest.transactionReference && (
                    <div className="flex justify-between">
                      <p className="text-gray-500">Reference</p>
                      <p className="font-medium text-gray-800 text-xs">{selectedRequest.transactionReference}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Details */}
              {(() => {
                try {
                  const paymentDetails = typeof selectedRequest.paymentDetails === 'string'
                    ? JSON.parse(selectedRequest.paymentDetails)
                    : selectedRequest.paymentDetails;

                  if (!paymentDetails) return null;

                  return (
                    <div className="border border-[#E4E7EC] rounded-lg p-4 bg-gray-50">
                      <p className="text-sm font-medium mb-2">Bank Details</p>
                      <div className="space-y-2 text-sm">
                        {paymentDetails?.bank_name && (
                          <div className="flex justify-between">
                            <p className="text-gray-500">Bank</p>
                            <p className="font-medium text-gray-800">{paymentDetails.bank_name}</p>
                          </div>
                        )}
                        {paymentDetails?.account_name && (
                          <div className="flex justify-between">
                            <p className="text-gray-500">Account Name</p>
                            <p className="font-medium text-gray-800">{paymentDetails.account_name}</p>
                          </div>
                        )}
                        {paymentDetails?.account_number && (
                          <div className="flex justify-between">
                            <p className="text-gray-500">Account Number</p>
                            <p className="font-medium text-gray-800">{paymentDetails.account_number}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                } catch {
                  return null;
                }
              })()}

              {/* Rejection Reason */}
              {selectedRequest.rejectionReason && (
                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason</p>
                  <p className="text-sm text-red-700">{selectedRequest.rejectionReason}</p>
                </div>
              )}

              <div className="flex justify-center">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
