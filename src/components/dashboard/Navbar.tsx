"use client";
import Image from "next/image";
import Logo from "../../../public/assets/logo-white.svg";
import { Bell, Sun, Moon, Search } from "lucide-react";
import Avatar from "../../../public/assets/Avatar.svg";
import { RiMenu2Line } from "react-icons/ri";
import { userAtom } from "@/store/User";
import { useAtom } from "jotai";

interface NavbarProps {
  onToggleSidebar: () => void;
  darkMode: boolean;
  toggleDark: () => void;
}

export default function Navbar({
  onToggleSidebar,
  darkMode,
  toggleDark,
}: NavbarProps) {
  const [user] = useAtom(userAtom);

  return (
    <header className="fixed top-0 left-0 right-0 w-full bg-white border-b border-gray-200 shadow-sm z-40 h-[72px] flex items-center px-2 sm:px-4">
      {/* Logo and Menu Button */}
      <div className="flex items-center gap-3 min-w-[120px] sm:min-w-[180px] md:min-w-[230px] px-2 sm:px-4">
        <div className="ml-1 sm:ml-2">
          <Image
            src={Logo}
            alt="logo"
            width={90}
            height={18}
            className="sm:w-[110px] sm:h-[21px] w-[90px] h-[18px]"
          />
        </div>
      </div>

      {/* Search Bar & Menu Button */}
      <div className="flex-1 flex gap-2 items-center ml-2 sm:ml-6 md:ml-12">
        {/* Sidebar toggle always visible */}
        <button
          className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-md border border-gray-200 hover:bg-gray-50 transition"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <RiMenu2Line className="w-5 h-5 text-[#83859C]" />
        </button>
        {/* Search hidden on mobile */}
        <div className="hidden sm:flex relative w-full max-w-[200px] sm:max-w-[320px] md:max-w-[430px] items-center">
          <input
            type="text"
            placeholder="Search"
            className="w-full rounded-md bg-[#F7F9FB] border border-gray-200 pl-10 pr-12 sm:pr-16 py-2 sm:py-3 text-[14px] sm:text-[15px] shadow-none focus:ring-2 focus:ring-[#233E97] focus:border-[#233E97] transition"
          />
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#83859C]" />
          {/* <span className="hidden sm:inline absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 rounded border border-gray-200 text-xs text-[#83859C] bg-white font-medium select-none">
            ⌘ K
          </span> */}
        </div>
      </div>

      {/* Actions: Theme, Bell, Profile */}
      <div className="hidden md:flex items-center gap-3 min-w-[120px] sm:min-w-[180px] md:min-w-[230px] px-2 sm:px-4 justify-end">
        {/* <button
          onClick={toggleDark}
          aria-label="Toggle theme"
          className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 hover:bg-gray-50 transition"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-[#83859C]" />
          ) : (
            <Moon className="w-5 h-5 text-[#83859C]" />
          )}
        </button> */}
        <button
          aria-label="Notifications"
          className="relative flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 hover:bg-gray-50 transition"
        >
          <Bell className="w-5 h-5 text-[#83859C]" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#F89C1F]"></span>
        </button>
        {/* Profile section (could be replaced by Image/avatar) */}
        <div className="flex items-center gap-2 ml-3">
          <Image
            src={Avatar}
            width={32}
            height={32}
            alt="avatar"
            className="rounded-full border border-gray-200"
          />
          <span className="text-sm font-medium text-[#233E97]">
            {user?.businessName}
          </span>
          {/* <svg width="14" height="8" fill="none" viewBox="0 0 14 8" className="ml-1">
            <path d="M1 1l6 6 6-6" stroke="#83859C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg> */}
        </div>
      </div>
      {/* Mobile profile/actions */}
      <div className="flex md:hidden items-center gap-2 px-2">
        {/* <button
          onClick={toggleDark}
          aria-label="Toggle theme"
          className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 hover:bg-gray-50 transition"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-[#83859C]" />
          ) : (
            <Moon className="w-5 h-5 text-[#83859C]" />
          )}
        </button> */}
        <button
          aria-label="Notifications"
          className="relative flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 hover:bg-gray-50 transition"
        >
          <Bell className="w-5 h-5 text-[#83859C]" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#F89C1F]"></span>
        </button>
        <Image
          src={Avatar}
          width={28}
          height={28}
          alt="avatar"
          className="rounded-full border border-gray-200"
        />
      </div>
    </header>
  );
}
