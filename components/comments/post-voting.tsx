"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowBigDownIcon, ArrowBigUpIcon, LoaderCircleIcon } from "lucide-react";
import { handleCommentVote } from "@/app/actions";
import { toast } from "sonner";

export function CommentVoting({
    commentId,
    votes,
    userVote,
    postId,
    subcommunity,
}: {
    commentId: string;
    votes: { voteType: "UP" | "DOWN" }[];
    userVote?: "UP" | "DOWN" | null;
    postId: string;
    subcommunity: string;
}) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const computedVotes = votes.reduce((acc, vote) => acc + (vote.voteType === "UP" ? 1 : -1), 0);

    const [voteCount, setVoteCount] = useState(computedVotes);
    const [currentVote, setCurrentVote] = useState<"UP" | "DOWN" | null>(userVote ?? null);

    const handleVote = (direction: "UP" | "DOWN") => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append("commentId", commentId);
            formData.append("direction", direction);
            formData.append("subcommunity", subcommunity);
            formData.append("postId", postId);

            const prevVote = currentVote;

            if (prevVote === direction) {
                setCurrentVote(null);
                setVoteCount((prev) => prev - (direction === "UP" ? 1 : -1));
            } else {
                setCurrentVote(direction);
                setVoteCount((prev) => prev + (prevVote ? 2 : 1) * (direction === "UP" ? 1 : -1));
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
            >
                <ArrowBigUpIcon className="w-5 h-5" />
            </button>

            {isPending
                ? <span className="animate-spin">
                    <LoaderCircleIcon className="w-4 h-4 text-muted-foreground" />
                </span>
                : <span className="text-sm">{voteCount}</span>
            }

            <button
                onClick={() => handleVote("DOWN")}
                disabled={isPending}
            >
                <ArrowBigDownIcon className="w-5 h-5" />
            </button>
        </div>
    );
}


