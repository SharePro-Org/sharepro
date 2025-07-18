"use client";
import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MdOutlineLock } from "react-icons/md";
import { FaChevronLeft } from "react-icons/fa6";
import { useMutation } from "@apollo/client";
import { RESET_PASSWORD } from "@/apollo/mutations/auth";
import { useSearchParams } from "next/navigation";

function isStrongPassword(pw: string) {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number (tweak as needed)
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pw);
}

function ResetPasswordContent() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const router = useRouter();
  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD);
  const [success, setSuccess] = useState("");
  const params = useSearchParams().get("token");

  // Only render form if token is present
  if (!params) {
    return <div className="w-full max-w-md mx-auto mt-20 text-center text-lg">Loading...</div>;
  }

  const canContinue = isStrongPassword(password);

  const handleBlur = () => {
    setTouched(true);
    setError(
      isStrongPassword(password)
        ? ""
        : "Password must be at least 8 characters, include uppercase, lowercase, and a number."
    );
  };

  const handleChange = (value: string) => {
    setPassword(value);
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setError("");
    setSuccess("");
    if (!isStrongPassword(password)) {
      setError(
        "Password must be at least 8 characters, include uppercase, lowercase, and a number."
      );
      return;
    }
    const token = params;
    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }
    try {
      const { data } = await resetPassword({
        variables: { newPassword: password, token },
      });
      if (data?.resetPassword?.success) {
        setSuccess(data.resetPassword.message || "Password reset!");
        setTimeout(() => router.push("/auth/sign-in"), 1500);
      } else {
        setError(data?.resetPassword?.message || "Failed to reset password");
      }
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    }
  };

  return (
    <AuthLayout>
      <form
        className="w-full max-w-md mt-12 md:mt-20"
        onSubmit={handleSubmit}
        noValidate
      >
        {/* Back Button */}
        <button
          type="button"
          aria-label="Back"
          onClick={() => router.back()}
          className="mb-6 p-2 rounded-sm bg-[#EBF0FF] hover:bg-muted transition-colors"
        >
          <FaChevronLeft className="w-5 h-5 text-primary" />
        </button>

        <h2 className="text-[22px] font-semibold mb-1 text-heading">
          Reset your password
        </h2>
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
              onChange={(e) => handleChange(e.target.value)}
              onBlur={handleBlur}
              className={error && touched ? "border !border-danger" : ""}
            />
            <MdOutlineLock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray5" />
          </div>
          {error && touched && (
            <p className="text-xs text-danger mt-1">{error}</p>
          )}
        </div>
        {success && (
          <p className="text-success text-sm text-center font-medium mb-2">
            {success}
          </p>
        )}
        <Button
          className="w-full"
          type="submit"
          disabled={!canContinue || loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </AuthLayout>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div className="w-full max-w-md mx-auto mt-20 text-center text-lg">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
