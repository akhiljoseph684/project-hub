"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

export default function VerifyOtpRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { isAuthenticated, user, loading } =
    useAppSelector((state) => state.auth);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (user?.isVerified) {
      router.replace("/dashboard");
    }
  }, [
    loading,
    isAuthenticated,
    user,
    router,
  ]);

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  

  if (user?.isVerified) {
    return null;
  }

  return <>{children}</>;
}