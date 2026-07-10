"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface MemberCardProps {
  member: {
    id: string;
    joinedAt: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
      avatar?: string;
    };
    role: {
      name: string;
      color?: string;
    };
  };
}

export default function MemberCard({ member }: MemberCardProps) {
  return (
    <div className="rounded-xl border p-4">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={member.user.avatar} />
          <AvatarFallback>
            {member.user.firstName[0]}
            {member.user.lastName[0]}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h3 className="font-medium">
            {member.user.firstName} {member.user.lastName}
          </h3>

          <p className="text-sm text-muted-foreground">{member.user.email}</p>
        </div>

        <Badge>{member.role.name}</Badge>
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        Joined {new Date(member.joinedAt).toLocaleDateString()}
      </div>
    </div>
  );
}
