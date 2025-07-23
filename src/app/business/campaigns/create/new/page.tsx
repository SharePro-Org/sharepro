'use client'

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { ArrowLeft } from 'lucide-react';
import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from '@apollo/client';
import { CREATE_CAMPAIGN } from '@/apollo/mutations/campaigns';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import userCheck from "../../../../../../public/assets/userCheck.svg";


const NewCampaignContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const [schedule, setSchedule] = useState(false);
  const [endDate, setEndDate] = useState<Date | string>('');
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [name, setName] = useState("")
  const [time, setTime] = useState("")
  const [launchDate, setLaunchDate] = useState("")
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  // Get businessId from localStorage
  const [businessId, setBusinessId] = useState<string>("");
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const userData = localStorage.getItem("userData");
        if (userData) {
          const parsed = JSON.parse(userData);
          if (parsed.businessId) {
            setBusinessId(parsed.businessId);
          }
        }
      } catch (err) {
        // handle error if needed
      }
    }
  }, []);
  const [createCampaign, { loading }] = useMutation(CREATE_CAMPAIGN, {
    onCompleted: (data) => {
      if (data.createCampaign.success) {
        setSuccess(true);
        setErrorMsg("");
      } else {
        setErrorMsg(data.createCampaign.message || 'Failed to create campaign.');
        // setSuccessMsg("");
      }
    },
    onError: (error) => {
      setErrorMsg(error.message);
      // setSuccessMsg("");
    }
  });

  return (
    <DashboardLayout>
      <section className='bg-white rounded-md md:p-6 p-3'>
        <button
          className='text-black cursor-pointer flex items-center'
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-3" />
          <span className='text-lg font-semibold capitalize'>Create a {type} campaign</span>
        </button>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setErrorMsg("");
            // setSuccessMsg("");
            const input = {
              name,
              businessId,
              description,
              isActive: true,
              isScheduled: schedule,
              startDate: schedule ? launchDate : new Date().toISOString().split('T')[0],
              endDate: endDate ? endDate.toString().split('T')[0] : '',
              // campaignType: type?.toUpperCase() || "LOYALTY",
              // link,
              // time: schedule ? time : undefined
            };
            try {
              await createCampaign({ variables: { input } });
            } catch (err) {
              // Error handled in onError
            }
          }}
        >
          {/* Campaign creation form or content goes here */}
          <p className='text-primay text-lg my-2'>Campaign Info</p>
          <div className='mb-4'>
            <Label htmlFor="name" className="block mb-2 text-sm">
              Campaign name
            </Label>
            <Input
              id="name"
              placeholder="Enter campaign name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
          </div>

          <div className='mb-4'>
            <Label htmlFor="duration" className="block mb-2 text-sm">
              End Date
            </Label>
            <Input
              id="duration"
              type="date"
              placeholder="End date"
              value={endDate ? endDate.toString().split('T')[0] : ''}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full"
            />
          </div>

          <div className='mb-4'>
            <Label htmlFor="description" className="block mb-2 text-sm">
              Campaign Description
            </Label>
            <Input
              id="description"
              placeholder="Add a brief description for this campaign (for internal use)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full"
            />
          </div>

          <div className='mb-4'>
            <Label htmlFor="descriotion" className="block mb-2 text-sm">
              Link (Social media, Webiste, App)
            </Label>
            <Input
              id="name"
              placeholder="Where customers will participate in the campaign"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full"
            />
          </div>

          <div className='flex md:w-[40%] justify-between'>
            <button
              type="submit"
              disabled={loading || schedule}
              className={`bg-primary text-sm text-white py-2 px-4 rounded-sm ${loading || schedule ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {loading ? 'Creating...' : 'Launch Campaign'}
            </button>

            <button type="button"
              onClick={() => setSchedule(!schedule)}
              className='bg-secondary cursor-pointer text-sm text-white py-2 px-4 rounded-sm'>Schedule for later</button>
          </div>
          {errorMsg && <div className="text-red-500 my-2">{errorMsg}</div>}
          {/* {successMsg && <div className="text-green-500 my-2">{successMsg}</div>} */}
          {schedule && <>
            <p className='text-primay text-lg mt-6 mb-2'>Set schedule date</p>

            <div className='grid lg:grid-cols-2 md:gap-4'>
              <div className='mb-4'>
                <Label htmlFor="launch" className="block mb-2 text-sm">
                  Launch Date
                </Label>
                <Input
                  id="launch"
                  type="date"
                  placeholder="Launch date"
                  value={launchDate ? launchDate.toString().split('T')[0] : ''}
                  onChange={(e) => setLaunchDate(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className='mb-4'>
                <Label htmlFor="time" className="block mb-2 text-sm">
                  Time
                </Label>
                <Input
                  id="duration"
                  type="time"
                  placeholder="Time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`bg-primary my-4 md:w-32 w-full cursor-pointer text-sm text-white py-2 px-4 rounded-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Scheduling...' : 'Schedule'}
            </button>
          </>}
        </form>

        <Dialog open={success}>
          <DialogContent className="max-w-md w-full flex flex-col items-center justify-center gap-6 py-12">
            {/* Success Icon */}

            <div className="flex justify-center">
              <div className="  flex items-center justify-center">
                <Image
                  src={userCheck}
                  alt="userchecker"
                  width={110}
                  height={21}
                />
              </div>
            </div>
            <div className="text-center">
              <div className="text-heading text-[20px] font-bold mb-2">
                Campaign Created!
              </div>
              <div className="text-body text-base mb-2">
                You can proceed to set rewards now or do this later
              </div>
            </div>
            <div className="">
              <button
                className="w-full bg-primary p-4 text-white mb-3 rounded-sm"
                onClick={() => router.push("/business/dashboard")}
              >
                Go to Dashboard
              </button>

              <button
                className="w-full bg-secondary p-4 text-white rounded-sm"
                onClick={() => router.push("/business/campaigns/create/rewards")}
              >
                Set Rewards
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </section>
    </DashboardLayout >
  );
};

const newCampaign = () => {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <NewCampaignContent />
    </Suspense>
  )
}

export default newCampaign;