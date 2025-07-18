"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { FaChevronLeft } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { VERIFY_EMAIL } from "@/apollo/mutations/auth";

export default function VerifyEmail() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("your email");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setEmail(params.get("email") || "your email");
    }
  }, []);
  const [code, setCode] = useState("");
  const [verifyEmail, { loading }] = useMutation(VERIFY_EMAIL);
  const [error, setError] = useState("");

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

          <h2 className="text-heding text-2xl font-semibold mb-2">
            Verify Your Email
          </h2>
          <p className="text-body text-base ">
            We've sent a verification code to your email <span className="font-semibold">{email}</span>.<br/>
            Please enter the code below to continue.
          </p>
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              try {
                const { data } = await verifyEmail({ variables: { code } });
                if (data?.verifyEmail?.success) {
                  router.push("/onboarding");
                } else {
                  setError(data?.verifyEmail?.message || "Verification failed");
                }
              } catch (err: any) {
                setError(err.message || "Verification failed");
              }
            }}
          >
            <input
              type="text"
              placeholder="Enter verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border rounded px-3 py-2 text-base"
              required
            />
            {error && <p className="text-danger text-sm text-center font-medium">{error}</p>}
            <Button className="w-full" type="submit" disabled={loading || !code}>
              {loading ? "Verifying..." : "Continue"}
            </Button>
          </form>
          <Button variant="outline" className="w-full">
            Resend Verification Email
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
