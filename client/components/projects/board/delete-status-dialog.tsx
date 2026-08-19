"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

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

import { deleteProjectStatus } from "@/services/status.service";
import { showErrorToast, showSuccessToast } from "@/lib/toast";

interface DeleteStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  status: {
    id: string;
    name: string;
  } | null;

  onSuccess?: (statusId: string) => void;
}

export default function DeleteStatusDialog({
  open,
  onOpenChange,
  status,
  onSuccess,
}: DeleteStatusDialogProps) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!status) return;

    try {
      setLoading(true);

      const response = await deleteProjectStatus(status.id);

      showSuccessToast(response.message || "Status deleted successfully");

      onSuccess?.(status.id);

      onOpenChange(false);
    } catch (error: any) {
      console.error("Delete status error:", error);

      showErrorToast(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete status",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleOpenChange(value: boolean) {
    if (loading) return;

    onOpenChange(value);
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>

          <AlertDialogTitle>Delete "{status?.name}"?</AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be undone. The status will be permanently removed
            from this project.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              handleDelete();
            }}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Status
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
