'use client';
import Image from 'next/image';
import Logo from '../../../public/assets/logo.svg';
import {  Bell, Sun, Moon, Search } from 'lucide-react';
import Avatar from '../../../public/assets/Avatar.svg';
import { RiMenu2Line } from "react-icons/ri";

interface NavbarProps {
  onToggleSidebar: () => void;
  darkMode: boolean;
  toggleDark: () => void;
}

export default function Navbar({ onToggleSidebar, darkMode, toggleDark }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 w-full bg-white border-b border-gray-200 shadow-sm z-40 h-[72px] flex items-center">
      {/* Logo and Menu Button */}
      <div className="flex items-center gap-3 min-w-[230px] px-8">
        <div className="ml-2">
          <Image src={Logo} alt="logo" width={110} height={21} />
        </div>
        
      </div>

      {/* Search Bar */}
      <div className="flex-1 flex gap-2 items-center ml-12">
        <button
          className="flex items-center justify-center w-12 h-12 rounded-md border border-gray-200 hover:bg-gray-50 transition"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
         <RiMenu2Line className="w-5 h-5 text-[#83859C]" />
        </button>
        <div className="relative w-full max-w-[430px] flex items-center">
          <input
            type="text"
            placeholder="Search or type command..."
            className="w-full rounded-md bg-[#F7F9FB] border border-gray-200 pl-10 pr-16 py-3 text-[15px] shadow-none focus:ring-2 focus:ring-[#233E97] focus:border-[#233E97] transition"
          />
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#83859C]" />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 rounded border border-gray-200 text-xs text-[#83859C] bg-white font-medium select-none">
            ⌘ K
          </span>
        </div>
      </div>

      {/* Actions: Theme, Bell, Profile */}
      <div className="flex items-center gap-3 min-w-[230px] px-8 justify-end">
        <button
          onClick={toggleDark}
          aria-label="Toggle theme"
          className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 hover:bg-gray-50 transition"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-[#83859C]" />
          ) : (
            <Moon className="w-5 h-5 text-[#83859C]" />
          )}
        </button>
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
          <span className="text-sm font-medium text-[#233E97]">Emirhan Boruch</span>
          <svg width="14" height="8" fill="none" viewBox="0 0 14 8" className="ml-1">
            <path d="M1 1l6 6 6-6" stroke="#83859C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </header>
  );
}
