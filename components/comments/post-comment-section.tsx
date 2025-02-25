"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

import { CreatePostCommentForm } from "@/components/comments/create-post-comment-form";
import { PostCommentItem } from "@/components/comments/post-comment-item";

export function PostCommentSection({
    postId,
    communityId,
    initialComments,
    isAdmin,
    subAdmin,
    userId
}: {
    postId: string;
    communityId: string;
    initialComments: any[];
    isAdmin: boolean;
    subAdmin: boolean;
    userId: string
}) {
    const [isReplying, setIsReplying] = useState<string | null>(null);
    const router = useRouter()

    const handleReplyClick = (commentId: string) => {
        setIsReplying(isReplying === commentId ? null : commentId);
    };

    const handleReplySuccess = () => {
        setIsReplying(null);
        router.refresh()

    };

    return (
        <div>
            <CreatePostCommentForm postId={postId} subcommunityId={communityId} parentId={null} />
            <div className="mt-4">
                {initialComments.length > 0 ? (
                    initialComments.map((comment) => {

                        const count = comment?.votes?.length > 0 && comment.votes.reduce((acc: number, vote: { voteType: "UP" | "DOWN" }) => {
                            if (vote.voteType === "UP") return acc + 1
                            if (vote.voteType === "DOWN") return acc - 1
        
                            return acc
                        }, 0)

                        return (
                            <PostCommentItem
                                key={comment.id}
                                comment={comment}
                                handleReplyClick={handleReplyClick}
                                isReplying={isReplying}
                                postId={postId}
                                communityId={communityId}
                                onReplySuccess={handleReplySuccess}
                                isAdmin={isAdmin}
                                subAdmin={subAdmin}
                                userId={userId}
                                count={count}
                            />
                        )
                    })
                ) : (
                    <p className="text-gray-500">No comments yet.</p>
                )}
            </div>
        </div>
    );
}
