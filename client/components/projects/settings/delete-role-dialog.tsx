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

interface DeleteRoleDialogProps {
  open: boolean;
  loading?: boolean;

  roleName: string;

  memberCount?: number;

  onClose: () => void;

  onDelete: () => void;
}

export default function DeleteRoleDialog({
  open,
  loading = false,
  roleName,
  memberCount = 0,
  onClose,
  onDelete,
}: DeleteRoleDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Role</AlertDialogTitle>

          <AlertDialogDescription>
            {memberCount > 0 ? (
              <>
                The <strong>{roleName}</strong> role is currently assigned to{" "}
                <strong>{memberCount}</strong>{" "}
                {memberCount === 1 ? "member" : "members"}.
                <br />
                <br />
                Please assign those members to another role before deleting this
                role.
              </>
            ) : (
              <>
                Are you sure you want to permanently delete the{" "}
                <strong>{roleName}</strong> role?
                <br />
                <br />
                This action cannot be undone.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          {memberCount === 0 && (
            <AlertDialogAction
              disabled={loading}
              onClick={onDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              {loading ? "Deleting..." : "Delete Role"}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
