"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowBigDownIcon, ArrowBigUpIcon } from "lucide-react";
import { handleCommentVote } from "@/app/actions";
import { toast } from "sonner";

export function CommentVoting({
  commentId,
  initialVotes,
  userVote,
  postId,
  subcommunity,
}: {
  commentId: string;
  initialVotes: number;
  userVote?: "UP" | "DOWN" | null;
  postId: string,
  subcommunity: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [voteCount, setVoteCount] = useState(initialVotes);
  const [currentVote, setCurrentVote] = useState<"UP" | "DOWN" | null>(userVote ?? null);

  const handleVote = (direction: "UP" | "DOWN") => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("commentId", commentId);
      formData.append("direction", direction);
      formData.append("subcommunity", subcommunity);
      formData.append("postId", postId)

      const prevVote = currentVote;

      if (prevVote === direction) {
        setCurrentVote(null);
        setVoteCount(voteCount + (direction === "UP" ? -1 : 1));
      } else {
        setCurrentVote(direction);
        setVoteCount(voteCount + (prevVote ? 2 : 1) * (direction === "UP" ? 1 : -1));
      }

      const response = await handleCommentVote(formData);
      if (response?.error) {
        toast.error(response.error);
      } else {
        toast.success(response.message);
        router.refresh();
      }
    });
  };


  return (
    <div className="flex flex-col items-center text-muted-foreground">
      <button
        onClick={() => handleVote("UP")}
        disabled={isPending}
        className={`hover:text-green-500 ${currentVote === "UP" ? "text-green-500" : ""}`}
      >
        <ArrowBigUpIcon className="w-5 h-5" />
      </button>
      <span className="text-sm">{voteCount}</span>
      <button
        onClick={() => handleVote("DOWN")}
        disabled={isPending}
        className={`hover:text-red-500 ${currentVote === "DOWN" ? "text-red-500" : ""}`}
      >
        <ArrowBigDownIcon className="w-5 h-5" />
      </button>
    </div>
  );
}


