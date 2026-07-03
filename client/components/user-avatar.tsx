"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  avatar?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  isOnline?: boolean;
}

export default function UserAvatar({
  avatar,
  firstName,
  isOnline = false,
}: UserAvatarProps) {
  return (
    <Avatar>
      <AvatarImage src={avatar ?? ""} alt={firstName ?? ""} />

      <AvatarFallback>{`${firstName?.[0] ?? ""}`}</AvatarFallback>
      {isOnline && (
        <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-background">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
        </span>
      )}
    </Avatar>
  );
}
