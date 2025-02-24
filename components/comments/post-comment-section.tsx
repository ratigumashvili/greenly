"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

import { CreatePostCommentForm } from "@/components/comments/create-post-comment-form";
import { PostCommentItem } from "@/components/comments/post-comment-item";

export function PostCommentSection({ 
    postId, 
    communityId,
    initialComments
}: { 
    postId: string;
    communityId: string;
    initialComments: any[];
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
                    initialComments.map((comment) => (
                        <PostCommentItem
                            key={comment.id} 
                            comment={comment} 
                            handleReplyClick={handleReplyClick} 
                            isReplying={isReplying} 
                            postId={postId}
                            communityId={communityId}
                            onReplySuccess={handleReplySuccess}
                        />
                    ))
                ) : (
                    <p className="text-gray-500">No comments yet.</p>
                )}
            </div>
        </div>
    );
}
