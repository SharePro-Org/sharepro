"use client"

import React, { useState } from "react";
import Image from "next/image";
import { CheckCircle, CopyIcon, XCircle } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { IoWarning } from "react-icons/io5";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_SINGLE_PAYOUT } from "@/apollo/queries/campaigns";
import { useParams } from "next/navigation";
import { APPROVE_OR_REJECT_PROOF } from "@/apollo/mutations/campaigns";

const PayoutDetails = () => {
    const params = useParams();
    const id = params.payoutId;
    const [modalOpen, setModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState<string | null>(null);
    // New modals for payout actions
    const [airtimeOpen, setAirtimeOpen] = useState(false);
    const [cashbackOpen, setCashbackOpen] = useState(false);
    const [voucherOpen, setVoucherOpen] = useState(false);
    

    const [voucherCode, setVoucherCode] = useState("");
    const [voucherDiscount, setVoucherDiscount] = useState("");
    const [voucherValidUntil, setVoucherValidUntil] = useState("");
    const [voucherNotes, setVoucherNotes] = useState("");

    const {
        data,
        loading,
        error,
    } = useQuery<any>(GET_SINGLE_PAYOUT, {
        variables: { id: id },
        skip: !id,
    });

    const [handleToggleRewardStatus, { loading: setLoading }] = useMutation(APPROVE_OR_REJECT_PROOF)
    console.log(data?.reward?.user?.bankAccounts?.accountNumber)

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
                        <button className={`flex gap-2 text-white text-sm px-4 py-1.5 rounded-full font-medium
                                    ${data?.reward?.status === 'APPROVED' ? 'bg-green-500'
                                : data?.reward?.status === 'PENDING' ? 'bg-yellow-500 text-black'
                                    : 'bg-red-500'}
                                     `}>
                            <IoWarning className="my-auto" />
                            <span

                            >
                                {data?.reward?.status}
                            </span>
                            {/* <span className="my-auto">{}</span> */}
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
                                <p className="font-medium text-gray-800">
                                    {data?.reward?.createdAt
                                        ? new Date(data.reward.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                                        : '--'}
                                </p>

                                <p className="text-gray-500">Payment Date</p>
                                <p className="font-medium text-gray-800">
                                    {data?.reward?.processedAt
                                        ? new Date(data.reward.processedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                                        : '--'}
                                </p>
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
                                <p className="font-medium text-gray-800">{data?.reward?.user?.bankAccounts?.[0]?.accountNumber}</p>

                                <p className="text-gray-500">Bank Name</p>
                                <p className="font-medium text-gray-800">{data?.reward?.user?.bankAccounts?.[0]?.bankName}</p>

                                <p className="text-gray-500">Bank Holder’s Name</p>
                                <p className="font-medium text-gray-800">{data?.reward?.user?.bankAccounts?.[0]?.accountName}</p>
                            </div>
                        </div>
                    </div>

                    {/* Proof of Purchase */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                            Proof of Purchase
                        </h3>
                        <div className="flex flex-wrap gap-4">
                            {data?.reward?.proofFile ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        const src = `https://api.mysharepro.com/media/${data.reward.proofFile}`;
                                        setModalImage(src);
                                        setModalOpen(true);
                                    }}
                                    className="border border-[#E4E7EC] rounded-lg overflow-hidden w-56 shadow-sm p-0"
                                >
                                    <Image
                                        src={`https://api.mysharepro.com/media/${data.reward.proofFile}`}
                                        alt="Receipt"
                                        width={224}
                                        height={580}
                                        className="object-cover"
                                    />
                                </button>
                            ) : (
                                <div className="border border-[#E4E7EC] rounded-lg overflow-hidden w-56 shadow-sm flex items-center justify-center p-6 text-sm text-gray-500">
                                    No proof submitted
                                </div>
                            )}
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
                        {data?.reward?.status === 'APPROVED' ? (
                            <button className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-md bg-[#0A1B88] text-white font-medium hover:bg-[#0A1B88]/90 transition">
                                <CheckCircle className="w-5 h-5" />
                                {setLoading ? 'loading...' : 'Send Reward'}

                            </button>)
                            : (
                                <button onClick={() => handleToggleRewardStatus({
                                    variables: {
                                        rewardId: id,
                                        action: 'approve',
                                    }
                                })} className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-md bg-[#0A1B88] text-white font-medium hover:bg-[#0A1B88]/90 transition">
                                    <CheckCircle className="w-5 h-5" />

                                    {setLoading ? 'loading...' : 'Approve Payout'}

                                </button>)}

                    </div>
                </div>
                {/* Modal for image preview */}
                {modalOpen && modalImage && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                        <div className="relative max-w-4xl w-full mx-4">
                            <button
                                className="absolute right-2 top-2 text-white bg-black/40 rounded-full p-2"
                                onClick={() => setModalOpen(false)}
                                aria-label="Close preview"
                            >
                                ✕
                            </button>
                            <div className="bg-white rounded-md overflow-hidden">
                                <Image src={modalImage} alt="Preview" width={1200} height={800} className="w-full h-auto object-contain bg-black" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Airtime Details Modal */}
                {airtimeOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                        <div className="bg-white rounded-md p-6 w-full max-w-md mx-4 relative">
                            {/* <button className="absolute left-6 top-6 text-gray-600" onClick={() => setAirtimeOpen(false)}>←</button> */}
                            <button className="absolute right-6 top-6 text-gray-600" onClick={() => setAirtimeOpen(false)}>✕</button>
                            <h3 className="text-center text-xl font-semibold mb-4">Airtime Details</h3>
                            <div className="border border-[#E4E7EC] rounded-lg p-4 mb-4">
                                <div className="grid grid-cols-2 gap-4 items-center">
                                    <div>
                                        <p className="text-sm text-gray-500">Network</p>
                                        <p className="font-medium">{data?.reward?.user?.bankAccounts?.[0]?.networkProvider || data?.reward?.user?.network || 'MTN'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Phone Number</p>
                                        <div className="flex items-center justify-end gap-2">
                                            <p className="font-medium">{data?.reward?.user?.bankAccounts?.[0]?.phoneNumber || data?.reward?.user?.phone || 'N/A'}</p>
                                            <button
                                                className="p-2 bg-gray-100 rounded-md"
                                                onClick={() => {
                                                    const val = data?.reward?.user?.bankAccounts?.[0]?.phoneNumber || data?.reward?.user?.phone || '';
                                                    if (val && navigator.clipboard) navigator.clipboard.writeText(val).then(() => alert('Copied'));
                                                }}
                                            >
                                                <CopyIcon size={10} />
                                            </button>
                                        </div>
                                    </div>
                                    {/* duplicate row for convenience matching screenshot */}
                                    <div>
                                        <p className="text-sm text-gray-500">Network</p>
                                        <p className="font-medium">{data?.reward?.user?.bankAccounts?.[0]?.networkProvider || data?.reward?.user?.network || 'MTN'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Phone Number</p>
                                        <div className="flex items-center justify-end gap-2">
                                            <p className="font-medium">{data?.reward?.user?.bankAccounts?.[0]?.phoneNumber || data?.reward?.user?.phone || 'N/A'}</p>
                                            <button
                                                className="p-2 bg-gray-100 rounded-md"
                                                onClick={() => {
                                                    const val = data?.reward?.user?.bankAccounts?.[0]?.phoneNumber || data?.reward?.user?.phone || '';
                                                    if (val && navigator.clipboard) navigator.clipboard.writeText(val).then(() => alert('Copied'));
                                                }}
                                            >
                                                <CopyIcon size={10} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm italic text-gray-600 mb-6">Airtime rewards are to be done manually. Ensure to make payment to maintain trust and uphold business name.</p>
                            <div className="text-center">
                                <button onClick={() => { setAirtimeOpen(false); alert('Marked as paid (UI only)'); }} className="px-6 py-3 bg-[#24348B] text-white rounded-full">I Have Paid</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Cashback Details Modal */}
                {cashbackOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                        <div className="bg-white rounded-md p-6 w-full max-w-md mx-4 relative">
                            {/* <button className="absolute left-6 top-6 text-gray-600" onClick={() => setCashbackOpen(false)}>←</button> */}
                            <button className="absolute right-6 top-6 text-gray-600" onClick={() => setCashbackOpen(false)}>✕</button>
                            <h3 className="text-center text-xl font-semibold mb-4">Cashback Details</h3>
                            <div className="border border-[#E4E7EC] rounded-lg p-4 mb-4">
                                <div className="grid grid-cols-2 gap-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Bank Name</p>
                                        <p className="font-medium">{data?.reward?.user?.bankAccounts?.[0]?.bankName || 'Opay'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Account Number</p>
                                        <div className="flex items-center justify-end gap-2">
                                            <p className="font-medium">{data?.reward?.user?.bankAccounts?.[0]?.accountNumber || '0123456789'}</p>
                                            <button className="p-2 bg-gray-100 rounded-md" onClick={() => { const v = data?.reward?.user?.bankAccounts?.[0]?.accountNumber || ''; if (v && navigator.clipboard) navigator.clipboard.writeText(v).then(() => alert('Copied')); }}><CopyIcon size={10} /></button>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">Bank Holder’s Name</p>
                                        <p className="font-medium">{data?.reward?.user?.bankAccounts?.[0]?.accountName || `${data?.reward?.user?.firstName} ${data?.reward?.user?.lastName}`}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Amount to Send</p>
                                        <div className="flex items-center justify-end gap-2">
                                            <p className="font-medium">{data?.reward?.amount || 'N 20,250'}</p>
                                            <button className="p-2 bg-gray-100 rounded-md" onClick={() => { const v = data?.reward?.amount || ''; if (v && navigator.clipboard) navigator.clipboard.writeText(String(v)).then(() => alert('Copied')); }}><CopyIcon size={10} /></button>
                                        </div>
                                        <p className="text-sm text-green-600 mt-1">A processing fee of N250 is required</p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center">
                                <button onClick={() => { setCashbackOpen(false); alert('Proceed to Paystack (UI only)'); }} className="px-6 py-3 bg-[#24348B] text-white rounded-full">Proceed to Paystack</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Voucher Details Modal */}
                {voucherOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                        <div className="bg-white rounded-md p-6 w-full max-w-md mx-4 relative">
                            {/* <button className="absolute left-6 top-6 text-gray-600" onClick={() => setVoucherOpen(false)}>←</button> */}
                            <button className="absolute right-6 top-6 text-gray-600" onClick={() => setVoucherOpen(false)}>✕</button>
                            <h3 className="text-center text-xl font-semibold mb-4">Voucher Details</h3>
                            <form onSubmit={(e) => { e.preventDefault(); alert(`Voucher sent: ${voucherCode} (${voucherDiscount})`); setVoucherCode(''); setVoucherDiscount(''); setVoucherValidUntil(''); setVoucherNotes(''); setVoucherOpen(false); }} className="space-y-4">
                                <div>
                                    <label className="block text-sm mb-1">Enter Voucher Code*</label>
                                    <input value={voucherCode} onChange={(e) => setVoucherCode(e.target.value)} className="border border-[#E4E7EC] rounded-md p-3 w-full" placeholder="e.g DSC2000" />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Discount Amount *</label>
                                    <input value={voucherDiscount} onChange={(e) => setVoucherDiscount(e.target.value)} className="border border-[#E4E7EC] rounded-md p-3 w-full" placeholder="e.g 20%" />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Valid Until *</label>
                                    <input value={voucherValidUntil} onChange={(e) => setVoucherValidUntil(e.target.value)} type="date" className="border border-[#E4E7EC] rounded-md p-3 w-full" placeholder="YYYY-MM-DD" />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Additional Notes</label>
                                    <textarea value={voucherNotes} onChange={(e) => setVoucherNotes(e.target.value)} className="border border-[#E4E7EC] rounded-md p-3 w-full" />
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="px-6 py-3 bg-[#24348B] text-white rounded-full">Send Voucher</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                
            </>
        </DashboardLayout>
    );
};

export default PayoutDetails;
