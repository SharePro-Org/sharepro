'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Logo from '/assets/logo.svg';
import { cn } from '@/lib/utils';
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
} from 'lucide-react';

const links = [
  { label: 'Dashboard', href: '/business/dashboard', icon: LayoutDashboard },
  { label: 'Campaigns', href: '/business/campaigns', icon: Megaphone },
  { label: 'Analytics', href: '/business/analytics', icon: PieChart },
  { label: 'Wallets & Payouts', href: '/business/wallets', icon: Wallet },
  { label: 'Customers & Referrers', href: '/business/customers', icon: Users },
  { label: 'Notifications', href: '/business/notifications', icon: Bell },
  { label: 'Settings', href: '/business/settings', icon: Settings },
  { label: 'Billings & Subscriptions', href: '/business/billings', icon: CreditCard },
  { label: 'Account', href: '/business/account', icon: User },
  { label: 'Help & Support', href: '/business/support', icon: HelpCircle },
  { label: 'Logout', href: '/logout', icon: LogOut },
];


export default function Sidebar({ open }: { open: boolean }) {
  const pathname = usePathname();
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
          {links.map((item) => {
            const Icon = item.icon;
            let active = false;
            if (item.href === '/') {
              active = pathname === '/';
            } else if (item.href.startsWith('/business/')) {
              // Get the first segment after /business/
              const pathSeg = pathname.split('/')[2];
              const linkSeg = item.href.split('/')[2];
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
        </ul>
      </nav>
    </aside>
  );
}
