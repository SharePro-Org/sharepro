
import { Metadata } from 'next';
import './globals.css';
import type { ReactNode } from 'react';
import Providers from "./Providers";


export const metadata: Metadata = {
  title: "Sharepro - Referral & Loyalty Program",
  description: "Boost your business with Sharepro's referral and loyalty program management platform.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
