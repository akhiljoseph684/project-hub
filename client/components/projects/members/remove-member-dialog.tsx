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

import { ProjectMember } from "./member-actions";

interface RemoveMemberDialogProps {
  open: boolean;

  loading?: boolean;

  member: ProjectMember | null;

  onClose: () => void;

  onRemove: () => void;
}

export default function RemoveMemberDialog({
  open,
  loading = false,
  member,
  onClose,
  onRemove,
}: RemoveMemberDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Member</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to remove{" "}
            <span className="font-semibold text-foreground">
              {member?.user.firstName} {member?.user.lastName}
            </span>{" "}
            from this project?
            <br />
            <br />
            They will immediately lose access to this project and all of its
            resources.
            <br />
            <br />
            <span className="font-medium">This action cannot be undone.</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            disabled={loading}
            onClick={onRemove}
            className="bg-destructive hover:bg-destructive/90"
          >
            {loading ? "Removing..." : "Remove Member"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
