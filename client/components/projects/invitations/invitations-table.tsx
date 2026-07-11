"use client";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import InvitationActions from "./invitation-actions";
import { ProjectInvitation } from "./invitations-page";

interface InvitationsTableProps {
  invitations: ProjectInvitation[];

  loading?: boolean;

  onRefresh?: () => void;

  onCancel: (invitation: ProjectInvitation) => void;

  onInviteAgain: (invitation: ProjectInvitation) => void;
}

export default function InvitationsTable({
  invitations,
  loading,
  onCancel,
  onInviteAgain,
}: InvitationsTableProps) {
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Loading invitations...
      </div>
    );
  }

  if (invitations.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2">
        <h3 className="text-lg font-semibold">No Invitations</h3>

        <p className="text-sm text-muted-foreground">
          No project invitations have been sent yet.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>

          <TableHead>Role</TableHead>

          <TableHead>Status</TableHead>

          <TableHead>Invited By</TableHead>

          <TableHead>Invited On</TableHead>

          <TableHead className="w-16" />
        </TableRow>
      </TableHeader>

      <TableBody>
        {invitations.map((invitation) => (
          <TableRow key={invitation.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={invitation.user.avatar} />

                  <AvatarFallback>
                    {invitation.user.firstName[0]}
                    {invitation.user.lastName[0]}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="font-medium">
                    {invitation.user.firstName} {invitation.user.lastName}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {invitation.user.email}
                  </p>
                </div>
              </div>
            </TableCell>

            <TableCell>
              <Badge
                variant="outline"
                style={{
                  borderColor: invitation.role.color,
                }}
              >
                {invitation.role.name}
              </Badge>
            </TableCell>

            <TableCell>
              {invitation.status === "PENDING" && (
                <Badge className="bg-yellow-500 hover:bg-yellow-500">
                  Pending
                </Badge>
              )}

              {invitation.status === "ACCEPTED" && (
                <Badge className="bg-green-600 hover:bg-green-600">
                  Accepted
                </Badge>
              )}

              {invitation.status === "DECLINED" && (
                <Badge variant="destructive">Declined</Badge>
              )}
            </TableCell>

            <TableCell>
              {invitation.invitedBy.firstName} {invitation.invitedBy.lastName}
            </TableCell>

            <TableCell>
              {new Date(invitation.createdAt).toLocaleDateString()}
            </TableCell>

            <TableCell>
              <InvitationActions
                invitation={invitation}
                onCancel={onCancel}
                onInviteAgain={onInviteAgain}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
