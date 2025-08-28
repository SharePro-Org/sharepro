// 'use client';
// import { ReactNode, useEffect, useState } from 'react';
// import Navbar from './Navbar';
// import Sidebar from './Sidebar';

// export default function DashboardLayout({ children }: { children: ReactNode }) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       if (window.innerWidth >= 768) {
//         setSidebarOpen(true);
//       }
//       const stored = localStorage.getItem('theme');
//       if (stored === 'dark') setDarkMode(true);
//     }
//   }, []);

//   useEffect(() => {
//     if (darkMode) {
//       document.documentElement.classList.add('dark');
//       localStorage.setItem('theme', 'dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//       localStorage.setItem('theme', 'light');
//     }
//   }, [darkMode]);

//   return (
//     <div className="min-h-screen bg-[#F7F9FB] flex flex-col">
//       <Navbar
//         onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
//         darkMode={darkMode}
//         toggleDark={() => setDarkMode(!darkMode)}
//       />
//       <div className="flex flex-1">
//         <Sidebar open={sidebarOpen} />
//         <main className="flex-1 p-8 md:p-10 max-w-[calc(100vw-270px)]">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }

"use client";
import { ReactNode, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
  user,
}: {
  children: ReactNode;
  user?: Boolean;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Redirect if userData is not in localStorage
      const userData = localStorage.getItem("userData");
      if (!userData) {
        if (pathname.startsWith("/user")) {
          window.location.replace("/user/auth/login");
        } else {
          window.location.replace("/auth/sign-in");
        }
        return;
      }
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      }
      const stored = localStorage.getItem("theme");
      if (stored === "dark") setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      {/* Fixed Navbar */}
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        darkMode={darkMode}
        toggleDark={() => setDarkMode(!darkMode)}
      />
      {/* Fixed Sidebar */}
      <Sidebar open={sidebarOpen} user={user} />

      {/* Main Content Area (scrollable) */}
      <div
        className={`${sidebarOpen ? "md:pl-[280px]" : ""}
          pt-[42px] transition-all
          min-h-screen
        `}
        // Sidebar width: 224px + 2*16px (ml-6, px-2, border) ≈ 256px
        // Navbar height: py-4 (16px), px-8, font size ≈ 76px
      >
        <div className="mt-14 px-4 md:px-4 lg:px-4 max-w-full">{children}</div>
      </div>
    </div>
  );
}
