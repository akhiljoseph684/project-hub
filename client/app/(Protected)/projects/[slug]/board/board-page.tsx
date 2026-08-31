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
import CreateStatusDialog from "@/components/projects/board/create-status-dialog";
import DeleteStatusDialog from "@/components/projects/board/delete-status-dialog";
import { Loader2 } from "lucide-react";
import { useQueryParams } from "@/hooks/use-query-params";
import { useDebounce } from "@/hooks/useDebounce";

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

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const [deleteStatusOpen, setDeleteStatusOpen] = useState(false);

  const [priority, setPriority] = useState("all");

  const [assignee, setAssignee] = useState("all");

  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const { createQueryString } = useQueryParams();

  const [selectedStatus, setSelectedStatus] = useState<{
    id: string;
    name: string;
  } | null>(null);

  function handleDeleteStatus(status: any) {
    setSelectedStatus(status);
    setDeleteStatusOpen(true);
  }

  const fetchBoard = useCallback(async () => {
    if (!project?.id) return;

    try {
      setLoading(true);

      const query = createQueryString({
        search: debouncedSearch,
        assignee: assignee !== "all" ? assignee : undefined,
        priority: priority !== "all" ? priority : undefined,
      });
      
      const res = await getProjectBoard(project.id, query);

      setColumns(res.board);

      const boardStatuses = res.board.map((column: BoardColumnData) => ({
        id: column.id,
        name: column.title,
        color: column.color,
      }));

      setStatuses(boardStatuses);
    } catch (error: any) {
      console.error("Fetch Board Error:", error);

      showErrorToast(error?.message || "Failed to load project board.");
    } finally {
      setLoading(false);
    }
  }, [project?.id, debouncedSearch, assignee, priority, createQueryString]);

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
  }, [project?.id, fetchBoard]);

  useEffect(() => {
    if (!project?.id) return;

    fetchMembers();
    fetchLabels();
  }, [project?.id, fetchMembers, fetchLabels]);

  if (!project) {
    return null;
  }

  return (
    <div className="space-y-6">
      <BoardToolbar
        search={search}
        assignee={assignee}
        priority={priority}
        onSearchChange={(value) => {
          setSearch(value);
        }}
        onAssigneeChange={(value) => {
          setAssignee(value);
        }}
        onPriorityChange={(value) => {
          setPriority(value);
        }}
        onResetFilters={() => {
          setSearch("");
          setAssignee("all");
          setPriority("all");
        }}
        onCreateTask={() => {
          setDialogOpen(true);
        }}
      />

      {loading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : columns.length === 0 ? (
        <BoardEmpty onCreateTask={() => setDialogOpen(true)} />
      ) : (
        <BoardList
          projectId={project.id}
          columns={columns}
          setColumns={setColumns}
          onCreateStatus={() => setStatusDialogOpen(true)}
          onDeleteStatus={handleDeleteStatus}
          onTaskClick={(task) => {
            console.log("Task clicked:", task);
          }}
          onCreateTask={(columnId) => {
            setDefaultStatusId(columnId);

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

      <CreateStatusDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        projectId={project.id}
        onSuccess={(status: any) => {
          setStatusDialogOpen(false);
          fetchBoard();
        }}
      />

      <DeleteStatusDialog
        open={deleteStatusOpen}
        onOpenChange={setDeleteStatusOpen}
        status={selectedStatus}
        onSuccess={(statusId: any) => {
          fetchBoard();

          setSelectedStatus(null);
        }}
      />
    </div>
  );
}
