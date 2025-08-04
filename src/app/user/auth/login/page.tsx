"use client";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FiPhone } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { MdOutlineVisibilityOff, MdOutlineVisibility } from "react-icons/md";
import Link from "next/link";
import Image from "next/image";

import TopRightLeftSection from "../../../../../public/assets/auth/top-right-left-section.svg";
import BottomLeftLeftSection from "../../../../../public/assets/auth/bottom-left-left-section.svg";

const login = () => {
  const [tab, setTab] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [errors, setErrors] = useState({ email: "", phone: "", password: "" });
  const [touched, setTouched] = useState({
    email: false,
    phone: false,
    password: false,
  });
  const [generalError, setGeneralError] = useState("");

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone: string) => /^[0-9]{8,15}$/.test(phone);

  // Only enable if (email && password) or (phone && password)
  const canContinue =
    tab === "email"
      ? email.trim() && password.trim()
      : phone.trim() && password.trim();

  const validate = () => {
    if (tab === "email") {
      return {
        email: isValidEmail(email) ? "" : "Enter a valid email",
        phone: "",
        password: password ? "" : "Password is required",
      };
    } else {
      return {
        email: "",
        phone: isValidPhone(phone) ? "" : "Enter a valid phone number",
        password: password ? "" : "Password is required",
      };
    }
  };

  const handleBlur = (field: "email" | "phone" | "password") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate());
  };

  const handleChange = (
    field: "email" | "phone" | "password",
    value: string
  ) => {
    if (field === "email") setEmail(value);
    if (field === "phone") setPhone(value);
    if (field === "password") setPassword(value);
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {};

  return (
    <div>
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
      <div className="md:w-[30%] p-4 mx-auto mt-12 md:mt-16">
        <h2 className="text-[29px] text-center font-semibold mb-1 text-heading">
          Welcome back!
        </h2>
        <p className="text-sm text-center text-body mb-8">
          Sign in to continue sharing and tracking your campaign rewards.{" "}
        </p>

        {/* Pill Toggle */}
        <div className="flex justify-between mb-6 rounded-[15px] border border-gray6 p-1 w-full ">
          <button
            className={cn(
              "px-5 py-2 rounded-[15px] text-sm  transition-all",
              tab === "email"
                ? "bg-[#ECF3FF] text-primary rounded-[15px] font-medium"
                : "text-body"
            )}
            onClick={() => setTab("email")}
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
            onClick={() => setTab("phone")}
            type="button"
          >
            Phone Number
          </button>
        </div>

        <form
          className="w-full max-w-xl space-y-4 "
          onSubmit={handleSubmit}
          noValidate
        >
          {generalError && (
            <p className="text-danger text-sm text-center font-medium">
              {generalError}
            </p>
          )}
          {tab === "email" ? (
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative flex justify-between">
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g johndoe@email.com"
                  value={email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={
                    errors.email && touched.email ? "border !border-danger" : ""
                  }
                />
                <HiOutlineMail
                  size={20}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray5"
                />
              </div>
              {errors.email && touched.email && (
                <p className="text-xs text-danger mt-1">{errors.email}</p>
              )}
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
                  onChange={(e) => handleChange("phone", e.target.value)}
                  onBlur={() => handleBlur("phone")}
                  className={
                    errors.phone && touched.phone ? "border !border-danger" : ""
                  }
                />
                <FiPhone className="absolute right-3 top-1/2 -translate-y-1/2 text-gray5" />
              </div>
              {errors.phone && touched.phone && (
                <p className="text-xs text-danger mt-1">{errors.phone}</p>
              )}
            </div>
          )}

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative flex justify-between">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                className={
                  errors.password && touched.password
                    ? "border !border-danger"
                    : ""
                }
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 cursor-pointer -translate-y-1/2 text-gray5 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <MdOutlineVisibilityOff />
                ) : (
                  <MdOutlineVisibility />
                )}
              </button>
            </div>
            {errors.password && touched.password && (
              <p className="text-xs text-danger mt-1">{errors.password}</p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end mb-1">
            <Link
              href="/auth/forgot-password"
              className="text-primary hover:underline text-sm font-medium"
            >
              Forgot password?
            </Link>
          </div>

          {/* <Button
            className="w-full"
            type="submit"
            disabled={!canContinue || loadingEmail || loadingPhone}
          >
            {loadingEmail || loadingPhone ? "Signing in..." : "Continue"}
          </Button> */}
          <Button
            variant="outline"
            className="flex w-full items-center justify-center gap-2"
            type="button"
          >
            <FcGoogle /> Sign in with Google
          </Button>
        </form>

        {/* Footer Links */}
        <div className="flex w-full max-w-xl mx-auto justify-start text-sm mt-4">
          <span>Don&apos;t have an account?&nbsp;</span>
          <Link
            href="/user/auth/signup"
            className="text-primary font-semibold hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
      <Image
        src={BottomLeftLeftSection}
        alt=""
        width={30}
        height={30}
        className="pointer-events-none absolute left-0 bottom-0 z-0 object-cover"
      />
    </div>
  );
};

export default login;
