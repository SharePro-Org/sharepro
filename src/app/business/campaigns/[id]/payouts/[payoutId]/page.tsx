"use client"

import React from "react";
import Image from "next/image";
import { CheckCircle, XCircle } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { IoWarning } from "react-icons/io5";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_SINGLE_PAYOUT } from "@/apollo/queries/campaigns";
import { useParams } from "next/navigation";
import { REVIEW_PAYOUT } from "@/apollo/mutations/campaigns";

const PayoutDetails = () => {
    const params = useParams();
    const id = params.payoutId;
    const {
        data,
        loading,
        error,
    } = useQuery<any>(GET_SINGLE_PAYOUT, {
        variables: { id: id },
        skip: !id,
    });

    const [handleToggleRewardStatus, { loading: setLoading }] = useMutation(REVIEW_PAYOUT)


    return (
        <DashboardLayout>
            <>
                <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-lg font-semibold">Payout Details</h2>
                            {/* <p className="text-sm text-gray-500">Transaction ID: TXN-2025-001234</p> */}
                        </div>
                        <button className="bg-green-500 flex gap-2 text-white text-sm px-4 py-1.5 rounded-full font-medium">
                            <IoWarning className="my-auto" />
                            <span className="my-auto">{data?.reward?.status}</span>
                        </button>
                    </div>

                    {/* Campaign Reward + Customer Details */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Campaign Reward Details */}
                        <div className="border border-[#E4E7EC] bg-[#F9FAFB] rounded-lg p-4 space-y-3">
                            <h3 className="text-sm font-medium text-gray-700">
                                Campaign Reward Details
                            </h3>
                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                                <p className="text-gray-500">Campaign</p>
                                <p className="font-medium text-gray-800">{data?.reward?.campaign?.name}</p>

                                <p className="text-gray-500">Reward Type</p>
                                <p className="font-medium text-gray-800">{data?.reward?.rewardType}</p>

                                <p className="text-gray-500">Amount</p>
                                <p className="font-medium text-gray-800">{data?.reward?.amount}</p>

                                {/* <p className="text-gray-500">Reward</p>
                                <p className="font-medium text-gray-800">Cashback</p> */}

                                <p className="text-gray-500">Request Date</p>
                                <p className="font-medium text-gray-800">--</p>

                                <p className="text-gray-500">Payment Date</p>
                                <p className="font-medium text-gray-800">--</p>
                            </div>
                        </div>

                        {/* Customer Details */}
                        <div className="border border-[#E4E7EC] bg-[#F9FAFB] rounded-lg p-4 space-y-3">
                            <h3 className="text-sm font-medium text-gray-700">Customer Details</h3>
                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                                <p className="text-gray-500">Full Name</p>
                                <p className="font-medium text-gray-800">{data?.reward?.user.firstName} {data?.reward?.user.lastName}</p>

                                <p className="text-gray-500">Email Address</p>
                                <p className="font-medium text-gray-800">{data?.reward?.user.email}</p>

                                <p className="text-gray-500">Phone Number</p>
                                <p className="font-medium text-gray-800">{data?.reward?.user.phone}</p>

                                <p className="text-gray-500">Account Number</p>
                                <p className="font-medium text-gray-800"></p>

                                <p className="text-gray-500">Bank Name</p>
                                <p className="font-medium text-gray-800"></p>

                                <p className="text-gray-500">Bank Holder’s Name</p>
                                <p className="font-medium text-gray-800"></p>
                            </div>
                        </div>
                    </div>

                    {/* Proof of Purchase */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                            Proof of Purchase
                        </h3>
                        <div className="flex flex-wrap gap-4">
                            {[1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="border border-[#E4E7EC] rounded-lg overflow-hidden w-56 shadow-sm"
                                >
                                    <Image
                                        src={data?.reward?.proofFile}
                                        alt={`Receipt ${i}`}
                                        width={224}
                                        height={280}
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                        <button onClick={() => handleToggleRewardStatus({
                            variables: {
                                rewardId: id,
                                action: 'reject',
                            }
                        })} className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-md border border-red-500 text-red-600 font-medium hover:bg-red-50 transition">
                            <XCircle className="w-5 h-5" />
                            {setLoading ? 'loading...' : 'Reject Payout'}

                        </button>
                        <button onClick={() => handleToggleRewardStatus({
                            variables: {
                                rewardId: id,
                                action: 'approve',
                            }
                        })} className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-md bg-[#0A1B88] text-white font-medium hover:bg-[#0A1B88]/90 transition">
                            <CheckCircle className="w-5 h-5" />
                            {setLoading ? 'loading...' : 'Approve & Make Payment'}

                        </button>
                    </div>
                </div>
            </>
        </DashboardLayout>
    );
};

export default PayoutDetails;
