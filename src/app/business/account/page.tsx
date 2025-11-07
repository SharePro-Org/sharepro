"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Camera, Edit, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CustomSelect } from "@/components/ui/custom-select";
import { Country, City } from "country-state-city";
import { Button, Dropdown } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client/react";

import { useAtom } from "jotai";
import { userAtom } from "@/store/User";

import {
  LIST_INVITED_MEMBERS,
  GET_BUSINESS,
  INVITE_MEMBER,
  UPDATE_BUSINESS,
} from "@/apollo/mutations/account";
import { useQuery } from "@apollo/client/react";


const account = () => {
  const [active, setActive] = useState("profile");
  const [openBusinessModal, setOpenBusinessModal] = useState(false);
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [openInviteModal, setOpenInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [inviteMember] = useMutation(INVITE_MEMBER);
  const [updateBusiness, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_BUSINESS);

  // Replace with actual businessId and inviterName from context/store
  const [businessId, setBusinessId] = useState<string>("");
  const [user] = useAtom(userAtom);
  const [detailedReason, setDetailedReason] = useState("");

  const [editBusinessForm, setEditBusinessForm] = useState({
    name: "",
    phone: "",
    category: "",
    type: "",
    website: "",
    tagline: "",
  });

  type BusinessQueryResult = {
    business?: {
      name?: string;
      phone?: string;
      email?: string;
      website?: string;
      tagline?: string;
      // Add other fields as needed
    };
  };

  const {
    data: userData,
    loading: userLoading,
    error: userError,
    refetch: refetchUser,
  } = useQuery<BusinessQueryResult>(GET_BUSINESS, {
    variables: { id: businessId },
    skip: !businessId,
  });

  useEffect(() => {
    if (user?.businessId) {
      setBusinessId(user.businessId);
    }
  }, [user]);

  useEffect(() => {
    if (userData?.business) {
      setEditBusinessForm({
        name: userData.business.name || "",
        phone: userData.business.phone || "",
        category: "", // Add logic if category is available
        type: "", // Add logic if type is available
        website: userData.business.website || "",
        tagline: userData.business.tagline || "",
      });
    }
  }, [userData]);

  type InviteMemberResponse = {
    inviteMember?: {
      success?: boolean;
      message?: string;
      error?: string;
    };
  };

  const handleInviteUser = async () => {
    setInviteLoading(true);
    setInviteError(null);
    setInviteSuccess(null);
    try {
      const response = await inviteMember({
        variables: {
          input: {
            businessId,
            email: inviteEmail,
            role: inviteRole.toUpperCase(),
            inviterName: inviteName,
          },
        },
      });
      const data = response.data as InviteMemberResponse;
      if (data?.inviteMember?.success) {
        setInviteSuccess(
          data.inviteMember.message || "Invite sent successfully!"
        );
        setInviteName("");
        setInviteEmail("");
        setInviteRole("");
      } else {
        setInviteError(
          data?.inviteMember?.error || "Failed to send invite."
        );
      }
    } catch (err: any) {
      setInviteError(err.message || "An error occurred.");
    } finally {
      setInviteLoading(false);
    }
  };

  type MembersQueryResult = {
    businessMembers?: Array<{
      inviterName?: string;
      memberEmail?: string;
      role?: string;
      status?: string;
      // Add other member fields as needed
    }>;
  };

  type DeactivateBusinessVariables = {
    input: {
      businessId: string;
      reason: string;
      detailedReason: string;
    };
  };

  type DeactivateBusinessResponse = {
    deactivateBusiness: {
      success: boolean;
      message: string;
    };
  };

  type LogoutResponse = {
    logout: {
      success: boolean;
      message: string;
    };
  };

  const {
    data: membersData,
    loading: membersLoading,
    error: membersError,
    refetch: refetchMembers,
  } = useQuery<MembersQueryResult>(LIST_INVITED_MEMBERS, {
    variables: { businessId },
    skip: !businessId,
  });

  const [openDeactivateModal, setOpenDeactivateModal] = useState(false);
  const [steps, setSteps] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const categories = [
    { value: "retail", label: "Retail" },
    { value: "food", label: "Food" },
    { value: "health", label: "Health" },
    { value: "technology", label: "Technology" },
  ];
  const businessTypes = [
    { value: "retail", label: "Retail" },
    { value: "wholesale", label: "Wholesale" },
    { value: "service", label: "Service" },
  ];

  // Get all countries
  const countries = Country.getAllCountries().map((country) => ({
    value: country.isoCode,
    label: country.name,
  }));

  // Get cities for the selected country
  const cities = selectedCountry
    ? City.getCitiesOfCountry(selectedCountry)?.map((city) => ({
      value: city.name,
      label: city.name,
    })) || []
    : [];

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setSelectedCity(""); // Reset city when country changes
  };

  return (
    <DashboardLayout>
      <>
        <p className="text-lg font-semibold capitalize mb-3">Account</p>
        <section className="flex gap-4">
          <div className="lg:w-[20%] flex flex-col text-sm gap-3 items-start bg-white rounded-md p-4">
            <button
              onClick={() => setActive("profile")}
              className={`p-3 rounded-full text-left w-full ${active === "profile" && "bg-[#ECF3FF] text-primary"
                }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActive("users")}
              className={`p-3 rounded-full w-full text-left ${active === "users" && "bg-[#ECF3FF] text-primary"
                }`}
            >
              Users
            </button>
            <button
              onClick={() => setOpenDeactivateModal(true)}
              className={`p-3 rounded-sm w-full text-left`}
            >
              Deactivate Account
            </button>
          </div>
          <div className="lg:w-[80%] bg-white rounded-md p-4">
            {active === "profile" && (
              <div>
                <p className="mb-4 font-medium">Business Profile</p>
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
                    <p className="font-medium my-auto">Business Information</p>
                    <button
                      onClick={() => setOpenBusinessModal(true)}
                      className="flex text-primary bg-[#ECF3FF] rounded-md my-auto gap-2  p-2"
                    >
                      <span className="text-sm">Edit</span>
                      <Edit size={10} className="my-auto" />
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-[#030229B2] mb-2">Name</p>
                      <p className="font-medium">{userData?.business?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#030229B2] mb-2">
                        Email Address
                      </p>
                      <p className="font-medium">{userData?.business?.email}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-[#030229B2] mb-2">
                        Phone Number
                      </p>
                      <p className="font-medium">{userData?.business?.phone}</p>
                    </div>
                    {/* <div>
                      <p className="text-sm text-[#030229B2] mb-2">Type</p>
                      <p className="font-medium">hello</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#030229B2] mb-2">Category</p>
                      <p className="font-medium">hello</p>
                    </div> */}
                    <div>
                      <p className="text-sm text-[#030229B2] mb-2">
                        Website/Social media
                      </p>
                      <p className="font-medium">
                        {userData?.business?.website}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[#030229B2] mb-2">Tagline</p>
                      <p className="font-medium">
                        {userData?.business?.tagline}
                      </p>
                    </div>
                  </div>
                </div>
                {/* <div className="border border-[#E5E5EA] rounded-sm p-4">
                  <div className="border-b border-b-[#E5E5EA] flex py-3 mb-3 justify-between">
                    <p className="font-medium my-auto">Address Information</p>
                    <button
                      onClick={() => setOpenAddressModal(true)}
                      className="flex text-primary bg-[#ECF3FF] rounded-md my-auto gap-2 p-2"
                    >
                      <span className="text-sm">Edit</span>
                      <Edit size={10} className="my-auto" />
                    </button>
                  </div>

                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-[#030229B2] mb-2">Country</p>
                      <p className="font-medium">hello</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#030229B2] mb-2">City</p>
                      <p className="font-medium">hello</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#030229B2] mb-2">Address</p>
                      <p className="font-medium">hello</p>
                    </div>
                  </div>
                </div> */}
              </div>
            )}
            {active === "users" && (
              <div>
                <p className="mb-4 font-medium">User Management</p>
                <div className="border border-[#E5E5EA] rounded-sm p-4 mb-4">
                  <div className="flex justify-between">
                    <p className="font-medium">Team Members</p>
                    <button
                      onClick={() => setOpenInviteModal(true)}
                      className="bg-primary rounded-sm p-3 text-white flex gap-2"
                    >
                      <Plus className="my-auto" size={16} />
                      <span className="text-sm">Invite User</span>
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full mt-4 text-sm">
                      <thead>
                        <tr className="bg-[#D1DAF4] text-black">
                          <th className="px-4 py-3 font-medium text-left">
                            Name
                          </th>
                          <th className="px-4 py-3 font-medium text-left">
                            Email
                          </th>
                          <th className="px-4 py-3 font-medium text-left">
                            Role
                          </th>
                          <th className="px-4 py-3 font-medium text-left">
                            Status
                          </th>
                          <th className="px-4 py-3 font-medium text-left">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {membersLoading ? (
                          <tr>
                            <td colSpan={5} className="text-center py-4">
                              Loading team members...
                            </td>
                          </tr>
                        ) : membersError ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="text-center py-4 text-red-500"
                            >
                              Error loading members.
                            </td>
                          </tr>
                        ) : Array.isArray(membersData?.businessMembers) && membersData.businessMembers.length > 0 ? (
                          membersData.businessMembers.map(
                            (member: any, idx: number) => (
                              <tr key={idx}>
                                <td className="px-4 black font-normal py-3">
                                  {member.inviterName || "-"}
                                </td>
                                <td className="px-4 black font-normal py-3">
                                  {member.memberEmail}
                                </td>
                                <td className="px-4 black font-normal py-3">
                                  {member.role}
                                </td>
                                <td className="px-4 black font-normal py-3">
                                  {member.status}
                                </td>
                                <td className="px-4 black font-normal py-3">
                                  <Dropdown
                                    menu={{
                                      items: [
                                        { key: "edit", label: "Edit" },
                                        { key: "remove", label: "Remove" },
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
                            )
                          )
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-center py-4">
                              No team members found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="border border-[#E5E5EA] rounded-sm p-4">
                  <div className="flex border-b border-b-[#E5E5EA] py-3">
                    <p className="w-32 text-sm font-medium">Role</p>
                    <p className="text-sm font-medium">Permissions</p>
                  </div>

                  <div className="flex py-3 text-[#030229B2]">
                    <p className="w-32 text-sm">Admin</p>
                    <p className="text-sm">
                      Full access to campaigns, billing, users, and settings
                    </p>
                  </div>
                  <div className="flex py-3 text-[#030229B2]">
                    <p className="w-32 text-sm">Manager</p>
                    <p className="text-sm">
                      Can create and manage campaigns, view analytics
                    </p>
                  </div>
                  <div className="flex py-3 text-[#030229B2]">
                    <p className="w-32 text-sm">Viewer</p>
                    <p className="text-sm">
                      Can view dashboard and analytics only
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <Dialog
          open={openBusinessModal}
          onOpenChange={() => setOpenBusinessModal(false)}
        >
          <DialogContent>
            <h2 className="font-medium text-center">
              Edit Business Information
            </h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await updateBusiness({
                  variables: {
                    input: {
                      // businessId: businessId,
                      name: editBusinessForm.name,
                      phone: editBusinessForm.phone,
                      category: editBusinessForm.category,
                      type: editBusinessForm.type,
                      website: editBusinessForm.website,
                      tagline: editBusinessForm.tagline,
                    },
                  },
                });
                setOpenBusinessModal(false);
              }}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="bussName"
                  className="mb-2 text-[#030229CC] text-sm"
                >
                  Business Name
                </label>
                <input
                  type="text"
                  id="bussName"
                  value={editBusinessForm.name}
                  onChange={(e) =>
                    setEditBusinessForm({
                      ...editBusinessForm,
                      name: e.target.value,
                    })
                  }
                  className="border border-[#E5E5EA] rounded-md p-2 w-full"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 text-[#030229CC] text-sm"
                >
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phone"
                  value={editBusinessForm.phone}
                  onChange={(e) =>
                    setEditBusinessForm({
                      ...editBusinessForm,
                      phone: e.target.value,
                    })
                  }
                  className="border border-[#E5E5EA] rounded-md p-2 w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="bussCat"
                    className="mb-2 text-[#030229CC] text-sm"
                  >
                    Business Category
                  </label>
                  <select
                    id="bussCat"
                    className="border border-[#E5E5EA] rounded-md p-2 w-full"
                    value={editBusinessForm.category}
                    onChange={(e) =>
                      setEditBusinessForm({
                        ...editBusinessForm,
                        category: e.target.value,
                      })
                    }
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="bussType"
                    className="mb-2 text-[#030229CC] text-sm"
                  >
                    Business Type
                  </label>
                  <select
                    id="bussType"
                    className="border border-[#E5E5EA] rounded-md p-2 w-full"
                    value={editBusinessForm.type}
                    onChange={(e) =>
                      setEditBusinessForm({
                        ...editBusinessForm,
                        type: e.target.value,
                      })
                    }
                  >
                    {businessTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label
                  htmlFor="website"
                  className="mb-2 text-[#030229CC] text-sm"
                >
                  Business Website/Social Media
                </label>
                <input
                  type="text"
                  id="website"
                  value={editBusinessForm.website}
                  onChange={(e) =>
                    setEditBusinessForm({
                      ...editBusinessForm,
                      website: e.target.value,
                    })
                  }
                  className="border border-[#E5E5EA] rounded-md p-2 w-full"
                />
              </div>
              <div>
                <label
                  htmlFor="tagline"
                  className="mb-2 text-[#030229CC] text-sm"
                >
                  Business Tagline
                </label>
                <input
                  type="text"
                  id="tagline"
                  value={editBusinessForm.tagline}
                  onChange={(e) =>
                    setEditBusinessForm({
                      ...editBusinessForm,
                      tagline: e.target.value,
                    })
                  }
                  className="border border-[#E5E5EA] rounded-md p-2 w-full"
                />
              </div>
              {updateError && (
                <div className="text-red-500 text-sm">
                  Error updating business: {updateError.message}
                </div>
              )}
              <div className="text-center">
                <button
                  type="submit"
                  className="p-3 bg-primary rounded-md text-white"
                  disabled={updateLoading}
                >
                  {updateLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog
          open={openAddressModal}
          onOpenChange={() => setOpenAddressModal(false)}
        >
          <DialogContent>
            <h2 className="font-medium text-center">
              Edit Address Information
            </h2>
            <div>
              <label
                htmlFor="country"
                className="mb-2 text-[#030229CC] text-sm block"
              >
                Country
              </label>
              <CustomSelect
                options={countries}
                placeholder="Select a country"
                value={selectedCountry}
                onChange={handleCountryChange}
              />
            </div>
            <div>
              <label
                htmlFor="city"
                className="mb-2 text-[#030229CC] text-sm block"
              >
                City
              </label>
              <CustomSelect
                options={cities}
                placeholder="Select a city"
                value={selectedCity}
                onChange={setSelectedCity}
              />
            </div>
            <div className="">
              <label
                htmlFor="address"
                className="mb-2 text-[#030229CC] text-sm"
              >
                Address
              </label>
              <input
                type="text"
                className="border border-[#E5E5EA] rounded-md p-3 w-full"
              />
            </div>
            <div className="text-center">
              <button className="p-3 bg-primary rounded-md text-white">
                Save Changes
              </button>
            </div>
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
                <p className="font-medium">What Will Happen?</p>
                <ul className="text-sm text-[#030229CC]">
                  <li>Your business profile will be hidden</li>
                  <li>Ongoing campaigns will be paused</li>
                  <li>You will stop receiving notifications</li>
                  <li>
                    You won’t be able to access the dashboard until reactivated
                  </li>
                </ul>
                <p className="font-medium">Reason for deactivating </p>
                <span className="text-sm text-[#030229CC]">
                  Let us know why you're leaving, this helps us improve.
                </span>
                <textarea value={detailedReason} onChange={(e) => setDetailedReason(e.target.value)} className="rounded-md h-32 border border-[#E5E5EA] rounded-md p-3 w-full"></textarea>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setOpenDeactivateModal(false)}
                    className="bg-gray-500 text-white p-3 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setSteps(1)}
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
                  This action will pause all platform activity for your
                  business. You can reactivate later by logging in again.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setSteps(1)}
                    className="bg-[#E7302B] text-white p-3 rounded-md"
                  >
                    Yes Deactivate
                  </button>
                  <button
                    onClick={async () => {
                      if (!detailedReason.trim()) {
                        alert("Please provide a reason for deactivation.");
                        return;
                      }
                      try {
                        const { DEACTIVATE_BUSINESS, LOGOUT } = await import("@/apollo/mutations/account");
                        const [deactivateBusiness] = useMutation<DeactivateBusinessResponse, DeactivateBusinessVariables>(DEACTIVATE_BUSINESS);
                        const [logout] = useMutation<LogoutResponse>(LOGOUT);

                        // First try to deactivate the business
                        const deactivateResponse = await deactivateBusiness({
                          variables: {
                            input: {
                              businessId,
                              reason: "USER_REQUEST",
                              detailedReason: detailedReason,
                            },
                          },
                        });

                        if (deactivateResponse?.data?.deactivateBusiness?.success) {
                          try {
                            // Try to log out the user
                            const logoutResponse = await logout();
                            if (logoutResponse?.data?.logout?.success) {
                              localStorage.clear(); // Clear any stored data
                              window.location.href = "/login"; // Redirect to login
                            } else {
                              // alert("Business deactivated successfully, but logout failed. Please manually log out.");
                              setOpenDeactivateModal(false);
                            }
                          } catch (logoutError) {
                            // alert("Business deactivated successfully, but logout failed. Please manually log out.");
                            setOpenDeactivateModal(false);
                          }
                        } else {
                          // Show the specific error message from the API if available
                          // alert(deactivateResponse?.data?.deactivateBusiness?.message || "Failed to deactivate business. Please try again.");
                        }
                      } catch (error: any) {
                        // Show a more specific error message if available
                        alert(error.message || "An error occurred while deactivating the business. Please try again.");
                      }
                    }} className="bg-gray-500 text-white p-3 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        <Dialog
          open={openInviteModal}
          onOpenChange={() => {
            setOpenInviteModal(false);
            setInviteError(null);
            setInviteSuccess(null);
          }}
        >
          <DialogContent className="">
            <h2 className="text-center font-medium">Invite User</h2>
            {inviteError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-2 text-sm">
                {inviteError}
              </div>
            )}
            {inviteSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded mb-2 text-sm">
                {inviteSuccess}
              </div>
            )}
            <div>
              <label htmlFor="name" className="mb-2 text-[#030229CC] text-sm">
                Full Name
              </label>
              <input
                type="text"
                className="border border-[#E5E5EA] rounded-md p-3 w-full"
                placeholder="e.g John Doe"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="invite-email"
                className="mb-2 text-[#030229CC] text-sm"
              >
                Email Address*
              </label>
              <input
                type="email"
                className="border border-[#E5E5EA] rounded-md p-3 w-full"
                placeholder="e.g johndoe@email.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="invite-role"
                className="mb-2 text-[#030229CC] text-sm"
              >
                Role*
              </label>
              <select
                className="border border-[#E5E5EA] rounded-md p-3 w-full"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
              >
                <option value="">Select a role</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            <div className="text-center">
              <button
                className="p-3 bg-primary rounded-md text-white w-full"
                onClick={handleInviteUser}
                disabled={inviteLoading || !inviteEmail || !inviteRole}
              >
                {inviteLoading ? "Sending..." : "Send Invite"}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    </DashboardLayout>
  );
};

export default account;
