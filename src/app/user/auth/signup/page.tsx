"use client";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, Suspense } from "react";
import { FiPhone } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { MdOutlineVisibilityOff, MdOutlineVisibility } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { useMutation, useQuery } from "@apollo/client/react";

import { REGISTER_USER, TRACK_CONVERSION, GOOGLE_AUTH } from "@/apollo/mutations/auth";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { useSetAtom } from "jotai";
import { userAtom } from "@/store/User";

import TopRightLeftSection from "../../../../../public/assets/auth/top-right-left-section.svg";
import BottomLeftLeftSection from "../../../../../public/assets/auth/bottom-left-left-section.svg";
import { BUSINESS } from "@/apollo/queries/admin";

const SignupComp = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [registerUser, { loading }] = useMutation(REGISTER_USER);
  const [trackConversion] = useMutation(TRACK_CONVERSION);
  const [googleAuthMutation, { loading: loadingGoogle }] = useMutation(GOOGLE_AUTH);
  const setUser = useSetAtom(userAtom);


  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Extract referral information from URL
  const [referralData, setReferralData] = useState({
    referralCode: null as string | null,
    campaignId: null as string | null,
    source: null as string | null,
    businessId: null as string | null,
  });

  useEffect(() => {
    // Extract query parameters
    const campaignId = searchParams.get("cid");
    const source = searchParams.get("src");
    const businessId = searchParams.get("businessId");

    // Extract referral code from slug (stored in localStorage or query param as fallback)
    let referralCode = searchParams.get("ref"); // fallback to query param

    // Check if referral code was stored from slug route
    const storedSlugData = localStorage.getItem("slugReferralCode");
    if (storedSlugData) {
      try {
        const parsed = JSON.parse(storedSlugData);
        // Use stored referral code if it's less than 24 hours old
        if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
          referralCode = parsed.referralCode;
        } else {
          // Clean up expired data
          localStorage.removeItem("slugReferralCode");
        }
      } catch (error) {
        console.error("Error parsing stored slug referral code:", error);
        localStorage.removeItem("slugReferralCode");
      }
    }

    // Track page visit analytics immediately
    const trackPageVisit = async () => {
      const pageVisitProperties = {
        page: "registration_page",
        hasReferralCode: !!referralCode,
        campaignId: campaignId || null,
        source: source || "direct",
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        referralSource: storedSlugData ? "slug" : "query_param",
      };

      // Track registration page visit
      if (campaignId && referralCode) {
        try {
          await trackConversion({
            variables: {
              campaignId,
              referralCode,
              properties: JSON.stringify({
                eventType: "registration_page_visit",
                ...pageVisitProperties,
              }),
            },
          });
        } catch (error) {
          console.error("Page visit tracking failed:", error);
        }
      }
    };

    trackPageVisit();

    // Set referral data state
    setReferralData({
      referralCode,
      campaignId,
      source,
      businessId,
    });
  }, [searchParams, trackConversion]);

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

  const handleGoogleSuccess = async (tokenResponse: { access_token: string }) => {
    setGeneralError("");
    try {
      const { data } = await googleAuthMutation({
        variables: {
          accessToken: tokenResponse.access_token,
          isSignup: true,
          referralCode: referralData.referralCode,
          businessId: referralData.businessId,
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

        // Track conversion if referral data exists
        if (referralData.campaignId && referralData.referralCode) {
          try {
            await trackConversion({
              variables: {
                campaignId: referralData.campaignId,
                referralCode: referralData.referralCode,
                properties: JSON.stringify({
                  eventType: "registration_conversion",
                  conversionType: "google_oauth_registration",
                  userEmail: user?.email,
                  userId: user?.id,
                  timestamp: new Date().toISOString(),
                  source: referralData.source,
                }),
              },
            });
          } catch (conversionError) {
            console.error("Conversion tracking failed:", conversionError);
          }
        }

        const redirect = searchParams.get("redirect");
        if (redirect) {
          // Navigate to dashboard with redirect param to auto-open external site
          router.push(`/user/dashboard?redirect=${encodeURIComponent(redirect)}`);
        } else if (userData.userType === "ADMIN") {
          router.push("/admin/dashboard");
        } else if (userData.userType === "VIEWER") {
          router.push("/user/dashboard");
        } else {
          router.push("/business/dashboard");
        }
      } else {
        setGeneralError(data?.googleAuth?.message || "Google sign-up failed");
      }
    } catch (err: any) {
      setGeneralError(err.message || "Google sign-up failed");
    }
  };

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
    const newErrors = validate();
    setErrors(newErrors);
    const hasError = Object.values(newErrors).some(Boolean);

    if (hasError) return;

    // Track registration attempt analytics
    const trackRegistrationAttempt = async () => {
      const attemptProperties = {
        eventType: "registration_attempt",
        email,
        firstName,
        lastName,
        hasReferral: !!referralData.referralCode,
        source: referralData.source || "direct",
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      };

      if (referralData.campaignId && referralData.referralCode) {
        try {
          await trackConversion({
            variables: {
              campaignId: referralData.campaignId,
              referralCode: referralData.referralCode,
              properties: JSON.stringify(attemptProperties),
            },
          });
        } catch (error) {
          console.error("Registration attempt tracking failed:", error);
        }
      }
    };

    await trackRegistrationAttempt();

    try {
      // Track registration attempt analytics
      const registrationProperties = {
        source: referralData.source || "direct",
        hasReferral: !!referralData.referralCode,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      };

      const { data } = await registerUser({
        variables: {
          input: {
            firstName,
            lastName,
            email,
            phoneNumber: phone,
            password,
            referralCode: referralData.referralCode,
            userReferralCode: searchParams.get("userRef"),
          },
        },
      }) as {
        data: {
          registerUserByCode?: {
            success?: boolean;
            user?: { id?: string };
            message?: string;
          };
        };
      };

      if (data?.registerUserByCode?.success) {
        // Track registration success analytics
        const trackRegistrationSuccess = async () => {
          const successProperties = {
            eventType: "registration_success",
            userId: data.registerUserByCode?.user?.id,
            userEmail: email,
            firstName,
            lastName,
            hasReferral: !!referralData.referralCode,
            source: referralData.source || "direct",
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
          };

          if (referralData.campaignId && referralData.referralCode) {
            try {
              await trackConversion({
                variables: {
                  campaignId: referralData.campaignId,
                  referralCode: referralData.referralCode,
                  properties: JSON.stringify(successProperties),
                },
              });
            } catch (error) {
              console.error("Registration success tracking failed:", error);
            }
          }
        };

        await trackRegistrationSuccess();

        // Track conversion if this is a referral signup
        if (referralData.campaignId && referralData.referralCode) {
          try {
            await trackConversion({
              variables: {
                campaignId: referralData.campaignId,
                referralCode: referralData.referralCode,
                properties: JSON.stringify({
                  eventType: "registration_conversion",
                  conversionType: "registration",
                  userEmail: email,
                  firstName,
                  lastName,
                  userId: data.registerUserByCode.user?.id,
                  timestamp: new Date().toISOString(),
                  source: referralData.source,
                }),
              },
            });

            // Show success message for referral conversion
            // alert("Registration successful! Referral reward processed.");
          } catch (conversionError) {
            console.error("Conversion tracking failed:", conversionError);
            // Don't fail the registration for conversion tracking errors
            // alert("Registration successful!");
          }
        } else {
          // alert("Registration successful!");
        }

        // Redirect to verify email page (pass redirect param if present)
        const redirect = searchParams.get("redirect");
        const verifyUrl = `/user/auth/verify-email?email=${encodeURIComponent(email)}${redirect ? `&redirect=${encodeURIComponent(redirect)}` : ""}`;
        router.push(verifyUrl);
        // router.push("/user/auth/login");
      } else {
        // Track registration failure analytics
        const trackRegistrationFailure = async () => {
          const failureProperties = {
            eventType: "registration_failure",
            email,
            firstName,
            lastName,
            errorMessage:
              data?.registerUserByCode?.message || "Registration failed",
            hasReferral: !!referralData.referralCode,
            source: referralData.source || "direct",
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
          };

          if (referralData.campaignId && referralData.referralCode) {
            try {
              await trackConversion({
                variables: {
                  campaignId: referralData.campaignId,
                  referralCode: referralData.referralCode,
                  properties: JSON.stringify(failureProperties),
                },
              });
            } catch (error) {
              console.error("Registration failure tracking failed:", error);
            }
          }
        };

        await trackRegistrationFailure();
        setGeneralError(
          data?.registerUserByCode?.message || "Registration failed"
        );
      }
    } catch (err: any) {
      console.error("Registration error:", err);

      // Track registration failure analytics for network/server errors
      const trackRegistrationError = async () => {
        const errorProperties = {
          eventType: "registration_failure",
          email,
          firstName,
          lastName,
          errorMessage: err.message || "Registration failed",
          errorType: "network_error",
          hasReferral: !!referralData.referralCode,
          source: referralData.source || "direct",
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        };

        if (referralData.campaignId && referralData.referralCode) {
          try {
            await trackConversion({
              variables: {
                campaignId: referralData.campaignId,
                referralCode: referralData.referralCode,
                properties: JSON.stringify(errorProperties),
              },
            });
          } catch (error) {
            console.error("Registration error tracking failed:", error);
          }
        }
      };

      await trackRegistrationError();
      setGeneralError(err.message || "Registration failed");
    }
  };

  const {
    data: userData,
    error: userError,
  } = useQuery<any>(BUSINESS, {
    variables: { id: referralData.businessId },
    skip: !referralData.businessId,
  });

  console.log("Fetched business data:", userData, userError);


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
        <p className="text-sm text-center text-body mb-8">
          {referralData.referralCode
            ? "You've been invited! Complete your registration to claim your reward."
            : "Create your account and start earning rewards today."}
        </p>

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
            disabled={!isFormValid || loading || loadingGoogle}
          >
            {loading ? "Signing up..." : "Create Account and Claim Reward"}
          </Button>
          <GoogleLoginButton
            onSuccess={handleGoogleSuccess}
            onError={() => setGeneralError("Google sign-up was cancelled or failed")}
            loading={loadingGoogle}
            label="Sign up with Google"
            loadingLabel="Signing up..."
          />
        </form>

        {/* Footer Links */}
        <div className="flex w-full max-w-xl mx-auto justify-start text-sm mt-4">
          <span>Already have an account?&nbsp;</span>
          <Link
            href={`/user/auth/login${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
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

const signup = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupComp />
    </Suspense>
  );
};
export default signup;
