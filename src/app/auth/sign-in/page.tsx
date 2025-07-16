'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/components/AuthLayout';
import { HiOutlineMail } from "react-icons/hi";
import { FiPhone } from "react-icons/fi";
import { MdOutlineLock } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { cn } from '@/lib/utils';


export default function SignIn() {
  const [tab, setTab] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  // Only enable if (email && password) or (phone && password)
  const canContinue =
    tab === 'email'
      ? email.trim() && password.trim()
      : phone.trim() && password.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canContinue) {
      router.push('/onboarding/business-info');
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-xl mt-12 md:mt-16">
        <h2 className="text-[29px] font-semibold mb-1 text-heading">Welcome back!</h2>
        <p className="text-sm text-body mb-8">Please sign in to access your account</p>

        {/* Pill Toggle */}
        <div className="flex justify-between mb-6 rounded-[15px] border border-gray6 p-1 w-full ">
          <button
            className={cn(
              "px-5 py-2 rounded-[15px] text-sm  transition-all",
              tab === "email"
                ? "bg-[#ECF3FF] text-primary rounded-[15px] font-medium"
                : "text-body"
            )}
            onClick={() => setTab('email')}
            type="button"
          >
            Email Address
          </button>
          <button
            className={cn(
              "px-5 py-2 rounded-[15px] text-sm  transition-all",
              tab === "phone"
                ? "bg-[#ECF3FF] text-primary rounded-[15px] font-medium"
                : "text-body"
            )}
            onClick={() => setTab('phone')}
            type="button"
          >
            Phone Number
          </button>
        </div>

        <form className="w-full max-w-xl space-y-4 " onSubmit={handleSubmit}>
          {tab === 'email' ? (
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative flex justify-between">
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g johndoe@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <HiOutlineMail size={20}  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray5" />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative flex justify-between">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g 0123456789"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
                <FiPhone className="absolute right-3 top-1/2 -translate-y-1/2 text-gray5" />
              </div>
            </div>
          )}

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative flex justify-between">
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <MdOutlineLock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray5" />
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end mb-1">
            <Link href="/auth/forgot-password" className="text-primary hover:underline text-sm font-medium">
              Forgot password?
            </Link>
          </div>

          <Button className="w-full" type="submit" disabled={!canContinue}>
            Continue
          </Button>
          <Button variant="outline" className="flex w-full items-center justify-center gap-2" type="button">
            <FcGoogle /> Sign in with Google
          </Button>
        </form>

        {/* Footer Links */}
        <div className="flex w-full max-w-xl mx-auto justify-start text-sm mt-4">
          <span>Don&apos;t have an account?&nbsp;</span>
          <Link href="/auth/sign-up" className="text-primary font-semibold hover:underline">Sign up</Link>
        </div>
      </div>
    </AuthLayout>
  );
}