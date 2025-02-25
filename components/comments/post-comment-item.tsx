"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EllipsisIcon } from "lucide-react";

import { CreatePostCommentForm } from "@/components/comments/create-post-comment-form";
import { CommentVoting } from "@/components/comments/post-voting";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { deleteComment } from "@/app/actions";

export function PostCommentItem({
    comment,
    handleReplyClick,
    isReplying,
    postId,
    communityId,
    onReplySuccess,
    isAdmin,
    subAdmin,
    userId,
    count
}: {
    comment: any;
    handleReplyClick: (id: string) => void;
    isReplying: string | null;
    postId: string;
    communityId: string;
    onReplySuccess?: () => void;
    isAdmin: boolean,
    subAdmin: boolean,
    userId: string,
    count: number
}) {

    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter()

    const handleDelete = async (idToDelete: string) => {
        setIsDeleting(true);

        const response = await deleteComment(idToDelete);

        if (response?.error) {
            toast.error(response.error);
        } else {
            toast.success(response.message);
            router.refresh()
        }

        setIsDeleting(false);
    };

    return (
        <div className="pl-8 p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="flex items-start justify-between">
                <div className="relative pl-6">
                    <div className="absolute -top-4 -left-8 -bottom-4 w-8 min-h-full bg-slate-100/70 flex flex-col items-center justify-center">
                        {/* <CommentVoting
                            commentId={comment.id}
                            initialVotes={comment.votes.length === 0 ? 0 : count}
                            userVote={comment.userVote} 
                            postId={postId}
                            subcommunity={communityId}
                        /> */}
                        <CommentVoting
                            commentId={comment.id}
                            votes={comment.votes} // 🟢 Pass full votes array
                            userVote={comment.userVote}
                            postId={postId}
                            subcommunity={communityId}
                        />


                    </div>
                    <p className="font-semibold text-gray-900">@{comment.author.userName}</p>
                    <p className="text-gray-700">{comment.content}</p>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <EllipsisIcon className="text-gray-500 hover:text-gray-700 transition" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-24 bg-white border rounded-md shadow-md">
                        <DropdownMenuItem
                            onClick={() => handleReplyClick(comment.id)}
                            className="cursor-pointer px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                            Reply
                        </DropdownMenuItem>
                        {(comment.authorId === userId || isAdmin || subAdmin) && (
                            <DropdownMenuItem
                                onClick={() => handleDelete(comment.id)}
                                disabled={isDeleting}
                                className="block w-full cursor-pointer px-4 py-2 text-red-600 hover:bg-red-50"
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {isReplying === comment.id && (
                <div className="mt-4">
                    <CreatePostCommentForm
                        postId={postId}
                        subcommunityId={communityId}
                        parentId={comment.id}
                        onReplySuccess={onReplySuccess}
                    />
                </div>
            )}

            {comment.replies?.length > 0 && (
                <div className="ml-6 mt-3 border-l-2 border-gray-200 pl-4">
                    {comment.replies.map((reply: any) => (
                        <PostCommentItem
                            key={reply.id}
                            comment={reply}
                            handleReplyClick={handleReplyClick}
                            isReplying={isReplying}
                            postId={postId}
                            communityId={communityId}
                            onReplySuccess={onReplySuccess}
                            isAdmin={isAdmin}
                            subAdmin={subAdmin}
                            userId={userId}
                            count={count}
                        />
                    ))}
                </div>
            )}
        </div>

    );
}

