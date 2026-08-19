"use client";

import { useCallback, useEffect, useState } from "react";

import BoardToolbar from "@/components/projects/board/board-toolbar";
import BoardList, {
  BoardColumnData,
} from "@/components/projects/board/board-list";
import BoardEmpty from "@/components/projects/board/board-empty";
import CreateTaskDialog from "@/components/projects/task/create-task-dialog";

import { useAppSelector } from "@/redux/hooks";

import { getProjectBoard, getProjectMembers } from "@/services/project.service";

import { showErrorToast } from "@/lib/toast";
import { getProjectLabels } from "@/services/label.service";

interface BoardMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface BoardLabel {
  id: string;
  name: string;
  color: string;
}

interface BoardStatus {
  id: string;
  name: string;
  color: string;
}

export default function BoardPage() {
  const project = useAppSelector((state) => state.project.currentProject);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [columns, setColumns] = useState<BoardColumnData[]>([]);

  const [statuses, setStatuses] = useState<BoardStatus[]>([]);

  const [members, setMembers] = useState<BoardMember[]>([]);

  const [labels, setLabels] = useState<BoardLabel[]>([]);

  const [loading, setLoading] = useState(false);

  const [defaultStatusId, setDefaultStatusId] = useState("");


  const fetchBoard = useCallback(async () => {
    if (!project?.id) return;

    try {
      setLoading(true);

      const res = await getProjectBoard(project.id);

      setColumns(res.board);

      const boardStatuses = res.board.map((column: BoardColumnData) => ({
        id: column.id,
        name: column.title,
        color: column.color,
      }));

      setStatuses(boardStatuses);
    } catch (error: any) {
      console.error("Fetch Board Error:", error);

      showErrorToast(error.message || "Failed to load project board.");
    } finally {
      setLoading(false);
    }
  }, [project?.id]);

  const fetchMembers = useCallback(async () => {
    if (!project?.id) return;

    try {
      const res = await getProjectMembers(project.id);

      const formattedMembers = res.members.map((member: any) => ({
        id: member.user.id,
        name: `${member.user.firstName || ""} ${
          member.user.lastName || ""
        }`.trim(),
        email: member.user.email,
        avatar: member.user.avatar,
      }));

      setMembers(formattedMembers);
    } catch (error: any) {
      console.error("Fetch Members Error:", error);

      showErrorToast(error.message || "Failed to load project members.");
    }
  }, [project?.id]);

  const fetchLabels = useCallback(async () => {
    if (!project?.id) return;

    try {
      const res = await getProjectLabels(project.id);

      setLabels(res.labels);
    } catch (error: any) {
      console.error("Fetch Members Error:", error);

      showErrorToast(error.message || "Failed to load project members.");
    }
  }, [project?.id]);

  useEffect(() => {
    if (!project?.id) return;

    fetchBoard();
    fetchMembers();
    fetchLabels()
  }, [project?.id, fetchBoard, fetchMembers, fetchLabels]);

  if (!project) {
    return null;
  }

  return (
    <div className="space-y-6">
      <BoardToolbar
        search=""
        assignee="all"
        priority="all"
        onSearchChange={() => {}}
        onAssigneeChange={() => {}}
        onPriorityChange={() => {}}
        onResetFilters={() => {}}
        onCreateTask={() => setDialogOpen(true)}
      />

      {loading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-muted-foreground">Loading board...</p>
        </div>
      ) : columns.length === 0 ? (
        <BoardEmpty onCreateTask={() => setDialogOpen(true)} />
      ) : (
        <BoardList
          columns={columns}
          setColumns={setColumns}
          onTaskClick={(task) => {
            console.log("Task clicked:", task);
          }}
          onCreateTask={(columnId) => {
            setDefaultStatusId(columnId)

            setDialogOpen(true);
          }}
        />
      )}

      <CreateTaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        projectId={project.id}
        statuses={statuses}
        members={members}
        labels={labels}
        defaultStatusId={defaultStatusId ?? statuses[0]?.id}
        onSuccess={() => {
          setDialogOpen(false);
          setDefaultStatusId("");
          fetchBoard();
        }}
      />
    </div>
  );
}
