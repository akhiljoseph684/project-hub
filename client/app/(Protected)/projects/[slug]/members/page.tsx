"use client";

import InvitationsPage from "@/components/projects/invitations/invitations-page";
import MembersPage from "@/components/projects/members/members-page";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProjectMembersPage() {
  return (
    <Tabs defaultValue="members">
      <TabsList>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="invitations">Invitations</TabsTrigger>
      </TabsList>

      <TabsContent value="members">
        <MembersPage />
      </TabsContent>

      <TabsContent value="invitations">
        <InvitationsPage />
      </TabsContent>
    </Tabs>
  );
}
