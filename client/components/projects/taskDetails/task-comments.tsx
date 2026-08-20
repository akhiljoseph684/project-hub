"use client";

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

import TaskCommentForm from "./task-comment-form";

interface TaskCommentUser {
  id: string;
  name: string;
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
  comments: TaskComment[];

  onCommentCreated?: (comment: TaskComment) => void;
  onCommentUpdated?: (comment: TaskComment) => void;
  onCommentDeleted?: (commentId: string) => void;
}

export default function TaskComments({
  taskId,
  comments,
  onCommentCreated,
  onCommentUpdated,
  onCommentDeleted,
}: TaskCommentsProps) {
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

      {comments.length > 0 ? (
        <div className="space-y-5">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onUpdated={onCommentUpdated}
              onDeleted={onCommentDeleted}
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

      <TaskCommentForm taskId={taskId} onSuccess={onCommentCreated} />
    </section>
  );
}

interface CommentItemProps {
  comment: TaskComment;

  onUpdated?: (comment: TaskComment) => void;
  onDeleted?: (commentId: string) => void;
}

function CommentItem({ comment, onUpdated, onDeleted }: CommentItemProps) {
  return (
    <div className="group flex gap-3">
      <Avatar className="h-9 w-9 shrink-0">
        <AvatarImage
          src={comment.user.avatar ?? undefined}
          alt={comment.user.name}
        />

        <AvatarFallback>{getInitials(comment.user.name)}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium">{comment.user.name}</p>

            <p className="text-xs text-muted-foreground">
              {formatCommentDate(comment.createdAt)}
            </p>
          </div>

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
                  console.log("Delete comment:", comment.id);

                  onDeleted?.(comment.id);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
