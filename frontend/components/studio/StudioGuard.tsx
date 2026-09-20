"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useAuth } from "@/components/auth/AuthProvider";

type StudioGuardProps = {
  children: ReactNode;
};

export default function StudioGuard({ children }: StudioGuardProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!user) {
      router.replace("/login?next=/studio");
      return;
    }

    if (!user.is_staff) {
      router.replace("/");
    }
  }, [isLoading, router, user]);

  if (isLoading) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#f4f1eb]
          text-[#171717]
        "
      >
        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.35em]
            text-black/45
          "
        >
          Checking access…
        </p>
      </main>
    );
  }

  if (!user || !user.is_staff) {
    return null;
  }

  return children;
}
