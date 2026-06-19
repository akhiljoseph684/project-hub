"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

export default function GuestRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticated, user } = useAppSelector(
    (state) => state.auth
  );

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!isAuthenticated) return;

    if (!user) return;

    if (
      !user.isVerified &&
      pathname !== "/verify-otp"
    ) {
      router.replace(
        `/verify-otp?email=${user.email}`
      );
      return;
    }

    if (
      user.isVerified &&
      pathname !== "/home"
    ) {
      router.replace("/home");
    }
  }, [
    mounted,
    isAuthenticated,
    user,
    pathname,
    router,
  ]);

  if (!mounted) {
    return null;
  }

  if (isAuthenticated && user) {
    return null;
  }

  return <>{children}</>;
}