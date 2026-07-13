"use client";

import { useEffect, useState } from "react";
import { Mail, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { useAppSelector } from "@/redux/hooks";
import {
  deleteProjectInvitation,
  getProjectInvitations,
} from "@/services/project.service";
import { showErrorToast } from "@/lib/toast";

import InvitationsTable from "./invitations-table";
import CancelInvitationDialog from "./cancel-invitation-dialog";
import useProjectInvitationSocket from "@/hooks/use-project-invitation-socket";

export interface ProjectInvitation {
  id: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";

  createdAt: string;

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
    color: string;
  };

  invitedBy: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export default function InvitationsPage() {
  const project = useAppSelector((state) => state.project.currentProject);

  const [loading, setLoading] = useState(false);
  const [invitations, setInvitations] = useState<ProjectInvitation[]>([]);
  const [selectedInvitation, setSelectedInvitation] =
    useState<ProjectInvitation | null>(null);

  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  async function fetchInvitations() {
    try {
      if (!project?.id) return;

      setLoading(true);

      const res = await getProjectInvitations(project.id);

      setInvitations(res.invitations);
    } catch (error: any) {
      showErrorToast(error.message || "Failed to load invitations.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (project?.id) {
      fetchInvitations();
    }
  }, [project?.id]);

  // ✅ Call the custom hook here, at the top level
  useProjectInvitationSocket({
    onRefresh: fetchInvitations,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Project Invitations</h1>

          <p className="mt-2 text-muted-foreground">
            Manage pending, accepted and declined invitations.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={fetchInvitations}
          disabled={loading}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${
              loading ? "animate-spin" : ""
            }`}
          />
          Refresh
        </Button>
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

        <InvitationsTable
          invitations={invitations}
          loading={loading}
          onRefresh={fetchInvitations}
          onCancel={(invitation) => {
            setSelectedInvitation(invitation);
            setCancelOpen(true);
          }}
          onInviteAgain={(invitation) => {
            console.log("Invite Again", invitation);
          }}
        />

        <CancelInvitationDialog
          open={cancelOpen}
          invitation={selectedInvitation}
          loading={cancelLoading}
          onClose={() => {
            setCancelOpen(false);
            setSelectedInvitation(null);
          }}
          onCancel={async () => {
            if (!selectedInvitation) return;

            setCancelLoading(true);

            try {
              await deleteProjectInvitation(selectedInvitation.id);

              await fetchInvitations();
            } finally {
              setCancelLoading(false);
              setCancelOpen(false);
              setSelectedInvitation(null);
            }
          }}
        />
      </Card>
    </div>
  );
}