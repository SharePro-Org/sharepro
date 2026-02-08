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
import {
  MdOutlineLock,
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
} from "react-icons/md";
import Link from "next/link";
import { useMutation } from "@apollo/client/react";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { useSetAtom } from "jotai";
import { userAtom } from "@/store/User";

import { REGISTER, GOOGLE_AUTH } from "@/apollo/mutations/auth";

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone: string) => /^[0-9]{8,15}$/.test(phone);
const isValidPassword = (password: string) => password.length >= 6;

type GoogleAuthResponse = {
  googleAuth?: {
    success: boolean;
    token: string;
    refreshToken: string;
    isNewUser: boolean;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      phone: string;
      businessName: string;
      profile: { userType: string };
      business: { id: string; onBoardingComplete: boolean };
    };
    message: string;
  };
};

export default function BusinessSignUp() {
  const router = useRouter();
  const [register, { loading }] = useMutation(REGISTER);
  const [googleAuth, { loading: loadingGoogle }] = useMutation(GOOGLE_AUTH);
  const setUser = useSetAtom(userAtom);
  const [generalError, setGeneralError] = useState("");

  const handleGoogleSuccess = async (tokenResponse: { access_token: string }) => {
    setGeneralError("");
    try {
      const { data } = await googleAuth({
        variables: { accessToken: tokenResponse.access_token, isSignup: true },
      }) as { data: GoogleAuthResponse };
      if (data?.googleAuth?.success) {
        const user = data.googleAuth.user;
        const onBoardingComplete = user?.business?.onBoardingComplete;
        const userData = {
          accessToken: data.googleAuth.token,
          refreshToken: data.googleAuth.refreshToken,
          userId: user?.id,
          email: user?.email,
          businessName: user?.businessName,
          businessId: user?.business?.id,
          phone: user?.phone,
          userType: user?.profile?.userType,
          onBoardingComplete,
          firstName: user?.firstName,
          lastName: user?.lastName,
        };
        localStorage.setItem("userData", JSON.stringify(userData));
        setUser(userData);

        if (data.googleAuth.isNewUser) {
          router.push("/onboarding");
        } else if (userData.userType === "ADMIN") {
          router.push("/admin/dashboard");
        } else if (userData.userType === "VIEWER") {
          router.push("/user/dashboard");
        } else {
          router.push(onBoardingComplete ? "/business/dashboard" : "/onboarding");
        }
      } else {
        setGeneralError(data?.googleAuth?.message || "Google sign-up failed");
      }
    } catch (err: any) {
      setGeneralError(err.message || "Google sign-up failed");
    }
  };

 

  // State for each field
  const [businessName, setBusinessName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({
      businessName: true,
      businessEmail: true,
      phoneNumber: true,
      password: true,
      confirmPassword: true,
    });
    setGeneralError("");
    const newErrors = validate();
    setErrors(newErrors);
    const hasError = Object.values(newErrors).some(Boolean);
    if (hasError) return;
    try {
      const { data } = await register({
        variables: {
          input: {
            email: businessEmail,
            phone: phoneNumber,
            businessName,
            password,
          },
        },
      }) as { data: { register?: { success?: boolean; message?: string } } };

      if (data?.register?.success) {
        router.push(
          `/auth/verify-email?email=${encodeURIComponent(businessEmail)}`
        );
      } else {
        setGeneralError(data?.register?.message || "Registration failed");
      }
    } catch (err: any) {
      setGeneralError(err.message || "Registration failed");
    }
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
          {generalError && (
            <p className="text-danger text-sm text-center font-medium">
              {generalError}
            </p>
          )}
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
                type={showPassword ? "text" : "password"}
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
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <div className="relative flex justify-between">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
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
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 cursor-pointer -translate-y-1/2 text-gray5 focus:outline-none"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <MdOutlineVisibilityOff />
                ) : (
                  <MdOutlineVisibility />
                )}
              </button>
            </div>
            {errors.confirmPassword && touched.confirmPassword && (
              <p className="text-xs text-danger mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>
          <Button disabled={!isFormValid || loading}>
            {loading ? "Signing up..." : "Continue"}
          </Button>
          <GoogleLoginButton
            onSuccess={handleGoogleSuccess}
            onError={() => setGeneralError("Google sign-up was cancelled")}
            loading={loadingGoogle}
            label="Sign up with Google"
            loadingLabel="Signing up..."
          />
          <div className="w-fit flex text-body md:text-sm pt-4 text-xs py-2 mt-2">
            Already have an account?
            <Link
              href="/auth/sign-in"
              className="text-primary hover:underline ml-2 font-semibold"
            >
              Sign In
            </Link>
          </div>
          <p className=" text-body md:text-sm pt-4 text-xs">
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
