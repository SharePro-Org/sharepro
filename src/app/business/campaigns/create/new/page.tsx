'use client'

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { ArrowLeft } from 'lucide-react';
import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const newCampaign = () => {
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

  return (
    <DashboardLayout>
      <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
        <section className='bg-white rounded-md md:p-6 p-3'>
          <button
            className='text-black cursor-pointer flex items-center'
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-3" />
            <span className='text-lg font-semibold capitalize'>Create a {type} campaign</span>
          </button>
          <form>
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
              <button disabled={schedule} className='bg-primary cursor-pointer text-sm text-white py-2 px-4 rounded-sm'>Launch Campaign</button>
              <button type="button"
                onClick={() => setSchedule(true)}
                className='bg-secondary cursor-pointer text-sm text-white py-2 px-4 rounded-sm'>Schedule for later</button>
            </div>

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

              <button disabled={schedule} className='bg-primary my-4 md:w-32 w-full cursor-pointer text-sm text-white py-2 px-4 rounded-sm'>Schedule</button>
            </>}

          </form>

        </section>
      </Suspense>
    </DashboardLayout>
  );
};

export default newCampaign;