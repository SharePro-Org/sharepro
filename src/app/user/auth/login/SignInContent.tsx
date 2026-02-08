"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HiOutlineMail } from "react-icons/hi";
import { FiPhone } from "react-icons/fi";
import Image from "next/image";

import {
  MdOutlineLock,
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
} from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { cn } from "@/lib/utils";
import { useMutation } from "@apollo/client/react";

import { LOGIN, LOGIN_PHONE, GOOGLE_AUTH } from "@/apollo/mutations/auth";
import { useGoogleLogin } from "@react-oauth/google";
import { useSetAtom } from "jotai";
import { userAtom } from "@/store/User";

import TopRightLeftSection from "../../../../../public/assets/auth/top-right-left-section.svg";
import BottomLeftLeftSection from "../../../../../public/assets/auth/bottom-left-left-section.svg";

export default function SignInContent() {
  useEffect(() => {
    localStorage.removeItem("userData");
  }, []);

  const router = useRouter();
  const searchParams = useSearchParams();

  const [tab, setTab] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);

  useEffect(() => {
    // Extract referral parameters from URL
    const ref = searchParams.get("ref");
    const bid = searchParams.get("businessId");
    setReferralCode(ref);
    setBusinessId(bid);
  }, [searchParams]);

  // Validation state
  const [errors, setErrors] = useState({ email: "", phone: "", password: "" });
  const [touched, setTouched] = useState({
    email: false,
    phone: false,
    password: false,
  });
  const [generalError, setGeneralError] = useState("");
  const [login, { loading: loadingEmail }] = useMutation(LOGIN);
  const [loginPhone, { loading: loadingPhone }] = useMutation(LOGIN_PHONE);
  const [googleAuthMutation, { loading: loadingGoogle }] = useMutation(GOOGLE_AUTH);
  const setUser = useSetAtom(userAtom);

  type GoogleAuthResponse = {
    googleAuth?: {
      success: boolean;
      token: string;
      refreshToken: string;
      message?: string;
      isNewUser?: boolean;
      user?: {
        id: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        businessName?: string;
        business?: { id: string; onBoardingComplete?: boolean };
        profile?: { userType?: string };
      };
    };
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGeneralError("");
      try {
        const { data } = await googleAuthMutation({
          variables: {
            accessToken: tokenResponse.access_token,
            isSignup: false,
            referralCode: referralCode,
            businessId: businessId,
            userRefCode: searchParams.get("userRef"),
          },
        }) as { data: GoogleAuthResponse };

        if (data?.googleAuth?.success) {
          const user = data.googleAuth.user;
          const userData = {
            accessToken: data.googleAuth.token,
            refreshToken: data.googleAuth.refreshToken,
            userId: user?.id,
            email: user?.email,
            phone: user?.phone,
            businessName: user?.businessName,
            firstName: user?.firstName,
            lastName: user?.lastName,
            businessId: user?.business?.id,
            userType: user?.profile?.userType,
          };
          localStorage.setItem("userData", JSON.stringify(userData));
          setUser(userData);

          const redirect = searchParams.get("redirect");
          if (redirect) {
            window.location.href = redirect;
          } else if (userData.userType === "ADMIN") {
            router.push("/admin/dashboard");
          } else if (userData.userType === "VIEWER") {
            router.push("/user/dashboard");
          } else {
            router.push("/business/dashboard");
          }
        } else {
          setGeneralError(data?.googleAuth?.message || "Google sign-in failed");
        }
      } catch (err: any) {
        setGeneralError(err.message || "Google sign-in failed");
      }
    },
    onError: () => {
      setGeneralError("Google sign-in was cancelled or failed");
    },
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, phone: true, password: true });
    setGeneralError("");
    const newErrors = validate();
    setErrors(newErrors);
    const hasError = Object.values(newErrors).some(Boolean);
    if (hasError || !canContinue) return;
    try {
      type LoginResponse = {
        login?: {
          success: boolean;
          token: string;
          refreshToken: string;
          message?: string;
          user?: {
            id: string;
            firstName?: string;
            lastName?: string;
            email?: string;
            phone?: string;
            businessName?: string;
            business?: { id: string };
            profile?: { userType?: string };
          };
        };
      };

      type LoginPhoneResponse = {
        loginPhone?: {
          success: boolean;
          token: string;
          refreshToken: string;
          message?: string;
          user?: {
            id: string;
            email?: string;
            phone?: string;
            firstName?: string;
            lastName?: string;
            businessName?: string;
            business?: { id: string };
            profile?: { userType?: string };
          };
        };
      };

      if (tab === "email") {
        const { data } = await login({
          variables: {
            email,
            password,
            referralCode,
            businessId,
            userRefCode: searchParams.get("userRef"),
          }
        }) as { data: LoginResponse };
        if (data?.login?.success) {
          const user = data.login.user;

          const userData = {
            accessToken: data.login.token,
            refreshToken: data.login.refreshToken,
            userId: user?.id,
            email: user?.email || email,
            phone: user?.phone || phone,
            businessName: user?.businessName,
            firstName: user?.firstName,
            lastName: user?.lastName,
            businessId: user?.business?.id,
            userType: user?.profile?.userType,

          };

          localStorage.setItem("userData", JSON.stringify(userData));
          setUser(userData);

          const redirect = searchParams.get("redirect");
          if (redirect) {
            window.location.href = redirect;
          } else if (userData.userType === "ADMIN") {
            router.push("/admin/dashboard");
          } else if (userData.userType === "VIEWER") {
            router.push("/user/dashboard");
          } else {
            router.push("/business/dashboard");
          }
        } else {
          setGeneralError(data?.login?.message || "Invalid credentials");
        }
      } else {
        const { data } = await loginPhone({
          variables: {
            phone,
            password,
            referralCode,
            businessId,
            userRefCode: searchParams.get("userRef"),
          }
        }) as { data: LoginPhoneResponse };
        if (data?.loginPhone?.success) {
          const user = data.loginPhone.user;

          const userData = {
            accessToken: data.loginPhone.token,
            refreshToken: data.loginPhone.refreshToken,
            userId: user?.id,
            email: user?.email,
            phone: user?.phone || phone,
            businessName: user?.businessName,
            businessId: user?.business?.id,
            userType: user?.profile?.userType,
            firstName: user?.firstName,
            lastName: user?.lastName,
          };
          localStorage.setItem("userData", JSON.stringify(userData));
          setUser(userData);

          const redirect = searchParams.get("redirect");
          if (redirect) {
            window.location.href = redirect;
          } else if (userData.userType === "ADMIN") {
            router.push("/admin/dashboard");
          } else if (userData.userType === "VIEWER") {
            router.push("/user/dashboard");
          } else {
            router.push("/business/dashboard");
          }
        } else {
          setGeneralError(data?.loginPhone?.message || "Invalid credentials");
        }
      }
    } catch (err: any) {
      setGeneralError(err.message || "Login failed");
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
        className="pointer-events-none absolute  lg:block hidden right-6 top-0 z-0 object-cover"
      />
      <div className="w-full p-4 mx-auto max-w-xl mt-12 md:mt-16">
        <h2 className="text-[29px] text-center font-semibold mb-1 text-heading">
          Welcome back!
        </h2>
        <p className="text-sm text-center text-body mb-8">
          Sign in to continue sharing and tracking your campaign rewards.
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

          <Button
            className="w-full"
            type="submit"
            disabled={!canContinue || loadingEmail || loadingPhone || loadingGoogle}
          >
            {loadingEmail || loadingPhone ? "Signing in..." : "Continue"}
          </Button>
          <Button
            variant="outline"
            className="flex w-full items-center justify-center gap-2"
            type="button"
            onClick={() => googleLogin()}
            disabled={loadingGoogle}
          >
            <FcGoogle /> {loadingGoogle ? "Signing in..." : "Sign in with Google"}
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
        className="pointer-events-none absolute lg:block hidden left-0 bottom-0 z-0 object-cover"
      />
    </>
  );
}
