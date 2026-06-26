"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setAuth, logout, setLoading } from "@/redux/slices/authSlice";
import api from "@/lib/axios";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get("/auth/me", {
          withCredentials: true,
        });

        console.log(res.data.user);

        dispatch(
          setAuth({
            user: res.data.user,
            accessToken: res.data.accessToken,
          }),
        );
      } catch {
        dispatch(logout());
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchMe();
  }, [dispatch]);

  return <>{children}</>;
}
