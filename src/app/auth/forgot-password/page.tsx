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
import { useMutation } from '@apollo/client/react';
import { FORGOT_PASSWORD } from '@/apollo/mutations/auth';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type ForgotPasswordMutationResult = {
  forgotPassword?: {
    success: boolean;
    message?: string;
  };
};

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const [success, setSuccess] = useState('');
  const [forgotPassword, { loading }] = useMutation<ForgotPasswordMutationResult>(FORGOT_PASSWORD);

  const canContinue = isValidEmail(email);

  const handleBlur = () => {
    setTouched(true);
    setError(isValidEmail(email) ? '' : 'Enter a valid email');
  };

  const handleChange = (value: string) => {
    setEmail(value);
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setError('');
    setSuccess('');
    if (!isValidEmail(email)) {
      setError('Enter a valid email');
      return;
    }
    try {
      const { data } = await forgotPassword({ variables: { email } });
      if (data?.forgotPassword?.success) {
        setSuccess(data.forgotPassword.message || 'Reset link sent to your email');
      } else {
        setError(data?.forgotPassword?.message || 'Failed to send reset link');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link');
    }
  };

  return (
    <AuthLayout>
      <form className="w-full max-w-md mt-12 md:mt-20 mx-auto" onSubmit={handleSubmit} noValidate>
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
              onChange={e => handleChange(e.target.value)}
              onBlur={handleBlur}
              className={error && touched ? 'border !border-danger' : ''}
            />
            <HiOutlineMail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray5" />
          </div>
          {error && touched && (
            <p className="text-xs text-danger mt-1">{error}</p>
          )}
        </div>
        {success && (
          <p className="text-success text-sm text-center font-medium mb-2">{success}</p>
        )}
        <Button className="w-full mb-3" type="submit" disabled={!canContinue || loading}>
          {loading ? 'Sending...' : 'Continue'}
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
