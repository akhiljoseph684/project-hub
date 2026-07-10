"use client";

import { MoreHorizontal, Shield, Trash2, User } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ProjectMember {
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

interface MemberActionsProps {
  member: ProjectMember;

  onChangeRole: (member: ProjectMember) => void;

  onRemove: (member: ProjectMember) => void;

  onViewProfile?: (member: ProjectMember) => void;
}

export default function MemberActions({
  member,
  onChangeRole,
  onRemove,
  onViewProfile,
}: MemberActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem onClick={() => onViewProfile?.(member)}>
          <User className="mr-2 h-4 w-4" />
          View Profile
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onChangeRole(member)}>
          <Shield className="mr-2 h-4 w-4" />
          Change Role
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => onRemove(member)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Remove Member
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
