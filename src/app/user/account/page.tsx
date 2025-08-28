"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Camera, Edit, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CustomSelect } from "@/components/ui/custom-select";
import { Country, City } from "country-state-city";
import { Button, Dropdown } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { INVITE_MEMBER } from "@/apollo/mutations/account";
import { useAtom } from "jotai";
import { userAtom } from "@/store/User";

const account = () => {
  const [openBusinessModal, setOpenBusinessModal] = useState(false);
  const [user] = useAtom(userAtom);

  const [openDeactivateModal, setOpenDeactivateModal] = useState(false);
  const [steps, setSteps] = useState(0);

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
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-[#030229B2] mb-2">Name</p>
                    <p className="font-medium">hello</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#030229B2] mb-2">
                      Email Address
                    </p>
                    <p className="font-medium">hello</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-[#030229B2] mb-2">
                      Phone Number
                    </p>
                    <p className="font-medium">hello</p>
                  </div>
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
            {/* Business information form goes here */}
            <div className="">
              <label
                htmlFor="bussName"
                className="mb-2 text-[#030229CC] text-sm"
              >
                Name
              </label>
              <input
                type="text"
                className="border border-[#E5E5EA] rounded-md p-2 w-full"
              />
            </div>
            <div className="">
              <label htmlFor="phone" className="mb-2 text-[#030229CC] text-sm">
                Phone Number
              </label>
              <input
                type="phone"
                className="border border-[#E5E5EA] rounded-md p-2 w-full"
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
                <textarea className="rounded-md h-32 border border-[#E5E5EA] rounded-md p-3 w-full"></textarea>

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
                  This action will pause all platform activity for your account.
                  You can reactivate later by logging in again.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setSteps(1)}
                    className="bg-[#E7302B] text-white p-3 rounded-md"
                  >
                    Yes Deactivate
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
      </>
    </DashboardLayout>
  );
};

export default account;
