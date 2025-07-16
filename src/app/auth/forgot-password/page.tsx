'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/components/AuthLayout';
import { HiOutlineMail } from "react-icons/hi";
import { FaChevronLeft } from "react-icons/fa6";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const canContinue = isValidEmail(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canContinue) {
      // For now, just show a message or route
      alert("Reset link sent to your email (frontend only)");
      // router.push('/reset-password');
    }
  };

  return (
    <AuthLayout>
      <form className="w-full max-w-md mt-12 md:mt-20 mx-auto" onSubmit={handleSubmit}>
        {/* Back button */}
        <button
          type="button"
          aria-label="Back"
          onClick={() => router.back()}
          className="mb-6 p-2 rounded-sm bg-[#EBF0FF] hover:bg-muted transition-colors"
        >
          <FaChevronLeft className="w-5 h-5 text-primary" />
        </button>
        <h2 className="text-[29px] font-semibold mb-1 text-heading">Forgot Password</h2>
        <p className="text-base text-gray500 mb-7">
          Enter your email address you logged in with
        </p>
        <div className="space-y-2 mb-3">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative flex justify-between">
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <HiOutlineMail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray5" />
          </div>
        </div>
        <Button className="w-full mb-3" type="submit" disabled={!canContinue}>
          Continue
        </Button>
        <div className="flex justify-start text-sm lg:text-base text-body">
          <span>Remember your Password?&nbsp;</span>
          <Link href="/auth/sign-in" className="text-primary hover:underline font-semibold">
            Log back in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
