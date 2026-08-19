"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { socket } from "@/lib/socket";
import { useAppSelector } from "@/redux/hooks";
import { setOnlineUsers } from "@/redux/slices/socketSlice";

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();

  const { user } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (!user) {
      socket.disconnect();
      dispatch(setOnlineUsers({}));
      return;
    }

    socket.connect();

    const handleConnect = () => {

      socket.emit("user:online", user.id);
    };

    const handleOnlineUsers = (
      users: Record<string, string>,
    ) => {

      dispatch(setOnlineUsers(users));
    };

    socket.on("connect", handleConnect);

    socket.on("online-users", handleOnlineUsers);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("online-users", handleOnlineUsers);

      socket.disconnect();
    };
  }, [dispatch, user]);

  return <>{children}</>;
}