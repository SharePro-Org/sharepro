'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_ALL_WITHDRAWAL_REQUESTS } from '@/apollo/queries/rewards';
import { PROCESS_WITHDRAWAL_REQUEST } from '@/apollo/mutations/rewards';
import { useState } from 'react';
import { message } from 'antd';
import { CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';
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
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  business?: {
    id: string;
    name: string;
  };
  processedBy?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

interface WithdrawalRequestsData {
  allWithdrawalRequests: WithdrawalRequest[];
}

interface ProcessWithdrawalRequestData {
  processWithdrawalRequest: {
    success: boolean;
    message: string;
    errors?: string[];
    withdrawalRequest?: WithdrawalRequest;
  };
}

export default function WithdrawalRequestsPage() {
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [action, setAction] = useState<'approve' | 'decline'>('approve');

  const { data, loading, error, refetch } = useQuery<WithdrawalRequestsData>(
    GET_ALL_WITHDRAWAL_REQUESTS
  );

  const [processRequest, { loading: processing }] = useMutation<ProcessWithdrawalRequestData>(PROCESS_WITHDRAWAL_REQUEST, {
    onCompleted: (data) => {
      if (data.processWithdrawalRequest.success) {
        message.success(data.processWithdrawalRequest.message);
        setShowModal(false);
        setSelectedRequest(null);
        setRejectionReason('');
        refetch();
      } else {
        message.error(data.processWithdrawalRequest.message);
      }
    },
    onError: (error) => {
      message.error('Error processing request: ' + error.message);
    },
  });

  const confirmAction = () => {
    if (!selectedRequest) return;

    processRequest({
      variables: {
        withdrawalId: selectedRequest.id,
        action,
        rejectionReason: action === 'decline' ? rejectionReason : undefined,
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const pendingRequests = data?.allWithdrawalRequests?.filter(
    (req) => req.status.toLowerCase() === 'pending'
  ) || [];

  const processedRequests = data?.allWithdrawalRequests?.filter(
    (req) => req.status.toLowerCase() !== 'pending'
  ) || [];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading withdrawal requests...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Error loading requests: {error.message}</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Withdrawal Requests</h1>
          <p className="text-gray-500 mt-1">Manage user payout requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pending Requests Card */}
          <div className="flex flex-col bg-[#fff] rounded-md p-4 items-start min-h-[100px] justify-center">
            <div className="flex w-full flex-col">
              <div className="flex justify-between">
                <p className="my-auto font-medium">Pending Requests</p>
                <div className="rounded-full ml-auto bg-[#FFC327]/20 w-[30px] h-[30px] flex items-center justify-center">
                  <Clock size={16} className="text-[#FFC327]" />
                </div>
              </div>
              <div className="text-xl my-3 font-bold">{pendingRequests.length}</div>
            </div>
          </div>

          {/* Total Requests Card */}
          <div className="flex flex-col bg-[#fff] rounded-md p-4 items-start min-h-[100px] justify-center">
            <div className="flex w-full flex-col">
              <div className="flex justify-between">
                <p className="my-auto font-medium">Total Requests</p>
                <div className="rounded-full ml-auto bg-[#233E97]/20 w-[30px] h-[30px] flex items-center justify-center">
                  <DollarSign size={16} fill="#233E97" className="text-[#233E97]" />
                </div>
              </div>
              <div className="text-xl my-3 font-bold">{data?.allWithdrawalRequests?.length || 0}</div>
            </div>
          </div>

          {/* Processed Requests Card */}
          <div className="flex flex-col bg-[#fff] rounded-md p-4 items-start min-h-[100px] justify-center">
            <div className="flex w-full flex-col">
              <div className="flex justify-between">
                <p className="my-auto font-medium">Processed</p>
                <div className="rounded-full ml-auto bg-[#A16AD4]/20 w-[30px] h-[30px] flex items-center justify-center">
                  <CheckCircle size={16} fill="#A16AD4" className="text-[#A16AD4]" />
                </div>
              </div>
              <div className="text-xl my-3 font-bold">{processedRequests.length}</div>
            </div>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Pending Requests</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
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
                {pendingRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No pending requests
                    </td>
                  </tr>
                ) : (
                  pendingRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {request.user.firstName} {request.user.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{request.user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900">{request.business?.name || 'N/A'}</p>
                      </td>
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
                        <p className="text-sm text-gray-500">{formatDate(request.createdAt)}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowModal(true);
                          }}
                          className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90"
                        >
                          Process Request
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Processed Requests */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Processed Requests</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Processed Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Processed By
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {processedRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No processed requests
                    </td>
                  </tr>
                ) : (
                  processedRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {request.user.firstName} {request.user.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{request.user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900">{request.business?.name || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-semibold text-gray-900">
                          {request.currency} {Number(request.amount).toLocaleString()}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-500">
                          {request.processedAt ? formatDate(request.processedAt) : '-'}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900">
                          {request.processedBy
                            ? `${request.processedBy.firstName || ''} ${
                                request.processedBy.lastName || ''
                              }`.trim() || request.processedBy.email
                            : '-'}
                        </p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Action Modal */}
      <Dialog open={showModal} onOpenChange={() => {
        setShowModal(false);
        setSelectedRequest(null);
        setRejectionReason('');
        setAction('approve');
      }}>
        <DialogContent>
          <h2 className="text-center font-medium">Process Withdrawal Request</h2>
          <p className="text-sm text-[#030229CC]">
            Please review the withdrawal details below before approving or declining.
          </p>

          {selectedRequest && (
            <>
              <div className="border border-[#E4E7EC] rounded-lg p-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <p className="text-gray-500">User</p>
                    <p className="font-medium text-gray-800">
                      {selectedRequest.user.firstName} {selectedRequest.user.lastName}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">{selectedRequest.user.email}</p>
                  </div>
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
                    <p className="text-gray-500">Business</p>
                    <p className="font-medium text-gray-800">{selectedRequest.business?.name || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Payment Details</label>
                <div className="border border-[#E4E7EC] rounded-lg p-4 bg-gray-50">
                  <div className="space-y-2 text-sm">
                    {(() => {
                      try {
                        const paymentDetails = typeof selectedRequest.paymentDetails === 'string'
                          ? JSON.parse(selectedRequest.paymentDetails)
                          : selectedRequest.paymentDetails;

                        return (
                          <>
                            {paymentDetails?.bank_code && (
                              <div className="flex justify-between">
                                <p className="text-gray-500">Bank Code</p>
                                <p className="font-medium text-gray-800">{paymentDetails.bank_code}</p>
                              </div>
                            )}
                            {paymentDetails?.bank_name && (
                              <div className="flex justify-between">
                                <p className="text-gray-500">Bank Name</p>
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
                          </>
                        );
                      } catch (e) {
                        return <p className="text-sm text-gray-500">No payment details available</p>;
                      }
                    })()}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Action</label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="action"
                      value="approve"
                      checked={action === 'approve'}
                      onChange={(e) => setAction(e.target.value as 'approve' | 'decline')}
                      className="mr-2"
                    />
                    <span className="text-sm">Approve</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="action"
                      value="decline"
                      checked={action === 'decline'}
                      onChange={(e) => setAction(e.target.value as 'approve' | 'decline')}
                      className="mr-2"
                    />
                    <span className="text-sm">Decline</span>
                  </label>
                </div>
              </div>

              {action === 'decline' && (
                <div>
                  <label className="block text-sm mb-1">Rejection Reason</label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full border border-[#E4E7EC] rounded-md px-3 py-2 text-sm"
                    rows={3}
                    placeholder="Enter reason for rejection"
                  />
                </div>
              )}

              <p className="text-sm text-[#030229CC]">
                Are you sure you want to {action} this withdrawal request?
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedRequest(null);
                    setRejectionReason('');
                    setAction('approve');
                  }}
                  disabled={processing}
                  className="bg-gray-500 text-white px-6 py-2 rounded-md disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmAction()}
                  disabled={processing}
                  className={`${
                    action === 'approve'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  } text-white px-6 py-2 rounded-md disabled:opacity-50 flex items-center gap-2`}
                >
                  {action === 'approve' ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      {processing ? 'Processing...' : 'Approve'}
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      {processing ? 'Processing...' : 'Decline'}
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
