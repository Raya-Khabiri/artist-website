import type { Metadata } from "next";
import type { ReactNode } from "react";

import Navbar from "@/components/layout/Navbar";
import StudioGuard from "@/components/studio/StudioGuard";

export const metadata: Metadata = {
  title: "Artist Studio",
  description: "Private EAMORA artist management area.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
};

type StudioLayoutProps = {
  children: ReactNode;
};

export default function StudioLayout({ children }: StudioLayoutProps) {
  return (
    <StudioGuard>
      <Navbar />

      <div className="pt-20">{children}</div>
    </StudioGuard>
  );
}
