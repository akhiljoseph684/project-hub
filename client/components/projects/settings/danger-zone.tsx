"use client";

import { Archive, RefreshCw, Trash2, UserRoundCog } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DangerZoneProps {
  onArchive?: () => void;
  onTransferOwnership?: () => void;
  onDelete?: () => void;
}

export default function DangerZone({
  onArchive,
  onTransferOwnership,
  onDelete,
}: DangerZoneProps) {
  return (
    <Card className="border-destructive/30">
      <div className="border-b p-6">
        <h2 className="text-xl font-semibold text-destructive">Danger Zone</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          These actions are destructive and may permanently affect this project.
        </p>
      </div>

      <div className="space-y-6 p-6">
        <Alert>
          <AlertTitle>Proceed carefully</AlertTitle>

          <AlertDescription>
            Some actions below cannot be undone.
          </AlertDescription>
        </Alert>


        <div className="flex items-center justify-between rounded-lg border p-5">
          <div className="flex gap-4">
            <Archive className="mt-1 h-5 w-5 text-yellow-500" />

            <div>
              <h3 className="font-medium">Archive Project</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Archive this project. Members can still access it, but editing
                will be disabled until restored.
              </p>
            </div>
          </div>

          <Button variant="outline" onClick={onArchive}>
            Archive
          </Button>
        </div>


        <div className="flex items-center justify-between rounded-lg border p-5">
          <div className="flex gap-4">
            <UserRoundCog className="mt-1 h-5 w-5 text-blue-500" />

            <div>
              <h3 className="font-medium">Transfer Ownership</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Transfer this project to another project member.
              </p>
            </div>
          </div>

          <Button variant="outline" onClick={onTransferOwnership}>
            Transfer
          </Button>
        </div>


        <div className="flex items-center justify-between rounded-lg border p-5">
          <div className="flex gap-4">
            <RefreshCw className="mt-1 h-5 w-5 text-green-500" />

            <div>
              <h3 className="font-medium">Regenerate Project Key</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Generate a new unique project key. Existing URLs remain
                unchanged.
              </p>
            </div>
          </div>

          <Button variant="outline">Regenerate</Button>
        </div>


        <div className="flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 p-5">
          <div className="flex gap-4">
            <Trash2 className="mt-1 h-5 w-5 text-destructive" />

            <div>
              <h3 className="font-medium text-destructive">Delete Project</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Permanently delete this project, including all tasks, files,
                members, and activity history.
              </p>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this project?</AlertDialogTitle>

                <AlertDialogDescription>
                  This action cannot be undone. All project data, including
                  tasks, files, comments, members, and activity history will be
                  permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>

                <AlertDialogAction onClick={onDelete}>
                  Delete Project
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Card>
  );
}
