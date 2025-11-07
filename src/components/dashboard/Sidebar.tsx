"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AlertCircleIcon, DollarSignIcon } from "lucide-react";

import Image from "next/image";
import Logo from "/assets/logo.svg";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Megaphone,
  PieChart,
  Wallet,
  Users,
  Bell,
  Settings,
  CreditCard,
  User,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { useState } from "react";

type LogoutMutationResponse = {
  logout: {
    message: string;
    success: boolean;
  };
};
import { hr } from "@uiw/react-md-editor";
import { FaUserGroup } from "react-icons/fa6";

const links = [
  { label: "Dashboard", href: "/business/dashboard", icon: LayoutDashboard },
  { label: "Campaigns", href: "/business/campaigns", icon: Megaphone },
  { label: "Analytics", href: "/business/analytics", icon: PieChart },
  { label: "Wallet", href: "/business/wallets", icon: Wallet },
  { label: "Payout", href: "/business/payout", icon: DollarSignIcon },

  { label: "Customers & Referrers", href: "/business/customers", icon: Users },
  { label: "Notifications", href: "/business/notifications", icon: Bell },
  { label: "Settings", href: "/business/settings", icon: Settings },
  {
    label: "Billings & Subscriptions",
    href: "/business/billings",
    icon: CreditCard,
  },
  { label: "Account", href: "/business/account", icon: User },
  { label: "Help & Support", href: "/business/support", icon: HelpCircle },
  // { label: "Logout", href: "/auth/sign-in", icon: LogOut },
];

const userLinks = [
  { label: "Dashboard", href: "/user/dashboard", icon: LayoutDashboard },
  { label: "Campaigns", href: "/user/campaigns", icon: Megaphone },
  { label: "My Rewards", href: "/user/rewards", icon: Wallet },
  { label: "Account", href: "/user/account", icon: User },
  { label: "Help & Support", href: "/user/support", icon: HelpCircle },
  // { label: "Logout", href: "/user/auth/login", icon: LogOut },
];

const adminLinks = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Business", href: "/admin/business", icon: Megaphone },
  { label: "Customers", href: "/admin/customers", icon: Wallet },
  // { label: "User Management", href: "/admin/user-management", icon: Users },
  { label: 'System Permissions', href: '/admin/system-permissions', icon: FaUserGroup },
  { label: 'Knowledge Base', href: '/admin/knowledge-base', icon: HelpCircle },
  { label: "Account", href: "/admin/account", icon: User },
];

export default function Sidebar({
  open,
  user,
}: {
  open: boolean;
  user?: Boolean | undefined;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [show, setShow] = useState(false);

  const handleLogout = async () => {
    try {
      const { LOGOUT } = await import("@/apollo/mutations/account");
      const { useMutation } = await import("@apollo/client/react");
      const [logout] = useMutation<LogoutMutationResponse>(LOGOUT);
      const result = await logout();
      const logoutData = result?.data?.logout;
      if (logoutData?.success) {
        localStorage.clear();
        if (pathname.startsWith("/user")) {
          router.push("/user/auth/login");
        } else {
          router.push("/auth/sign-in");
        }
      } else {
        alert(logoutData?.message || "Logout failed.");
      }
    } catch (error) {
      alert("Logout failed.");
    }
  };

  return (
    <aside
      className={cn(
        "flex flex-col fixed top-24 left-1/2 md:left-6 z-20 transform -translate-x-1/2 md:translate-x-0 mx-auto",
        "bg-white border border-gray-200 rounded-2xl shadow-sm h-[80vh] w-[95vw] max-w-sm md:w-64 transition-all px-2 py-1",
        !open && "hidden"
      )}
    >
      <nav className="flex-1 overflow-y-auto pt-4 pb-4 hide-scrollbar">
        <ul className="space-y-2">
          {(pathname.startsWith("/user") ? userLinks : pathname.startsWith("/admin") ? adminLinks : links).map((item) => {
            const Icon = item.icon;
            let active = false;
            if (item.href === "/") {
              active = pathname === "/";
            } else if (item.href.startsWith("/business/") || item.href.startsWith("/user/") || item.href.startsWith("/admin/")) {
              // Unify logic for business and user routes
              const pathSeg = pathname.split("/")[2];
              const linkSeg = item.href.split("/")[2];
              active = pathSeg === linkSeg;
            } else {
              active = pathname === item.href;
            }
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-[#83859C] hover:bg-[#F1F3F9]",
                    active && "bg-primary text-[#fff] font-semibold"
                  )}
                >
                  <Icon className={cn("w-5 h-5", active && "text-white")} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
          <li
            className={cn(
              "flex items-center gap-3 cursor-pointer rounded-md px-3 py-2.5 text-sm text-[#83859C] hover:bg-[#F1F3F9]"
            )}
            onClick={() => setShow(true)}
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </li>
        </ul>

        <Dialog open={show} onOpenChange={() => setShow(false)}>
          <DialogContent className="text-center py-10">
            <div className="flex justify-center mb-2">
              <AlertCircleIcon
                color="#E7302B"
                className="w-12 h-12 text-white"
              />
            </div>
            <h2 className="text-lg font-semibold">You’re about to logout!</h2>
            <p>Are you sure you want to logout?</p>
            <div className="flex justify-center gap-4">
              <button
                className="p-3 px-8 rounded-md bg-[#E7302B] text-white"
                onClick={handleLogout}
              >
                Logout
              </button>
              <button
                className="p-3 px-8 rounded-md bg-gray-600 text-white"
                onClick={() => setShow(false)}
              >
                Cancel
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </nav>
    </aside>
  );
}
