"use client";

import { MailOpen } from "lucide-react";

export default function EmptyInvitations() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 rounded-full bg-muted p-5">
        <MailOpen className="h-10 w-10 text-muted-foreground" />
      </div>

      <h2 className="text-xl font-semibold">No Invitations</h2>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        You don't have any project invitations at the moment.
      </p>
    </div>
  );
}
