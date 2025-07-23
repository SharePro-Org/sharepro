"use client"

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const rewards = () => {
  const router = useRouter();

  return (
    <DashboardLayout>
      <section className='bg-white rounded-md md:p-6 p-3'>
        <button
          className='text-black cursor-pointer flex items-center'
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-3" />
          <span className='text-lg font-semibold capitalize'>Define Campaign Rewards</span>
        </button>
      </section>
    </DashboardLayout>
  );
};

export default rewards;