"use client"

import React, { useState } from "react";
import Image from "next/image";
import { CheckCircle, CopyIcon, XCircle, ArrowLeft } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { IoWarning } from "react-icons/io5";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_SINGLE_PAYOUT } from "@/apollo/queries/campaigns";
import { useParams, useRouter } from "next/navigation";
import { APPROVE_OR_REJECT_PROOF, SEND_REWARD } from "@/apollo/mutations/campaigns";
import { message } from "antd";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const PayoutDetails = () => {
    const router = useRouter();
    const params = useParams();
    const id = params.payoutId;
    const [modalOpen, setModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState<string | null>(null);
    // New modals for payout actions
    const [confirmOpen, setConfirmOpen] = useState(false);
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

    const [handleToggleRewardStatus, { loading: setLoading }] = useMutation(APPROVE_OR_REJECT_PROOF, {
        refetchQueries: [{ query: GET_SINGLE_PAYOUT, variables: { id } }],
    })

    const [sendReward, { loading: sendingReward }] = useMutation<any>(SEND_REWARD, {
        refetchQueries: [{ query: GET_SINGLE_PAYOUT, variables: { id } }],
    });

    const handleSendRewardConfirm = async () => {
        setConfirmOpen(false);
        const deliveryType = data?.reward?.deliveryType;

        if (deliveryType === 'cashback') {
            try {
                const result = await sendReward({ variables: { rewardId: id } });
                if (result.data?.sendReward?.success) {
                    message.success("Cashback sent to wallet successfully!");
                } else {
                    message.error(result.data?.sendReward?.message || "Failed to send reward");
                }
            } catch (error: any) {
                message.error(error.message || "An error occurred");
            }
        } else if (['voucher', 'discount'].includes(deliveryType || '')) {
            setVoucherOpen(true);
        } else if (deliveryType === 'airtime') {
            setAirtimeOpen(true);
        } else {
            message.warning("Unknown reward type. Please contact support.");
        }
    };

    const handleAirtimeConfirm = async () => {
        try {
            const result = await sendReward({ variables: { rewardId: id } });
            if (result.data?.sendReward?.success) {
                message.success("Airtime reward marked as sent!");
                setAirtimeOpen(false);
            } else {
                message.error(result.data?.sendReward?.message || "Failed to process airtime");
            }
        } catch (error: any) {
            message.error(error.message || "An error occurred");
        }
    };

    const handleVoucherSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!voucherCode.trim()) {
            message.error("Voucher code is required");
            return;
        }

        try {
            const result = await sendReward({
                variables: {
                    rewardId: id,
                    voucherCode: voucherCode,
                    voucherNotes: voucherNotes,
                    validUntil: voucherValidUntil || null,
                }
            });

            if (result.data?.sendReward?.success) {
                message.success("Voucher sent successfully!");
                setVoucherOpen(false);
                setVoucherCode('');
                setVoucherNotes('');
                setVoucherValidUntil('');
            } else {
                message.error(result.data?.sendReward?.message || "Failed to send voucher");
            }
        } catch (error: any) {
            message.error(error.message || "An error occurred");
        }
    };

    return (
        <DashboardLayout>
            <>
                <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <button
                            className="text-black cursor-pointer flex items-center"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="mr-3" />
                            <span className="text-lg font-semibold">
                                Payout Details
                            </span>
                        </button>
                        <button className={`flex gap-2 text-white text-sm px-4 py-1.5 rounded-full font-medium
                                    ${data?.reward?.status === 'PAID' ? 'bg-blue-500'
                                : data?.reward?.status === 'APPROVED' ? 'bg-green-500'
                                : data?.reward?.status === 'PENDING' ? 'bg-yellow-500 text-black'
                                : data?.reward?.status === 'REJECTED' ? 'bg-red-500'
                                    : 'bg-gray-500'}
                                     `}>
                            <IoWarning className="my-auto" />
                            <span>
                                {data?.reward?.status}
                            </span>
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
                            {data?.reward?.proofFiles?.length > 0 ? (
                                data.reward.proofFiles.map((proof: any) => (
                                    <button
                                        key={proof.id}
                                        type="button"
                                        onClick={() => {
                                            setModalImage(proof.fileUrl);
                                            setModalOpen(true);
                                        }}
                                        className="border border-[#E4E7EC] rounded-lg overflow-hidden w-56 shadow-sm p-0"
                                    >
                                        <Image
                                            src={proof.fileUrl}
                                            alt={proof.originalFilename || "Receipt"}
                                            width={224}
                                            height={580}
                                            className="object-cover"
                                        />
                                    </button>
                                ))
                            ) : data?.reward?.proofFile ? (
                                // Backward compatibility for single file
                                <button
                                    type="button"
                                    onClick={() => {
                                        setModalImage(data.reward.proofFile);
                                        setModalOpen(true);
                                    }}
                                    className="border border-[#E4E7EC] rounded-lg overflow-hidden w-56 shadow-sm p-0"
                                >
                                    <Image
                                        src={data.reward.proofFile}
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
                        {data?.reward?.status && data.reward.status !== 'APPROVED' && data.reward.status !== 'PAID' && (
                            <button onClick={() => handleToggleRewardStatus({
                                variables: {
                                    rewardId: id,
                                    action: 'reject',
                                }
                            })} className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-md border border-red-500 text-red-600 font-medium hover:bg-red-50 transition">
                                <XCircle className="w-5 h-5" />
                                {setLoading ? 'loading...' : 'Reject Payout'}
                            </button>
                        )}
                        {data?.reward?.status === 'APPROVED' && (
                            <button
                                onClick={() => setConfirmOpen(true)}
                                disabled={sendingReward}
                                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-md bg-[#0A1B88] text-white font-medium hover:bg-[#0A1B88]/90 transition disabled:opacity-50"
                            >
                                <CheckCircle className="w-5 h-5" />
                                {sendingReward ? 'Sending...' : 'Send Reward'}
                            </button>
                        )}
                        {data?.reward?.status === 'PAID' && (
                            <button
                                disabled
                                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-md bg-green-500 text-white font-medium cursor-not-allowed"
                            >
                                <CheckCircle className="w-5 h-5" />
                                Reward Sent
                            </button>
                        )}
                        {data?.reward?.status && data.reward.status !== 'APPROVED' && data.reward.status !== 'PAID' && data.reward.status !== 'REJECTED' && (
                            <button onClick={() => handleToggleRewardStatus({
                                variables: {
                                    rewardId: id,
                                    action: 'approve',
                                }
                            })} className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-md bg-[#0A1B88] text-white font-medium hover:bg-[#0A1B88]/90 transition">
                                <CheckCircle className="w-5 h-5" />
                                {setLoading ? 'loading...' : 'Approve Payout'}
                            </button>
                        )}

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

                {/* Send Reward Confirmation Modal */}
                <Dialog open={confirmOpen} onOpenChange={() => setConfirmOpen(false)}>
                    <DialogContent>
                        <h2 className="text-center font-medium">Confirm Send Reward</h2>
                        <p className="text-sm text-[#030229CC]">
                            You are about to send a reward to this customer. Please review the details below before confirming.
                        </p>
                        <div className="border border-[#E4E7EC] rounded-lg p-4">
                            <div className="grid grid-cols-2 gap-y-3 text-sm">
                                <p className="text-gray-500">Customer</p>
                                <p className="font-medium text-gray-800">{data?.reward?.user?.firstName} {data?.reward?.user?.lastName}</p>
                                <p className="text-gray-500">Amount</p>
                                <p className="font-medium text-gray-800">{data?.reward?.amount}</p>
                                <p className="text-gray-500">Reward Type</p>
                                <p className="font-medium text-gray-800 capitalize">{data?.reward?.deliveryType || data?.reward?.rewardType}</p>
                                <p className="text-gray-500">Campaign</p>
                                <p className="font-medium text-gray-800">{data?.reward?.campaign?.name}</p>
                            </div>
                        </div>
                        <p className="text-sm text-[#030229CC]">
                            Are you sure you want to send this reward? This action cannot be undone.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setConfirmOpen(false)}
                                className="bg-gray-500 text-white px-6 py-2 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendRewardConfirm}
                                disabled={sendingReward}
                                className="bg-primary text-white px-6 py-2 rounded-md disabled:opacity-50"
                            >
                                {sendingReward ? 'Processing...' : 'Confirm'}
                            </button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Airtime Confirmation Modal */}
                <Dialog open={airtimeOpen} onOpenChange={() => setAirtimeOpen(false)}>
                    <DialogContent>
                        <h2 className="text-center font-medium">Confirm Airtime Reward</h2>
                        <div className="border border-[#E4E7EC] rounded-lg p-4">
                            <div className="grid grid-cols-2 gap-y-3 text-sm">
                                <p className="text-gray-500">Customer</p>
                                <p className="font-medium text-gray-800">{data?.reward?.user?.firstName} {data?.reward?.user?.lastName}</p>
                                <p className="text-gray-500">Amount</p>
                                <p className="font-medium text-gray-800">{data?.reward?.amount}</p>
                                <p className="text-gray-500">Phone Number</p>
                                <p className="font-medium text-gray-800">{data?.reward?.user?.phone || 'N/A'}</p>
                            </div>
                        </div>
                        <p className="text-sm text-[#030229CC]">
                            By clicking confirm, you acknowledge that the airtime has been credited to the customer&apos;s phone number.
                            An email notification will be sent to the customer.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setAirtimeOpen(false)}
                                className="bg-gray-500 text-white px-6 py-2 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAirtimeConfirm}
                                disabled={sendingReward}
                                className="bg-primary text-white px-6 py-2 rounded-md disabled:opacity-50"
                            >
                                {sendingReward ? 'Processing...' : 'Confirm Airtime Sent'}
                            </button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Cashback Details Modal */}
                <Dialog open={cashbackOpen} onOpenChange={() => setCashbackOpen(false)}>
                    <DialogContent>
                        <h2 className="text-center font-medium">Cashback Details</h2>
                        <div className="border border-[#E4E7EC] rounded-lg p-4">
                            <div className="grid grid-cols-2 gap-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Bank Name</p>
                                    <p className="font-medium">{data?.reward?.user?.bankAccounts?.[0]?.bankName || 'Opay'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Account Number</p>
                                    <div className="flex items-center justify-end gap-2">
                                        <p className="font-medium">{data?.reward?.user?.bankAccounts?.[0]?.accountNumber || '0123456789'}</p>
                                        <button className="p-2 bg-gray-100 rounded-md" onClick={() => { const v = data?.reward?.user?.bankAccounts?.[0]?.accountNumber || ''; if (v && navigator.clipboard) navigator.clipboard.writeText(v).then(() => message.success('Copied')); }}><CopyIcon size={10} /></button>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Bank Holder&apos;s Name</p>
                                    <p className="font-medium">{data?.reward?.user?.bankAccounts?.[0]?.accountName || `${data?.reward?.user?.firstName} ${data?.reward?.user?.lastName}`}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Amount to Send</p>
                                    <div className="flex items-center justify-end gap-2">
                                        <p className="font-medium">{data?.reward?.amount || 'N 20,250'}</p>
                                        <button className="p-2 bg-gray-100 rounded-md" onClick={() => { const v = data?.reward?.amount || ''; if (v && navigator.clipboard) navigator.clipboard.writeText(String(v)).then(() => message.success('Copied')); }}><CopyIcon size={10} /></button>
                                    </div>
                                    <p className="text-sm text-green-600 mt-1">A processing fee of N250 is required</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => setCashbackOpen(false)} className="bg-gray-500 text-white px-6 py-2 rounded-md">Cancel</button>
                            <button onClick={() => { setCashbackOpen(false); }} className="bg-primary text-white px-6 py-2 rounded-md">Proceed to Paystack</button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Voucher Details Modal */}
                <Dialog open={voucherOpen} onOpenChange={() => setVoucherOpen(false)}>
                    <DialogContent>
                        <h2 className="text-center font-medium">Send Voucher Reward</h2>
                        <p className="text-sm text-[#030229CC]">
                            Enter the voucher details to send to {data?.reward?.user?.firstName} {data?.reward?.user?.lastName}
                        </p>
                        <form onSubmit={handleVoucherSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm mb-1">Voucher Code *</label>
                                <input
                                    value={voucherCode}
                                    onChange={(e) => setVoucherCode(e.target.value)}
                                    className="border border-[#E4E7EC] rounded-md p-3 w-full"
                                    placeholder="e.g. REWARD2026"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Redemption Instructions</label>
                                <textarea
                                    value={voucherNotes}
                                    onChange={(e) => setVoucherNotes(e.target.value)}
                                    className="border border-[#E4E7EC] rounded-md p-3 w-full"
                                    placeholder="Where and how to use this voucher..."
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Valid Until (Optional)</label>
                                <input
                                    value={voucherValidUntil}
                                    onChange={(e) => setVoucherValidUntil(e.target.value)}
                                    type="date"
                                    className="border border-[#E4E7EC] rounded-md p-3 w-full"
                                />
                            </div>
                            <div className="flex justify-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => setVoucherOpen(false)}
                                    className="bg-gray-500 text-white px-6 py-2 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={sendingReward}
                                    className="bg-primary text-white px-6 py-2 rounded-md disabled:opacity-50"
                                >
                                    {sendingReward ? 'Sending...' : 'Send Voucher'}
                                </button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                
            </>
        </DashboardLayout>
    );
};

export default PayoutDetails;
