'use client';
import { useRouter } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';
import AuthLayout from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FaChevronLeft } from "react-icons/fa6";

export default function OtpPage() {
 const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(59);
  const inputRefs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

  // Timer countdown effect
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Handle digit input & focus
  const handleChange = (idx: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return; // Only allow single digit
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val && idx < 5) {
      inputRefs[idx + 1].current?.focus();
    }
  };

  const handleBackspace = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputRefs[idx - 1].current?.focus();
    }
  };

  // OTP validation
  const otpValue = otp.join('');
  const isOtpComplete = otpValue.length === 6 && otp.every(d => d !== '');

  // Form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isOtpComplete) {
      router.push('/sign-in');
    }
  };

  return (
    <AuthLayout>
  <form className="w-full max-w-xl mt-12 md:mt-20" onSubmit={handleSubmit}>
    {/* Back Button, h2, p, etc */}
    <button
      type="button"
      aria-label="Back"
      onClick={() => router.back()}
      className="mb-6 p-2 rounded-sm bg-[#EBF0FF] hover:bg-muted transition-colors"
    >
      <FaChevronLeft className="w-5 h-5 text-primary" />
    </button>
    <h2 className="text-heading text-2xl font-semibold mb-2">Check your email</h2>
    <p className="text-body text-base mb-6">
      Enter the 6-digit code we sent to your email address.
    </p>

    {/* OTP Inputs */}
    {/* <div className="flex  items-center gap-2 lg:gap-4 mb-4">
      {otp.map((digit, idx) => (
        <input
          key={idx}
          ref={inputRefs[idx]}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className="w-8 h-8 md:w-10 md:h-10 lg:w-16 lg:h-16 rounded-xs md:rounded-sm border border-gray-300 text-center text-2xl font-medium focus:outline-none focus:ring-2 focus:ring-primary transition"
          value={digit}
          onChange={e => handleChange(idx, e.target.value)}
          onKeyDown={e => handleBackspace(idx, e)}
          autoFocus={idx === 0}
        />
      ))}
    </div> */}
    {/* OTP Inputs */}
<div className="flex w-full gap-2 lg:gap-4 mb-4">
  {otp.map((digit, idx) => (
    <input
      key={idx}
      ref={inputRefs[idx]}
      type="text"
      inputMode="numeric"
      maxLength={1}
      className="flex-1 min-w-0 h-12 md:h-14 lg:h-16 rounded-md border border-gray-300 text-center text-2xl font-medium focus:outline-none focus:ring-2 focus:ring-primary transition"
      value={digit}
      onChange={e => handleChange(idx, e.target.value)}
      onKeyDown={e => handleBackspace(idx, e)}
      autoFocus={idx === 0}
    />
  ))}
</div>


    {/* Timer */}
    <div className="flex gap-2 mb-6 text-body text-base">
      Code expires in <p className="font-medium">00:{timer.toString().padStart(2, '0')}</p>
    </div>

    {/* Submit */}
    <Button className="w-full mb-2" type="submit" disabled={otpValue.length < 6}>
      Verify email
    </Button>

    {/* Resend Link */}
    <div className="text-sm mb-6">
      Didn't get code?{' '}
      <button type="button" className="text-primary font-medium hover:underline" onClick={() => setTimer(59)}>
        Resend code
      </button>
    </div>
  </form>
</AuthLayout>

  );
}
