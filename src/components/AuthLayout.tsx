import type { ReactNode } from "react";
import Link from 'next/link';
import Image from 'next/image';
import Logo from '../../public/assets/logo-white.svg';


import AuthIllustration from '../../public/assets/auth/auth-illustration.svg';
import TopRightLeftSection from '../../public/assets/auth/top-right-left-section.svg';
import BottomLeftLeftSection from '../../public/assets/auth/bottom-left-left-section.svg';
import BottomRightSection from '../../public/assets/auth/bottom-right-section.svg';


export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row overflow-hidden">
      {/* LEFT PANEL */}
      <div className="relative flex flex-col md:w-1/2 h-screen bg-white">
        {/* Logo always visible */}
        <div className="shrink-0 p-8 px-8 md:px-16 lg:px-24 ">
          <Link href="/" className="flex items-center gap-2">
            <Image src={Logo} alt="logo" width={110} height={21} />
          </Link>
        </div>
        <Image
          src={TopRightLeftSection}
          alt=""
          width={35}
          height={35}
          className="pointer-events-none absolute right-6 top-0 z-0 object-cover"
        />
        {/* Scrollable form/content */}
        <div className="flex-1 min-h-0 overflow-y-auto px-8 md:px-16 lg:px-24 pb-8 relative hide-scrollbar">
          {children}
        </div>
        <Image
          src={BottomLeftLeftSection}
          alt=""
          width={30}
          height={30}
          className="pointer-events-none absolute left-0 bottom-0 z-0 object-cover"
        />
      </div>

      {/* RIGHT PANEL */}
      <div className="relative hidden md:flex flex-col justify-center items-center md:w-1/2 bg-[#ECF3FF4D]">
        <div className="relative flex flex-col items-center justify-center text-center w-full px-8">
          <p
            className="mb-4 lg:text-[40px] md:text-2xl font-bold"
            style={{
              background: 'linear-gradient(270deg, #605BFF 0%, #233E97 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
            }}
          >
            Turn your customers into loyal  promoters.
          </p>
          <p className="lg:text-base md:text-sm text-body">
            Reward your customers every time they share <br /> and refer others to your business.
          </p>
          <Image
            src={AuthIllustration}
            alt="Authentication illustration"
            width={296} 
            height={208}
            className="mt-8"
          />
        </div>
        <Image
          src={BottomRightSection}
          alt=""
          className="pointer-events-none absolute right-0 bottom-0 object-cover w-full"
        />
      </div>
    </div>
  );
}
