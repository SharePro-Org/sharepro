"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Camera, Edit, Plus, SearchIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAtom } from "jotai";
import { userAtom } from "@/store/User";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  GET_USER,
  UPDATE_USER,
  CREATE_USER_BANK_DETAILS,
  DEACTIVATE_USER_ACCOUNT
} from "@/apollo/mutations/account";
import { BANK_LIST } from "@/apollo/queries/wallet";

type UserProfile = {
  firstName: string;
  lastName: string;
  phone?: string;
  id: string;
  language: string;
};

type BankAccount = {
  accountName: string;
  accountNumber: string;
  bankCode: string;
  bankName: string;
  phoneNumber: string;
  networkProvider: string;
};

type CurrentUser = {
  userProfile?: UserProfile;
  email: string;
  phone?: string;
  dateJoined: string;
  bankAccounts?: BankAccount[];
};

type GetUserData = {
  currentUser: CurrentUser;
};

type CreateBankDetailsResponse = {
  createUserBankDetails: {
    success: boolean;
    message: string;
  };
};

type DeactivateUserAccountResponse = {
  deactivateUserAccount: {
    success: boolean;
    message: string;
  };
};

type DeactivateUserAccountVariables = {
  input: {
    reason: string;
    password: string;
    detailedReason: string;
  };
};

type CreateBankDetailsVariables = {
  input: {
    accountName: string;
    bankName: string;
    accountNumber: string;
    phoneNumber: string;
    networkProvider: string;
  };
};

const account = () => {
  const [openBusinessModal, setOpenBusinessModal] = useState(false);
  const [openBankModal, setOpenBankModal] = useState(false);
  const [bankSearch, setBankSearch] = useState("");
   const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);
  const [user] = useAtom(userAtom);
  const { data: userData, loading: userLoading, error: userError } = useQuery<GetUserData>(GET_USER, {
    variables: { id: user?.userId },
    skip: !user?.userId,
  });


  const { data: bankList } = useQuery<any>(BANK_LIST, {
    variables: {}
  })

  const [updateUser, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_USER);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  const [deactivateForm, setDeactivateForm] = useState({
    reason: "",
    password: "",
    detailedReason: "",
  });

  const [deactivateAccount, { loading: deactivateLoading }] = useMutation<
    DeactivateUserAccountResponse,
    DeactivateUserAccountVariables
  >(DEACTIVATE_USER_ACCOUNT, {
    onCompleted: (data) => {
      if (data.deactivateUserAccount.success) {
        localStorage.clear();
        window.location.href = "/login";
      } else {
        alert(data.deactivateUserAccount.message);
      }
    },
    onError: (error) => {
      alert(error.message);
    }
  });
  const [bankForm, setBankForm] = useState({
    accountName: "",
    bankName: "",
    accountNumber: "",
    phoneNumber: "",
    networkProvider: "",
    accountType: "savings", // default value
    bankCode: "", // This will be set based on selected bank
  });

  const [createBankDetails, { loading: bankDetailsLoading, error: bankDetailsError }] = useMutation<
    CreateBankDetailsResponse,
    CreateBankDetailsVariables
  >(CREATE_USER_BANK_DETAILS, {
    onCompleted: (data) => {
      if (data.createUserBankDetails.success) {
        setOpenBankModal(false);
        // alert(data.createUserBankDetails.message || "Bank details saved successfully!");
      }
    },
    onError: (error) => {
      console.error('Error creating bank details:', error);
    }
  });
  useEffect(() => {
    if (userData?.currentUser?.userProfile) {
      setEditForm({
        firstName: userData.currentUser.userProfile.firstName || "",
        lastName: userData.currentUser.userProfile.lastName || "",
        phone: userData.currentUser.phone || "",
      });

      const accounts = userData.currentUser.bankAccounts;
      // Guard: only read index 0 when array exists and has at least one element
      if (Array.isArray(accounts) && accounts.length > 0 && accounts[0]) {
        const first = accounts[0];
        setBankForm({
          accountName: first.accountName || "",
          bankName: first.bankName || "",
          accountNumber: first.accountNumber || "",
          phoneNumber: first.phoneNumber || "",
          networkProvider: first.networkProvider || "",
          accountType:  "savings",
          bankCode: first.bankCode || "",
        });
      }
    }
  }, [userData]);

  const [openDeactivateModal, setOpenDeactivateModal] = useState(false);
  const [steps, setSteps] = useState(0);

  // Filter banks based on search
  const filteredBanks = bankList?.bankList?.filter((bank: any) =>
    bank.name.toLowerCase().includes(bankSearch.toLowerCase())
  ) || [];

  const getSelectedBankName = () => {
    const bank = bankList?.bankList?.find((b: any) => b.code === bankForm.bankCode);
    return bank?.name || "";
  };

  return (
    <DashboardLayout>
      <>
        <p className="text-lg font-semibold capitalize mb-3">Account</p>
        <section className="">
          <div className="bg-white w-full rounded-md p-4">
            <div>
              <p className="mb-4 font-medium">User Profile</p>
              <div className="border border-[#E5E5EA] rounded-sm p-4 flex gap-4">
                <div className="border flex items-center border-[#E5E5EA] rounded-full w-20 h-20">
                  <Camera size={16} className="my-auto mx-auto" />
                </div>
                <button className="text-sm text-primary bg-[#ECF3FF] my-auto px-6 p-2 rounded-full">
                  Add Logo
                </button>
                <button className="text-[#FC3833] text-sm my-auto">
                  Remove
                </button>
              </div>
              <div className="border border-[#E5E5EA] rounded-sm p-4 my-4">
                <div className="border-b border-b-[#E5E5EA] flex py-3 mb-3 justify-between">
                  <p className="font-medium my-auto">Personal Information</p>
                  <button
                    onClick={() => setOpenBusinessModal(true)}
                    className="flex text-primary bg-[#ECF3FF] rounded-md my-auto gap-2  p-2"
                  >
                    <span className="text-sm">Edit</span>
                    <Edit size={10} className="my-auto" />
                  </button>
                </div>
                {userLoading ? (
                  <div className="text-center py-4 text-gray-500">Loading user info...</div>
                ) : userError ? (
                  <div className="text-center py-4 text-red-500">Error loading user info</div>
                ) : (
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-[#030229B2] mb-2">Name</p>
                      <p className="font-medium">{userData?.currentUser?.userProfile?.firstName} {userData?.currentUser?.userProfile?.lastName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#030229B2] mb-2">Email Address</p>
                      <p className="font-medium">{userData?.currentUser?.email}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-[#030229B2] mb-2">Phone Number</p>
                      <p className="font-medium">{userData?.currentUser?.phone || "-"}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bank Account Details Section */}
            <div className="border border-[#E5E5EA] rounded-sm p-4 my-4">
              <div className="border-b border-b-[#E5E5EA] flex py-3 mb-3 justify-between">
                <p className="font-medium my-auto">Bank Account Details</p>
                <button
                  onClick={() => setOpenBankModal(true)}
                  className="flex text-primary bg-[#ECF3FF] rounded-md my-auto gap-2  p-2"
                >
                  <span className="text-sm">Add</span>
                  <Plus size={16} className="my-auto" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-[#030229B2] mb-2">Account Holder</p>
                  <p className="font-medium">{userData?.currentUser?.bankAccounts?.[0]?.accountName || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-[#030229B2] mb-2">Bank Name</p>
                  <p className="font-medium">{userData?.currentUser?.bankAccounts?.[0]?.bankName || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-[#030229B2] mb-2">Account Number</p>
                  <p className="font-medium">{userData?.currentUser?.bankAccounts?.[0]?.accountNumber || "-"}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-10">
              <button
                onClick={() => setOpenDeactivateModal(true)}
                className="text-primary text-sm rounded-full bg-[#ECF3FF] py-2 px-6"
              >
                Deactivate Account
              </button>
            </div>
          </div>
        </section>

        <Dialog
          open={openBusinessModal}
          onOpenChange={() => setOpenBusinessModal(false)}
        >
          <DialogContent>
            <h2 className="font-medium text-center">
              Edit Profile Information
            </h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await updateUser({
                  variables: {
                    id: user?.userId,
                    firstName: editForm.firstName,
                    lastName: editForm.lastName,
                    phone: editForm.phone,
                  },
                });
                setOpenBusinessModal(false);
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="firstName" className="mb-2 text-[#030229CC] text-sm">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  value={editForm.firstName}
                  onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                  className="border border-[#E5E5EA] rounded-md p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="mb-2 text-[#030229CC] text-sm">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  value={editForm.lastName}
                  onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                  className="border border-[#E5E5EA] rounded-md p-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="phone" className="mb-2 text-[#030229CC] text-sm">Phone Number</label>
                <input
                  type="text"
                  id="phone"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="border border-[#E5E5EA] rounded-md p-2 w-full"
                />
              </div>
              {updateError && (
                <div className="text-red-500 text-sm">Error updating profile: {updateError.message}</div>
              )}
              <div className="text-center">
                <button type="submit" className="p-3 bg-primary rounded-md text-white" disabled={updateLoading}>
                  {updateLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog
          open={openDeactivateModal}
          onOpenChange={() => setOpenDeactivateModal(false)}
        >
          <DialogContent className="">
            {steps === 0 ? (
              <>
                <h2 className="text-center font-medium">Deactivate Account</h2>
                <p className="text-sm text-[#030229CC]">
                  Deactivating your account will temporarily suspend all
                  campaigns, user access, and reward activities. You can
                  reactivate it anytime by logging back in.
                </p>
                {/* <p className="font-medium">What Will Happen?</p>
                <ul className="text-sm text-[#030229CC]">
                  <li>Your business profile will be hidden</li>
                  <li>Ongoing campaigns will be paused</li>
                  <li>You will stop receiving notifications</li>
                  <li>
                    You won’t be able to access the dashboard until reactivated
                  </li>
                </ul> */}
                <p className="font-medium">Reason for deactivating </p>
                <span className="text-sm text-[#030229CC]">
                  Let us know why you're leaving, this helps us improve.
                </span>
                <textarea
                  className="rounded-md h-32 border border-[#E5E5EA] rounded-md p-3 w-full"
                  value={deactivateForm.detailedReason}
                  onChange={(e) => setDeactivateForm({ ...deactivateForm, detailedReason: e.target.value })}
                  placeholder="Please provide detailed reason for deactivation"
                  required
                ></textarea>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setOpenDeactivateModal(false)}
                    className="bg-gray-500 text-white p-3 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!deactivateForm.detailedReason.trim()) {
                        alert("Please provide a reason for deactivation");
                        return;
                      }
                      setSteps(1);
                    }}
                    className="bg-primary text-white p-3 rounded-md"
                  >
                    Deactivate Account
                  </button>
                </div>
              </>
            ) : (
              <>
                <img
                  src="/assets/icons/warning.svg"
                  className="w-20 h-20 mx-auto"
                  alt=""
                />
                <p className="my-3 text-center font-bold">
                  Are you sure you want to deactivate your account?
                </p>
                <p className="text-sm text-center text-[#030229CC]">
                  This action will pause all platform activity for your account.
                  You can reactivate later by logging in again.
                </p>
                <div className="my-4">
                  <label htmlFor="password" className="mb-2 text-[#030229CC] text-sm">Enter your password to confirm</label>
                  <input
                    type="password"
                    id="password"
                    value={deactivateForm.password}
                    onChange={(e) => setDeactivateForm({ ...deactivateForm, password: e.target.value })}
                    className="border border-[#E5E5EA] rounded-md p-2 w-full"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => {
                      if (!deactivateForm.password) {
                        alert("Please enter your password to confirm deactivation");
                        return;
                      }
                      deactivateAccount({
                        variables: {
                          input: {
                            reason: "user_request",
                            password: deactivateForm.password,
                            detailedReason: deactivateForm.detailedReason
                          }
                        }
                      });
                    }}
                    disabled={deactivateLoading}
                    className="bg-[#E7302B] text-white p-3 rounded-md"
                  >
                    {deactivateLoading ? "Processing..." : "Yes Deactivate"}
                  </button>
                  <button
                    onClick={() => setOpenDeactivateModal(false)}
                    className="bg-gray-500 text-white p-3 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        <Dialog
          open={openBankModal}
          onOpenChange={() => setOpenBankModal(false)}
        >
          <DialogContent>
            <h2 className="font-medium text-center">
              Add Bank Account Details
            </h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!bankForm.accountName || !bankForm.bankName || !bankForm.accountNumber || !bankForm.phoneNumber || !bankForm.networkProvider) {
                  alert("Please fill in all fields");
                  return;
                }
                try {
                  await createBankDetails({
                    variables: {
                      input: {
                        accountName: bankForm.accountName,
                        bankName: bankForm.bankName,
                        accountNumber: bankForm.accountNumber,
                        phoneNumber: bankForm.phoneNumber,
                        networkProvider: bankForm.networkProvider
                      }
                    }
                  });
                } catch (error) {
                  console.error('Error submitting form:', error);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="accountName" className="mb-2 text-[#030229CC] text-sm">Account Holder Name</label>
                <input
                  type="text"
                  id="accountName"
                  value={bankForm.accountName}
                  onChange={(e) => setBankForm({ ...bankForm, accountName: e.target.value })}
                  placeholder="Enter account holder name"
                  className="border border-[#E5E5EA] rounded-md p-2 w-full"
                  required
                />
              </div>
              <div className="bank-dropdown-container">
                                <label className="block text-sm font-medium mb-1">Select Bank</label>
                                <div className="relative">
                                  <div
                                    className="border border-[#E4E7EC] rounded-md p-3 w-full bg-white text-gray-900 focus-within:ring-2 focus-within:ring-[#24348B] focus-within:border-[#24348B] outline-none cursor-pointer transition-all duration-200 hover:border-[#24348B] flex items-center justify-between"
                                    onClick={() => setIsBankDropdownOpen(!isBankDropdownOpen)}
                                  >
                                    <span className={bankForm.bankCode ? "text-gray-900" : "text-gray-400"}>
                                      {bankForm.bankCode ? getSelectedBankName() : "Select your bank"}
                                    </span>
                                    <svg className={`w-4 h-4 transition-transform ${isBankDropdownOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                  </div>
              
                                  {isBankDropdownOpen && (
                                    <div className="absolute z-50 mt-1 w-full bg-white border border-[#E4E7EC] rounded-md shadow-lg max-h-64 overflow-hidden">
                                      <div className="p-2 border-b border-[#E4E7EC]">
                                        <div className="relative">
                                          <input
                                            type="text"
                                            className="w-full pl-8 pr-3 py-2 border border-[#E4E7EC] rounded-md focus:ring-2 focus:ring-[#24348B] focus:border-[#24348B] outline-none text-sm"
                                            placeholder="Search banks..."
                                            value={bankSearch}
                                            onChange={e => setBankSearch(e.target.value)}
                                            onClick={e => e.stopPropagation()}
                                          />
                                          <SearchIcon size={14} className="absolute top-2.5 left-2 text-gray-400" />
                                        </div>
                                      </div>
                                      <div className="max-h-48 overflow-y-auto">
                                        {filteredBanks.length > 0 ? (
                                          filteredBanks.map((bank: any) => (
                                            <div
                                              key={bank.code}
                                              className={`px-3 py-2 cursor-pointer hover:bg-[#EEF3FF] transition-colors ${
                                                bankForm.bankCode === bank.code ? 'bg-[#EEF3FF] text-[#24348B] font-medium' : 'text-gray-900'
                                              }`}
                                              onClick={() => {
                                                setBankForm(f => ({ ...f, bankCode: bank.code }));
                                                setBankSearch("");
                                                setIsBankDropdownOpen(false);
                                              }}
                                            >
                                              {bank.name}
                                            </div>
                                          ))
                                        ) : (
                                          <div className="px-3 py-4 text-center text-gray-500 text-sm">
                                            No banks found matching "{bankSearch}"
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
              <div>
                <label htmlFor="accountNumber" className="mb-2 text-[#030229CC] text-sm">Account Number</label>
                <input
                  type="text"
                  id="accountNumber"
                  value={bankForm.accountNumber}
                  onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                  placeholder="Enter account number"
                  className="border border-[#E5E5EA] rounded-md p-2 w-full"
                  required
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="mb-2 text-[#030229CC] text-sm">Mobile Money Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={bankForm.phoneNumber}
                  onChange={(e) => setBankForm({ ...bankForm, phoneNumber: e.target.value })}
                  placeholder="Enter mobile money number"
                  className="border border-[#E5E5EA] rounded-md p-2 w-full"
                  required
                />
              </div>
              <div>
                <label htmlFor="networkProvider" className="mb-2 text-[#030229CC] text-sm">Network Provider</label>
                <select
                  id="networkProvider"
                  value={bankForm.networkProvider}
                  onChange={(e) => setBankForm({ ...bankForm, networkProvider: e.target.value })}
                  className="border border-[#E5E5EA] rounded-md p-2 w-full"
                  required
                >
                  <option value="">Select Network Provider</option>
                  <option value="mtn">MTN</option>
                  <option value="glo">GLO</option>
                  <option value="airtel">Airtel</option>
                  <option value="9mobile">9mobile</option>
                </select>
              </div>
              {bankDetailsError && (
                <div className="text-red-500 text-sm">
                  Error saving bank details: {bankDetailsError.message}
                </div>
              )}
              <div className="text-center">
                <button
                  type="submit"
                  className="p-3 bg-primary rounded-md text-white w-full"
                  disabled={bankDetailsLoading}
                >
                  {bankDetailsLoading ? "Saving..." : "Save Bank Details"}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </>
    </DashboardLayout>
  );
};

export default account;
