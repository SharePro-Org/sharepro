'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { FaChevronLeft } from "react-icons/fa6";


export default function VerifyEmail() {
  const router = useRouter();




  return (
    <AuthLayout>
  <div className="w-full max-w-xl  mt-16 md:mt-28">
    <div className="w-full max-w-xl space-y-4 ">
      <button
  type="button"
  aria-label="Back"
  className="mb-6 p-2 rounded-sm bg-[#EBF0FF] hover:bg-muted transition-colors"
  onClick={() => router.back()}
>
  <FaChevronLeft className="w-5 h-5 text-primary" />
</button>

      <h2 className="text-heding text-2xl font-semibold mb-2">Verify Your Email</h2>
      <p className="text-body text-base ">
        We've sent a verification link to your email anga*******@gmail.com. Please check your inbox and click the link to continue.
      </p>
      <Button className="w-full " onClick={() => router.push('/otp')}>Continue</Button>
      <Button variant="outline" className="w-full">Resend Verification Email</Button>
    </div>
  </div>
</AuthLayout>

  );
}
