import type { Metadata } from "next";

import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Your Account",
  description: "Private EAMORA customer account and conversations.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
};

type AccountLayoutProps = {
  children: ReactNode;
};

export default function AccountLayout({ children }: AccountLayoutProps) {
  return children;
}
