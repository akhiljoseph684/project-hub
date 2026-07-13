"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket";

interface UseProjectInvitationSocketProps {
  onRefresh: () => void;
}

export default function useProjectInvitationSocket({
  onRefresh,
}: UseProjectInvitationSocketProps) {
  useEffect(() => {
    const handleNewInvitation = () => {
      console.log("New project invitation");
      onRefresh();
    };

    const handleAccepted = () => {
      console.log("Invitation accepted");
      onRefresh();
    };

    const handleDeclined = () => {
      console.log("Invitation declined");
      onRefresh();
    };

    const handleCancelled = () => {
      console.log("Invitation cancelled");
      onRefresh();
    };

    socket.on("project:invitation:new", handleNewInvitation);
    socket.on("project:invitation:accepted", handleAccepted);
    socket.on("project:invitation:declined", handleDeclined);
    socket.on("project:invitation:cancelled", handleCancelled);

    return () => {
      socket.off("project:invitation:new", handleNewInvitation);
      socket.off("project:invitation:accepted", handleAccepted);
      socket.off("project:invitation:declined", handleDeclined);
      socket.off("project:invitation:cancelled", handleCancelled);
    };
  }, [onRefresh]);
}
