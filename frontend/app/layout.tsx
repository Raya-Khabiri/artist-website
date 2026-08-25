import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import SitePreloader from "@/components/layout/SitePreloader";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "EAMORA | Contemporary Artist",
    template: "%s | EAMORA",
  },

  description:
    "Explore EAMORA's original artworks, selected collections and prints. Art preserving memory, emotion and fleeting moments.",

  applicationName: "EAMORA",

  keywords: [
    "EAMORA",
    "contemporary artist",
    "original artwork",
    "fine art",
    "art prints",
    "London artist",
    "online art gallery",
  ],

  authors: [
    {
      name: "EAMORA",
    },
  ],

  creator: "EAMORA",
  publisher: "EAMORA",

  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    siteName: "EAMORA",
    title: "EAMORA | Contemporary Artist",
    description:
      "Explore original artworks, selected collections and prints by EAMORA.",
    images: [
      {
        url: "/images/eamora-hero.jpg",
        width: 1512,
        height: 1080,
        alt: "Featured EAMORA artwork",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "EAMORA | Contemporary Artist",
    description:
      "Explore original artworks, selected collections and prints by EAMORA.",
    images: ["/images/eamora-hero.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`
        ${geistSans.variable}
        ${geistMono.variable}
        h-full
        antialiased
      `}
    >
      <body className="flex min-h-full flex-col">
        <SitePreloader />

        {children}
      </body>
    </html>
  );
}
