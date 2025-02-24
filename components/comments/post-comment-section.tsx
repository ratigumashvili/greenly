"use client"

import { useState } from "react";
import { CreatePostCommentForm } from "@/components/comments/create-post-comment-form";

export function CommentSection({ 
    postId, 
    communityId,
}: { 
    postId: string;
    communityId: string;

}) {
    const [isReply, setIsReply] = useState(false);
    const [parentCommentId, setParentCommentId] = useState<string | null>(null);

    const handleReplyClick = (commentId: string) => {
        setIsReply(true);
        setParentCommentId(commentId);
    };

    return (
        <div>
            <CreatePostCommentForm
                postId={postId}
                subcommunityId={communityId}
                parentId={isReply ? parentCommentId ?? undefined : undefined}
            />

            <div>
                {/* Dummy comments for demonstration */}
                <div>
                    <p>Comment 1</p>
                    <button onClick={() => handleReplyClick("comment-1-id")}>Reply</button>
                </div>
                <div>
                    <p>Comment 2</p>
                    <button onClick={() => handleReplyClick("comment-2-id")}>Reply</button>
                </div>
            </div>
        </div>
    );
}
