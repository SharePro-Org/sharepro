"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { FaChevronLeft } from "react-icons/fa6";
import { useEffect, useState, Suspense } from "react";

import TopRightLeftSection from "../../../../../public/assets/auth/top-right-left-section.svg";
import BottomLeftLeftSection from "../../../../../public/assets/auth/bottom-left-left-section.svg";
import Image from "next/image";


function VerifyEmailContent() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setEmail(params.get("email") || "");
    }
  }, []);

  // Mask email for privacy (e.g., a***b@domain.com)
  function maskEmail(email: string) {
    if (!email) return "your email";
    const [user, domain] = email.split("@");
    if (!user || !domain) return email;
    if (user.length <= 2) return user[0] + "***@" + domain;
    return user[0] + "***" + user.slice(-1) + "@" + domain;
  }

  return (
    <>
      <div className="p-4">
        <img className="w-32" src="/assets/logo.svg" alt="" />
      </div>
      <Image
        src={TopRightLeftSection}
        alt=""
        width={35}
        height={35}
        className="pointer-events-none absolute right-6 top-0 z-0 object-cover"
      />
      <div className="w-full mx-auto max-w-xl  mt-16 md:mt-28">
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
            We've sent a verification link to your email{" "}
            <span className="font-semibold">{maskEmail(email)}</span>. Please
            check your inbox and click the link to continue.
          </p>
          <Button className="w-full " onClick={() => router.push("/user/auth/otp")}>
            Continue
          </Button>
          <Button variant="outline" className="w-full">
            Resend Verification Email
          </Button>
        </div>
      </div>
      <Image
        src={BottomLeftLeftSection}
        alt=""
        width={30}
        height={30}
        className="pointer-events-none absolute left-0 bottom-0 z-0 object-cover"
      />
    </>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-xl mx-auto mt-16 md:mt-28 text-center text-lg">
          Loading...
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
