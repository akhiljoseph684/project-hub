"use client";

import { FormEvent, useState } from "react";
import { Loader2, Send } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { showErrorToast, showSuccessToast } from "@/lib/toast";

import type { TaskComment } from "./task-comments";
import { createTaskComment } from "@/services/task-comment.service";

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

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      setLoading(true);

      const response = await createTaskComment(taskId, content.trim());

      if (response?.success) {
        onSuccess?.(response.data);
        setContent("");
      }
    } catch (error) {
      console.error("Failed to create comment:", error);
      showErrorToast("Failed to create comment");
    } finally {
      setLoading(false);
    }
  };
  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();

      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border bg-muted/20 p-4">
      <div className="flex gap-3">
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
