"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { useAppSelector } from "@/redux/hooks";
import { useDispatch } from "react-redux";

import { userOnline, userOffline } from "@/redux/slices/socketSlice";

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    socket.connect();

    socket.on("connect", () => {
      socket.emit("join", user.id);
    });

    socket.on("user-online", (userId: string) => {
      dispatch(userOnline(userId));
    });

    socket.on("user-offline", (userId: string) => {
      dispatch(userOffline(userId));
    });

    return () => {
      socket.off("connect");
      socket.off("user-online");
      socket.off("user-offline");

      socket.disconnect();
    };
  }, [dispatch, isAuthenticated, user]);

  return <>{children}</>;
}
