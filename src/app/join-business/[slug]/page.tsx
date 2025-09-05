"use client";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, Suspense } from "react";
import { FcGoogle } from "react-icons/fc";
import { FiPhone } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { MdOutlineVisibilityOff, MdOutlineVisibility } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { useMutation } from "@apollo/client/react";

import { REGISTER_INVITED_MEMBER } from "@/apollo/mutations/account";

import TopRightLeftSection from "../../../../public/assets/auth/top-right-left-section.svg";
import BottomLeftLeftSection from "../../../../public/assets/auth/bottom-left-left-section.svg";

const SignupComp = () => {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registerInvitedMember] = useMutation(REGISTER_INVITED_MEMBER);

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    password: false,
  });
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone: string) => /^[0-9]{8,15}$/.test(phone);
  const isValidName = (name: string) => name.trim().length >= 2;
  const isValidPassword = (password: string) => password.length >= 6;

  const validate = () => {
    return {
      firstName: isValidName(firstName)
        ? ""
        : "First name must be at least 2 characters",
      lastName: isValidName(lastName)
        ? ""
        : "Last name must be at least 2 characters",
      email: isValidEmail(email) ? "" : "Enter a valid email",
      phone: isValidPhone(phone) ? "" : "Enter a valid phone number",
      password: isValidPassword(password)
        ? ""
        : "Password must be at least 6 characters",
    };
  };

  const isFormValid =
    isValidName(firstName) &&
    isValidName(lastName) &&
    isValidEmail(email) &&
    isValidPhone(phone) &&
    isValidPassword(password);

  const handleBlur = (
    field: "firstName" | "lastName" | "email" | "phone" | "password"
  ) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate());
  };

  const handleChange = (
    field: "firstName" | "lastName" | "email" | "phone" | "password",
    value: string
  ) => {
    if (field === "firstName") setFirstName(value);
    if (field === "lastName") setLastName(value);
    if (field === "email") setEmail(value);
    if (field === "phone") setPhone(value);
    if (field === "password") setPassword(value);
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      password: true,
    });
    setGeneralError("");
    setSuccessMessage("");
    if (!isFormValid) return;
    setLoading(true);
    try {
      const response = await registerInvitedMember({
        variables: {
          input: {
            email,
            firstName,
            lastName,
            phone,
            password,
            businessId: slug,
          },
        },
      });
      const result = response.data?.registerInvitedMember;
      if (result?.success) {
        setSuccessMessage(result.message || "Account created!");
        router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);

        // setFirstName("");
        // setLastName("");
        // setEmail("");
        // setPhone("");
        // setPassword("");
      } else {
        setGeneralError(
          result?.message || result?.errors?.[0] || "Failed to register."
        );
      }
    } catch (err: any) {
      setGeneralError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="p-4">
        <img className="w-32" src="/assets/logo-white.svg" alt="" />
      </div>
      <Image
        src={TopRightLeftSection}
        alt=""
        width={35}
        height={35}
        className="pointer-events-none absolute lg:block hidden  right-6 top-0 z-0 object-cover"
      />
      <div className="max-w-xl p-4 mx-auto mt-12 md:mt-16">
        <h2 className="text-[29px] text-center font-semibold mb-1 text-heading">
          Join SharePro & Start Earning Rewards
        </h2>

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
          {successMessage && (
            <p className="text-success text-sm text-center font-medium">
              {successMessage}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <div className="relative flex justify-between">
                <Input
                  id="firstName"
                  type="text"
                  placeholder="e.g John"
                  value={firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  onBlur={() => handleBlur("firstName")}
                  className={
                    errors.firstName && touched.firstName
                      ? "border !border-danger"
                      : ""
                  }
                />
                <FiUser className="absolute right-3 top-1/2 -translate-y-1/2 text-gray5" />
              </div>
              {errors.firstName && touched.firstName && (
                <p className="text-xs text-danger mt-1">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <div className="relative flex justify-between">
                <Input
                  id="lastName"
                  type="text"
                  placeholder="e.g Doe"
                  value={lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  onBlur={() => handleBlur("lastName")}
                  className={
                    errors.lastName && touched.lastName
                      ? "border !border-danger"
                      : ""
                  }
                />
                <FiUser className="absolute right-3 top-1/2 -translate-y-1/2 text-gray5" />
              </div>
              {errors.lastName && touched.lastName && (
                <p className="text-xs text-danger mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

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

          <Button
            className="w-full"
            type="submit"
            disabled={!isFormValid || loading}
          >
            {loading ? "Signing up..." : "Create Account"}
          </Button>
          <Button
            variant="outline"
            className="flex w-full items-center justify-center gap-2"
            type="button"
          >
            <FcGoogle /> Sign up with Google
          </Button>
        </form>

        {/* Footer Links */}
        <div className="flex w-full max-w-xl mx-auto justify-start text-sm mt-4">
          <span>Already have an account?&nbsp;</span>
          <Link
            href="/user/auth/login"
            className="text-primary font-semibold hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
      <Image
        src={BottomLeftLeftSection}
        alt=""
        width={30}
        height={30}
        className="pointer-events-none absolute lg:block hidden  left-0 bottom-0 z-0 object-cover"
      />
    </>
  );
};

const joinBusiness = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupComp />
    </Suspense>
  );
};

export default joinBusiness;
