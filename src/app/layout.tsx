
import { Metadata } from 'next';
import './globals.css';
import type { ReactNode } from 'react';
import Providers from "./Providers";


export const metadata: Metadata = {
  metadataBase: new URL("https://app.mysharepro.com"),
  title: "SharePro - Referral & Loyalty Program",
  description: "Boost your business with SharePro's referral and loyalty program management platform.",
  openGraph: {
    type: "website",
    url: "https://app.mysharepro.com",
    siteName: "SharePro",
    title: "SharePro - Referral & Loyalty Program",
    description: "Boost your business with SharePro's referral and loyalty program management platform.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SharePro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SharePro - Referral & Loyalty Program",
    description: "Boost your business with SharePro's referral and loyalty program management platform.",
    images: ["/og-image.png"],
  },
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
