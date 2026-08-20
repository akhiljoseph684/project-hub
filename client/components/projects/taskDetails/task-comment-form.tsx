"use client";

import { FormEvent, useState } from "react";
import { Loader2, Send } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { showErrorToast, showSuccessToast } from "@/lib/toast";

import type { TaskComment } from "./task-comments";

interface TaskCommentFormProps {
  taskId: string;

  onSuccess?: (comment: TaskComment) => void;
}

export default function TaskCommentForm({
  taskId,
  onSuccess,
}: TaskCommentFormProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      showErrorToast("Please enter a comment.");
      return;
    }

    try {
      setLoading(true);

      /*
       * TODO:
       *
       * Connect your backend service here.
       *
       * Example:
       *
       * const response = await createTaskComment(
       *   taskId,
       *   {
       *     content: trimmedContent,
       *   },
       * );
       *
       * onSuccess?.(response.comment);
       */

      console.log("Create comment:", {
        taskId,
        content: trimmedContent,
      });

      /*
       * Temporary comment for UI testing.
       *
       * Remove this when the backend API is connected.
       */
      const temporaryComment: TaskComment = {
        id: `temp-${Date.now()}`,
        content: trimmedContent,
        createdAt: new Date().toISOString(),
        user: {
          id: "current-user",
          name: "You",
          avatar: null,
        },
      };

      onSuccess?.(temporaryComment);

      setContent("");

      showSuccessToast("Comment added successfully.");
    } catch (error: any) {
      console.error("Create comment error:", error);

      showErrorToast(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to add comment.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    /*
     * Ctrl + Enter / Cmd + Enter
     * submits the comment.
     */
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();

      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border bg-muted/20 p-4">
      <div className="flex gap-3">
        {/* Current user avatar */}
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarFallback>Y</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <Textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a comment..."
            disabled={loading}
            rows={4}
            maxLength={5000}
            className="resize-none bg-background"
          />

          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Ctrl + Enter to submit
            </p>

            <Button
              type="submit"
              size="sm"
              disabled={loading || !content.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Comment
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
