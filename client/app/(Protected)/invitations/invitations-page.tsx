"use client";

import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { useDispatch } from "react-redux";

import { Card } from "@/components/ui/card";
import { showErrorToast } from "@/lib/toast";

import InvitationsTable from "./invitations-table";
import EmptyInvitations from "./empty-invitations";

import { getMyProjectInvitations } from "@/services/project.service";
import { setInvitationCount } from "@/redux/slices/notificationSlice";
import useProjectInvitationSocket from "@/hooks/use-project-invitation-socket";

export interface MyInvitation {
  id: string;

  status: "PENDING" | "ACCEPTED" | "DECLINED";

  createdAt: string;

  project: {
    id: string;
    name: string;
    slug: string;
    color?: string;
    icon?: string;
  };

  invitedBy: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };

  role: {
    id: string;
    name: string;
    color?: string;
  };
}

export default function InvitationsPage() {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [invitations, setInvitations] = useState<MyInvitation[]>([]);

  async function fetchInvitations() {
    try {
      setLoading(true);

      const res = await getMyProjectInvitations();

      console.log(res);

      setInvitations(res.invitations);

      const pending = res.invitations.filter(
        (item: MyInvitation) => item.status === "PENDING",
      ).length;

      dispatch(setInvitationCount(pending));
    } catch (error: any) {
      console.log(error);
      showErrorToast(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInvitations();
  }, []);
  useProjectInvitationSocket({
    onRefresh: fetchInvitations,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Invitations</h1>

        <p className="mt-2 text-muted-foreground">
          View and manage all project invitations.
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />

            <h2 className="font-semibold">Invitations</h2>
          </div>

          <span className="text-sm text-muted-foreground">
            {invitations.length} Invitations
          </span>
        </div>

        {invitations.length === 0 && !loading ? (
          <EmptyInvitations />
        ) : (
          <InvitationsTable
            invitations={invitations}
            loading={loading}
            onRefresh={fetchInvitations}
          />
        )}
      </Card>
    </div>
  );
}
