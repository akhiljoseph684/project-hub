"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import {
  acceptProjectInvitation,
  declineProjectInvitation,
} from "@/services/project.service";

import { showErrorToast, showSuccessToast } from "@/lib/toast";

interface InvitationActionsProps {
  invitation: {
    id: string;
    status: "PENDING" | "ACCEPTED" | "DECLINED";
  };

  onRefresh?: () => void;
}

export default function InvitationActions({
  invitation,
  onRefresh,
}: InvitationActionsProps) {
  const [loading, setLoading] = useState(false);

  async function handleAccept() {
    try {
      setLoading(true);

      await acceptProjectInvitation(invitation.id);

      showSuccessToast("Invitation accepted successfully.");

      onRefresh?.();
    } catch (error: any) {
      showErrorToast(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDecline() {
    try {
      setLoading(true);

      await declineProjectInvitation(invitation.id);

      showSuccessToast("Invitation declined.");

      onRefresh?.();
    } catch (error: any) {
      showErrorToast(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (invitation.status !== "PENDING") {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" disabled={loading} onClick={handleDecline}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Decline"}
      </Button>

      <Button disabled={loading} onClick={handleAccept}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Accept"}
      </Button>
    </div>
  );
}
