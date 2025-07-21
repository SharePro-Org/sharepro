"use client";
import type { ReactNode } from "react";
import Logo from '../../../public/assets/logo-black.svg';
import Image from "next/image";
import { cn } from "@/lib/utils";

const steps = [
  { label: "Business Info" },
  { label: "Contact & Location Info" },
  // { label: "Branding" },
  // { label: "Subscription Plan" },
];

const SIDEBAR_WIDTH = 271;

interface OnboardingLayoutProps {
  children: ReactNode;
  stepIndex: number;
}

export default function OnboardingLayout({ children, stepIndex }: OnboardingLayoutProps) {
  return (
    <div>
      {/* Fixed Sidebar */}
      <aside
        className="hidden md:flex flex-col bg-primary px-8 py-6"
        style={{
          width: SIDEBAR_WIDTH,
          minHeight: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 20,
        }}
      >
        <div className="mb-14 pl-2">
          <Image src={Logo} alt="logo" width={110} height={21} />
        </div>
        <div className="relative mt-2">
          <div
            className="absolute left-2 top-[12px] w-1"
            style={{
              height: `${38 * (stepIndex + 1)}px`,
              background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.12) 100%)",
              borderRadius: "6px",
            }}
          />
          <ul className="flex flex-col gap- relative z-10">
            {steps.map((step, idx) => {
              const isActive = idx === stepIndex;
              const isCompleted = idx < stepIndex;
              const isFuture = idx > stepIndex;
              return (
                <li key={step.label} className="flex items-center relative h-[52px] ml-2">
                  <div
                    className={cn(
                      "w-1 h-[18px] rounded-xl bg-white transition-all mr-2",
                      isActive || isCompleted
                        ? "opacity-100"
                        : "opacity-20"
                    )}
                  />
                  <span
                    className={cn(
                      "transition-all text-base select-none",
                      isActive
                        ? "text-white font-medium"
                        : isCompleted
                        ? "text-white"
                        : "text-white/40"
                    )}
                  >
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      {/* Main Content (scrollable) */}
      <main
        className="flex-1 flex justify-center items-start py-10 md:py-16 bg-[#F7F9FB] overflow-y-auto hide-scrollbar md:ml-[271px]"
        style={{
          minHeight: "100vh",
          maxHeight: "100vh",
        }}
      >
        <div className="w-full max-w-4xl">{children}</div>
      </main>
    </div>
  );
}
