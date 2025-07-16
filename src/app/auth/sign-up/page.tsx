"use client";
import { useState } from "react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/AuthLayout";
import { useRouter } from "next/navigation";
import { RiBriefcase4Line } from "react-icons/ri";
import { HiOutlineMail } from "react-icons/hi";
import { FiPhone } from "react-icons/fi";
import { MdOutlineLock } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone: string) => /^[0-9]{8,15}$/.test(phone);
const isValidPassword = (password: string) => password.length >= 6;

export default function BusinessSignUp() {
  const router = useRouter();

  // State for each field
  const [businessName, setBusinessName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touched, setTouched] = useState({
    businessName: false,
    businessEmail: false,
    phoneNumber: false,
    password: false,
    confirmPassword: false,
  });
  const [errors, setErrors] = useState({
    businessName: "",
    businessEmail: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const validate = () => {
    return {
      businessName: businessName.trim() ? "" : "Business name is required",
      businessEmail: isValidEmail(businessEmail)
        ? ""
        : "Please enter your email to create an account.",
      phoneNumber: isValidPhone(phoneNumber)
        ? ""
        : "Enter a valid phone number",
      password: isValidPassword(password)
        ? ""
        : "Password must be at least 6 characters",
      confirmPassword:
        password === confirmPassword && confirmPassword
          ? ""
          : "Passwords do not match",
    };
  };

  const isFormValid =
    businessName.trim() &&
    isValidEmail(businessEmail) &&
    isValidPhone(phoneNumber) &&
    isValidPassword(password) &&
    password === confirmPassword;

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate());
  };

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({
      businessName: true,
      businessEmail: true,
      phoneNumber: true,
      password: true,
      confirmPassword: true,
    });
    const newErrors = validate();
    setErrors(newErrors);
    const hasError = Object.values(newErrors).some(Boolean);
    if (!hasError) router.push("/auth/verify-email");
  };

  return (
    <AuthLayout>
      <div className="w-full">
        <div className="mt-8 md:mt-10 lg:mt-12 mb-8">
          <h1 className="text-xl  lg:text-[29px] font-semibold text-heading">
            Create your Account
          </h1>
          <p className="text-xs lg:text-sm text-body">
            Please fill in your details to create an account
          </p>
        </div>

        <form
          className="w-full max-w-xl space-y-4"
          onSubmit={handleSignUp}
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="business-name">Business Name</Label>
            <div className="relative flex justify-between">
              <Input
                id="business-name"
                placeholder="e.g Power House"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                onBlur={() => handleBlur("businessName")}
                className={
                  errors.businessName && touched.businessName
                    ? "border !border-danger"
                    : ""
                }
              />
              <RiBriefcase4Line className="absolute right-3 top-1/2 -translate-y-1/2 text-gray5" />
            </div>
            {errors.businessName && touched.businessName && (
              <p className="text-xs text-danger mt-1">{errors.businessName}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="business-email">Business Email</Label>
            <div className="relative flex justify-between">
              <Input
                id="business-email"
                type="email"
                placeholder="e.g johndoe@email.com"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                onBlur={() => handleBlur("businessEmail")}
                className={
                  errors.businessEmail && touched.businessEmail
                    ? "border !border-danger"
                    : ""
                }
              />
              <HiOutlineMail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray5" />
            </div>
            {errors.businessEmail && touched.businessEmail && (
              <p className="text-xs text-danger mt-1">{errors.businessEmail}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone-number">Phone Number</Label>
            <div className="relative flex justify-between">
              <Input
                id="phone-number"
                type="tel"
                placeholder="e.g 0123456789"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                onBlur={() => handleBlur("phoneNumber")}
                className={
                  errors.phoneNumber && touched.phoneNumber
                    ? "border !border-danger"
                    : ""
                }
              />
              <FiPhone className="absolute right-3 top-1/2 -translate-y-1/2 text-gray5" />
            </div>
            {errors.phoneNumber && touched.phoneNumber && (
              <p className="text-xs text-danger mt-1">{errors.phoneNumber}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative flex justify-between">
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur("password")}
                className={
                  errors.password && touched.password
                    ? "border !border-danger"
                    : ""
                }
              />
              <MdOutlineLock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray5" />
            </div>
            {errors.password && touched.password && (
              <p className="text-xs text-danger mt-1">{errors.password}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <div className="relative flex justify-between">
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => handleBlur("confirmPassword")}
                className={
                  errors.confirmPassword && touched.confirmPassword
                    ? "border !border-danger"
                    : ""
                }
              />
              <MdOutlineLock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray5" />
            </div>
            {errors.confirmPassword && touched.confirmPassword && (
              <p className="text-xs text-danger mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>
          <Button disabled={!isFormValid}>Continue</Button>
          <Button
            variant="outline"
            className="flex w-full items-center justify-center gap-2"
            type="button"
          >
            <FcGoogle /> Sign in with Google
          </Button>
          <div className="w-fit mx-auto flex justify-center items-center text-body md:text-sm pt-4 text-xs border rounded-sm py-2 px-4 mt-2">
            Already have an account?
            <Link
              href="/auth/sign-in"
              className="text-primary hover:underline ml-2 font-semibold"
            >
              Sign In
            </Link>
          </div>
          <p className="text-center text-body md:text-sm pt-4 text-xs">
            By Signing up, you agree to the
            <Link href="/policy" className="hover:underline ml-2 font-semibold">
              Terms of Use{" "}
            </Link>
            and Privacy Policy of
            <Link href="/policy" className="hover:underline ml-2 font-semibold">
              SharePro
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
