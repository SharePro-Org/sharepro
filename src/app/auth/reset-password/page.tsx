'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/AuthLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MdOutlineLock } from "react-icons/md";
import { FaChevronLeft } from "react-icons/fa6";

function isStrongPassword(pw: string) {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number (tweak as needed)
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pw);
}

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const router = useRouter();

  const canContinue = isStrongPassword(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canContinue) {
      // Handle actual reset here or just alert for now
      alert('Password reset! (Frontend only)');
      // router.push('/sign-in');
    }
  };

  return (
    <AuthLayout>
      <form className="w-full max-w-md mt-12 md:mt-20" onSubmit={handleSubmit}>
        {/* Back Button */}
        <button
          type="button"
          aria-label="Back"
          onClick={() => router.back()}
          className="mb-6 p-2 rounded-sm bg-[#EBF0FF] hover:bg-muted transition-colors"
        >
          <FaChevronLeft className="w-5 h-5 text-primary" />
        </button>

        <h2 className="text-[22px] font-semibold mb-1 text-heading">Reset your password</h2>
        <p className="text-sm text-body mb-7">
          Create a new password for your account
        </p>
        <div className="space-y-2 mb-3">
          <Label htmlFor="password">Password</Label>
          <div className="relative flex justify-between">
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <MdOutlineLock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray5" />
          </div>
        </div>
        <Button className="w-full" type="submit" disabled={!canContinue}>
          Reset Password
        </Button>
      </form>
    </AuthLayout>
  );
}
