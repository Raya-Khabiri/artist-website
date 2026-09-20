import type { ReactNode } from "react";

import StudioGuard from "@/components/studio/StudioGuard";

type StudioLayoutProps = {
  children: ReactNode;
};

export default function StudioLayout({ children }: StudioLayoutProps) {
  return <StudioGuard>{children}</StudioGuard>;
}
