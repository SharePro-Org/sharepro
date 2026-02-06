"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_CAMPAIGN_BY_REFERRAL_CODE } from "@/apollo/queries/campaigns";
import { TRACK_REFERRAL_CLICK } from "@/apollo/mutations/campaigns";
import { Facebook, Twitter, Instagram } from "lucide-react";
import Link from "next/link";

interface Campaign {
  id: string;
  name: string;
  description: string;
  websiteLink: string;
  referralCode: string;
  referralLink: string;
  campaignType: string;
  status: string;
  isActive: boolean;
  business: {
    id: string;
    name: string;
  };
}

interface CampaignByReferralCodeData {
  campaignByReferralCode: Campaign;
}

interface TrackReferralClickData {
  trackReferralClick: {
    success: boolean;
    message: string;
    campaignId: string;
  };
}

const ReferralPageComp = () => {
  const params = useParams();
  const router = useRouter();

  // Handle both 2 and 3 segment URLs
  const referralPathArray = Array.isArray(params.referralPath)
    ? params.referralPath
    : [params.referralPath];

  const businessId = params.businessId as string;
  const campaignReferralCode = referralPathArray[0] as string;
  const userReferralCode = referralPathArray[1] as string | undefined;

  // Determine if this is a 2-segment (microsite) or 3-segment (redirect) URL
  const shouldRedirect = referralPathArray.length >= 2 && userReferralCode;

  const [redirecting, setRedirecting] = useState(shouldRedirect);

  // Fetch campaign details
  const { data, loading, error } = useQuery<CampaignByReferralCodeData>(
    GET_CAMPAIGN_BY_REFERRAL_CODE,
    {
      variables: { referralCode: campaignReferralCode },
      skip: !campaignReferralCode,
    }
  );

  // Track referral click mutation
  const [trackReferralClick] = useMutation<TrackReferralClickData>(TRACK_REFERRAL_CLICK);

  // Handle redirect for 3-segment URLs
  useEffect(() => {
    if (shouldRedirect && !loading && data?.campaignByReferralCode) {
      const campaign = data.campaignByReferralCode;

      if (campaign.websiteLink) {
        // Store referral info in sessionStorage
        sessionStorage.setItem('referralCode', userReferralCode);
        sessionStorage.setItem('campaignId', campaign.id);
        sessionStorage.setItem('businessId', campaign.business.id);

        // Track the click with user's referral code
        trackReferralClick({
          variables: {
            referralCode: userReferralCode,
            userAgent: navigator.userAgent,
            referrerUrl: document.referrer || window.location.href,
          },
        }).catch((err) => {
          console.error('Failed to track referral click:', err);
        });

        // Redirect to campaign website
        setTimeout(() => {
          window.location.href = campaign.websiteLink;
        }, 300);
      } else {
        setRedirecting(false);
      }
    } else if (shouldRedirect && error) {
      setRedirecting(false);
    }
  }, [shouldRedirect, data, loading, error, userReferralCode, trackReferralClick]);

  // Show loading state for redirect
  if (shouldRedirect && (loading || (redirecting && data?.campaignByReferralCode?.websiteLink))) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Redirecting to Campaign...
          </h2>
          <p className="text-gray-500">Please wait while we redirect you to the business website</p>
        </div>
      </div>
    );
  }

  // Show error for redirect URLs
  if (shouldRedirect && (error || !data?.campaignByReferralCode)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Campaign Not Found</h2>
          <p className="text-gray-600 mb-4">
            The referral link you clicked is invalid or the campaign may have expired.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-primary text-white px-6 py-3 rounded-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  // Show error for no website link
  if (shouldRedirect && data?.campaignByReferralCode && !data.campaignByReferralCode.websiteLink) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-yellow-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Website Configured</h2>
          <p className="text-gray-600 mb-2">
            The campaign <strong>{data.campaignByReferralCode.name}</strong> doesn't have a website
            link configured yet.
          </p>
          <p className="text-gray-500 text-sm mb-4">
            Please contact the business owner to set up the campaign website.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-primary text-white px-6 py-3 rounded-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  // For 2-segment URLs, show the microsite landing page
  const referralCode = campaignReferralCode;

  const getSignupUrl = () => {
    const queryParams = new URLSearchParams();
    queryParams.append("ref", referralCode);
    queryParams.append("businessId", businessId);
    return `/user/auth/signup?${queryParams.toString()}`;
  };

  const getLoginUrl = () => {
    const queryParams = new URLSearchParams();
    queryParams.append("ref", referralCode);
    queryParams.append("businessId", businessId);
    return `/user/auth/login?${queryParams.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img src="/assets/logo-white.svg" className="w-32" alt="Logo" />
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
                How It Works
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
                Features
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
                Pricing
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
                About
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
                Help & Support
              </a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link href={getLoginUrl()}>
                <button className="text-gray-700 hover:text-gray-900 font-medium">Login</button>
              </Link>
              <Link href={getSignupUrl()}>
                <button className="bg-primary text-white px-4 py-2 rounded-sm font-medium">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="microsite-hero" className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-primary">Buy More, Refer Friends,</span>
            <br />
            <span className="text-secondary">Earn Amazing Rewards.</span>
          </h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Join our referral and loyalty programmes to participate and win.
          </p>
          <Link href={getSignupUrl()}>
            <button className="bg-primary text-white px-10 py-3 rounded-sm font-medium text-lg">
              Get Started
            </button>
          </Link>
        </div>
      </section>

      {/* Purple Section */}
      <section className="bg-[#1009ECA1] py-16">
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Get 20% off when you refer a friend
          </h2>

          {/* How It Works Card */}
          <div className="bg-white rounded-2xl p-8 md:p-12 mt-12">
            <h3 className="text-3xl font-bold text-primary mb-12">How It Works</h3>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              {/* Step 1 */}
              <div className="text-center border border-[#0000001A] p-4 rounded-sm">
                <img src="/assets/icons/step-1.svg" className="w-16 h-16 mx-auto mb-6" alt="" />
                <h4 className="text-lg font-medium text-gray-900 mb-3">Sign Up</h4>
                <p className="text-gray-600 text-sm">
                  Create an account on SharePro to access campaigns on your dashboard
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center border border-[#0000001A] p-4 rounded-sm">
                <img src="/assets/icons/step-2.svg" className="w-16 h-16 mx-auto mb-6" alt="" />
                <h4 className="text-lg font-medium text-gray-900 mb-3">Join in a Campaign</h4>
                <p className="text-gray-600 text-sm">
                  Join a loyalty, referral or combo campaign on sharepro
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center border border-[#0000001A] p-4 rounded-sm">
                <img src="/assets/icons/step-3.svg" className="w-16 h-16 mx-auto mb-6" alt="" />
                <h4 className="text-lg font-medium text-gray-900 mb-3">Earn Rewards</h4>
                <p className="text-gray-600 text-sm">
                  Earn amazing rewards for participating in campaigns.
                </p>
              </div>
            </div>

            <Link href={getSignupUrl()}>
              <button className="bg-primary text-white px-16 py-3 rounded-sm font-medium text-lg mt-12">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div
            id="microsite-cta"
            className="bg-secondary rounded-3xl p-8 md:p-16 text-center text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Sign up to access your own <br /> unique dashboard
            </h2>
            <p className="text-xl mb-8 opacity-90">Monitor and claim rewards at any time.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={getSignupUrl()}>
                <button className="bg-white w-52 text-purple-600 py-3 rounded-sm font-medium text-lg hover:bg-gray-100 transition-colors">
                  Sign Up
                </button>
              </Link>
              <Link href="/user/auth/login">
                <button className="border-2 w-52 border-white text-white py-3 rounded-sm font-medium text-lg hover:bg-white hover:text-purple-600 transition-colors">
                  Explore Campaigns
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#ECF3FF] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            {/* Logo and Tagline */}
            <div className="mb-6 md:mb-0">
              <img src="/assets/logo-white.svg" alt="Logo" className="w-32 mb-2" />
              <p className="text-gray-600 max-w-xs">
                Built to help businesses grow through smart loyalty and referrals.
              </p>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-wrap gap-6 md:gap-8">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                How It Works
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Features
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Pricing
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                About
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Help & Support
              </a>
            </nav>
          </div>

          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2025 SharePro. All rights reserved.
            </p>

            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const ReferralPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      }
    >
      <ReferralPageComp />
    </Suspense>
  );
};

export default ReferralPage;
