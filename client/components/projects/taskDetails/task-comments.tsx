"use client";

import { useEffect, useState } from "react";
import { MessageSquare, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

import { showErrorToast } from "@/lib/toast";

import {
  createTaskComment,
  deleteTaskComment,
  getTaskComments,
} from "@/services/task-comment.service";

import TaskCommentForm from "./task-comment-form";

interface TaskCommentUser {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
}

export interface TaskComment {
  id: string;
  content: string;
  createdAt: string;

  user: TaskCommentUser;
}

interface TaskCommentsProps {
  taskId: string;
  currentUserId?: string;
}

export default function TaskComments({
  taskId,
  currentUserId,
}: TaskCommentsProps) {
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      setLoading(true);

      const response = await getTaskComments(taskId);

      if (response?.success) {
        setComments(response.comments || []);
      }
    } catch (error) {
      console.error("Failed to load comments:", error);
      showErrorToast("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!taskId) return;

    fetchComments();
  }, [taskId]);

  const handleCommentCreated = async (comment: TaskComment) => {
    setComments((prev) => [...prev, comment]);
  };

  const handleCommentDeleted = async (commentId: string) => {
    try {
      const response = await deleteTaskComment(commentId);

      if (response?.success) {
        setComments((prev) =>
          prev.filter((comment) => comment.id !== commentId),
        );
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
      showErrorToast("Failed to delete comment");
    }
  };

  return (
    <section className="space-y-5">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />

        <h3 className="text-sm font-semibold">Comments</h3>

        {comments.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {comments.length}
          </span>
        )}
      </div>

      <Separator />

      {loading ? (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">Loading comments...</p>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-5">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              onDeleted={handleCommentDeleted}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <MessageSquare className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />

          <p className="text-sm font-medium">No comments yet</p>

          <p className="mt-1 text-xs text-muted-foreground">
            Start a conversation about this task.
          </p>
        </div>
      )}

      <TaskCommentForm taskId={taskId} onSuccess={handleCommentCreated} />
    </section>
  );
}

interface CommentItemProps {
  comment: TaskComment;
  currentUserId?: string;
  onDeleted?: (commentId: string) => void;
}

function CommentItem({ comment, currentUserId, onDeleted }: CommentItemProps) {
  const isOwner = currentUserId === comment.user.id;

  return (
    <div className="group flex gap-3">
      <Avatar className="h-9 w-9 shrink-0">
        <AvatarImage
          src={comment.user.avatar ?? undefined}
          alt={comment.user.firstName}
        />

        <AvatarFallback>{getInitials(comment.user.firstName)}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium">{comment.user.firstName}</p>

            <p className="text-xs text-muted-foreground">
              {formatCommentDate(comment.createdAt)}
            </p>
          </div>

          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    console.log("Edit comment:", comment.id);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => {
                    onDeleted?.(comment.id);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="mt-2 rounded-lg bg-muted/50 px-3 py-2.5">
          <p className="whitespace-pre-wrap text-sm leading-6">
            {comment.content}
          </p>
        </div>
      </div>
    </div>
  );
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatCommentDate(date: string) {
  const commentDate = new Date(date);

  return commentDate.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
