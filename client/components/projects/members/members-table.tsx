"use client";

import { MoreHorizontal, Shield, User2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Member {
  id: string;

  joinedAt: string;

  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };

  role: {
    id: string;
    name: string;
    color?: string;
    isSystem?: boolean;
  };
}

interface MembersTableProps {
  search: string;

  members?: Member[];

  onChangeRole?: (member: Member) => void;

  onRemove?: (member: Member) => void;
}

export default function MembersTable({
  search,
  members = [],
  onChangeRole,
  onRemove,
}: MembersTableProps) {
  const filteredMembers = members.filter((member) => {
    const fullName =
      `${member.user.firstName} ${member.user.lastName}`.toLowerCase();

    return (
      fullName.includes(search.toLowerCase()) ||
      member.user.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  if (filteredMembers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <User2 className="mb-4 h-12 w-12 text-muted-foreground" />

        <h3 className="text-lg font-semibold">No Members Found</h3>

        <p className="mt-2 text-sm text-muted-foreground">
          Invite members to collaborate on this project.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b bg-muted/40">
          <tr className="text-left text-sm">
            <th className="px-6 py-4 font-medium">Member</th>

            <th className="px-6 py-4 font-medium">Role</th>

            <th className="px-6 py-4 font-medium">Joined</th>

            <th className="px-6 py-4 font-medium">Status</th>

            <th className="w-20 px-6 py-4"></th>
          </tr>
        </thead>

        <tbody>
          {filteredMembers.map((member) => (
            <tr
              key={member.id}
              className="border-b transition hover:bg-muted/30"
            >
              {/* User */}

              <td className="px-6 py-5">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={member.user.avatar} />

                    <AvatarFallback>
                      {member.user.firstName[0]}
                      {member.user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="font-medium">
                      {member.user.firstName} {member.user.lastName}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {member.user.email}
                    </p>
                  </div>
                </div>
              </td>

              {/* Role */}

              <td className="px-6 py-5">
                <Badge variant="secondary" className="gap-1">
                  <Shield className="h-3 w-3" />

                  {member.role.name}
                </Badge>
              </td>

              {/* Joined */}

              <td className="px-6 py-5 text-sm text-muted-foreground">
                {new Date(member.joinedAt).toLocaleDateString()}
              </td>

              {/* Status */}

              <td className="px-6 py-5">
                <Badge variant="outline" className="text-green-600">
                  Active
                </Badge>
              </td>

              {/* Actions */}

              <td className="px-6 py-5 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onChangeRole?.(member)}>
                      Change Role
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onRemove?.(member)}
                    >
                      Remove Member
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
