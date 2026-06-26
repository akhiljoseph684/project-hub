"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { user, isAuthenticated, loading } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace("/login");
    }


    if (user && !user.isVerified) {
      router.replace(`/verify-otp?email=${user.email}`);
      return;
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
