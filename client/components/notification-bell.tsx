"use client";

import Link from "next/link";
import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/redux/hooks";

export default function NotificationBell() {
  const invitationCount = useAppSelector(
    (state) => state.notification.invitationCount,
  );

  return (
    <Link href="/invitations">
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />

        {invitationCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
            {invitationCount > 99 ? "99+" : invitationCount}
          </span>
        )}
      </Button>
    </Link>
  );
}
