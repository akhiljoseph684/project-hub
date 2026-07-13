"use client";

import { Badge } from "@/components/ui/badge";

interface InvitationStatusBadgeProps {
  status: "PENDING" | "ACCEPTED" | "DECLINED";
}

export default function InvitationStatusBadge({
  status,
}: InvitationStatusBadgeProps) {
  switch (status) {
    case "PENDING":
      return (
        <Badge
          variant="outline"
          className="border-yellow-500 bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400"
        >
          Pending
        </Badge>
      );

    case "ACCEPTED":
      return (
        <Badge
          variant="outline"
          className="border-green-500 bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
        >
          Accepted
        </Badge>
      );

    case "DECLINED":
      return (
        <Badge
          variant="outline"
          className="border-red-500 bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
        >
          Declined
        </Badge>
      );

    default:
      return null;
  }
}
