"use client";

import { Facebook, Twitter, Instagram } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";

const MicroSite = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;

  // Generate signup URL with query parameters
  const getSignupUrl = () => {
    const campaignId = searchParams.get('cid');
    const source = searchParams.get('src');
    
    let signupUrl = '/user/auth/signup';
    const params = new URLSearchParams();
    params.append("ref", slug)

    if (campaignId) {
      params.append('cid', campaignId);
    }
    if (source) {
      params.append('src', source);
    }
    
    if (params.toString()) {
      signupUrl += `?${params.toString()}`;
    }
    
    return signupUrl;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img src="/assets/logo.svg" alt="Logo" />
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a
                href="#"
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                How It Works
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Features
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Pricing
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                About
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Help & Support
              </a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link href="/user/auth/login">
                <button className="text-gray-700 hover:text-gray-900 font-medium">
                  Login
                </button>
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
            <h3 className="text-3xl font-bold text-primary mb-12">
              How It Works
            </h3>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              {/* Step 1 */}
              <div className="text-center border border-[#0000001A] p-4 rounded-sm">
                <img
                  src="/assets/icons/step-1.svg"
                  className="w-16 h-16 mx-auto mb-6"
                  alt=""
                />
                <h4 className="text-lg font-medium text-gray-900 mb-3">
                  Sign Up
                </h4>
                <p className="text-gray-600 text-sm">
                  Create an account on SharePro to access campaigns on your
                  dashboard
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center border border-[#0000001A] p-4 rounded-sm">
                <img
                  src="/assets/icons/step-2.svg"
                  className="w-16 h-16 mx-auto mb-6"
                  alt=""
                />
                <h4 className="text-lg font-medium text-gray-900 mb-3">
                  Join in a Campaign
                </h4>
                <p className="text-gray-600 text-sm">
                  Join a loyalty, referral or combo campaign on sharepro
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center border border-[#0000001A] p-4 rounded-sm">
                <img
                  src="/assets/icons/step-3.svg"
                  className="w-16 h-16 mx-auto mb-6"
                  alt=""
                />
                <h4 className="text-lg font-medium text-gray-900 mb-3">
                  Earn Rewards
                </h4>
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
            <p className="text-xl mb-8 opacity-90">
              Monitor and claim rewards at any time.
            </p>
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
              <img src="/assets/logo.svg" alt="Logo" className="w-32 mb-2" />
              <p className="text-gray-600 max-w-xs">
                Built to help businesses grow through smart loyalty and
                referrals.
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
              {/* </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <LinkedIn size={20} />
              </a> */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MicroSite;
