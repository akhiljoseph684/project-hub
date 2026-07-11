"use client";

import { MoreHorizontal, RefreshCw, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ProjectInvitation } from "./invitations-page";

interface InvitationActionsProps {
  invitation: ProjectInvitation;

  onCancel: (invitation: ProjectInvitation) => void;

  onInviteAgain: (invitation: ProjectInvitation) => void;
}

export default function InvitationActions({
  invitation,
  onCancel,
  onInviteAgain,
}: InvitationActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        {invitation.status === "PENDING" && (
          <DropdownMenuItem
            onClick={() => onCancel(invitation)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Cancel Invitation
          </DropdownMenuItem>
        )}

        {invitation.status === "DECLINED" && (
          <DropdownMenuItem onClick={() => onInviteAgain(invitation)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Invite Again
          </DropdownMenuItem>
        )}

        {invitation.status === "ACCEPTED" && (
          <>
            <DropdownMenuItem disabled>Invitation Accepted</DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onCancel(invitation)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Record
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
