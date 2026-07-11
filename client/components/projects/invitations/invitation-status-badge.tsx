"use client";

import { Badge } from "@/components/ui/badge";
import { Clock3, CheckCircle2, XCircle } from "lucide-react";

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
          variant="secondary"
          className="border-yellow-200 bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
        >
          <Clock3 className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      );

    case "ACCEPTED":
      return (
        <Badge className="border-green-200 bg-green-100 text-green-700 hover:bg-green-100">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Accepted
        </Badge>
      );

    case "DECLINED":
      return (
        <Badge
          variant="destructive"
          className="border-red-200 bg-red-100 text-red-700 hover:bg-red-100"
        >
          <XCircle className="mr-1 h-3 w-3" />
          Declined
        </Badge>
      );

    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
}
