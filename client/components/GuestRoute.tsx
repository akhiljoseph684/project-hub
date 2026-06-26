"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

export default function GuestRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { isAuthenticated, loading } =
    useAppSelector((state) => state.auth);

  useEffect(() => {
    if (loading) return;

    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return null;
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}