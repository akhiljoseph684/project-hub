"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { ProjectInvitation } from "./invitations-page";

interface CancelInvitationDialogProps {
  open: boolean;

  invitation: ProjectInvitation | null;

  loading?: boolean;

  onClose: () => void;

  onCancel: () => void;
}

export default function CancelInvitationDialog({
  open,
  invitation,
  loading = false,
  onClose,
  onCancel,
}: CancelInvitationDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Invitation</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to cancel the invitation sent to{" "}
            <span className="font-semibold text-foreground">
              {invitation?.user.firstName} {invitation?.user.lastName}
            </span>
            ?
            <br />
            <br />
            The invited user will no longer be able to accept this invitation.
            <br />
            <br />
            <span className="font-medium text-destructive">
              This action cannot be undone.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            Keep Invitation
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={loading}
            onClick={onCancel}
            className="bg-destructive hover:bg-destructive/90"
          >
            {loading ? "Cancelling..." : "Cancel Invitation"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
