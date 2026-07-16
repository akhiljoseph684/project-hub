"use client";

import { Plus } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProjectMember {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  role?: string;
}

interface BoardMembersProps {
  members: ProjectMember[];
  maxVisible?: number;
  onInvite?: () => void;
}

export default function BoardMembers({
  members,
  maxVisible = 5,
  onInvite,
}: BoardMembersProps) {
  const visibleMembers = members.slice(0, maxVisible);
  const remaining = members.length - visibleMembers.length;

  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-3">
        <TooltipProvider>
          {visibleMembers.map((member) => (
            <Tooltip key={member.id}>
              <TooltipTrigger asChild>
                <Avatar className="h-9 w-9 border-2 border-background">
                  <AvatarImage
                    src={member.avatar ?? ""}
                    alt={member.name}
                  />

                  <AvatarFallback>
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>

              <TooltipContent>
                <div className="space-y-1">
                  <p className="font-medium">
                    {member.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {member.email}
                  </p>

                  {member.role && (
                    <Badge
                      variant="secondary"
                      className="mt-1"
                    >
                      {member.role}
                    </Badge>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>

        {remaining > 0 && (
          <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-semibold">
            +{remaining}
          </div>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onInvite}
      >
        <Plus className="mr-2 h-4 w-4" />
        Invite
      </Button>
    </div>
  );
}