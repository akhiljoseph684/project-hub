"use client";

import { formatDistanceToNow } from "date-fns";

import UserAvatar from "@/components/user-avatar";

import InvitationStatusBadge from "./invitation-status-badge";
import InvitationActions from "./invitations-actions";
import { MyInvitation } from "./invitations-page";

interface InvitationsTableProps {
  invitations: MyInvitation[];

  loading?: boolean;

  onRefresh?: () => void;
}

export default function InvitationsTable({
  invitations,
  loading = false,
  onRefresh,
}: InvitationsTableProps) {
  if (loading) {
    return <div className="flex justify-center py-12">Loading...</div>;
  }


  return (
    <div className="divide-y">
      {invitations.map((invitation) => (
        <div
          key={invitation.id}
          className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between"
        >
          {/* Left */}

          <div className="flex items-start gap-4">
            <UserAvatar
              avatar={invitation.invitedBy.avatar}
              firstName={invitation.invitedBy.firstName}
              lastName={invitation.invitedBy.lastName}
            />

            <div className="space-y-2">
              <h3 className="font-semibold text-lg">
                {invitation.project.name}
              </h3>

              <p className="text-sm text-muted-foreground">
                Invited by{" "}
                <span className="font-medium text-foreground">
                  {invitation.invitedBy.firstName}{" "}
                  {invitation.invitedBy.lastName}
                </span>
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">
                  {invitation.role.name}
                </span>

                <InvitationStatusBadge status={invitation.status} />

                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(invitation.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Right */}

          <InvitationActions invitation={invitation} onRefresh={onRefresh} />
        </div>
      ))}
    </div>
  );
}
