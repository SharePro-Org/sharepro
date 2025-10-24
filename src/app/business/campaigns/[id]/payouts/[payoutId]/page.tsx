"use client"

import React from "react";
import Image from "next/image";
import { CheckCircle, XCircle } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { IoWarning } from "react-icons/io5";

const PayoutDetails = () => {
    return (
        <DashboardLayout>
            <>
                <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-lg font-semibold">Payout Details</h2>
                            <p className="text-sm text-gray-500">Transaction ID: TXN-2025-001234</p>
                        </div>
                        <button className="bg-[#FCBC33] flex gap-2 text-white text-sm px-4 py-1.5 rounded-full font-medium">
                            <IoWarning className="my-auto" />
                            <span className="my-auto">Pending</span>
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
                                <p className="font-medium text-gray-800">Shp2Earn</p>

                                <p className="text-gray-500">Reward Type</p>
                                <p className="font-medium text-gray-800">Referral reward</p>

                                <p className="text-gray-500">Amount</p>
                                <p className="font-medium text-gray-800">₦10,000</p>

                                <p className="text-gray-500">Reward</p>
                                <p className="font-medium text-gray-800">Cashback</p>

                                <p className="text-gray-500">Request Date</p>
                                <p className="font-medium text-gray-800">08-04-2025</p>

                                <p className="text-gray-500">Payment Date</p>
                                <p className="font-medium text-gray-800">--</p>
                            </div>
                        </div>

                        {/* Customer Details */}
                        <div className="border border-[#E4E7EC] bg-[#F9FAFB] rounded-lg p-4 space-y-3">
                            <h3 className="text-sm font-medium text-gray-700">Customer Details</h3>
                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                                <p className="text-gray-500">Full Name</p>
                                <p className="font-medium text-gray-800">John Busco</p>

                                <p className="text-gray-500">Email Address</p>
                                <p className="font-medium text-gray-800">john.busco@example.com</p>

                                <p className="text-gray-500">Phone Number</p>
                                <p className="font-medium text-gray-800">+234 801 234 5678</p>

                                <p className="text-gray-500">Account Number</p>
                                <p className="font-medium text-gray-800">0123456789</p>

                                <p className="text-gray-500">Bank Name</p>
                                <p className="font-medium text-gray-800">Opay</p>

                                <p className="text-gray-500">Bank Holder’s Name</p>
                                <p className="font-medium text-gray-800">John Busco</p>
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
                                        src="/assets/receipt-placeholder.png"
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
                        <button className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-md border border-red-500 text-red-600 font-medium hover:bg-red-50 transition">
                            <XCircle className="w-5 h-5" />
                            Reject Payout
                        </button>
                        <button className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-md bg-[#0A1B88] text-white font-medium hover:bg-[#0A1B88]/90 transition">
                            <CheckCircle className="w-5 h-5" />
                            Approve & Make Payment
                        </button>
                    </div>
                </div>
            </>
        </DashboardLayout>
    );
};

export default PayoutDetails;
