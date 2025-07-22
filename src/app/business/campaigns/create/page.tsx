'use client'

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const createCampaign = () => {
  const router = useRouter();
  return (
    <DashboardLayout>
      <>
        <section className='bg-white rounded-md md:p-6 p-3'>
          <button
            className='text-black cursor-pointer flex items-center'
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-3" />
            <span className='text-lg font-semibold'>Create campaign</span>
          </button>
          <div className='grid mt-8 lg:grid-cols-3 gap-4'>
            <div className='bg-[#D1DAF442] p-4 rounded-md'>
              <p className='font-semibold'>Create a Loyalty Campaign</p>
              <p className='my-1'>For retaining existing customers</p>
              <p className='text-sm'>Reward your current customers for their continued loyalty and repeat actions to keep them engaged and coming back for more.</p>
              <div className='flex justify-between mt-8'>
                <Link href={'/business/campaigns/create/new?type=loyalty'}>
                  <button className='bg-primary cursor-pointer text-sm text-white py-2 px-4 rounded-sm'>Create Campaign</button>
                </Link>

                <button className='text-primary p-2 text-sm mt-auto'>Learn More</button>
              </div>
            </div>
            <div className='bg-[#D1DAF442] p-4 rounded-md'>
              <p className='font-semibold'>Create a Referral Campaign</p>
              <p className='my-1'>For acquiring new customers via sharing</p>
              <p className='text-sm'>Use this campaign type to drive customer acquisition by encouraging your existing users to share your business with friends and contacts.</p>
              <div className='flex justify-between mt-4'>
                <Link href={'/business/campaigns/create/new?type=referral'}>
                  <button className='bg-primary cursor-pointer text-sm text-white py-2 px-4 rounded-sm'>Create Campaign</button>
                </Link>
                <button className='text-primary p-2 text-sm mt-auto'>Learn More</button>
              </div>
            </div>
            <div className='bg-[#D1DAF442] p-4 rounded-md'>
              <p className='font-semibold'>Create a Combo Campaign</p>
              <p className='my-1'>Referral + repeat purchase rewards</p>
              <p className='text-sm'>Combine both referral and loyalty incentives to grow your customer base while rewarding repeat purchases and long-term engagement.</p>
              <div className='flex justify-between mt-8'>
                <Link href={'/business/campaigns/create/new?type=combo'}>
                  <button className='bg-primary cursor-pointer text-sm text-white py-2 px-4 rounded-sm'>Create Campaign</button>
                </Link>
                <button className='text-primary p-2 text-sm mt-auto'>Learn More</button>
              </div>
            </div>
          </div>
        </section>
      </>
    </DashboardLayout>
  );
};

export default createCampaign;