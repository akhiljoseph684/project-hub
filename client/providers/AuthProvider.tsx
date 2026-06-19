"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setAuth, logout } from "@/redux/slices/authSlice";
import api from "@/lib/axios";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
  console.log("AuthProvider Mounted");

  const fetchMe = async () => {
    console.log("Calling /auth/me");

    try {
      const res = await api.get("/auth/me", {
        withCredentials: true,
      });

      console.log("Auth Success");

      dispatch(
        setAuth({
          user: res.data.user,
          accessToken: res.data.accessToken,
        })
      );
    } catch {
      console.log("Auth Failed");
      dispatch(logout());
    }
  };

  fetchMe();
}, [dispatch]);

  return <>{children}</>;
}